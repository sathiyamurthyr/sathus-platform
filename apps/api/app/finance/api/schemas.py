"""Pydantic v2 schemas for Finance & Server Billing APIs."""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ==============================================================================
# COMPANY PROFILE & ASSETS
# ==============================================================================

class CompanyProfileUpdate(BaseModel):
    legal_name: Optional[str] = None
    display_name: Optional[str] = None
    pan: Optional[str] = None
    cin: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None


class CompanyLocationResponse(BaseSchema):
    ref_id: int
    location_name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    state_code: str
    pincode: str
    gstin: str
    is_default: bool
    status: str


class CompanyBankAccountResponse(BaseSchema):
    ref_id: int
    account_holder: str
    bank_name: str
    branch: str
    account_number_masked: str
    ifsc_code: str
    upi_id: Optional[str] = None
    currency: str
    is_default: bool
    show_on_invoice: bool
    status: str


class CompanySignatoryResponse(BaseSchema):
    ref_id: int
    signatory_name: str
    designation: str
    effective_from: date
    effective_to: Optional[date] = None
    is_default: bool
    status: str


class CompanyPaymentQRResponse(BaseSchema):
    ref_id: int
    qr_name: str
    qr_type: str
    qr_payload: str
    upi_id: str
    merchant_name: str
    is_default: bool
    status: str


class CompanyProfileResponse(BaseSchema):
    ref_id: int
    legal_name: str
    display_name: str
    pan: str
    cin: Optional[str] = None
    email: str
    phone: str
    website: str
    locations: list[CompanyLocationResponse] = []
    bank_accounts: list[CompanyBankAccountResponse] = []
    signatories: list[CompanySignatoryResponse] = []


# ==============================================================================
# SERVICE CATALOGUE
# ==============================================================================

class ServicePriceResponse(BaseSchema):
    ref_id: int
    currency: str
    unit_price: Decimal
    effective_from: date
    effective_to: Optional[date] = None
    is_active: bool


class ServiceResponse(BaseSchema):
    ref_id: int
    service_code: str
    service_name: str
    sac_code: str
    description: str
    category: str
    billing_frequency: str
    default_gst_rate: Decimal
    is_active: bool
    prices: list[ServicePriceResponse] = []


class ServiceCreate(BaseModel):
    service_code: str
    service_name: str
    sac_code: str = "998315"
    description: str
    category: str = "Hosting"
    billing_frequency: str = "MONTHLY"
    default_gst_rate: Decimal = Decimal("18.00")
    unit_price: Decimal


# ==============================================================================
# CUSTOMER & VENDOR
# ==============================================================================

class CustomerCreate(BaseModel):
    customer_code: str
    customer_name: str
    legal_company_name: str
    gstin: Optional[str] = None
    pan: Optional[str] = None
    gst_reg_type: str = "REGISTERED_REGULAR"
    state: str = "Tamil Nadu"
    state_code: str = "33"
    billing_address: str
    service_address: Optional[str] = None
    email: str
    phone: str
    primary_contact: Optional[str] = None
    payment_terms_days: int = 15


class CustomerUpdate(BaseModel):
    customer_name: Optional[str] = None
    legal_company_name: Optional[str] = None
    gstin: Optional[str] = None
    pan: Optional[str] = None
    gst_reg_type: Optional[str] = None
    state: Optional[str] = None
    state_code: Optional[str] = None
    billing_address: Optional[str] = None
    service_address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    primary_contact: Optional[str] = None
    payment_terms_days: Optional[int] = None
    credit_limit: Optional[Decimal] = None
    status: Optional[str] = None


class CustomerResponse(BaseSchema):
    ref_id: int
    customer_code: str
    customer_name: str
    legal_company_name: str
    gstin: Optional[str] = None
    pan: Optional[str] = None
    gst_reg_type: str
    state: str
    state_code: str
    billing_address: str
    service_address: Optional[str] = None
    email: str
    phone: str
    primary_contact: Optional[str] = None
    payment_terms_days: int
    credit_limit: Decimal
    status: str
    created_at: datetime


