"""FastAPI Endpoints for Finance, GST & Server Billing."""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.finance.api.schemas import (
    CompanyBankAccountResponse,
    CompanyLocationResponse,
    CompanyProfileResponse,
    CompanyProfileUpdate,
    CompanySignatoryResponse,
    CustomerCreate,
    CustomerResponse,
    FinanceDashboardSummary,
    InvoiceCalculateRequest,
    InvoiceCreate,
    InvoiceResponse,
    PaymentCreate,
    PaymentResponse,
    PurchaseBillCreate,
    PurchaseBillResponse,
    ServiceCreate,
    ServiceResponse,
    SubscriptionCreate,
    SubscriptionResponse,
    VendorCreate,
    VendorResponse,
)
from app.finance.application.services import (
    InvoiceService,
    PaymentService,
    RecurringBillingService,
    SubscriptionService,
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
)

router = APIRouter()


# ==============================================================================
# DEPENDENCIES
# ==============================================================================

def get_repos(db: AsyncSession = Depends(get_db)):
    return {
        "company": CompanyRepository(db),
        "service": ServiceRepository(db),
        "customer": CustomerRepository(db),
        "vendor": VendorRepository(db),
        "subscription": SubscriptionRepository(db),
        "invoice": InvoiceRepository(db),
        "purchase": PurchaseRepository(db),
        "payment": PaymentRepository(db),
        "audit": AuditRepository(db),
    }


def get_invoice_service(repos: dict = Depends(get_repos)) -> InvoiceService:
    return InvoiceService(
        invoice_repo=repos["invoice"],
        company_repo=repos["company"],
        customer_repo=repos["customer"],
        audit_repo=repos["audit"],
    )


def get_subscription_service(repos: dict = Depends(get_repos)) -> SubscriptionService:
    return SubscriptionService(
        sub_repo=repos["subscription"],
        service_repo=repos["service"],
        customer_repo=repos["customer"],
        audit_repo=repos["audit"],
    )


def get_billing_service(
    repos: dict = Depends(get_repos),
    inv_svc: InvoiceService = Depends(get_invoice_service),
) -> RecurringBillingService:
    return RecurringBillingService(
        sub_repo=repos["subscription"],
        invoice_service=inv_svc,
        audit_repo=repos["audit"],
    )


def get_payment_service(repos: dict = Depends(get_repos)) -> PaymentService:
    return PaymentService(
        payment_repo=repos["payment"],
        audit_repo=repos["audit"],
    )


# ==============================================================================
# 1. COMPANY PROFILE & SETTINGS
# ==============================================================================

@router.get("/company-profile", response_model=CompanyProfileResponse)
async def get_company_profile(repos: dict = Depends(get_repos)):
    """Retrieve master company legal profile and default locations."""
    profile = await repos["company"].get_or_create_default_profile()
    return profile


@router.put("/company-profile", response_model=CompanyProfileResponse)
async def update_company_profile(
    payload: CompanyProfileUpdate,
    repos: dict = Depends(get_repos),
):
    """Update master company profile details."""
    profile = await repos["company"].get_or_create_default_profile()
    updated = await repos["company"].update_profile(
        profile_ref_id=profile.ref_id,
        **payload.model_dump(exclude_unset=True),
    )
    return updated


@router.get("/locations", response_model=list[CompanyLocationResponse])
async def list_company_locations(repos: dict = Depends(get_repos)):
    """List business locations and state GSTIN registrations."""
    await repos["company"].get_or_create_default_profile()
    return await repos["company"].list_locations()


@router.get("/bank-accounts", response_model=list[CompanyBankAccountResponse])
async def list_company_bank_accounts(repos: dict = Depends(get_repos)):
    """List designated bank accounts with masked account numbers."""
    await repos["company"].get_or_create_default_profile()
    return await repos["company"].list_bank_accounts()


@router.get("/signatories", response_model=list[CompanySignatoryResponse])
async def list_signatories(repos: dict = Depends(get_repos)):
    """List authorized signatories."""
    await repos["company"].get_or_create_default_profile()
    return await repos["company"].list_signatories()


# ==============================================================================
# 2. SERVICE CATALOGUE
# ==============================================================================

