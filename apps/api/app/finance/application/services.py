"""Application services orchestrating financial operations and workflows."""

from datetime import date, datetime
from decimal import Decimal
import json
from typing import Optional, Sequence

from app.core.exceptions import AppException
from app.finance.application.gst_engine import calculate_invoice_totals
from app.finance.domain.models import (
    InvoiceStatus,
    SubscriptionStatus,
    SupplyType,
)
from app.finance.infrastructure.models import (
    FinanceBillingRun,
    FinanceCustomer,
    FinanceDocumentSnapshot,
    FinancePayment,
    FinancePurchaseBill,
    FinanceSalesInvoice,
    FinanceSalesItem,
    FinanceSubscription,
)
from app.finance.infrastructure.repositories import (
    AuditRepository,
    CompanyRepository,
    CustomerRepository,
    InvoiceRepository,
    PaymentRepository,
    PurchaseRepository,
    ServiceRepository,
    SubscriptionRepository,
    _gen_ref_id,
)


class InvoiceService:
    def __init__(
        self,
        invoice_repo: InvoiceRepository,
        company_repo: CompanyRepository,
        customer_repo: CustomerRepository,
        audit_repo: AuditRepository,
    ):
        self.invoice_repo = invoice_repo
        self.company_repo = company_repo
        self.customer_repo = customer_repo
        self.audit_repo = audit_repo

    async def calculate_preview(
        self,
        customer_ref_id: int,
        items: list[dict],
        supplier_location_ref_id: Optional[int] = None,
    ) -> dict:
        customer = await self.customer_repo.get_by_ref_id(customer_ref_id)
        if not customer:
            raise AppException(f"Customer with ref_id {customer_ref_id} not found")

        company = await self.company_repo.get_or_create_default_profile()
        location = await self.company_repo.get_default_location()
        supplier_state_code = location.state_code if location else "33"

        calc = calculate_invoice_totals(
            items_data=items,
            supplier_state_code=supplier_state_code,
            place_of_supply_state_code=customer.state_code,
        )

        return {
            "supply_type": calc.supply_type.value,
            "place_of_supply": customer.state,
            "place_of_supply_code": customer.state_code,
            "taxable_amount": str(calc.total_taxable),
            "cgst_amount": str(calc.total_cgst),
            "sgst_amount": str(calc.total_sgst),
            "igst_amount": str(calc.total_igst),
            "total_gst": str(calc.total_gst),
            "round_off": str(calc.round_off),
            "grand_total": str(calc.grand_total),
            "amount_in_words": calc.amount_in_words,
            "items": [
                {
                    "taxable_amount": str(it.taxable_amount),
                    "gst_rate": str(it.gst_rate),
                    "cgst_rate": str(it.cgst_rate),
                    "cgst_amount": str(it.cgst_amount),
                    "sgst_rate": str(it.sgst_rate),
                    "sgst_amount": str(it.sgst_amount),
                    "igst_rate": str(it.igst_rate),
                    "igst_amount": str(it.igst_amount),
                    "total_amount": str(it.total_amount),
                }
                for it in calc.items
            ],
        }

    async def create_invoice(
        self,
        customer_ref_id: int,
        billing_period_start: date,
        billing_period_end: date,
        items: list[dict],
        due_date: Optional[date] = None,
        created_by_user_id: Optional[str] = None,
        subscription_ref_id: Optional[int] = None,
        payment_terms: Optional[str] = "Net 15 Days",
    ) -> FinanceSalesInvoice:
        customer = await self.customer_repo.get_by_ref_id(customer_ref_id)
        if not customer:
            raise AppException(f"Customer with ref_id {customer_ref_id} not found")

        company = await self.company_repo.get_or_create_default_profile()
        location = await self.company_repo.get_default_location()
        bank = await self.company_repo.get_default_bank_account()
        signatory = await self.company_repo.get_default_signatory()
        qr = await self.company_repo.get_default_qr()

        supplier_state_code = location.state_code if location else "33"

        calc = calculate_invoice_totals(
            items_data=items,
            supplier_state_code=supplier_state_code,
            place_of_supply_state_code=customer.state_code,
        )

        invoice_no = await self.invoice_repo.get_next_invoice_number()
        today = date.today()
        invoice_due = due_date or date.fromordinal(today.toordinal() + customer.payment_terms_days)

        invoice = FinanceSalesInvoice(
            ref_id=_gen_ref_id(),
            invoice_no=invoice_no,
            subscription_ref_id=subscription_ref_id,
            customer_ref_id=customer.finance_customer_ref_id,
            company_location_ref_id=location.finance_company_location_ref_id if location else None,
            bank_account_ref_id=bank.finance_company_bank_account_ref_id if bank else None,
            payment_qr_ref_id=qr.finance_payment_qr_ref_id if qr else None,
            signatory_ref_id=signatory.finance_signatory_ref_id if signatory else None,
            invoice_date=today,
            due_date=invoice_due,
            billing_period_start=billing_period_start,
            billing_period_end=billing_period_end,
            place_of_supply=customer.state,
            place_of_supply_code=customer.state_code,
            supply_type=calc.supply_type.value,
            taxable_amount=calc.total_taxable,
            cgst_amount=calc.total_cgst,
            sgst_amount=calc.total_sgst,
            igst_amount=calc.total_igst,
            total_gst=calc.total_gst,
            round_off=calc.round_off,
            grand_total=calc.grand_total,
            paid_amount=Decimal("0.00"),
            balance_due=calc.grand_total,
            status=InvoiceStatus.DRAFT.value,
            created_by_user_id=created_by_user_id or "system",
            payment_terms=payment_terms,
        )
        self.invoice_repo.session.add(invoice)
        await self.invoice_repo.session.flush()

        for idx, it in enumerate(items):
            line_calc = calc.items[idx]
            item = FinanceSalesItem(
                ref_id=_gen_ref_id(),
                sales_invoice_ref_id=invoice.finance_sales_invoice_ref_id,
                service_ref_id=it.get("service_ref_id"),
                item_description=it["item_description"],
                sac_code=it.get("sac_code", "998315"),
                quantity=it.get("quantity", 1),
                unit_price=Decimal(str(it["unit_price"])),
                discount_amount=Decimal(str(it.get("discount_amount", "0.00"))),
                taxable_amount=line_calc.taxable_amount,
                gst_rate=line_calc.gst_rate,
                cgst_rate=line_calc.cgst_rate,
                cgst_amount=line_calc.cgst_amount,
                sgst_rate=line_calc.sgst_rate,
                sgst_amount=line_calc.sgst_amount,
                igst_rate=line_calc.igst_rate,
                igst_amount=line_calc.igst_amount,
                total_amount=line_calc.total_amount,
            )
            self.invoice_repo.session.add(item)

        await self.invoice_repo.session.commit()
        await self.audit_repo.log_action(
            action="INVOICE_CREATE",
            entity_type="SALES_INVOICE",
            entity_ref_id=invoice.ref_id,
            user_id=created_by_user_id or "system",
            new_values=json.dumps({"invoice_no": invoice_no, "grand_total": str(calc.grand_total)}),
        )
        return await self.invoice_repo.get_by_ref_id(invoice.ref_id)

    async def approve_invoice(self, invoice_ref_id: int, approver_user_id: str) -> FinanceSalesInvoice:
        invoice = await self.invoice_repo.get_by_ref_id(invoice_ref_id)
        if not invoice:
            raise AppException("Invoice not found")

        # Maker-Checker verification: Approver must be distinct from Creator
        if approver_user_id and invoice.created_by_user_id:
            if approver_user_id.lower() == invoice.created_by_user_id.lower() and approver_user_id != "system":
                raise AppException("Maker-checker violation: Invoice creator cannot approve their own invoice")

        invoice.status = InvoiceStatus.APPROVED.value
        invoice.approved_by_user_id = approver_user_id
        invoice.approved_at = datetime.utcnow()
        invoice.updated_at = datetime.utcnow()

        await self.invoice_repo.session.commit()
        await self.audit_repo.log_action(
            action="INVOICE_APPROVE",
            entity_type="SALES_INVOICE",
            entity_ref_id=invoice.ref_id,
            user_id=approver_user_id,
        )
        return invoice

    async def issue_invoice(self, invoice_ref_id: int, issued_by_user_id: str) -> FinanceSalesInvoice:
        """Issue invoice and freeze immutable document snapshot."""
        invoice = await self.invoice_repo.get_by_ref_id(invoice_ref_id)
        if not invoice:
            raise AppException("Invoice not found")

        company = await self.company_repo.get_or_create_default_profile()
        location = await self.company_repo.get_default_location()
        bank = await self.company_repo.get_default_bank_account()
        customer = invoice.customer

        company_snapshot = {
            "legal_name": company.legal_name,
            "display_name": company.display_name,
            "pan": company.pan,
            "cin": company.cin,
            "email": company.email,
            "phone": company.phone,
            "website": company.website,
            "location_name": location.location_name if location else None,
            "address": f"{location.address_line1}, {location.city}, {location.state} - {location.pincode}" if location else "",
            "gstin": location.gstin if location else "",
            "state": location.state if location else "Tamil Nadu",
            "state_code": location.state_code if location else "33",
        }

        customer_snapshot = {
            "customer_code": customer.customer_code,
            "customer_name": customer.customer_name,
            "legal_company_name": customer.legal_company_name,
            "gstin": customer.gstin,
            "pan": customer.pan,
            "state": customer.state,
            "state_code": customer.state_code,
            "billing_address": customer.billing_address,
            "service_address": customer.service_address,
            "email": customer.email,
            "phone": customer.phone,
        }

        bank_snapshot = {
            "account_holder": bank.account_holder if bank else "",
            "bank_name": bank.bank_name if bank else "",
            "branch": bank.branch if bank else "",
            "account_number_masked": bank.account_number_masked if bank else "",
            "ifsc_code": bank.ifsc_code if bank else "",
            "upi_id": bank.upi_id if bank else "",
        }

        await self.company_repo.create_document_snapshot(
            document_type="SALES_INVOICE",
            document_ref_id=invoice.ref_id,
            company_details_json=json.dumps(company_snapshot),
            customer_details_json=json.dumps(customer_snapshot),
            bank_details_json=json.dumps(bank_snapshot),
            template_version="1.0",
        )

        invoice.status = InvoiceStatus.ISSUED.value
        invoice.updated_at = datetime.utcnow()
        await self.invoice_repo.session.commit()

        await self.audit_repo.log_action(
            action="INVOICE_ISSUE",
            entity_type="SALES_INVOICE",
            entity_ref_id=invoice.ref_id,
            user_id=issued_by_user_id,
        )
        return invoice


