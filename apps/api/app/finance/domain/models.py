"""Domain entities, value objects, and enums for Finance & Server Billing."""

from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import NamedTuple


class InvoiceStatus(str, Enum):
    """Sales invoice lifecycle statuses."""
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    ISSUED = "ISSUED"
    PARTIALLY_PAID = "PARTIALLY_PAID"
    PAID = "PAID"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"


class SubscriptionStatus(str, Enum):
    """Server hosting subscription statuses."""
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    ACTIVE = "ACTIVE"
    PAUSED = "PAUSED"
    SUSPENDED = "SUSPENDED"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"


class PurchaseStatus(str, Enum):
    """Vendor purchase bill workflow statuses."""
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    PAYMENT_PENDING = "PAYMENT_PENDING"
    PARTIALLY_PAID = "PARTIALLY_PAID"
    PAID = "PAID"
    REJECTED = "REJECTED"


class PaymentStatus(str, Enum):
    """Financial transaction payment statuses."""
    POSTED = "POSTED"
    REVERSED = "REVERSED"


class PaymentMode(str, Enum):
    """Permitted modes of payment."""
    BANK_TRANSFER = "BANK_TRANSFER"
    UPI = "UPI"
    PAYMENT_GATEWAY = "PAYMENT_GATEWAY"
    CHEQUE = "CHEQUE"
    CASH = "CASH"


class SupplyType(str, Enum):
    """GST supply classification."""
    INTRA_STATE = "INTRA_STATE"  # CGST + SGST
    INTER_STATE = "INTER_STATE"  # IGST
    EXPORT = "EXPORT"            # Zero rated
    EXEMPT = "EXEMPT"            # Nil / Exempt


class AssetType(str, Enum):
    """Company legal branding asset types."""
    COMPANY_LOGO = "COMPANY_LOGO"
    SIGNATURE = "SIGNATURE"
    COMPANY_SEAL = "COMPANY_SEAL"
    PAYMENT_QR = "PAYMENT_QR"


class BillingFrequency(str, Enum):
    """Subscription billing frequencies."""
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    HALF_YEARLY = "HALF_YEARLY"
    YEARLY = "YEARLY"


class ITCStatus(str, Enum):
    """Input Tax Credit eligibility statuses."""
    ELIGIBLE = "ELIGIBLE"
    INELIGIBLE = "INELIGIBLE"
    PENDING = "PENDING"
    CLAIMED = "CLAIMED"


class PartyType(str, Enum):
    """Counterparty classification."""
    CUSTOMER = "CUSTOMER"
    VENDOR = "VENDOR"


class LineItemTaxBreakdown(NamedTuple):
    """Calculated taxes for an itemized line item."""
    taxable_amount: Decimal
    gst_rate: Decimal
    cgst_rate: Decimal
    cgst_amount: Decimal
    sgst_rate: Decimal
    sgst_amount: Decimal
    igst_rate: Decimal
    igst_amount: Decimal
    total_amount: Decimal


class GSTCalculationResult(NamedTuple):
    """Consolidated GST calculation result."""
    supply_type: SupplyType
    total_taxable: Decimal
    total_cgst: Decimal
    total_sgst: Decimal
    total_igst: Decimal
    total_gst: Decimal
    round_off: Decimal
    grand_total: Decimal
    amount_in_words: str
    items: list[LineItemTaxBreakdown]


# Number to words conversion in Indian numbering system (Lakhs & Crores)
ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
TEENS = [
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
]
TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]


def _two_digits_to_words(n: int) -> str:
    """Convert a number <= 99 to words."""
    if n == 0:
        return ""
    if n < 10:
        return ONES[n]
    if n < 20:
        return TEENS[n - 10]
    tens = TENS[n // 10]
    ones = ONES[n % 10]
    return f"{tens} {ones}".strip() if ones else tens


def _three_digits_to_words(n: int) -> str:
    """Convert a number <= 999 to words."""
    hundreds = n // 100
    rem = n % 100
    parts: list[str] = []
    if hundreds > 0:
        parts.append(f"{ONES[hundreds]} Hundred")
    if rem > 0:
        parts.append(_two_digits_to_words(rem))
    return " ".join(parts)


def number_to_indian_rupees_words(amount: Decimal) -> str:
    """
    Convert a Decimal currency value into formal Indian Rupees Words.
    e.g. 10030.00 -> 'Ten Thousand Thirty Rupees Only'
         102000.00 -> 'One Lakh Two Thousand Rupees Only'
    """
    rounded = amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    integer_part = int(rounded)
    paise_part = int((rounded - integer_part) * 100)

    if integer_part == 0 and paise_part == 0:
        return "Zero Rupees Only"

    parts: list[str] = []

    # Indian numbering: Crores (> 1,00,00,000)
    crores = integer_part // 10000000
    rem = integer_part % 10000000

    if crores > 0:
        parts.append(f"{_three_digits_to_words(crores)} Crore")

    # Lakhs (1,00,000 to 99,99,999)
    lakhs = rem // 100000
    rem = rem % 100000
    if lakhs > 0:
        parts.append(f"{_two_digits_to_words(lakhs)} Lakh")

    # Thousands (1,000 to 99,999)
    thousands = rem // 1000
    rem = rem % 1000
    if thousands > 0:
        parts.append(f"{_two_digits_to_words(thousands)} Thousand")

    # Hundreds and remainder
    if rem > 0:
        parts.append(_three_digits_to_words(rem))

    rupees_str = " ".join(parts).strip()
    if rupees_str:
        rupees_str = f"{rupees_str} Rupees"

    if paise_part > 0:
        paise_str = f"{_two_digits_to_words(paise_part)} Paise"
        if rupees_str:
            return f"{rupees_str} and {paise_str} Only"
        return f"{paise_str} Only"

    return f"{rupees_str} Only" if rupees_str else "Zero Rupees Only"