@router.get("/services", response_model=list[ServiceResponse])
async def list_services(repos: dict = Depends(get_repos)):
    """List services. Seeds APP-SERVER (₹5,500) and DB-SERVER (₹3,000) automatically."""
    await repos["service"].seed_initial_services()
    return await repos["service"].list_services()


@router.post("/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(payload: ServiceCreate, repos: dict = Depends(get_repos)):
    """Register a new billable service with pricing in catalogue."""
    return await repos["service"].create_service(**payload.model_dump())


# ==============================================================================
# 3. CUSTOMER MANAGEMENT
# ==============================================================================

@router.get("/customers", response_model=list[CustomerResponse])
async def list_customers(
    search: Optional[str] = Query(None),
    repos: dict = Depends(get_repos),
):
    """List customer records with optional search filter."""
    return await repos["customer"].list_customers(search=search)


@router.post("/customers", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(payload: CustomerCreate, repos: dict = Depends(get_repos)):
    """Create customer CRM record with GSTIN and state classification."""
    return await repos["customer"].create_customer(**payload.model_dump())


@router.get("/customers/{ref_id}", response_model=CustomerResponse)
async def get_customer(ref_id: int, repos: dict = Depends(get_repos)):
    cust = await repos["customer"].get_by_ref_id(ref_id)
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    return cust


# ==============================================================================
# 4. VENDOR MANAGEMENT
# ==============================================================================

@router.get("/vendors", response_model=list[VendorResponse])
async def list_vendors(
    search: Optional[str] = Query(None),
    repos: dict = Depends(get_repos),
):
    """List vendors (e.g. WebHostingBingo) with optional search filter."""
    return await repos["vendor"].list_vendors(search=search)


@router.post("/vendors", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
async def create_vendor(payload: VendorCreate, repos: dict = Depends(get_repos)):
    """Create vendor record."""
    return await repos["vendor"].create_vendor(**payload.model_dump())


@router.get("/vendors/{ref_id}", response_model=VendorResponse)
async def get_vendor(ref_id: int, repos: dict = Depends(get_repos)):
    vend = await repos["vendor"].get_by_ref_id(ref_id)
    if not vend:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vend


# ==============================================================================
# 5. SERVER SUBSCRIPTIONS
# ==============================================================================

@router.get("/subscriptions", response_model=list[SubscriptionResponse])
async def list_subscriptions(
    customer_ref_id: Optional[int] = Query(None),
    repos: dict = Depends(get_repos),
):
    """List active and paused server hosting subscriptions."""
    return await repos["subscription"].list_subscriptions(customer_ref_id=customer_ref_id)


@router.post("/subscriptions", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    payload: SubscriptionCreate,
    sub_svc: SubscriptionService = Depends(get_subscription_service),
):
    """Subscribe a customer to Application Server, Database Server, or both."""
    return await sub_svc.create_subscription(
        customer_ref_id=payload.customer_ref_id,
        items=[it.model_dump() for it in payload.items],
        billing_day=payload.billing_day,
        auto_generate=payload.auto_generate,
        auto_send=payload.auto_send,
        approval_required=payload.approval_required,
    )


@router.get("/subscriptions/{ref_id}", response_model=SubscriptionResponse)
async def get_subscription(ref_id: int, repos: dict = Depends(get_repos)):
    sub = await repos["subscription"].get_by_ref_id(ref_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub


@router.post("/subscriptions/{ref_id}/pause", response_model=SubscriptionResponse)
async def pause_subscription(
    ref_id: int,
    sub_svc: SubscriptionService = Depends(get_subscription_service),
):
    """Pause an active server subscription."""
    return await sub_svc.pause_subscription(ref_id)


@router.post("/subscriptions/{ref_id}/resume", response_model=SubscriptionResponse)
async def resume_subscription(
    ref_id: int,
    sub_svc: SubscriptionService = Depends(get_subscription_service),
):
    """Resume a paused server subscription."""
    return await sub_svc.resume_subscription(ref_id)


@router.post("/subscriptions/{ref_id}/cancel", response_model=SubscriptionResponse)
async def cancel_subscription(
    ref_id: int,
    sub_svc: SubscriptionService = Depends(get_subscription_service),
):
    """Cancel a server subscription."""
    return await sub_svc.cancel_subscription(ref_id)


# ==============================================================================
# 6. SALES INVOICES
# ==============================================================================

@router.get("/sales-invoices", response_model=list[InvoiceResponse])
async def list_sales_invoices(
    customer_ref_id: Optional[int] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None),
    repos: dict = Depends(get_repos),
):
    """List GST sales invoices with optional filters."""
    return await repos["invoice"].list_invoices(
        customer_ref_id=customer_ref_id,
        status=status_filter,
        from_date=from_date,
        to_date=to_date,
    )


@router.post("/sales-invoices/calculate")
async def calculate_invoice_preview(
    payload: InvoiceCalculateRequest,
    inv_svc: InvoiceService = Depends(get_invoice_service),
):
    """Calculate GST totals, tax breakdown, and amount in words without saving."""
    return await inv_svc.calculate_preview(
        customer_ref_id=payload.customer_ref_id,
        items=[it.model_dump() for it in payload.items],
    )


@router.post("/sales-invoices", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_sales_invoice(
    payload: InvoiceCreate,
    inv_svc: InvoiceService = Depends(get_invoice_service),
):
    """Create a new manual or recurring GST sales invoice in DRAFT status."""
    return await inv_svc.create_invoice(
        customer_ref_id=payload.customer_ref_id,
        billing_period_start=payload.billing_period_start,
        billing_period_end=payload.billing_period_end,
        items=[it.model_dump() for it in payload.items],
        due_date=payload.due_date,
        payment_terms=payload.payment_terms,
    )


@router.get("/sales-invoices/{ref_id}", response_model=InvoiceResponse)
async def get_sales_invoice(ref_id: int, repos: dict = Depends(get_repos)):
    inv = await repos["invoice"].get_by_ref_id(ref_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv


@router.post("/sales-invoices/{ref_id}/approve", response_model=InvoiceResponse)
async def approve_sales_invoice(
    ref_id: int,
    approver_user_id: str = Query("finance_admin"),
    inv_svc: InvoiceService = Depends(get_invoice_service),
):
    """Approve invoice with Maker-Checker validation."""
    return await inv_svc.approve_invoice(ref_id, approver_user_id)


@router.post("/sales-invoices/{ref_id}/issue", response_model=InvoiceResponse)
async def issue_sales_invoice(
    ref_id: int,
    issued_by_user_id: str = Query("finance_admin"),
    inv_svc: InvoiceService = Depends(get_invoice_service),
):
    """Issue invoice and freeze immutable document snapshot."""
    return await inv_svc.issue_invoice(ref_id, issued_by_user_id)


@router.get("/sales-invoices/{ref_id}/snapshot")
async def get_invoice_snapshot(ref_id: int, repos: dict = Depends(get_repos)):
    """Retrieve immutable document snapshot for an issued invoice."""
    snapshot = await repos["company"].get_document_snapshot("SALES_INVOICE", ref_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found or invoice not yet issued")
    return {
        "document_type": snapshot.document_type,
        "document_ref_id": snapshot.document_ref_id,
        "company_details": snapshot.company_details_snapshot,
        "customer_details": snapshot.customer_details_snapshot,
        "bank_details": snapshot.bank_details_snapshot,
        "template_version": snapshot.template_version,
        "created_at": snapshot.created_at,
    }


# ==============================================================================
# 7. VENDOR PURCHASE BILLS
# ==============================================================================

@router.get("/purchase-bills", response_model=list[PurchaseBillResponse])
async def list_purchase_bills(
    vendor_ref_id: Optional[int] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    repos: dict = Depends(get_repos),
):
    """List vendor purchase bills (e.g. WebHostingBingo)."""
    return await repos["purchase"].list_bills(vendor_ref_id=vendor_ref_id, status=status_filter)


@router.post("/purchase-bills", response_model=PurchaseBillResponse, status_code=status.HTTP_201_CREATED)
async def create_purchase_bill(
    payload: PurchaseBillCreate,
    repos: dict = Depends(get_repos),
):
    """Record a verified vendor purchase bill with ITC tracking."""
    return await repos["purchase"].create_bill(
        vendor_ref_id=payload.vendor_ref_id,
        bill_no=payload.bill_no,
        items_data=[it.model_dump() for it in payload.items],
        bill_date=payload.bill_date,
        due_date=payload.due_date,
        service_period_start=payload.service_period_start,
        service_period_end=payload.service_period_end,
        itc_eligible=payload.itc_eligible,
        notes=payload.notes,
    )


# ==============================================================================
# 8. PAYMENTS & ALLOCATIONS
# ==============================================================================

@router.get("/payments", response_model=list[PaymentResponse])
async def list_payments(
    party_type: Optional[str] = Query(None),
    repos: dict = Depends(get_repos),
):
    """List financial payment transactions."""
    return await repos["payment"].list_payments(party_type=party_type)


@router.post("/payments", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def record_payment(
    payload: PaymentCreate,
    pay_svc: PaymentService = Depends(get_payment_service),
):
    """Record a payment receipt or disbursement and settle invoices."""
    return await pay_svc.record_payment(
        payment_type=payload.payment_type,
        party_type=payload.party_type,
        party_ref_id=payload.party_ref_id,
        amount=payload.amount,
        transaction_reference=payload.transaction_reference,
        payment_mode=payload.payment_mode,
        invoice_ref_ids=payload.invoice_ref_ids,
    )


# ==============================================================================
# 9. RECURRING BILLING EXECUTION
# ==============================================================================

@router.post("/billing-runs/execute")
async def execute_recurring_billing(
    billing_date: Optional[date] = Query(None),
    billing_svc: RecurringBillingService = Depends(get_billing_service),
):
    """Trigger idempotent recurring server billing run."""
    run = await billing_svc.execute_billing_run(as_of_date=billing_date)
    return {
        "status": "COMPLETED",
        "run_date": run.run_date,
        "subscriptions_scanned": run.total_subscriptions_scanned,
        "invoices_generated": run.invoices_generated,
        "total_taxable_amount": str(run.total_taxable_amount),
        "total_gst_amount": str(run.total_gst_amount),
    }


# ==============================================================================
# 10. FINANCIAL DASHBOARD & GST REPORTS
# ==============================================================================

@router.get("/dashboard/summary", response_model=FinanceDashboardSummary)
async def get_dashboard_summary(repos: dict = Depends(get_repos)):
    """Live financial summary with real database metrics."""
    invoices = await repos["invoice"].list_invoices()
    bills = await repos["purchase"].list_bills()
    subs = await repos["subscription"].list_subscriptions()

    total_revenue_mrr = Decimal("0.00")
    app_server_rev = Decimal("0.00")
    db_server_rev = Decimal("0.00")
    receivables = Decimal("0.00")
    overdue_count = 0
    gst_collected = Decimal("0.00")

    for inv in invoices:
        if inv.status in ["ISSUED", "PARTIALLY_PAID", "PAID"]:
            total_revenue_mrr += inv.taxable_amount
            gst_collected += inv.total_gst
            receivables += inv.balance_due
            if inv.due_date < date.today() and inv.balance_due > Decimal("0.00"):
                overdue_count += 1

            for it in inv.items:
                desc = it.item_description.upper()
                if "APPLICATION SERVER" in desc:
                    app_server_rev += it.taxable_amount
                elif "DATABASE SERVER" in desc:
                    db_server_rev += it.taxable_amount

    vendor_expenses = Decimal("0.00")
    eligible_itc = Decimal("0.00")
    for b in bills:
        vendor_expenses += b.grand_total
        if b.itc_eligible:
            eligible_itc += b.total_gst

    net_gst = max(gst_collected - eligible_itc, Decimal("0.00"))

    active_subs_count = sum(1 for s in subs if s.status == "ACTIVE")

    return FinanceDashboardSummary(
        total_revenue_mrr=total_revenue_mrr,
        app_server_revenue=app_server_rev,
        db_server_revenue=db_server_rev,
        active_subscriptions_count=active_subs_count,
        receivables_outstanding=receivables,
        overdue_invoices_count=overdue_count,
        vendor_expenses_total=vendor_expenses,
        gst_collected_total=gst_collected,
        eligible_itc_total=eligible_itc,
        net_gst_payable=net_gst,
        timestamp=datetime.utcnow(),
    )