class SubscriptionService:
    def __init__(
        self,
        sub_repo: SubscriptionRepository,
        service_repo: ServiceRepository,
        customer_repo: CustomerRepository,
        audit_repo: AuditRepository,
    ):
        self.sub_repo = sub_repo
        self.service_repo = service_repo
        self.customer_repo = customer_repo
        self.audit_repo = audit_repo

    async def create_subscription(
        self,
        customer_ref_id: int,
        items: list[dict],
        billing_day: int = 1,
        auto_generate: bool = True,
        auto_send: bool = False,
        approval_required: bool = True,
    ) -> FinanceSubscription:
        sub = await self.sub_repo.create_subscription(
            customer_ref_id=customer_ref_id,
            items_data=items,
            billing_day=billing_day,
            auto_generate=auto_generate,
            auto_send=auto_send,
            approval_required=approval_required,
        )
        await self.audit_repo.log_action(
            action="SUBSCRIPTION_CREATE",
            entity_type="SUBSCRIPTION",
            entity_ref_id=sub.ref_id,
            user_id="admin",
            new_values=json.dumps({"sub_no": sub.subscription_number, "items_count": len(items)}),
        )
        return sub

    async def pause_subscription(self, ref_id: int) -> FinanceSubscription:
        sub = await self.sub_repo.update_status(ref_id, SubscriptionStatus.PAUSED.value)
        if not sub:
            raise AppException("Subscription not found")
        await self.audit_repo.log_action(
            action="SUBSCRIPTION_PAUSE",
            entity_type="SUBSCRIPTION",
            entity_ref_id=ref_id,
            user_id="admin",
        )
        return sub

    async def resume_subscription(self, ref_id: int) -> FinanceSubscription:
        sub = await self.sub_repo.update_status(ref_id, SubscriptionStatus.ACTIVE.value)
        if not sub:
            raise AppException("Subscription not found")
        await self.audit_repo.log_action(
            action="SUBSCRIPTION_RESUME",
            entity_type="SUBSCRIPTION",
            entity_ref_id=ref_id,
            user_id="admin",
        )
        return sub

    async def cancel_subscription(self, ref_id: int) -> FinanceSubscription:
        sub = await self.sub_repo.update_status(ref_id, SubscriptionStatus.CANCELLED.value)
        if not sub:
            raise AppException("Subscription not found")
        await self.audit_repo.log_action(
            action="SUBSCRIPTION_CANCEL",
            entity_type="SUBSCRIPTION",
            entity_ref_id=ref_id,
            user_id="admin",
        )
        return sub