class VendorCreate(BaseModel):
    vendor_code: str
    vendor_name: str
    legal_name: str
    gstin: Optional[str] = None
    pan: Optional[str] = None
    state: str = "Maharashtra"
    state_code: str = "27"
    address: str
    email: str
    phone: str
    payment_terms_days: int = 30
    bank_details: Optional[str] = None


class VendorResponse(BaseSchema):
    ref_id: int
    vendor_code: str
    vendor_name: str
    legal_name: str
    gstin: Optional[str] = None
    pan: Optional[str] = None
    state: str
    state_code: str
    address: str
    email: str
    phone: str
    payment_terms_days: int
    status: str
    created_at: datetime


# ==============================================================================
# SUBSCRIPTIONS
# ==============================================================================

class SubscriptionItemCreate(BaseModel):
    service_ref_id: int
    server_identifier: Optional[str] = None
    server_hostname: Optional[str] = None
    server_ip: Optional[str] = None
    quantity: int = 1
    unit_price: Decimal
    gst_rate: Decimal = Decimal("18.00")


class SubscriptionCreate(BaseModel):
    customer_ref_id: int
    items: list[SubscriptionItemCreate]
    billing_day: int = 1
    billing_frequency: str = "MONTHLY"
    auto_generate: bool = True
    auto_send: bool = False
    approval_required: bool = True


class SubscriptionUpdate(BaseModel):
    customer_ref_id: Optional[int] = None
    server_hostname: Optional[str] = None
    server_ip: Optional[str] = None
    server_identifier: Optional[str] = None
    server_specs: Optional[str] = None
    base_amount_monthly: Optional[Decimal] = None
    plan_name: Optional[str] = None
    billing_frequency: Optional[str] = None
    next_billing_date: Optional[date] = None
    status: Optional[str] = None


class SubscriptionItemResponse(BaseSchema):
    ref_id: int
    service_ref_id: int
    server_identifier: Optional[str] = None
    server_hostname: Optional[str] = None
    server_ip: Optional[str] = None
    quantity: int
    unit_price: Decimal
    gst_rate: Decimal
    status: str


class SubscriptionResponse(BaseSchema):
    ref_id: int
    subscription_number: str
    customer_ref_id: int
    customer: Optional[CustomerResponse] = None
    billing_frequency: str
    billing_day: int
    start_date: date
    next_billing_date: date
    auto_generate_invoice: bool
    status: str
    items: list[SubscriptionItemResponse] = []
    created_at: datetime


# ==============================================================================
# SALES INVOICES
# ==============================================================================

class InvoiceCalculateItem(BaseModel):
    unit_price: Decimal
    quantity: int = 1
    gst_rate: Decimal = Decimal("18.00")
    discount_amount: Decimal = Decimal("0.00")


class InvoiceCalculateRequest(BaseModel):
    customer_ref_id: int
    items: list[InvoiceCalculateItem]


class InvoiceItemCreate(BaseModel):
    service_ref_id: Optional[int] = None
    item_description: str
    sac_code: str = "998315"
    quantity: int = 1
    unit_price: Decimal
    discount_amount: Decimal = Decimal("0.00")
    gst_rate: Decimal = Decimal("18.00")


class InvoiceCreate(BaseModel):
    customer_ref_id: int
    billing_period_start: date
    billing_period_end: date
    items: list[InvoiceItemCreate]
    due_date: Optional[date] = None
    payment_terms: Optional[str] = "Net 15 Days"


class InvoiceItemResponse(BaseSchema):
    ref_id: int
    item_description: str
    sac_code: str
    quantity: int
    unit_price: Decimal
    discount_amount: Decimal
    taxable_amount: Decimal
    gst_rate: Decimal
    cgst_rate: Decimal
    cgst_amount: Decimal
    sgst_rate: Decimal
    sgst_amount: Decimal
    igst_rate: Decimal
    igst_amount: Decimal
    total_amount: Decimal


