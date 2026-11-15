"""SQLAlchemy 2.0 Database Models for Finance, GST & Server Billing."""

from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


# ==============================================================================
# 1. COMPANY PROFILES & BRANDING CONFIGURATION
# ==============================================================================

class FinanceCompanyProfile(Base):
    """Master Sathus legal company profile."""
    __tablename__ = "finance_company_profiles"
    __allow_unmapped__ = True

    finance_company_profile_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    legal_name = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=False)
    pan = Column(String(10), nullable=False, index=True)
    cin = Column(String(21), nullable=True)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    website = Column(String(255), nullable=False, default="https://sathus.in")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    locations = relationship("FinanceCompanyLocation", back_populates="company")
    bank_accounts = relationship("FinanceCompanyBankAccount", back_populates="company")
    assets = relationship("FinanceCompanyAsset", back_populates="company")
    signatories = relationship("FinanceSignatory", back_populates="company")


class FinanceCompanyLocation(Base):
    """Business locations and GST registrations per state."""
    __tablename__ = "finance_company_locations"
    __allow_unmapped__ = True

    finance_company_location_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    company_ref_id = Column(BigInteger, ForeignKey("finance_company_profiles.finance_company_profile_ref_id"), nullable=False)
    location_name = Column(String(100), nullable=False)
    address_line1 = Column(String(255), nullable=False)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=False)
    state_code = Column(String(2), nullable=False, index=True)  # e.g. "33" for Tamil Nadu
    pincode = Column(String(10), nullable=False)
    gstin = Column(String(15), nullable=False, index=True)
    is_default = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    company = relationship("FinanceCompanyProfile", back_populates="locations")


