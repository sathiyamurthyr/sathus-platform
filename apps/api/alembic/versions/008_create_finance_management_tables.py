"""Create finance, GST and server billing management tables.

Revision ID: 008_finance_management_tables
Revises: 007_cloud_platform_tables
Create Date: 2026-11-15 11:30:00.000000

"""

from alembic import op
import sqlalchemy as sa


revision = '008_finance_management_tables'
down_revision = '007_cloud_platform_tables'
branch_labels = None
depends_on = None


def upgrade():
    # 1. finance_company_profiles
    op.create_table(
        'finance_company_profiles',
        sa.Column('finance_company_profile_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('legal_name', sa.String(255), nullable=False),
        sa.Column('display_name', sa.String(255), nullable=False),
        sa.Column('pan', sa.String(10), nullable=False),
        sa.Column('cin', sa.String(21), nullable=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=False),
        sa.Column('website', sa.String(255), nullable=False, server_default='https://sathus.in'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_finance_company_profiles_ref_id', 'finance_company_profiles', ['ref_id'], unique=True)
    op.create_index('ix_finance_company_profiles_pan', 'finance_company_profiles', ['pan'])

    # 2. finance_company_locations
    op.create_table(
        'finance_company_locations',
        sa.Column('finance_company_location_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('company_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_profiles.finance_company_profile_ref_id'), nullable=False),
        sa.Column('location_name', sa.String(100), nullable=False),
        sa.Column('address_line1', sa.String(255), nullable=False),
        sa.Column('address_line2', sa.String(255), nullable=True),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('district', sa.String(100), nullable=True),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('state_code', sa.String(2), nullable=False),
        sa.Column('pincode', sa.String(10), nullable=False),
        sa.Column('gstin', sa.String(15), nullable=False),
        sa.Column('is_default', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_finance_company_locations_ref_id', 'finance_company_locations', ['ref_id'], unique=True)
    op.create_index('ix_finance_company_locations_gstin', 'finance_company_locations', ['gstin'])
    op.create_index('ix_finance_company_locations_state_code', 'finance_company_locations', ['state_code'])

    # 3. finance_company_bank_accounts
    op.create_table(
        'finance_company_bank_accounts',
        sa.Column('finance_company_bank_account_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('company_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_profiles.finance_company_profile_ref_id'), nullable=False),
        sa.Column('account_holder', sa.String(255), nullable=False),
        sa.Column('bank_name', sa.String(150), nullable=False),
        sa.Column('branch', sa.String(150), nullable=False),
        sa.Column('account_number_encrypted', sa.Text(), nullable=False),
        sa.Column('account_number_masked', sa.String(50), nullable=False),
        sa.Column('ifsc_code', sa.String(20), nullable=False),
        sa.Column('swift_code', sa.String(20), nullable=True),
        sa.Column('upi_id', sa.String(100), nullable=True),
        sa.Column('bank_address', sa.Text(), nullable=True),
        sa.Column('currency', sa.String(5), server_default='INR', nullable=False),
        sa.Column('is_default', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('show_on_invoice', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_finance_bank_accounts_ref_id', 'finance_company_bank_accounts', ['ref_id'], unique=True)
    op.create_index('ix_finance_bank_accounts_ifsc', 'finance_company_bank_accounts', ['ifsc_code'])

    # 4. finance_company_assets
    op.create_table(
        'finance_company_assets',
        sa.Column('finance_company_asset_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('company_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_profiles.finance_company_profile_ref_id'), nullable=False),
        sa.Column('asset_type', sa.String(50), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_key', sa.String(500), nullable=False),
        sa.Column('mime_type', sa.String(100), nullable=False),
        sa.Column('checksum', sa.String(64), nullable=True),
        sa.Column('version', sa.Integer(), server_default='1', nullable=False),
        sa.Column('is_default', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_company_assets_ref_id', 'finance_company_assets', ['ref_id'], unique=True)
    op.create_index('ix_finance_company_assets_type', 'finance_company_assets', ['asset_type'])

    # 5. finance_payment_qr
    op.create_table(
        'finance_payment_qr',
        sa.Column('finance_payment_qr_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('company_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_profiles.finance_company_profile_ref_id'), nullable=False),
        sa.Column('bank_account_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_bank_accounts.finance_company_bank_account_ref_id'), nullable=True),
        sa.Column('qr_name', sa.String(100), nullable=False),
        sa.Column('qr_type', sa.String(50), server_default='UPI', nullable=False),
        sa.Column('qr_payload', sa.Text(), nullable=False),
        sa.Column('file_key', sa.String(500), nullable=True),
        sa.Column('upi_id', sa.String(100), nullable=False),
        sa.Column('merchant_name', sa.String(255), nullable=False),
        sa.Column('is_dynamic', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('is_default', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_payment_qr_ref_id', 'finance_payment_qr', ['ref_id'], unique=True)

    # 6. finance_signatories
    op.create_table(
        'finance_signatories',
        sa.Column('finance_signatory_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('company_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_profiles.finance_company_profile_ref_id'), nullable=False),
        sa.Column('signatory_name', sa.String(255), nullable=False),
        sa.Column('designation', sa.String(150), nullable=False),
        sa.Column('signature_asset_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_assets.finance_company_asset_ref_id'), nullable=True),
        sa.Column('effective_from', sa.Date(), nullable=False),
        sa.Column('effective_to', sa.Date(), nullable=True),
        sa.Column('is_default', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_signatories_ref_id', 'finance_signatories', ['ref_id'], unique=True)

    # 7. finance_invoice_templates
    op.create_table(
        'finance_invoice_templates',
        sa.Column('finance_invoice_template_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('company_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_profiles.finance_company_profile_ref_id'), nullable=False),
        sa.Column('template_name', sa.String(100), nullable=False),
        sa.Column('template_config', sa.Text(), server_default='{}', nullable=False),
        sa.Column('version', sa.Integer(), server_default='1', nullable=False),
        sa.Column('is_default', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_finance_templates_ref_id', 'finance_invoice_templates', ['ref_id'], unique=True)

    # 8. finance_document_snapshots
    op.create_table(
        'finance_document_snapshots',
        sa.Column('finance_document_snapshot_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('document_type', sa.String(50), nullable=False),
        sa.Column('document_ref_id', sa.BigInteger(), nullable=False),
        sa.Column('company_details_snapshot', sa.Text(), nullable=False),
        sa.Column('customer_details_snapshot', sa.Text(), nullable=False),
        sa.Column('bank_details_snapshot', sa.Text(), nullable=False),
        sa.Column('template_version', sa.String(50), server_default='1.0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_snapshots_ref_id', 'finance_document_snapshots', ['ref_id'], unique=True)
    op.create_index('ix_finance_snapshots_doc', 'finance_document_snapshots', ['document_type', 'document_ref_id'])

    # 9. finance_fy_settings
    op.create_table(
        'finance_fy_settings',
        sa.Column('finance_fy_setting_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('fy_code', sa.String(20), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_fy_ref_id', 'finance_fy_settings', ['ref_id'], unique=True)
    op.create_index('ix_finance_fy_code', 'finance_fy_settings', ['fy_code'], unique=True)

    # 10. finance_invoice_sequences
    op.create_table(
        'finance_invoice_sequences',
        sa.Column('finance_invoice_sequence_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('fy_code', sa.String(20), nullable=False),
        sa.Column('prefix', sa.String(50), nullable=False),
        sa.Column('last_number', sa.Integer(), server_default='0', nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('fy_code', 'prefix', name='uq_finance_sequence_fy_prefix')
    )
    op.create_index('ix_finance_sequence_ref_id', 'finance_invoice_sequences', ['ref_id'], unique=True)

    # 11. finance_customers
    op.create_table(
        'finance_customers',
        sa.Column('finance_customer_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('customer_code', sa.String(50), nullable=False),
        sa.Column('customer_name', sa.String(255), nullable=False),
        sa.Column('legal_company_name', sa.String(255), nullable=False),
        sa.Column('gstin', sa.String(15), nullable=True),
        sa.Column('pan', sa.String(10), nullable=True),
        sa.Column('gst_reg_type', sa.String(50), server_default='REGISTERED_REGULAR', nullable=False),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('state_code', sa.String(2), nullable=False),
        sa.Column('billing_address', sa.Text(), nullable=False),
        sa.Column('service_address', sa.Text(), nullable=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=False),
        sa.Column('primary_contact', sa.String(255), nullable=True),
        sa.Column('payment_terms_days', sa.Integer(), server_default='15', nullable=False),
        sa.Column('credit_limit', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_finance_customers_ref_id', 'finance_customers', ['ref_id'], unique=True)
    op.create_index('ix_finance_customers_code', 'finance_customers', ['customer_code'], unique=True)
    op.create_index('ix_finance_customers_gstin', 'finance_customers', ['gstin'])
    op.create_index('ix_finance_customers_email', 'finance_customers', ['email'])

    # 12. finance_customer_contacts
    op.create_table(
        'finance_customer_contacts',
        sa.Column('finance_customer_contact_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('customer_ref_id', sa.BigInteger(), sa.ForeignKey('finance_customers.finance_customer_ref_id'), nullable=False),
        sa.Column('contact_name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('designation', sa.String(100), nullable=True),
        sa.Column('is_primary', sa.Boolean(), server_default='false', nullable=False),
    )
    op.create_index('ix_finance_cust_contacts_ref_id', 'finance_customer_contacts', ['ref_id'], unique=True)

    # 13. finance_vendors
    op.create_table(
        'finance_vendors',
        sa.Column('finance_vendor_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('vendor_code', sa.String(50), nullable=False),
        sa.Column('vendor_name', sa.String(255), nullable=False),
        sa.Column('legal_name', sa.String(255), nullable=False),
        sa.Column('gstin', sa.String(15), nullable=True),
        sa.Column('pan', sa.String(10), nullable=True),
        sa.Column('state', sa.String(100), nullable=False),
        sa.Column('state_code', sa.String(2), nullable=False),
        sa.Column('address', sa.Text(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=False),
        sa.Column('payment_terms_days', sa.Integer(), server_default='30', nullable=False),
        sa.Column('bank_details', sa.Text(), nullable=True),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_finance_vendors_ref_id', 'finance_vendors', ['ref_id'], unique=True)
    op.create_index('ix_finance_vendors_code', 'finance_vendors', ['vendor_code'], unique=True)

    # 14. finance_vendor_documents
    op.create_table(
        'finance_vendor_documents',
        sa.Column('finance_vendor_document_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('vendor_ref_id', sa.BigInteger(), sa.ForeignKey('finance_vendors.finance_vendor_ref_id'), nullable=False),
        sa.Column('document_name', sa.String(255), nullable=False),
        sa.Column('file_key', sa.String(500), nullable=False),
        sa.Column('file_type', sa.String(50), nullable=False),
        sa.Column('file_size', sa.BigInteger(), nullable=False),
        sa.Column('uploaded_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_vendor_docs_ref_id', 'finance_vendor_documents', ['ref_id'], unique=True)

    # 15. finance_services
    op.create_table(
        'finance_services',
        sa.Column('finance_service_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('service_code', sa.String(50), nullable=False),
        sa.Column('service_name', sa.String(255), nullable=False),
        sa.Column('sac_code', sa.String(10), server_default='998315', nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('category', sa.String(100), server_default='Hosting', nullable=False),
        sa.Column('billing_frequency', sa.String(20), server_default='MONTHLY', nullable=False),
        sa.Column('default_gst_rate', sa.Numeric(5, 2), server_default='18.00', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_finance_services_ref_id', 'finance_services', ['ref_id'], unique=True)
    op.create_index('ix_finance_services_code', 'finance_services', ['service_code'], unique=True)

    # 16. finance_service_prices
    op.create_table(
        'finance_service_prices',
        sa.Column('finance_service_price_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('service_ref_id', sa.BigInteger(), sa.ForeignKey('finance_services.finance_service_ref_id'), nullable=False),
        sa.Column('currency', sa.String(5), server_default='INR', nullable=False),
        sa.Column('unit_price', sa.Numeric(14, 2), nullable=False),
        sa.Column('effective_from', sa.Date(), nullable=False),
        sa.Column('effective_to', sa.Date(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_prices_ref_id', 'finance_service_prices', ['ref_id'], unique=True)

    # 17. finance_subscriptions
    op.create_table(
        'finance_subscriptions',
        sa.Column('finance_subscription_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('subscription_number', sa.String(50), nullable=False),
        sa.Column('customer_ref_id', sa.BigInteger(), sa.ForeignKey('finance_customers.finance_customer_ref_id'), nullable=False),
        sa.Column('billing_frequency', sa.String(20), server_default='MONTHLY', nullable=False),
        sa.Column('billing_day', sa.Integer(), server_default='1', nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('next_billing_date', sa.Date(), nullable=False),
        sa.Column('auto_generate_invoice', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('auto_send_email', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('approval_required', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_finance_subs_ref_id', 'finance_subscriptions', ['ref_id'], unique=True)
    op.create_index('ix_finance_subs_num', 'finance_subscriptions', ['subscription_number'], unique=True)
    op.create_index('ix_finance_subs_next_billing', 'finance_subscriptions', ['next_billing_date'])

    # 18. finance_subscription_items
    op.create_table(
        'finance_subscription_items',
        sa.Column('finance_subscription_item_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('subscription_ref_id', sa.BigInteger(), sa.ForeignKey('finance_subscriptions.finance_subscription_ref_id'), nullable=False),
        sa.Column('service_ref_id', sa.BigInteger(), sa.ForeignKey('finance_services.finance_service_ref_id'), nullable=False),
        sa.Column('server_identifier', sa.String(100), nullable=True),
        sa.Column('server_hostname', sa.String(255), nullable=True),
        sa.Column('server_ip', sa.String(50), nullable=True),
        sa.Column('quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('unit_price', sa.Numeric(14, 2), nullable=False),
        sa.Column('gst_rate', sa.Numeric(5, 2), server_default='18.00', nullable=False),
        sa.Column('status', sa.String(20), server_default='ACTIVE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_sub_items_ref_id', 'finance_subscription_items', ['ref_id'], unique=True)

    # 19. finance_billing_runs
    op.create_table(
        'finance_billing_runs',
        sa.Column('finance_billing_run_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('run_date', sa.Date(), nullable=False),
        sa.Column('billing_period_start', sa.Date(), nullable=False),
        sa.Column('billing_period_end', sa.Date(), nullable=False),
        sa.Column('total_subscriptions_scanned', sa.Integer(), server_default='0', nullable=False),
        sa.Column('invoices_generated', sa.Integer(), server_default='0', nullable=False),
        sa.Column('total_taxable_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('total_gst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('status', sa.String(20), server_default='COMPLETED', nullable=False),
        sa.Column('error_log', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_billing_runs_ref_id', 'finance_billing_runs', ['ref_id'], unique=True)

    # 20. finance_sales_invoices
    op.create_table(
        'finance_sales_invoices',
        sa.Column('finance_sales_invoice_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('invoice_no', sa.String(50), nullable=False),
        sa.Column('subscription_ref_id', sa.BigInteger(), sa.ForeignKey('finance_subscriptions.finance_subscription_ref_id'), nullable=True),
        sa.Column('customer_ref_id', sa.BigInteger(), sa.ForeignKey('finance_customers.finance_customer_ref_id'), nullable=False),
        sa.Column('company_location_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_locations.finance_company_location_ref_id'), nullable=True),
        sa.Column('bank_account_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_bank_accounts.finance_company_bank_account_ref_id'), nullable=True),
        sa.Column('payment_qr_ref_id', sa.BigInteger(), sa.ForeignKey('finance_payment_qr.finance_payment_qr_ref_id'), nullable=True),
        sa.Column('signatory_ref_id', sa.BigInteger(), sa.ForeignKey('finance_signatories.finance_signatory_ref_id'), nullable=True),
        sa.Column('invoice_date', sa.Date(), nullable=False),
        sa.Column('due_date', sa.Date(), nullable=False),
        sa.Column('billing_period_start', sa.Date(), nullable=False),
        sa.Column('billing_period_end', sa.Date(), nullable=False),
        sa.Column('place_of_supply', sa.String(100), nullable=False),
        sa.Column('place_of_supply_code', sa.String(2), nullable=False),
        sa.Column('supply_type', sa.String(20), server_default='INTRA_STATE', nullable=False),
        sa.Column('taxable_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('cgst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('sgst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('igst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('total_gst', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('round_off', sa.Numeric(6, 2), server_default='0.00', nullable=False),
        sa.Column('grand_total', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('paid_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('balance_due', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('status', sa.String(20), server_default='DRAFT', nullable=False),
        sa.Column('created_by_user_id', sa.String(100), nullable=True),
        sa.Column('approved_by_user_id', sa.String(100), nullable=True),
        sa.Column('approved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('pdf_file_key', sa.String(500), nullable=True),
        sa.Column('payment_terms', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('subscription_ref_id', 'billing_period_start', 'billing_period_end', name='uq_finance_subscription_billing_period')
    )
    op.create_index('ix_finance_invoices_ref_id', 'finance_sales_invoices', ['ref_id'], unique=True)
    op.create_index('ix_finance_invoices_num', 'finance_sales_invoices', ['invoice_no'], unique=True)
    op.create_index('ix_finance_invoices_date', 'finance_sales_invoices', ['invoice_date'])
    op.create_index('ix_finance_invoices_status', 'finance_sales_invoices', ['status'])

    # 21. finance_sales_items
    op.create_table(
        'finance_sales_items',
        sa.Column('finance_sales_item_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('sales_invoice_ref_id', sa.BigInteger(), sa.ForeignKey('finance_sales_invoices.finance_sales_invoice_ref_id'), nullable=False),
        sa.Column('service_ref_id', sa.BigInteger(), sa.ForeignKey('finance_services.finance_service_ref_id'), nullable=True),
        sa.Column('item_description', sa.Text(), nullable=False),
        sa.Column('sac_code', sa.String(10), server_default='998315', nullable=False),
        sa.Column('quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('unit_price', sa.Numeric(14, 2), nullable=False),
        sa.Column('discount_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('taxable_amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('gst_rate', sa.Numeric(5, 2), server_default='18.00', nullable=False),
        sa.Column('cgst_rate', sa.Numeric(5, 2), server_default='0.00', nullable=False),
        sa.Column('cgst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('sgst_rate', sa.Numeric(5, 2), server_default='0.00', nullable=False),
        sa.Column('sgst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('igst_rate', sa.Numeric(5, 2), server_default='0.00', nullable=False),
        sa.Column('igst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('total_amount', sa.Numeric(14, 2), nullable=False),
    )
    op.create_index('ix_finance_sales_items_ref_id', 'finance_sales_items', ['ref_id'], unique=True)

    # 22. finance_purchase_bills
    op.create_table(
        'finance_purchase_bills',
        sa.Column('finance_purchase_bill_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('bill_no', sa.String(100), nullable=False),
        sa.Column('vendor_ref_id', sa.BigInteger(), sa.ForeignKey('finance_vendors.finance_vendor_ref_id'), nullable=False),
        sa.Column('bill_date', sa.Date(), nullable=False),
        sa.Column('due_date', sa.Date(), nullable=False),
        sa.Column('service_period_start', sa.Date(), nullable=True),
        sa.Column('service_period_end', sa.Date(), nullable=True),
        sa.Column('taxable_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('cgst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('sgst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('igst_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('total_gst', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('grand_total', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('paid_amount', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('balance_due', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('itc_eligible', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('itc_claim_status', sa.String(20), server_default='PENDING', nullable=False),
        sa.Column('status', sa.String(20), server_default='DRAFT', nullable=False),
        sa.Column('document_file_key', sa.String(500), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('vendor_ref_id', 'bill_no', name='uq_finance_vendor_bill_no')
    )
    op.create_index('ix_finance_purchase_bills_ref_id', 'finance_purchase_bills', ['ref_id'], unique=True)
    op.create_index('ix_finance_purchase_bills_date', 'finance_purchase_bills', ['bill_date'])

    # 23. finance_purchase_items
    op.create_table(
        'finance_purchase_items',
        sa.Column('finance_purchase_item_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('purchase_bill_ref_id', sa.BigInteger(), sa.ForeignKey('finance_purchase_bills.finance_purchase_bill_ref_id'), nullable=False),
        sa.Column('item_description', sa.Text(), nullable=False),
        sa.Column('sac_or_hsn', sa.String(10), nullable=True),
        sa.Column('quantity', sa.Integer(), server_default='1', nullable=False),
        sa.Column('unit_price', sa.Numeric(14, 2), nullable=False),
        sa.Column('taxable_amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('gst_rate', sa.Numeric(5, 2), server_default='18.00', nullable=False),
        sa.Column('total_amount', sa.Numeric(14, 2), nullable=False),
    )
    op.create_index('ix_finance_purchase_items_ref_id', 'finance_purchase_items', ['ref_id'], unique=True)

    # 24. finance_payments
    op.create_table(
        'finance_payments',
        sa.Column('finance_payment_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('payment_number', sa.String(50), nullable=False),
        sa.Column('payment_type', sa.String(20), nullable=False),
        sa.Column('party_type', sa.String(20), nullable=False),
        sa.Column('party_ref_id', sa.BigInteger(), nullable=False),
        sa.Column('payment_date', sa.Date(), nullable=False),
        sa.Column('payment_mode', sa.String(30), server_default='BANK_TRANSFER', nullable=False),
        sa.Column('amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('transaction_reference', sa.String(100), nullable=False),
        sa.Column('bank_account_ref_id', sa.BigInteger(), sa.ForeignKey('finance_company_bank_accounts.finance_company_bank_account_ref_id'), nullable=True),
        sa.Column('status', sa.String(20), server_default='POSTED', nullable=False),
        sa.Column('reversal_reason', sa.Text(), nullable=True),
        sa.Column('created_by_user_id', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_payments_ref_id', 'finance_payments', ['ref_id'], unique=True)
    op.create_index('ix_finance_payments_num', 'finance_payments', ['payment_number'], unique=True)
    op.create_index('ix_finance_payments_party', 'finance_payments', ['party_type', 'party_ref_id'])

    # 25. finance_payment_allocations
    op.create_table(
        'finance_payment_allocations',
        sa.Column('finance_payment_allocation_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('payment_ref_id', sa.BigInteger(), sa.ForeignKey('finance_payments.finance_payment_ref_id'), nullable=False),
        sa.Column('invoice_type', sa.String(30), server_default='SALES_INVOICE', nullable=False),
        sa.Column('invoice_ref_id', sa.BigInteger(), sa.ForeignKey('finance_sales_invoices.finance_sales_invoice_ref_id'), nullable=False),
        sa.Column('allocated_amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('allocated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_allocations_ref_id', 'finance_payment_allocations', ['ref_id'], unique=True)

    # 26. finance_credit_notes
    op.create_table(
        'finance_credit_notes',
        sa.Column('finance_credit_note_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('credit_note_no', sa.String(50), nullable=False),
        sa.Column('original_sales_invoice_ref_id', sa.BigInteger(), sa.ForeignKey('finance_sales_invoices.finance_sales_invoice_ref_id'), nullable=False),
        sa.Column('reason', sa.String(255), nullable=False),
        sa.Column('taxable_amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('gst_amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('grand_total', sa.Numeric(14, 2), nullable=False),
        sa.Column('status', sa.String(20), server_default='ISSUED', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_credit_notes_ref_id', 'finance_credit_notes', ['ref_id'], unique=True)

    # 27. finance_debit_notes
    op.create_table(
        'finance_debit_notes',
        sa.Column('finance_debit_note_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('debit_note_no', sa.String(50), nullable=False),
        sa.Column('original_sales_invoice_ref_id', sa.BigInteger(), sa.ForeignKey('finance_sales_invoices.finance_sales_invoice_ref_id'), nullable=False),
        sa.Column('reason', sa.String(255), nullable=False),
        sa.Column('taxable_amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('gst_amount', sa.Numeric(14, 2), nullable=False),
        sa.Column('grand_total', sa.Numeric(14, 2), nullable=False),
        sa.Column('status', sa.String(20), server_default='ISSUED', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_debit_notes_ref_id', 'finance_debit_notes', ['ref_id'], unique=True)

    # 28. finance_tax_rates
    op.create_table(
        'finance_tax_rates',
        sa.Column('finance_tax_rate_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('sac_code', sa.String(10), nullable=False),
        sa.Column('description', sa.String(255), nullable=False),
        sa.Column('rate_percent', sa.Numeric(5, 2), nullable=False),
        sa.Column('effective_from', sa.Date(), nullable=False),
        sa.Column('effective_to', sa.Date(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_tax_rates_ref_id', 'finance_tax_rates', ['ref_id'], unique=True)
    op.create_index('ix_finance_tax_rates_sac', 'finance_tax_rates', ['sac_code'])

    # 29. finance_gst_transactions
    op.create_table(
        'finance_gst_transactions',
        sa.Column('finance_gst_transaction_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('txn_type', sa.String(20), nullable=False),
        sa.Column('reference_id', sa.BigInteger(), nullable=False),
        sa.Column('period', sa.String(10), nullable=False),
        sa.Column('taxable_value', sa.Numeric(14, 2), nullable=False),
        sa.Column('cgst', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('sgst', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('igst', sa.Numeric(14, 2), server_default='0.00', nullable=False),
        sa.Column('status', sa.String(20), server_default='RECORDED', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_gst_txns_ref_id', 'finance_gst_transactions', ['ref_id'], unique=True)
    op.create_index('ix_finance_gst_txns_period', 'finance_gst_transactions', ['period'])

    # 30. finance_email_logs
    op.create_table(
        'finance_email_logs',
        sa.Column('finance_email_log_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('invoice_ref_id', sa.BigInteger(), sa.ForeignKey('finance_sales_invoices.finance_sales_invoice_ref_id'), nullable=False),
        sa.Column('recipient_email', sa.String(255), nullable=False),
        sa.Column('subject', sa.String(255), nullable=False),
        sa.Column('sent_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('status', sa.String(20), server_default='SENT', nullable=False),
        sa.Column('error_message', sa.Text(), nullable=True),
    )
    op.create_index('ix_finance_email_logs_ref_id', 'finance_email_logs', ['ref_id'], unique=True)

    # 31. finance_attachments
    op.create_table(
        'finance_attachments',
        sa.Column('finance_attachment_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('entity_type', sa.String(50), nullable=False),
        sa.Column('entity_ref_id', sa.BigInteger(), nullable=False),
        sa.Column('file_name', sa.String(255), nullable=False),
        sa.Column('file_key', sa.String(500), nullable=False),
        sa.Column('mime_type', sa.String(100), nullable=False),
        sa.Column('file_size', sa.BigInteger(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_attachments_ref_id', 'finance_attachments', ['ref_id'], unique=True)
    op.create_index('ix_finance_attachments_entity', 'finance_attachments', ['entity_type', 'entity_ref_id'])

    # 32. finance_audit_logs
    op.create_table(
        'finance_audit_logs',
        sa.Column('finance_audit_log_ref_id', sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('ref_id', sa.BigInteger(), nullable=False),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('entity_type', sa.String(50), nullable=False),
        sa.Column('entity_ref_id', sa.BigInteger(), nullable=False),
        sa.Column('performed_by_user_id', sa.String(100), nullable=False),
        sa.Column('old_values', sa.Text(), nullable=True),
        sa.Column('new_values', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )
    op.create_index('ix_finance_audit_logs_ref_id', 'finance_audit_logs', ['ref_id'], unique=True)
    op.create_index('ix_finance_audit_logs_action', 'finance_audit_logs', ['action'])
    op.create_index('ix_finance_audit_logs_entity', 'finance_audit_logs', ['entity_type', 'entity_ref_id'])


def downgrade():
    tables = [
        'finance_audit_logs',
        'finance_attachments',
        'finance_email_logs',
        'finance_gst_transactions',
        'finance_tax_rates',
        'finance_debit_notes',
        'finance_credit_notes',
        'finance_payment_allocations',
        'finance_payments',
        'finance_purchase_items',
        'finance_purchase_bills',
        'finance_sales_items',
        'finance_sales_invoices',
        'finance_billing_runs',
        'finance_subscription_items',
        'finance_subscriptions',
        'finance_service_prices',
        'finance_services',
        'finance_vendor_documents',
        'finance_vendors',
        'finance_customer_contacts',
        'finance_customers',
        'finance_invoice_sequences',
        'finance_fy_settings',
        'finance_document_snapshots',
        'finance_invoice_templates',
        'finance_signatories',
        'finance_payment_qr',
        'finance_company_assets',
        'finance_company_bank_accounts',
        'finance_company_locations',
        'finance_company_profiles',
    ]
    for table in tables:
        op.drop_table(table)
