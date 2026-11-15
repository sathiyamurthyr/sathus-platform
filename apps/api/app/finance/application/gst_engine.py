"""Statutory GST calculation engine with 100% Decimal precision."""

from decimal import Decimal, ROUND_HALF_UP
from typing import Sequence

from app.finance.domain.models import (
    GSTCalculationResult,
    LineItemTaxBreakdown,
    SupplyType,
    number_to_indian_rupees_words,
)

TWO_PLACES = Decimal("0.01")
ZERO = Decimal("0.00")


def determine_supply_type(
    supplier_state_code: str,
    place_of_supply_state_code: str,
    is_export: bool = False,
    is_exempt: bool = False,
) -> SupplyType:
    """
    Determine whether a supply is Intra-State (CGST+SGST) or Inter-State (IGST)
    based on the Supplier's location and the legally determined Place of Supply.
    """
    if is_export:
        return SupplyType.EXPORT
    if is_exempt:
        return SupplyType.EXEMPT

    s_code = supplier_state_code.strip().zfill(2)
    pos_code = place_of_supply_state_code.strip().zfill(2)

    if s_code == pos_code:
        return SupplyType.INTRA_STATE
    return SupplyType.INTER_STATE


def calculate_line_item_taxes(
    unit_price: Decimal,
    quantity: int,
    gst_rate_percent: Decimal,
    supply_type: SupplyType,
    discount_amount: Decimal = ZERO,
) -> LineItemTaxBreakdown:
    """
    Compute precise tax breakdown for a single itemized invoice line item.
    """
    qty = Decimal(quantity)
    gross_taxable = (unit_price * qty) - discount_amount
    taxable_amount = max(gross_taxable, ZERO).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)

    rate = gst_rate_percent.quantize(TWO_PLACES)

    if supply_type == SupplyType.INTRA_STATE:
        half_rate = (rate / Decimal("2")).quantize(TWO_PLACES)
        cgst_rate = half_rate
        sgst_rate = half_rate
        igst_rate = ZERO

        cgst_amount = (taxable_amount * (cgst_rate / Decimal("100"))).quantize(
            TWO_PLACES, rounding=ROUND_HALF_UP
        )
        sgst_amount = (taxable_amount * (sgst_rate / Decimal("100"))).quantize(
            TWO_PLACES, rounding=ROUND_HALF_UP
        )
        igst_amount = ZERO
    elif supply_type == SupplyType.INTER_STATE:
        cgst_rate = ZERO
        sgst_rate = ZERO
        igst_rate = rate

        cgst_amount = ZERO
        sgst_amount = ZERO
        igst_amount = (taxable_amount * (igst_rate / Decimal("100"))).quantize(
            TWO_PLACES, rounding=ROUND_HALF_UP
        )
    else:  # EXPORT or EXEMPT
        cgst_rate = ZERO
        sgst_rate = ZERO
        igst_rate = ZERO
        cgst_amount = ZERO
        sgst_amount = ZERO
        igst_amount = ZERO

    total_amount = (taxable_amount + cgst_amount + sgst_amount + igst_amount).quantize(
        TWO_PLACES, rounding=ROUND_HALF_UP
    )

    return LineItemTaxBreakdown(
        taxable_amount=taxable_amount,
        gst_rate=rate,
        cgst_rate=cgst_rate,
        cgst_amount=cgst_amount,
        sgst_rate=sgst_rate,
        sgst_amount=sgst_amount,
        igst_rate=igst_rate,
        igst_amount=igst_amount,
        total_amount=total_amount,
    )


def calculate_invoice_totals(
    items_data: Sequence[dict],
    supplier_state_code: str,
    place_of_supply_state_code: str,
    is_export: bool = False,
    is_exempt: bool = False,
) -> GSTCalculationResult:
    """
    Calculate full GST invoice totals across all line items with legal rounding.
    Each item in items_data is expected to have:
      - unit_price: Decimal
      - quantity: int
      - gst_rate: Decimal
      - discount_amount: Decimal (optional, default 0.00)
    """
    supply_type = determine_supply_type(
        supplier_state_code=supplier_state_code,
        place_of_supply_state_code=place_of_supply_state_code,
        is_export=is_export,
        is_exempt=is_exempt,
    )

    item_breakdowns: list[LineItemTaxBreakdown] = []
    total_taxable = ZERO
    total_cgst = ZERO
    total_sgst = ZERO
    total_igst = ZERO

    for it in items_data:
        unit_price = Decimal(str(it["unit_price"]))
        qty = int(it.get("quantity", 1))
        gst_rate = Decimal(str(it.get("gst_rate", "18.00")))
        disc = Decimal(str(it.get("discount_amount", "0.00")))

        line = calculate_line_item_taxes(
            unit_price=unit_price,
            quantity=qty,
            gst_rate_percent=gst_rate,
            supply_type=supply_type,
            discount_amount=disc,
        )
        item_breakdowns.append(line)
        total_taxable += line.taxable_amount
        total_cgst += line.cgst_amount
        total_sgst += line.sgst_amount
        total_igst += line.igst_amount

    total_taxable = total_taxable.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
    total_cgst = total_cgst.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
    total_sgst = total_sgst.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
    total_igst = total_igst.quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
    total_gst = (total_cgst + total_sgst + total_igst).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)

    exact_grand_total = total_taxable + total_gst

    # In Indian GST, invoice totals are rounded to the nearest integer rupee
    rounded_grand_total = exact_grand_total.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    round_off = (rounded_grand_total - exact_grand_total).quantize(TWO_PLACES)
    grand_total = rounded_grand_total.quantize(TWO_PLACES)

    amount_in_words = number_to_indian_rupees_words(grand_total)

    return GSTCalculationResult(
        supply_type=supply_type,
        total_taxable=total_taxable,
        total_cgst=total_cgst,
        total_sgst=total_sgst,
        total_igst=total_igst,
        total_gst=total_gst,
        round_off=round_off,
        grand_total=grand_total,
        amount_in_words=amount_in_words,
        items=item_breakdowns,
    )
