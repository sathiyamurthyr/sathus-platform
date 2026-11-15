"""Database repositories for Finance, GST & Server Billing."""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional, Sequence
import uuid

from sqlalchemy import and_, desc, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.finance.infrastructure.models import (
    FinanceCompanyProfile,
    FinanceCompanyLocation,
    FinanceCompanyBankAccount,
    FinanceCompanyAsset,
    FinancePaymentQR,
    FinanceSignatory,
    FinanceInvoiceTemplate,
    FinanceDocumentSnapshot,
    FinanceFYSetting,
    FinanceInvoiceSequence,
    FinanceCustomer,
    FinanceCustomerContact,
    FinanceVendor,
    FinanceVendorDocument,
    FinanceService,
    FinanceServicePrice,
    FinanceSubscription,
    FinanceSubscriptionItem,
    FinanceBillingRun,
    FinanceSalesInvoice,
    FinanceSalesItem,
    FinancePurchaseBill,
    FinancePurchaseItem,
    FinancePayment,
    FinancePaymentAllocation,
    FinanceCreditNote,
    FinanceDebitNote,
    FinanceTaxRate,
    FinanceGSTTransaction,
    FinanceEmailLog,
    FinanceAttachment,
    FinanceAuditLog,
)


def _gen_ref_id() -> int:
    """Generate a unique positive 63-bit integer reference ID."""
    return uuid.uuid4().int & 0x7FFFFFFFFFFFFFFF


# ==============================================================================
# COMPANY PROFILE & BRANDING REPOSITORY
# ==============================================================================

class CompanyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_or_create_default_profile(self) -> FinanceCompanyProfile:
        stmt = (
            select(FinanceCompanyProfile)
            .options(
                selectinload(FinanceCompanyProfile.locations),
                selectinload(FinanceCompanyProfile.bank_accounts),
                selectinload(FinanceCompanyProfile.assets),
                selectinload(FinanceCompanyProfile.signatories),
            )
            .limit(1)
        )
        res = await self.session.execute(stmt)
        profile = res.scalar_one_or_none()
        if not profile:
            profile = FinanceCompanyProfile(
                ref_id=_gen_ref_id(),
                legal_name="Sathus Technology Private Limited",
                display_name="Sathus Technology",
                pan="AAECS1234F",
                cin="U72900TN2026PTC123456",
                email="billing@sathus.in",
                phone="+91 44 2828 9000",
                website="https://sathus.in",
            )
            self.session.add(profile)
            await self.session.flush()

            # Seed default location in Tamil Nadu (State Code: 33)
            loc = FinanceCompanyLocation(
                ref_id=_gen_ref_id(),
                company_ref_id=profile.finance_company_profile_ref_id,
                location_name="Chennai Headquarters",
                address_line1="Sathus Technology Tower, 45 Mount Road",
                address_line2="Guindy Industrial Estate",
                city="Chennai",
                district="Chennai",
                state="Tamil Nadu",
                state_code="33",
                pincode="600032",
                gstin="33AAECS1234F1Z5",
                is_default=True,
                status="ACTIVE",
            )
            self.session.add(loc)

            # Seed default company bank account
            bank = FinanceCompanyBankAccount(
                ref_id=_gen_ref_id(),
                company_ref_id=profile.finance_company_profile_ref_id,
                account_holder="Sathus Technology Private Limited",
                bank_name="HDFC Bank",
                branch="Guindy, Chennai",
                account_number_encrypted="encrypted:50200088991122",
                account_number_masked="**** **** 1122",
                ifsc_code="HDFC0001234",
                upi_id="sathustechnology@hdfcbank",
                currency="INR",
                is_default=True,
                show_on_invoice=True,
                status="ACTIVE",
            )
            self.session.add(bank)
            await self.session.commit()
            return await self.get_or_create_default_profile()
        return profile

    async def update_profile(self, profile_ref_id: int, **kwargs) -> Optional[FinanceCompanyProfile]:
        profile = await self.session.execute(
            select(FinanceCompanyProfile).where(FinanceCompanyProfile.ref_id == profile_ref_id)
        )
        obj = profile.scalar_one_or_none()
        if not obj:
            return None
        for k, v in kwargs.items():
            if hasattr(obj, k) and v is not None:
                setattr(obj, k, v)
        obj.updated_at = datetime.utcnow()
        await self.session.commit()
        return obj

    async def list_locations(self) -> Sequence[FinanceCompanyLocation]:
        stmt = select(FinanceCompanyLocation).order_by(desc(FinanceCompanyLocation.is_default))
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def list_bank_accounts(self) -> Sequence[FinanceCompanyBankAccount]:
        stmt = select(FinanceCompanyBankAccount).order_by(desc(FinanceCompanyBankAccount.is_default))
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def list_signatories(self) -> Sequence[FinanceSignatory]:
        stmt = select(FinanceSignatory).order_by(desc(FinanceSignatory.is_default))
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_default_location(self) -> Optional[FinanceCompanyLocation]:
        stmt = select(FinanceCompanyLocation).where(FinanceCompanyLocation.is_default == True).limit(1)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def get_default_bank_account(self) -> Optional[FinanceCompanyBankAccount]:
        stmt = select(FinanceCompanyBankAccount).where(FinanceCompanyBankAccount.is_default == True).limit(1)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def get_default_signatory(self) -> Optional[FinanceSignatory]:
        stmt = select(FinanceSignatory).where(FinanceSignatory.is_default == True).limit(1)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def get_default_qr(self) -> Optional[FinancePaymentQR]:
        stmt = select(FinancePaymentQR).where(FinancePaymentQR.is_default == True).limit(1)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def create_document_snapshot(
        self,
        document_type: str,
        document_ref_id: int,
        company_details_json: str,
        customer_details_json: str,
        bank_details_json: str,
        template_version: str = "1.0",
    ) -> FinanceDocumentSnapshot:
        snapshot = FinanceDocumentSnapshot(
            ref_id=_gen_ref_id(),
            document_type=document_type,
            document_ref_id=document_ref_id,
            company_details_snapshot=company_details_json,
            customer_details_snapshot=customer_details_json,
            bank_details_snapshot=bank_details_json,
            template_version=template_version,
        )
        self.session.add(snapshot)
        await self.session.commit()
        return snapshot

    async def get_document_snapshot(self, document_type: str, document_ref_id: int) -> Optional[FinanceDocumentSnapshot]:
        stmt = select(FinanceDocumentSnapshot).where(
            and_(
                FinanceDocumentSnapshot.document_type == document_type,
                FinanceDocumentSnapshot.document_ref_id == document_ref_id,
            )
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()


# ==============================================================================
# SERVICE CATALOGUE REPOSITORY
# ==============================================================================

class ServiceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def seed_initial_services(self) -> None:
        """Seed Application Server (₹5,500) and Database Server (₹3,000)."""
        app_srv = await self.get_by_code("APP-SERVER")
        if not app_srv:
            app_srv = FinanceService(
                ref_id=_gen_ref_id(),
                service_code="APP-SERVER",
                service_name="Application Server Hosting",
                sac_code="998315",
                description="Application server hosting service for running customer-facing applications, APIs, web applications and application workloads.",
                category="Server Hosting",
                billing_frequency="MONTHLY",
                default_gst_rate=Decimal("18.00"),
                is_active=True,
            )
            self.session.add(app_srv)
            await self.session.flush()

            price_app = FinanceServicePrice(
                ref_id=_gen_ref_id(),
                service_ref_id=app_srv.finance_service_ref_id,
                currency="INR",
                unit_price=Decimal("5500.00"),
                effective_from=date(2026, 1, 1),
                is_active=True,
            )
            self.session.add(price_app)

        db_srv = await self.get_by_code("DB-SERVER")
        if not db_srv:
            db_srv = FinanceService(
                ref_id=_gen_ref_id(),
                service_code="DB-SERVER",
                service_name="Database Server Hosting",
                sac_code="998315",
                description="Dedicated database server hosting for PostgreSQL and other supported database workloads.",
                category="Server Hosting",
                billing_frequency="MONTHLY",
                default_gst_rate=Decimal("18.00"),
                is_active=True,
            )
            self.session.add(db_srv)
            await self.session.flush()

            price_db = FinanceServicePrice(
                ref_id=_gen_ref_id(),
                service_ref_id=db_srv.finance_service_ref_id,
                currency="INR",
                unit_price=Decimal("3000.00"),
                effective_from=date(2026, 1, 1),
                is_active=True,
            )
            self.session.add(price_db)

        await self.session.commit()

    async def list_services(self) -> Sequence[FinanceService]:
        stmt = (
            select(FinanceService)
            .options(selectinload(FinanceService.prices))
            .order_by(FinanceService.service_code)
        )
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_by_code(self, code: str) -> Optional[FinanceService]:
        stmt = (
            select(FinanceService)
            .options(selectinload(FinanceService.prices))
            .where(FinanceService.service_code == code)
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def get_by_ref_id(self, ref_id: int) -> Optional[FinanceService]:
        stmt = (
            select(FinanceService)
            .options(selectinload(FinanceService.prices))
            .where(FinanceService.ref_id == ref_id)
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def create_service(self, **kwargs) -> FinanceService:
        initial_price = kwargs.pop("unit_price", Decimal("0.00"))
        service = FinanceService(ref_id=_gen_ref_id(), **kwargs)
        self.session.add(service)
        await self.session.flush()

        price = FinanceServicePrice(
            ref_id=_gen_ref_id(),
            service_ref_id=service.finance_service_ref_id,
            currency="INR",
            unit_price=Decimal(str(initial_price)),
            effective_from=date.today(),
            is_active=True,
        )
        self.session.add(price)
        await self.session.commit()
        return service


# ==============================================================================
# CUSTOMER REPOSITORY
# ==============================================================================

class CustomerRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_customers(self, search: Optional[str] = None) -> Sequence[FinanceCustomer]:
        stmt = select(FinanceCustomer).options(selectinload(FinanceCustomer.contacts)).order_by(desc(FinanceCustomer.created_at))
        if search:
            pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    FinanceCustomer.customer_name.ilike(pattern),
                    FinanceCustomer.legal_company_name.ilike(pattern),
                    FinanceCustomer.customer_code.ilike(pattern),
                    FinanceCustomer.gstin.ilike(pattern),
                )
            )
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_by_ref_id(self, ref_id: int) -> Optional[FinanceCustomer]:
        stmt = select(FinanceCustomer).options(selectinload(FinanceCustomer.contacts)).where(FinanceCustomer.ref_id == ref_id)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def create_customer(self, **kwargs) -> FinanceCustomer:
        customer = FinanceCustomer(ref_id=_gen_ref_id(), **kwargs)
        self.session.add(customer)
        await self.session.commit()
        return customer

    async def update_customer(self, ref_id: int, **kwargs) -> Optional[FinanceCustomer]:
        cust = await self.get_by_ref_id(ref_id)
        if not cust:
            return None
        for k, v in kwargs.items():
            if hasattr(cust, k) and v is not None:
                setattr(cust, k, v)
        cust.updated_at = datetime.utcnow()
        await self.session.commit()
        return cust


# ==============================================================================
# VENDOR REPOSITORY
# ==============================================================================

class VendorRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_vendors(self, search: Optional[str] = None) -> Sequence[FinanceVendor]:
        stmt = select(FinanceVendor).options(selectinload(FinanceVendor.documents)).order_by(desc(FinanceVendor.created_at))
        if search:
            pattern = f"%{search}%"
            stmt = stmt.where(
                or_(
                    FinanceVendor.vendor_name.ilike(pattern),
                    FinanceVendor.legal_name.ilike(pattern),
                    FinanceVendor.vendor_code.ilike(pattern),
                    FinanceVendor.gstin.ilike(pattern),
                )
            )
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_by_ref_id(self, ref_id: int) -> Optional[FinanceVendor]:
        stmt = select(FinanceVendor).options(selectinload(FinanceVendor.documents)).where(FinanceVendor.ref_id == ref_id)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def create_vendor(self, **kwargs) -> FinanceVendor:
        vendor = FinanceVendor(ref_id=_gen_ref_id(), **kwargs)
        self.session.add(vendor)
        await self.session.commit()
        return vendor


# ==============================================================================
# SUBSCRIPTION REPOSITORY
# ==============================================================================

class SubscriptionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_subscriptions(self, customer_ref_id: Optional[int] = None) -> Sequence[FinanceSubscription]:
        stmt = (
            select(FinanceSubscription)
            .options(
                selectinload(FinanceSubscription.customer),
                selectinload(FinanceSubscription.items).selectinload(FinanceSubscriptionItem.service),
            )
            .order_by(desc(FinanceSubscription.created_at))
        )
        if customer_ref_id:
            stmt = stmt.join(FinanceCustomer).where(FinanceCustomer.ref_id == customer_ref_id)
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_by_ref_id(self, ref_id: int) -> Optional[FinanceSubscription]:
        stmt = (
            select(FinanceSubscription)
            .options(
                selectinload(FinanceSubscription.customer),
                selectinload(FinanceSubscription.items).selectinload(FinanceSubscriptionItem.service),
            )
            .where(FinanceSubscription.ref_id == ref_id)
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def create_subscription(
        self,
        customer_ref_id: int,
        items_data: list[dict],
        billing_day: int = 1,
        billing_frequency: str = "MONTHLY",
        auto_generate: bool = True,
        auto_send: bool = False,
        approval_required: bool = True,
    ) -> FinanceSubscription:
        cust = await self.session.execute(
            select(FinanceCustomer).where(FinanceCustomer.ref_id == customer_ref_id)
        )
        customer = cust.scalar_one()

        sub_number = f"SUB-{datetime.utcnow().year}-{_gen_ref_id() % 100000:05d}"
        today = date.today()
        # Next billing is set to the upcoming billing day
        next_billing = today

        sub = FinanceSubscription(
            ref_id=_gen_ref_id(),
            subscription_number=sub_number,
            customer_ref_id=customer.finance_customer_ref_id,
            billing_frequency=billing_frequency,
            billing_day=billing_day,
            start_date=today,
            next_billing_date=next_billing,
            auto_generate_invoice=auto_generate,
            auto_send_email=auto_send,
            approval_required=approval_required,
            status="ACTIVE",
        )
        self.session.add(sub)
        await self.session.flush()

        for it in items_data:
            srv = await self.session.execute(
                select(FinanceService).where(FinanceService.ref_id == it["service_ref_id"])
            )
            service = srv.scalar_one()

            item = FinanceSubscriptionItem(
                ref_id=_gen_ref_id(),
                subscription_ref_id=sub.finance_subscription_ref_id,
                service_ref_id=service.finance_service_ref_id,
                server_identifier=it.get("server_identifier"),
                server_hostname=it.get("server_hostname"),
                server_ip=it.get("server_ip"),
                quantity=it.get("quantity", 1),
                unit_price=Decimal(str(it["unit_price"])),
                gst_rate=Decimal(str(it.get("gst_rate", service.default_gst_rate))),
                status="ACTIVE",
            )
            self.session.add(item)

        await self.session.commit()
        return await self.get_by_ref_id(sub.ref_id)

    async def update_status(self, ref_id: int, new_status: str) -> Optional[FinanceSubscription]:
        sub = await self.get_by_ref_id(ref_id)
        if not sub:
            return None
        sub.status = new_status
        sub.updated_at = datetime.utcnow()
        await self.session.commit()
        return sub

    async def get_subscriptions_due_for_billing(self, as_of_date: date) -> Sequence[FinanceSubscription]:
        stmt = (
            select(FinanceSubscription)
            .options(
                selectinload(FinanceSubscription.customer),
                selectinload(FinanceSubscription.items).selectinload(FinanceSubscriptionItem.service),
            )
            .where(
                and_(
                    FinanceSubscription.status == "ACTIVE",
                    FinanceSubscription.auto_generate_invoice == True,
                    FinanceSubscription.next_billing_date <= as_of_date,
                )
            )
        )
        res = await self.session.execute(stmt)
        return res.scalars().all()


# ==============================================================================
# SALES INVOICE REPOSITORY
# ==============================================================================

class InvoiceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_next_invoice_number(self, fy_code: str = "2026-2027", prefix: str = "SATH/26-27/") -> str:
        """Atomically increment and retrieve next sequential invoice number."""
        stmt = (
            select(FinanceInvoiceSequence)
            .where(and_(FinanceInvoiceSequence.fy_code == fy_code, FinanceInvoiceSequence.prefix == prefix))
            .with_for_update()
        )
        res = await self.session.execute(stmt)
        seq = res.scalar_one_or_none()
        if not seq:
            seq = FinanceInvoiceSequence(
                ref_id=_gen_ref_id(),
                fy_code=fy_code,
                prefix=prefix,
                last_number=1,
            )
            self.session.add(seq)
            next_num = 1
        else:
            seq.last_number += 1
            next_num = seq.last_number
        await self.session.flush()
        return f"{prefix}{next_num:05d}"

    async def list_invoices(
        self,
        customer_ref_id: Optional[int] = None,
        status: Optional[str] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
    ) -> Sequence[FinanceSalesInvoice]:
        stmt = (
            select(FinanceSalesInvoice)
            .options(
                selectinload(FinanceSalesInvoice.customer),
                selectinload(FinanceSalesInvoice.items),
                selectinload(FinanceSalesInvoice.allocations),
            )
            .order_by(desc(FinanceSalesInvoice.invoice_date), desc(FinanceSalesInvoice.finance_sales_invoice_ref_id))
        )
        conditions = []
        if customer_ref_id:
            conditions.append(FinanceCustomer.ref_id == customer_ref_id)
            stmt = stmt.join(FinanceCustomer)
        if status:
            conditions.append(FinanceSalesInvoice.status == status)
        if from_date:
            conditions.append(FinanceSalesInvoice.invoice_date >= from_date)
        if to_date:
            conditions.append(FinanceSalesInvoice.invoice_date <= to_date)

        if conditions:
            stmt = stmt.where(and_(*conditions))

        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_by_ref_id(self, ref_id: int) -> Optional[FinanceSalesInvoice]:
        stmt = (
            select(FinanceSalesInvoice)
            .options(
                selectinload(FinanceSalesInvoice.customer),
                selectinload(FinanceSalesInvoice.items),
                selectinload(FinanceSalesInvoice.allocations),
            )
            .where(FinanceSalesInvoice.ref_id == ref_id)
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def get_by_invoice_no(self, invoice_no: str) -> Optional[FinanceSalesInvoice]:
        stmt = (
            select(FinanceSalesInvoice)
            .options(
                selectinload(FinanceSalesInvoice.customer),
                selectinload(FinanceSalesInvoice.items),
            )
            .where(FinanceSalesInvoice.invoice_no == invoice_no)
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def invoice_exists_for_period(self, subscription_pk: int, start_date: date, end_date: date) -> bool:
        stmt = select(func.count(FinanceSalesInvoice.finance_sales_invoice_ref_id)).where(
            and_(
                FinanceSalesInvoice.subscription_ref_id == subscription_pk,
                FinanceSalesInvoice.billing_period_start == start_date,
                FinanceSalesInvoice.billing_period_end == end_date,
            )
        )
        res = await self.session.execute(stmt)
        count = res.scalar() or 0
        return count > 0


# ==============================================================================
# PURCHASE BILLS REPOSITORY
# ==============================================================================

class PurchaseRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_bills(self, vendor_ref_id: Optional[int] = None, status: Optional[str] = None) -> Sequence[FinancePurchaseBill]:
        stmt = (
            select(FinancePurchaseBill)
            .options(
                selectinload(FinancePurchaseBill.vendor),
                selectinload(FinancePurchaseBill.items),
            )
            .order_by(desc(FinancePurchaseBill.bill_date))
        )
        conditions = []
        if vendor_ref_id:
            conditions.append(FinanceVendor.ref_id == vendor_ref_id)
            stmt = stmt.join(FinanceVendor)
        if status:
            conditions.append(FinancePurchaseBill.status == status)
        if conditions:
            stmt = stmt.where(and_(*conditions))
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def get_by_ref_id(self, ref_id: int) -> Optional[FinancePurchaseBill]:
        stmt = (
            select(FinancePurchaseBill)
            .options(
                selectinload(FinancePurchaseBill.vendor),
                selectinload(FinancePurchaseBill.items),
            )
            .where(FinancePurchaseBill.ref_id == ref_id)
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def create_bill(self, vendor_ref_id: int, bill_no: str, items_data: list[dict], **kwargs) -> FinancePurchaseBill:
        vend = await self.session.execute(select(FinanceVendor).where(FinanceVendor.ref_id == vendor_ref_id))
        vendor = vend.scalar_one()

        bill = FinancePurchaseBill(
            ref_id=_gen_ref_id(),
            bill_no=bill_no,
            vendor_ref_id=vendor.finance_vendor_ref_id,
            **kwargs,
        )
        self.session.add(bill)
        await self.session.flush()

        total_taxable = Decimal("0.00")
        total_gst = Decimal("0.00")

        for it in items_data:
            taxable = Decimal(str(it["taxable_amount"]))
            rate = Decimal(str(it.get("gst_rate", "18.00")))
            item_tot = taxable + (taxable * (rate / Decimal("100")))
            total_taxable += taxable
            total_gst += (taxable * (rate / Decimal("100")))

            item = FinancePurchaseItem(
                ref_id=_gen_ref_id(),
                purchase_bill_ref_id=bill.finance_purchase_bill_ref_id,
                item_description=it["item_description"],
                sac_or_hsn=it.get("sac_or_hsn", "998315"),
                quantity=it.get("quantity", 1),
                unit_price=Decimal(str(it["unit_price"])),
                taxable_amount=taxable,
                gst_rate=rate,
                total_amount=item_tot,
            )
            self.session.add(item)

        bill.taxable_amount = total_taxable
        bill.total_gst = total_gst
        bill.grand_total = total_taxable + total_gst
        bill.balance_due = bill.grand_total

        await self.session.commit()
        return await self.get_by_ref_id(bill.ref_id)


# ==============================================================================
# PAYMENTS REPOSITORY
# ==============================================================================

class PaymentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_payments(self, party_type: Optional[str] = None) -> Sequence[FinancePayment]:
        stmt = (
            select(FinancePayment)
            .options(selectinload(FinancePayment.allocations))
            .order_by(desc(FinancePayment.payment_date))
        )
        if party_type:
            stmt = stmt.where(FinancePayment.party_type == party_type)
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def record_payment(
        self,
        payment_type: str,
        party_type: str,
        party_ref_id: int,
        amount: Decimal,
        transaction_reference: str,
        payment_mode: str = "BANK_TRANSFER",
        bank_account_ref_id: Optional[int] = None,
        created_by_user_id: Optional[str] = None,
    ) -> FinancePayment:
        payment_num = f"PAY-{datetime.utcnow().year}-{_gen_ref_id() % 100000:05d}"
        payment = FinancePayment(
            ref_id=_gen_ref_id(),
            payment_number=payment_num,
            payment_type=payment_type,
            party_type=party_type,
            party_ref_id=party_ref_id,
            payment_date=date.today(),
            payment_mode=payment_mode,
            amount=amount,
            transaction_reference=transaction_reference,
            bank_account_ref_id=bank_account_ref_id,
            status="POSTED",
            created_by_user_id=created_by_user_id,
        )
        self.session.add(payment)
        await self.session.commit()
        return payment

    async def allocate_payment_to_invoice(
        self,
        payment_ref_id: int,
        invoice_ref_id: int,
        amount: Decimal,
    ) -> FinancePaymentAllocation:
        pay = await self.session.execute(select(FinancePayment).where(FinancePayment.ref_id == payment_ref_id))
        payment = pay.scalar_one()

        inv = await self.session.execute(select(FinanceSalesInvoice).where(FinanceSalesInvoice.ref_id == invoice_ref_id))
        invoice = inv.scalar_one()

        alloc = FinancePaymentAllocation(
            ref_id=_gen_ref_id(),
            payment_ref_id=payment.finance_payment_ref_id,
            invoice_type="SALES_INVOICE",
            invoice_ref_id=invoice.finance_sales_invoice_ref_id,
            allocated_amount=amount,
        )
        self.session.add(alloc)

        # Update invoice balance due
        invoice.paid_amount += amount
        invoice.balance_due = max(invoice.grand_total - invoice.paid_amount, Decimal("0.00"))
        if invoice.balance_due == Decimal("0.00"):
            invoice.status = "PAID"
        else:
            invoice.status = "PARTIALLY_PAID"

        await self.session.commit()
        return alloc


# ==============================================================================
# AUDIT & REPORTING REPOSITORY
# ==============================================================================

class AuditRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_action(
        self,
        action: str,
        entity_type: str,
        entity_ref_id: int,
        user_id: str,
        old_values: Optional[str] = None,
        new_values: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> FinanceAuditLog:
        log = FinanceAuditLog(
            ref_id=_gen_ref_id(),
            action=action,
            entity_type=entity_type,
            entity_ref_id=entity_ref_id,
            performed_by_user_id=user_id,
            old_values=old_values,
            new_values=new_values,
            ip_address=ip_address,
        )
        self.session.add(log)
        await self.session.commit()
        return log