class RecurringBillingService:
    def __init__(
        self,
        sub_repo: SubscriptionRepository,
        invoice_service: InvoiceService,
        audit_repo: AuditRepository,
    ):
        self.sub_repo = sub_repo
        self.invoice_service = invoice_service
        self.audit_repo = audit_repo

    async def execute_billing_run(self, as_of_date: Optional[date] = None) -> FinanceBillingRun:
        run_date = as_of_date or date.today()
        # Monthly billing period: 1st of month to end of month
        period_start = date(run_date.year, run_date.month, 1)
        if run_date.month == 12:
            period_end = date(run_date.year, 12, 31)
        else:
            period_end = date(run_date.year, run_date.month + 1, 1).fromordinal(
                date(run_date.year, run_date.month + 1, 1).toordinal() - 1
            )

        active_subs = await self.sub_repo.get_subscriptions_due_for_billing(run_date)

        invoices_generated = 0
        total_taxable = Decimal("0.00")
        total_gst = Decimal("0.00")

        for sub in active_subs:
            # Idempotency Protection: Check if invoice already exists for this subscription & period
            already_billed = await self.invoice_service.invoice_repo.invoice_exists_for_period(
                sub.finance_subscription_ref_id, period_start, period_end
            )
            if already_billed:
                continue

            # Build line items from active subscription items
            items_payload = []
            for item in sub.items:
                if item.status == "ACTIVE":
                    srv = item.service
                    items_payload.append({
                        "service_ref_id": srv.ref_id,
                        "item_description": f"{srv.service_name} ({item.server_identifier or 'Primary'}) - {sub.billing_frequency} Hosting",
                        "sac_code": srv.sac_code,
                        "quantity": item.quantity,
                        "unit_price": str(item.unit_price),
                        "gst_rate": str(item.gst_rate),
                        "discount_amount": "0.00",
                    })

            if not items_payload:
                continue

            inv = await self.invoice_service.create_invoice(
                customer_ref_id=sub.customer.ref_id,
                billing_period_start=period_start,
                billing_period_end=period_end,
                items=items_payload,
                subscription_ref_id=sub.finance_subscription_ref_id,
                created_by_user_id="recurring_billing_worker",
            )
            invoices_generated += 1
            total_taxable += inv.taxable_amount
            total_gst += inv.total_gst

        billing_run = FinanceBillingRun(
            ref_id=_gen_ref_id(),
            run_date=run_date,
            billing_period_start=period_start,
            billing_period_end=period_end,
            total_subscriptions_scanned=len(active_subs),
            invoices_generated=invoices_generated,
            total_taxable_amount=total_taxable,
            total_gst_amount=total_gst,
            status="COMPLETED",
        )
        self.sub_repo.session.add(billing_run)
        await self.sub_repo.session.commit()

        return billing_run