class InvoiceResponse(BaseSchema):
    ref_id: int
    invoice_no: str
    customer_ref_id: int
    customer: Optional[CustomerResponse] = None
    invoice_date: date
    due_date: date
    billing_period_start: date
    billing_period_end: date
    place_of_supply: str
    place_of_supply_code: str
    supply_type: str
    taxable_amount: Decimal
    cgst_amount: Decimal
    sgst_amount: Decimal
    igst_amount: Decimal
    total_gst: Decimal
    round_off: Decimal
    grand_total: Decimal
    paid_amount: Decimal
    balance_due: Decimal
    status: str
    created_by_user_id: Optional[str] = None
    approved_by_user_id: Optional[str] = None
    approved_at: Optional[datetime] = None
    payment_terms: Optional[str] = None
    items: list[InvoiceItemResponse] = []
    created_at: datetime


# ==============================================================================
# PURCHASE BILLS
# ==============================================================================

class PurchaseItemCreate(BaseModel):
    item_description: str
    sac_or_hsn: Optional[str] = "998315"
    quantity: int = 1
    unit_price: Decimal
    taxable_amount: Decimal
    gst_rate: Decimal = Decimal("18.00")


class PurchaseBillCreate(BaseModel):
    vendor_ref_id: int
    bill_no: str
    bill_date: date
    due_date: date
    service_period_start: Optional[date] = None
    service_period_end: Optional[date] = None
    itc_eligible: bool = True
    items: list[PurchaseItemCreate]
    notes: Optional[str] = None


class PurchaseItemResponse(BaseSchema):
    ref_id: int
    item_description: str
    sac_or_hsn: Optional[str] = None
    quantity: int
    unit_price: Decimal
    taxable_amount: Decimal
    gst_rate: Decimal
    total_amount: Decimal


class PurchaseBillResponse(BaseSchema):
    ref_id: int
    bill_no: str
    vendor_ref_id: int
    vendor: Optional[VendorResponse] = None
    bill_date: date
    due_date: date
    taxable_amount: Decimal
    cgst_amount: Decimal
    sgst_amount: Decimal
    igst_amount: Decimal
    total_gst: Decimal
    grand_total: Decimal
    paid_amount: Decimal
    balance_due: Decimal
    itc_eligible: bool
    itc_claim_status: str
    status: str
    notes: Optional[str] = None
    items: list[PurchaseItemResponse] = []
    created_at: datetime


# ==============================================================================
# PAYMENTS
# ==============================================================================

class PaymentCreate(BaseModel):
    payment_type: str = "CLIENT_RECEIPT"  # CLIENT_RECEIPT, VENDOR_PAYMENT
    party_type: str = "CUSTOMER"          # CUSTOMER, VENDOR
    party_ref_id: int
    amount: Decimal
    transaction_reference: str
    payment_mode: str = "BANK_TRANSFER"
    invoice_ref_ids: Optional[list[int]] = None


class PaymentAllocationResponse(BaseSchema):
    ref_id: int
    invoice_ref_id: int
    allocated_amount: Decimal
    allocated_at: datetime


class PaymentResponse(BaseSchema):
    ref_id: int
    payment_number: str
    payment_type: str
    party_type: str
    party_ref_id: int
    payment_date: date
    payment_mode: str
    amount: Decimal
    transaction_reference: str
    status: str
    allocations: list[PaymentAllocationResponse] = []
    created_at: datetime


# ==============================================================================
# DASHBOARD SUMMARY
# ==============================================================================

class FinanceDashboardSummary(BaseModel):
    total_revenue_mrr: Decimal
    app_server_revenue: Decimal
    db_server_revenue: Decimal
    active_subscriptions_count: int
    receivables_outstanding: Decimal
    overdue_invoices_count: int
    vendor_expenses_total: Decimal
    gst_collected_total: Decimal
    eligible_itc_total: Decimal
    net_gst_payable: Decimal
    timestamp: datetime
