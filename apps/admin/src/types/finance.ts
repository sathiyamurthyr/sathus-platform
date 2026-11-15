/**
 * TypeScript Interfaces for Sathus Admin Finance, GST & Server Billing Module.
 */

export type InvoiceStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ISSUED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED';

export type SubscriptionStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'ACTIVE'
  | 'PAUSED'
  | 'SUSPENDED'
  | 'CANCELLED'
  | 'EXPIRED';

export type PurchaseStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PAYMENT_PENDING'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'REJECTED';

export type SupplyType = 'INTRA_STATE' | 'INTER_STATE' | 'EXPORT' | 'EXEMPT';

export type PaymentMode = 'BANK_TRANSFER' | 'UPI' | 'PAYMENT_GATEWAY' | 'CHEQUE' | 'CASH';

export interface CompanyLocation {
  ref_id: number;
  location_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district?: string;
  state: string;
  state_code: string;
  pincode: string;
  gstin: string;
  is_default: boolean;
  status: string;
}

export interface CompanyBankAccount {
  ref_id: number;
  account_holder: string;
  bank_name: string;
  branch: string;
  account_number_masked: string;
  ifsc_code: string;
  swift_code?: string;
  upi_id?: string;
  currency: string;
  is_default: boolean;
  show_on_invoice: boolean;
  status: string;
}

export interface CompanySignatory {
  ref_id: number;
  signatory_name: string;
  designation: string;
  effective_from: string;
  effective_to?: string;
  is_default: boolean;
  status: string;
}

export interface CompanyPaymentQR {
  ref_id: number;
  qr_name: string;
  qr_type: string;
  qr_payload: string;
  upi_id: string;
  merchant_name: string;
  is_default: boolean;
  status: string;
}

export interface CompanyProfile {
  ref_id: number;
  legal_name: string;
  display_name: string;
  pan: string;
  cin?: string;
  email: string;
  phone: string;
  website: string;
  locations: CompanyLocation[];
  bank_accounts: CompanyBankAccount[];
  signatories: CompanySignatory[];
  payment_qrs?: CompanyPaymentQR[];
}

export interface CustomerContact {
  ref_id: number;
  contact_name: string;
  email: string;
  phone?: string;
  designation?: string;
  is_primary: boolean;
}

export interface FinanceCustomer {
  ref_id: number;
  customer_code: string;
  customer_name: string;
  legal_company_name: string;
  legal_name?: string;
  trade_name?: string;
  gstin?: string;
  pan?: string;
  gst_reg_type: string;
  state: string;
  state_code: string;
  billing_address: string;
  billing_address_line1?: string;
  service_address?: string;
  email: string;
  phone: string;
  contact_email?: string;
  contact_phone?: string;
  primary_contact?: string;
  payment_terms_days: number;
  credit_limit: number;
  status: string;
  created_at: string;
  contacts?: CustomerContact[];
}

export interface FinanceVendor {
  ref_id: number;
  vendor_code: string;
  vendor_name: string;
  legal_name: string;
  trade_name?: string;
  vendor_category?: string;
  gstin?: string;
  pan?: string;
  state: string;
  state_code: string;
  address: string;
  email: string;
  phone: string;
  contact_email?: string;
  contact_phone?: string;
  payment_terms_days: number;
  status: string;
  created_at: string;
}

export interface ServicePrice {
  ref_id: number;
  currency: string;
  unit_price: number;
  amount?: number;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
}

export interface FinanceService {
  ref_id: number;
  service_code: string; // APP-SERVER, DB-SERVER
  service_name: string;
  sac_code: string;
  description: string;
  category: string;
  billing_frequency: string;
  default_gst_rate: number;
  is_active: boolean;
  prices: ServicePrice[];
}

export interface SubscriptionItem {
  ref_id: number;
  service_ref_id: number;
  service_name?: string;
  service_code?: string;
  server_identifier?: string;
  server_hostname?: string;
  server_ip?: string;
  quantity: number;
  unit_price: number;
  gst_rate: number;
  status: string;
}