class PaymentService:
    def __init__(self, payment_repo: PaymentRepository, audit_repo: AuditRepository):
        self.payment_repo = payment_repo
        self.audit_repo = audit_repo

    async def record_payment(
        self,
        payment_type: str,
        party_type: str,
        party_ref_id: int,
        amount: Decimal,
        transaction_reference: str,
        payment_mode: str = "BANK_TRANSFER",
        invoice_ref_ids: Optional[list[int]] = None,
        created_by_user_id: Optional[str] = None,
    ) -> FinancePayment:
        payment = await self.payment_repo.record_payment(
            payment_type=payment_type,
            party_type=party_type,
            party_ref_id=party_ref_id,
            amount=amount,
            transaction_reference=transaction_reference,
            payment_mode=payment_mode,
            created_by_user_id=created_by_user_id,
        )

        # Allocate against provided invoices if specified
        if invoice_ref_ids and payment_type == "CLIENT_RECEIPT":
            rem = amount
            for inv_ref in invoice_ref_ids:
                if rem <= Decimal("0.00"):
                    break
                # For simplicity, allocate up to rem
                await self.payment_repo.allocate_payment_to_invoice(
                    payment_ref_id=payment.ref_id,
                    invoice_ref_id=inv_ref,
                    amount=rem,
                )

        await self.audit_repo.log_action(
            action="PAYMENT_RECORD",
            entity_type="PAYMENT",
            entity_ref_id=payment.ref_id,
            user_id=created_by_user_id or "admin",
            new_values=json.dumps({"amount": str(amount), "ref": transaction_reference}),
        )
        return payment