class FinanceCompanyBankAccount(Base):
    """Designated company bank accounts for client invoice payments."""
    __tablename__ = "finance_company_bank_accounts"
    __allow_unmapped__ = True

    finance_company_bank_account_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    company_ref_id = Column(BigInteger, ForeignKey("finance_company_profiles.finance_company_profile_ref_id"), nullable=False)
    account_holder = Column(String(255), nullable=False)
    bank_name = Column(String(150), nullable=False)
    branch = Column(String(150), nullable=False)
    account_number_encrypted = Column(Text, nullable=False)
    account_number_masked = Column(String(50), nullable=False)  # e.g. "**** **** 5678"
    ifsc_code = Column(String(20), nullable=False, index=True)
    swift_code = Column(String(20), nullable=True)
    upi_id = Column(String(100), nullable=True)
    bank_address = Column(Text, nullable=True)
    currency = Column(String(5), default="INR", nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
    show_on_invoice = Column(Boolean, default=True, nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    company = relationship("FinanceCompanyProfile", back_populates="bank_accounts")


class FinanceCompanyAsset(Base):
    """Storage references for company logos, authorized signatures, and seals."""
    __tablename__ = "finance_company_assets"
    __allow_unmapped__ = True

    finance_company_asset_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    company_ref_id = Column(BigInteger, ForeignKey("finance_company_profiles.finance_company_profile_ref_id"), nullable=False)
    asset_type = Column(String(50), nullable=False)  # COMPANY_LOGO, SIGNATURE, COMPANY_SEAL, PAYMENT_QR
    file_name = Column(String(255), nullable=False)
    file_key = Column(String(500), nullable=False)
    mime_type = Column(String(100), nullable=False)
    checksum = Column(String(64), nullable=True)
    version = Column(Integer, default=1, nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    company = relationship("FinanceCompanyProfile", back_populates="assets")


class FinancePaymentQR(Base):
    """Configured UPI and banking payment QR codes."""
    __tablename__ = "finance_payment_qr"
    __allow_unmapped__ = True

    finance_payment_qr_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    company_ref_id = Column(BigInteger, ForeignKey("finance_company_profiles.finance_company_profile_ref_id"), nullable=False)
    bank_account_ref_id = Column(BigInteger, ForeignKey("finance_company_bank_accounts.finance_company_bank_account_ref_id"), nullable=True)
    qr_name = Column(String(100), nullable=False)
    qr_type = Column(String(50), default="UPI", nullable=False)
    qr_payload = Column(Text, nullable=False)  # e.g. upi://pay?pa=...
    file_key = Column(String(500), nullable=True)
    upi_id = Column(String(100), nullable=False)
    merchant_name = Column(String(255), nullable=False)
    is_dynamic = Column(Boolean, default=False, nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class FinanceSignatory(Base):
    """Designated company authorized signatories."""
    __tablename__ = "finance_signatories"
    __allow_unmapped__ = True

    finance_signatory_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    company_ref_id = Column(BigInteger, ForeignKey("finance_company_profiles.finance_company_profile_ref_id"), nullable=False)
    signatory_name = Column(String(255), nullable=False)
    designation = Column(String(150), nullable=False)
    signature_asset_ref_id = Column(BigInteger, ForeignKey("finance_company_assets.finance_company_asset_ref_id"), nullable=True)
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date, nullable=True)
    is_default = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    company = relationship("FinanceCompanyProfile", back_populates="signatories")


class FinanceInvoiceTemplate(Base):
    """Invoice visual layout and branding template configs."""
    __tablename__ = "finance_invoice_templates"
    __allow_unmapped__ = True

    finance_invoice_template_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    company_ref_id = Column(BigInteger, ForeignKey("finance_company_profiles.finance_company_profile_ref_id"), nullable=False)
    template_name = Column(String(100), nullable=False)
    template_config = Column(Text, nullable=False, default="{}")
    version = Column(Integer, default=1, nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)


class FinanceDocumentSnapshot(Base):
    """Immutable legal snapshot frozen at invoice finalization."""
    __tablename__ = "finance_document_snapshots"
    __allow_unmapped__ = True

    finance_document_snapshot_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    document_type = Column(String(50), nullable=False)  # SALES_INVOICE, CREDIT_NOTE
    document_ref_id = Column(BigInteger, nullable=False, index=True)
    company_details_snapshot = Column(Text, nullable=False)  # JSON
    customer_details_snapshot = Column(Text, nullable=False) # JSON
    bank_details_snapshot = Column(Text, nullable=False)     # JSON
    template_version = Column(String(50), default="1.0", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==============================================================================
# 2. FINANCIAL YEAR & SEQUENTIAL NUMBERING
# ==============================================================================

class FinanceFYSetting(Base):
    """Financial year settings (e.g. 2026-27)."""
    __tablename__ = "finance_fy_settings"
    __allow_unmapped__ = True

    finance_fy_setting_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    fy_code = Column(String(20), unique=True, nullable=False)  # e.g. "2026-2027"
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class FinanceInvoiceSequence(Base):
    """Thread-safe sequential invoice number counter."""
    __tablename__ = "finance_invoice_sequences"
    __allow_unmapped__ = True

    finance_invoice_sequence_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    fy_code = Column(String(20), nullable=False, index=True)
    prefix = Column(String(50), nullable=False)  # e.g. "SATH/26-27/"
    last_number = Column(Integer, default=0, nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    __table_args__ = (
        UniqueConstraint("fy_code", "prefix", name="uq_finance_sequence_fy_prefix"),
    )


# ==============================================================================
# 3. CUSTOMER & VENDOR DIRECTORIES
# ==============================================================================

class FinanceCustomer(Base):
    """Customer CRM records with GSTIN and state classification."""
    __tablename__ = "finance_customers"
    __allow_unmapped__ = True

    finance_customer_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    customer_code = Column(String(50), unique=True, nullable=False, index=True)
    customer_name = Column(String(255), nullable=False)
    legal_company_name = Column(String(255), nullable=False)
    gstin = Column(String(15), nullable=True, index=True)
    pan = Column(String(10), nullable=True, index=True)
    gst_reg_type = Column(String(50), default="REGISTERED_REGULAR", nullable=False)
    state = Column(String(100), nullable=False)
    state_code = Column(String(2), nullable=False, index=True)
    billing_address = Column(Text, nullable=False)
    service_address = Column(Text, nullable=True)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50), nullable=False)
    primary_contact = Column(String(255), nullable=True)
    payment_terms_days = Column(Integer, default=15, nullable=False)
    credit_limit = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    contacts = relationship("FinanceCustomerContact", back_populates="customer")
    subscriptions = relationship("FinanceSubscription", back_populates="customer")
    invoices = relationship("FinanceSalesInvoice", back_populates="customer")


class FinanceCustomerContact(Base):
    """Secondary contacts, accounts, and decision makers."""
    __tablename__ = "finance_customer_contacts"
    __allow_unmapped__ = True

    finance_customer_contact_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    customer_ref_id = Column(BigInteger, ForeignKey("finance_customers.finance_customer_ref_id"), nullable=False)
    contact_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    designation = Column(String(100), nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)

    customer = relationship("FinanceCustomer", back_populates="contacts")


class FinanceVendor(Base):
    """Infrastructure and SaaS vendors (e.g. WebHostingBingo)."""
    __tablename__ = "finance_vendors"
    __allow_unmapped__ = True

    finance_vendor_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    vendor_code = Column(String(50), unique=True, nullable=False, index=True)
    vendor_name = Column(String(255), nullable=False)
    legal_name = Column(String(255), nullable=False)
    gstin = Column(String(15), nullable=True, index=True)
    pan = Column(String(10), nullable=True)
    state = Column(String(100), nullable=False)
    state_code = Column(String(2), nullable=False)
    address = Column(Text, nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    payment_terms_days = Column(Integer, default=30, nullable=False)
    bank_details = Column(Text, nullable=True)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    documents = relationship("FinanceVendorDocument", back_populates="vendor")
    bills = relationship("FinancePurchaseBill", back_populates="vendor")


class FinanceVendorDocument(Base):
    """Uploaded vendor bills, agreement contracts, and receipts."""
    __tablename__ = "finance_vendor_documents"
    __allow_unmapped__ = True

    finance_vendor_document_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    vendor_ref_id = Column(BigInteger, ForeignKey("finance_vendors.finance_vendor_ref_id"), nullable=False)
    document_name = Column(String(255), nullable=False)
    file_key = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    vendor = relationship("FinanceVendor", back_populates="documents")


# ==============================================================================
# 4. SERVICE CATALOGUE & HISTORICAL PRICING
# ==============================================================================

class FinanceService(Base):
    """Catalogue of billable hosting and cloud services."""
    __tablename__ = "finance_services"
    __allow_unmapped__ = True

    finance_service_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    service_code = Column(String(50), unique=True, nullable=False, index=True)  # APP-SERVER, DB-SERVER
    service_name = Column(String(255), nullable=False)
    sac_code = Column(String(10), nullable=False, default="998315")  # Hosting & IT infrastructure
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Hosting", nullable=False)
    billing_frequency = Column(String(20), default="MONTHLY", nullable=False)
    default_gst_rate = Column(Numeric(5, 2), default=Decimal("18.00"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    prices = relationship("FinanceServicePrice", back_populates="service")


class FinanceServicePrice(Base):
    """Historical price points with date ranges."""
    __tablename__ = "finance_service_prices"
    __allow_unmapped__ = True

    finance_service_price_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    service_ref_id = Column(BigInteger, ForeignKey("finance_services.finance_service_ref_id"), nullable=False)
    currency = Column(String(5), default="INR", nullable=False)
    unit_price = Column(Numeric(14, 2), nullable=False)  # ₹5,500.00 or ₹3,000.00
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    service = relationship("FinanceService", back_populates="prices")


# ==============================================================================
# 5. SERVER SUBSCRIPTIONS & RECURRING BILLING
# ==============================================================================

class FinanceSubscription(Base):
    """Server hosting recurring subscription agreement."""
    __tablename__ = "finance_subscriptions"
    __allow_unmapped__ = True

    finance_subscription_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    subscription_number = Column(String(50), unique=True, nullable=False, index=True)  # SUB-2026-0001
    customer_ref_id = Column(BigInteger, ForeignKey("finance_customers.finance_customer_ref_id"), nullable=False)
    billing_frequency = Column(String(20), default="MONTHLY", nullable=False)
    billing_day = Column(Integer, default=1, nullable=False)  # 1st of month
    start_date = Column(Date, nullable=False)
    next_billing_date = Column(Date, nullable=False, index=True)
    auto_generate_invoice = Column(Boolean, default=True, nullable=False)
    auto_send_email = Column(Boolean, default=False, nullable=False)
    approval_required = Column(Boolean, default=True, nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    customer = relationship("FinanceCustomer", back_populates="subscriptions")
    items = relationship("FinanceSubscriptionItem", back_populates="subscription", cascade="all, delete-orphan")


class FinanceSubscriptionItem(Base):
    """Itemized servers provisioned under a subscription."""
    __tablename__ = "finance_subscription_items"
    __allow_unmapped__ = True

    finance_subscription_item_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    subscription_ref_id = Column(BigInteger, ForeignKey("finance_subscriptions.finance_subscription_ref_id"), nullable=False)
    service_ref_id = Column(BigInteger, ForeignKey("finance_services.finance_service_ref_id"), nullable=False)
    server_identifier = Column(String(100), nullable=True)  # e.g. sathus-vps-app-01
    server_hostname = Column(String(255), nullable=True)
    server_ip = Column(String(50), nullable=True)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Numeric(14, 2), nullable=False)  # ₹5,500.00 or ₹3,000.00
    gst_rate = Column(Numeric(5, 2), default=Decimal("18.00"), nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    subscription = relationship("FinanceSubscription", back_populates="items")
    service = relationship("FinanceService")


class FinanceBillingRun(Base):
    """Audit log of automated monthly recurring billing runs."""
    __tablename__ = "finance_billing_runs"
    __allow_unmapped__ = True

    finance_billing_run_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    run_date = Column(Date, nullable=False, index=True)
    billing_period_start = Column(Date, nullable=False)
    billing_period_end = Column(Date, nullable=False)
    total_subscriptions_scanned = Column(Integer, default=0, nullable=False)
    invoices_generated = Column(Integer, default=0, nullable=False)
    total_taxable_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    total_gst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    status = Column(String(20), default="COMPLETED", nullable=False)
    error_log = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==============================================================================
# 6. SALES INVOICES & LINE ITEMS
# ==============================================================================

class FinanceSalesInvoice(Base):
    """Statutory GST Sales Invoices issued to customers."""
    __tablename__ = "finance_sales_invoices"
    __allow_unmapped__ = True

    finance_sales_invoice_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    invoice_no = Column(String(50), unique=True, nullable=False, index=True)  # SATH/26-27/00001
    subscription_ref_id = Column(BigInteger, ForeignKey("finance_subscriptions.finance_subscription_ref_id"), nullable=True)
    customer_ref_id = Column(BigInteger, ForeignKey("finance_customers.finance_customer_ref_id"), nullable=False)
    company_location_ref_id = Column(BigInteger, ForeignKey("finance_company_locations.finance_company_location_ref_id"), nullable=True)
    bank_account_ref_id = Column(BigInteger, ForeignKey("finance_company_bank_accounts.finance_company_bank_account_ref_id"), nullable=True)
    payment_qr_ref_id = Column(BigInteger, ForeignKey("finance_payment_qr.finance_payment_qr_ref_id"), nullable=True)
    signatory_ref_id = Column(BigInteger, ForeignKey("finance_signatories.finance_signatory_ref_id"), nullable=True)
    invoice_date = Column(Date, nullable=False, index=True)
    due_date = Column(Date, nullable=False)
    billing_period_start = Column(Date, nullable=False)
    billing_period_end = Column(Date, nullable=False)
    place_of_supply = Column(String(100), nullable=False)
    place_of_supply_code = Column(String(2), nullable=False)
    supply_type = Column(String(20), default="INTRA_STATE", nullable=False)  # INTRA_STATE or INTER_STATE
    taxable_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    cgst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    sgst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    igst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    total_gst = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    round_off = Column(Numeric(6, 2), default=Decimal("0.00"), nullable=False)
    grand_total = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    paid_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    balance_due = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    status = Column(String(20), default="DRAFT", nullable=False, index=True)
    created_by_user_id = Column(String(100), nullable=True)
    approved_by_user_id = Column(String(100), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    pdf_file_key = Column(String(500), nullable=True)
    payment_terms = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    customer = relationship("FinanceCustomer", back_populates="invoices")
    items = relationship("FinanceSalesItem", back_populates="invoice", cascade="all, delete-orphan")
    allocations = relationship("FinancePaymentAllocation", back_populates="invoice")

    __table_args__ = (
        # Idempotency constraint: Prevent duplicate recurring billing for same subscription & period
        UniqueConstraint("subscription_ref_id", "billing_period_start", "billing_period_end", name="uq_finance_subscription_billing_period"),
    )


class FinanceSalesItem(Base):
    """Line items for GST sales invoice."""
    __tablename__ = "finance_sales_items"
    __allow_unmapped__ = True

    finance_sales_item_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    sales_invoice_ref_id = Column(BigInteger, ForeignKey("finance_sales_invoices.finance_sales_invoice_ref_id"), nullable=False)
    service_ref_id = Column(BigInteger, ForeignKey("finance_services.finance_service_ref_id"), nullable=True)
    item_description = Column(Text, nullable=False)
    sac_code = Column(String(10), default="998315", nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Numeric(14, 2), nullable=False)
    discount_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    taxable_amount = Column(Numeric(14, 2), nullable=False)
    gst_rate = Column(Numeric(5, 2), default=Decimal("18.00"), nullable=False)
    cgst_rate = Column(Numeric(5, 2), default=Decimal("0.00"), nullable=False)
    cgst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    sgst_rate = Column(Numeric(5, 2), default=Decimal("0.00"), nullable=False)
    sgst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    igst_rate = Column(Numeric(5, 2), default=Decimal("0.00"), nullable=False)
    igst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    total_amount = Column(Numeric(14, 2), nullable=False)

    invoice = relationship("FinanceSalesInvoice", back_populates="items")


# ==============================================================================
# 7. VENDOR PURCHASE BILLS
# ==============================================================================

class FinancePurchaseBill(Base):
    """Vendor purchase invoices (e.g. WebHostingBingo)."""
    __tablename__ = "finance_purchase_bills"
    __allow_unmapped__ = True

    finance_purchase_bill_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    bill_no = Column(String(100), nullable=False)  # Vendor's invoice number
    vendor_ref_id = Column(BigInteger, ForeignKey("finance_vendors.finance_vendor_ref_id"), nullable=False)
    bill_date = Column(Date, nullable=False, index=True)
    due_date = Column(Date, nullable=False)
    service_period_start = Column(Date, nullable=True)
    service_period_end = Column(Date, nullable=True)
    taxable_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    cgst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    sgst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    igst_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    total_gst = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    grand_total = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    paid_amount = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    balance_due = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    itc_eligible = Column(Boolean, default=True, nullable=False)
    itc_claim_status = Column(String(20), default="PENDING", nullable=False)
    status = Column(String(20), default="DRAFT", nullable=False, index=True)
    document_file_key = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    vendor = relationship("FinanceVendor", back_populates="bills")
    items = relationship("FinancePurchaseItem", back_populates="bill", cascade="all, delete-orphan")

    __table_args__ = (
        # Prevent recording duplicate vendor bill
        UniqueConstraint("vendor_ref_id", "bill_no", name="uq_finance_vendor_bill_no"),
    )


class FinancePurchaseItem(Base):
    """Line items for vendor purchase bill."""
    __tablename__ = "finance_purchase_items"
    __allow_unmapped__ = True

    finance_purchase_item_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    purchase_bill_ref_id = Column(BigInteger, ForeignKey("finance_purchase_bills.finance_purchase_bill_ref_id"), nullable=False)
    item_description = Column(Text, nullable=False)
    sac_or_hsn = Column(String(10), nullable=True)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Numeric(14, 2), nullable=False)
    taxable_amount = Column(Numeric(14, 2), nullable=False)
    gst_rate = Column(Numeric(5, 2), default=Decimal("18.00"), nullable=False)
    total_amount = Column(Numeric(14, 2), nullable=False)

    bill = relationship("FinancePurchaseBill", back_populates="items")


# ==============================================================================
# 8. PAYMENTS & ALLOCATIONS
# ==============================================================================

class FinancePayment(Base):
    """Payments received from customers or disbursed to vendors."""
    __tablename__ = "finance_payments"
    __allow_unmapped__ = True

    finance_payment_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    payment_number = Column(String(50), unique=True, nullable=False, index=True)  # PAY-2026-0001
    payment_type = Column(String(20), nullable=False)  # CLIENT_RECEIPT, VENDOR_PAYMENT
    party_type = Column(String(20), nullable=False)    # CUSTOMER, VENDOR
    party_ref_id = Column(BigInteger, nullable=False, index=True)
    payment_date = Column(Date, nullable=False, index=True)
    payment_mode = Column(String(30), default="BANK_TRANSFER", nullable=False)
    amount = Column(Numeric(14, 2), nullable=False)
    transaction_reference = Column(String(100), nullable=False)  # UTR, Cheque #, Gateway Txn ID
    bank_account_ref_id = Column(BigInteger, ForeignKey("finance_company_bank_accounts.finance_company_bank_account_ref_id"), nullable=True)
    status = Column(String(20), default="POSTED", nullable=False)
    reversal_reason = Column(Text, nullable=True)
    created_by_user_id = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    allocations = relationship("FinancePaymentAllocation", back_populates="payment")


class FinancePaymentAllocation(Base):
    """Maps a payment transaction against specific sales invoices or purchase bills."""
    __tablename__ = "finance_payment_allocations"
    __allow_unmapped__ = True

    finance_payment_allocation_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    payment_ref_id = Column(BigInteger, ForeignKey("finance_payments.finance_payment_ref_id"), nullable=False)
    invoice_type = Column(String(30), default="SALES_INVOICE", nullable=False)  # SALES_INVOICE, PURCHASE_BILL
    invoice_ref_id = Column(BigInteger, ForeignKey("finance_sales_invoices.finance_sales_invoice_ref_id"), nullable=False)
    allocated_amount = Column(Numeric(14, 2), nullable=False)
    allocated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    payment = relationship("FinancePayment", back_populates="allocations")
    invoice = relationship("FinanceSalesInvoice", back_populates="allocations")


# ==============================================================================
# 9. STATUTORY CREDIT & DEBIT NOTES
# ==============================================================================

class FinanceCreditNote(Base):
    """Statutory credit notes for cancellations and refunds."""
    __tablename__ = "finance_credit_notes"
    __allow_unmapped__ = True

    finance_credit_note_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    credit_note_no = Column(String(50), unique=True, nullable=False, index=True)
    original_sales_invoice_ref_id = Column(BigInteger, ForeignKey("finance_sales_invoices.finance_sales_invoice_ref_id"), nullable=False)
    reason = Column(String(255), nullable=False)
    taxable_amount = Column(Numeric(14, 2), nullable=False)
    gst_amount = Column(Numeric(14, 2), nullable=False)
    grand_total = Column(Numeric(14, 2), nullable=False)
    status = Column(String(20), default="ISSUED", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class FinanceDebitNote(Base):
    """Statutory debit notes for supplemental charges."""
    __tablename__ = "finance_debit_notes"
    __allow_unmapped__ = True

    finance_debit_note_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    debit_note_no = Column(String(50), unique=True, nullable=False, index=True)
    original_sales_invoice_ref_id = Column(BigInteger, ForeignKey("finance_sales_invoices.finance_sales_invoice_ref_id"), nullable=False)
    reason = Column(String(255), nullable=False)
    taxable_amount = Column(Numeric(14, 2), nullable=False)
    gst_amount = Column(Numeric(14, 2), nullable=False)
    grand_total = Column(Numeric(14, 2), nullable=False)
    status = Column(String(20), default="ISSUED", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==============================================================================
# 10. GST RATES & TAX TRANSACTIONS
# ==============================================================================

class FinanceTaxRate(Base):
    """Configurable GST tax rates per SAC code."""
    __tablename__ = "finance_tax_rates"
    __allow_unmapped__ = True

    finance_tax_rate_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    sac_code = Column(String(10), nullable=False, index=True)
    description = Column(String(255), nullable=False)
    rate_percent = Column(Numeric(5, 2), nullable=False)  # 18.00
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class FinanceGSTTransaction(Base):
    """Normalized ledger for GSTR-1 and GSTR-3B filings."""
    __tablename__ = "finance_gst_transactions"
    __allow_unmapped__ = True

    finance_gst_transaction_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    txn_type = Column(String(20), nullable=False, index=True)  # OUTWARD_B2B, INWARD_ITC
    reference_id = Column(BigInteger, nullable=False)  # invoice or bill ref_id
    period = Column(String(10), nullable=False, index=True)  # e.g. "2026-11"
    taxable_value = Column(Numeric(14, 2), nullable=False)
    cgst = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    sgst = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    igst = Column(Numeric(14, 2), default=Decimal("0.00"), nullable=False)
    status = Column(String(20), default="RECORDED", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==============================================================================
# 11. EMAIL LOGS, ATTACHMENTS & AUDIT TRAILS
# ==============================================================================

class FinanceEmailLog(Base):
    """Delivery tracking for invoice emails dispatched through SMTP."""
    __tablename__ = "finance_email_logs"
    __allow_unmapped__ = True

    finance_email_log_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    invoice_ref_id = Column(BigInteger, ForeignKey("finance_sales_invoices.finance_sales_invoice_ref_id"), nullable=False)
    recipient_email = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status = Column(String(20), default="SENT", nullable=False)  # SENT, FAILED, PENDING
    error_message = Column(Text, nullable=True)


class FinanceAttachment(Base):
    """Generic file attachments for bills, receipts, and proofs."""
    __tablename__ = "finance_attachments"
    __allow_unmapped__ = True

    finance_attachment_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    entity_type = Column(String(50), nullable=False, index=True)  # INVOICE, BILL, PAYMENT
    entity_ref_id = Column(BigInteger, nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_key = Column(String(500), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class FinanceAuditLog(Base):
    """Immutable audit trail for financial transactions and approvals."""
    __tablename__ = "finance_audit_logs"
    __allow_unmapped__ = True

    finance_audit_log_ref_id = Column(BigInteger, primary_key=True, autoincrement=True)
    ref_id = Column(BigInteger, unique=True, nullable=False, index=True)
    action = Column(String(100), nullable=False, index=True)  # INVOICE_APPROVE, INVOICE_ISSUE, PAYMENT_REVERSE
    entity_type = Column(String(50), nullable=False, index=True)
    entity_ref_id = Column(BigInteger, nullable=False, index=True)
    performed_by_user_id = Column(String(100), nullable=False)
    old_values = Column(Text, nullable=True)  # JSON
    new_values = Column(Text, nullable=True)  # JSON
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