export interface ServerSubscription {
  ref_id: number;
  subscription_number: string;
  subscription_code?: string;
  plan_name?: string;
  plan_code?: string;
  base_amount_monthly?: number;
  server_hostname?: string;
  server_ip?: string;
  customer_ref_id: number;
  customer_name?: string;
  customer_code?: string;
  customer_gstin?: string;
  billing_frequency: string;
  billing_day: number;
  start_date: string;
  current_period_start?: string;
  current_period_end?: string;
  next_billing_date: string;
  auto_generate_invoice: boolean;
  auto_send_email: boolean;
  approval_required: boolean;
  status: SubscriptionStatus;
  tax_rate?: number;
  items: SubscriptionItem[];
  created_at: string;
}

export interface SalesItem {
  ref_id?: number;
  service_ref_id?: number;
  item_description: string;
  sac_code: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  taxable_amount: number;
  gst_rate: number;
  cgst_rate: number;
  cgst_amount: number;
  sgst_rate: number;
  sgst_amount: number;
  igst_rate: number;
  igst_amount: number;
  total_amount: number;
}

export interface SalesInvoice {
  ref_id: number;
  invoice_no: string;
  invoice_number?: string;
  amount_in_words?: string;
  subscription_ref_id?: number;
  customer_ref_id: number;
  customer_name?: string;
  customer_company?: string;
  customer_gstin?: string;
  customer_address?: string;
  invoice_date: string;
  due_date: string;
  billing_period_start: string;
  billing_period_end: string;
  place_of_supply: string;
  place_of_supply_code: string;
  supply_type: SupplyType;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_cgst?: number;
  total_sgst?: number;
  total_igst?: number;
  total_gst: number;
  round_off: number;
  grand_total: number;
  paid_amount: number;
  balance_due: number;
  status: InvoiceStatus;
  payment_terms?: string;
  created_by_user_id?: string;
  approved_by_user_id?: string;
  approved_at?: string;
  items: SalesItem[];
  created_at: string;
}

export interface PurchaseItem {
  ref_id?: number;
  item_description: string;
  sac_or_hsn?: string;
  hsn_sac_code?: string;
  quantity: number;
  unit_price: number;
  taxable_amount: number;
  gst_rate: number;
  cgst_rate?: number;
  cgst_amount?: number;
  sgst_rate?: number;
  sgst_amount?: number;
  igst_rate?: number;
  igst_amount?: number;
  total_amount: number;
  itc_eligible?: boolean;
}

export interface PurchaseBill {
  ref_id: number;
  bill_no: string;
  vendor_invoice_number?: string;
  vendor_ref_id: number;
  vendor_name?: string;
  vendor_gstin?: string;
  bill_date: string;
  due_date: string;
  place_of_supply?: string;
  place_of_supply_code?: string;
  service_period_start?: string;
  service_period_end?: string;
  taxable_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  igst_amount: number;
  total_cgst?: number;
  total_sgst?: number;
  total_igst?: number;
  total_gst: number;
  grand_total: number;
  paid_amount: number;
  balance_due: number;
  itc_eligible: boolean;
  itc_claim_status: string;
  itc_status?: string;
  gstr2b_match_status?: string;
  status: PurchaseStatus;
  notes?: string;
  items: PurchaseItem[];
  created_at: string;
}

export interface PaymentAllocation {
  ref_id: number;
  invoice_ref_id: number;
  invoice_no?: string;
  allocated_amount: number;
  allocated_at: string;
}

export interface PaymentTransaction {
  ref_id: number;
  payment_number: string;
  payment_type: 'CLIENT_RECEIPT' | 'VENDOR_PAYMENT';
  party_type: 'CUSTOMER' | 'VENDOR';
  party_ref_id: number;
  party_name?: string;
  payment_date: string;
  payment_mode: PaymentMode;
  amount: number;
  transaction_reference: string;
  status: string;
  allocations?: PaymentAllocation[];
  created_at: string;
}

export interface FinanceDashboardMetrics {
  total_revenue_mrr: number;
  app_server_revenue: number;
  db_server_revenue: number;
  active_subscriptions_count: number;
  receivables_outstanding: number;
  overdue_invoices_count: number;
  vendor_expenses_total: number;
  gst_collected_total: number;
  eligible_itc_total: number;
  net_gst_payable: number;
  last_updated: string;
}
