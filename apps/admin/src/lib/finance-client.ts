/**
 * API client and local mock/offline store for Finance, GST & Server Billing.
 */

import {
  CompanyProfile,
  FinanceCustomer,
  FinanceDashboardMetrics,
  FinanceService,
  FinanceVendor,
  PurchaseBill,
  SalesInvoice,
  ServerSubscription,
  PaymentTransaction,
} from '@/types/finance';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function shouldFetchApi(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.location.protocol === 'https:' && API_BASE.startsWith('http://localhost')) {
    return false;
  }
  return true;
}

// ==============================================================================
// SEED DATA
// ==============================================================================

export const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  ref_id: 1001,
  legal_name: 'Sathus Technology Private Limited',
  display_name: 'Sathus Technology',
  pan: 'AAECS1234F',
  cin: 'U72900TN2026PTC123456',
  email: 'billing@sathus.in',
  phone: '+91 44 2828 9000',
  website: 'https://sathus.in',
  logo_url: '/brand/sathus-logo.png',
  seal_url: '/brand/sathus-seal.png',
  locations: [
    {
      ref_id: 2001,
      location_name: 'Chennai Registered Office',
      address_line1: 'Sathus Technology Tower, 45 Mount Road',
      address_line2: 'Guindy Industrial Estate',
      city: 'Chennai',
      state: 'Tamil Nadu',
      state_code: '33',
      pincode: '600032',
      gstin: '33AAECS1234F1Z5',
      is_default: true,
      status: 'ACTIVE',
    },
  ],
  bank_accounts: [
    {
      ref_id: 3001,
      account_holder: 'Sathus Technology Private Limited',
      bank_name: 'HDFC Bank',
      branch: 'Guindy, Chennai',
      account_number_masked: '**** **** 1122',
      ifsc_code: 'HDFC0001234',
      upi_id: 'sathustechnology@hdfcbank',
      currency: 'INR',
      is_default: true,
      show_on_invoice: true,
      status: 'ACTIVE',
    },
  ],
  signatories: [
    {
      ref_id: 4001,
      signatory_name: 'Sathiya Murthy',
      designation: 'Managing Director & Authorized Signatory',
      effective_from: '2026-01-01',
      is_default: true,
      status: 'ACTIVE',
    },
  ],
  payment_qrs: [
    {
      ref_id: 5001,
      qr_name: 'Sathus HDFC Official UPI',
      qr_type: 'UPI',
      qr_payload: 'upi://pay?pa=sathustechnology@hdfcbank&pn=Sathus%20Technology&cu=INR',
      upi_id: 'sathustechnology@hdfcbank',
      merchant_name: 'Sathus Technology Pvt Ltd',
      is_default: true,
      status: 'ACTIVE',
    },
  ],
};

export const INITIAL_SERVICES: FinanceService[] = [
  {
    ref_id: 1,
    service_code: 'APP-SERVER',
    service_name: 'Application Server Hosting',
    sac_code: '998315',
    description: 'High-performance application server hosting for customer-facing workloads, APIs, frontends and microservices.',
    category: 'Server Hosting',
    billing_frequency: 'MONTHLY',
    default_gst_rate: 18,
    is_active: true,
    prices: [
      {
        ref_id: 11,
        currency: 'INR',
        unit_price: 5500,
        effective_from: '2026-01-01',
        is_active: true,
      },
    ],
  },
  {
    ref_id: 2,
    service_code: 'DB-SERVER',
    service_name: 'Database Server Hosting',
    sac_code: '998315',
    description: 'Dedicated database server hosting for PostgreSQL, NVMe persistent volumes, automated backups and replication.',
    category: 'Server Hosting',
    billing_frequency: 'MONTHLY',
    default_gst_rate: 18,
    is_active: true,
    prices: [
      {
        ref_id: 12,
        currency: 'INR',
        unit_price: 3000,
        effective_from: '2026-01-01',
        is_active: true,
      },
    ],
  },
];

export const INITIAL_CUSTOMERS: FinanceCustomer[] = [
  {
    ref_id: 101,
    customer_code: 'CUST-KAUVERY-01',
    customer_name: 'Kauvery Hospital Chennai',
    legal_company_name: 'Kauvery Hospital (Chennai) Limited',
    gstin: '33AABCK1234F1Z8',
    pan: 'AABCK1234F',
    gst_reg_type: 'REGISTERED_REGULAR',
    state: 'Tamil Nadu',
    state_code: '33',
    billing_address: 'No 199, Luz Church Road, Mylapore, Chennai, Tamil Nadu 600004',
    service_address: 'Data Center Rack 4, Chennai',
    email: 'accounts@kauveryhospital.com',
    phone: '+91 44 4000 6000',
    primary_contact: 'Dr. Aravind (Chief Medical Officer)',
    payment_terms_days: 15,
    credit_limit: 500000,
    status: 'ACTIVE',
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    ref_id: 102,
    customer_code: 'CUST-VERTEX-02',
    customer_name: 'Vertex Enterprises Bangalore',
    legal_company_name: 'Vertex Enterprises Private Limited',
    gstin: '29AABCV5678G1Z2',
    pan: 'AABCV5678G',
    gst_reg_type: 'REGISTERED_REGULAR',
    state: 'Karnataka',
    state_code: '29',
    billing_address: '88 Tech Park Boulevard, Whitefield, Bengaluru, Karnataka 560066',
    email: 'billing@vertexenterprises.store',
    phone: '+91 80 4111 2233',
    primary_contact: 'Manoj Kumar (VP Engineering)',
    payment_terms_days: 30,
    credit_limit: 300000,
    status: 'ACTIVE',
    created_at: '2026-02-15T11:30:00Z',
  },
];

export const INITIAL_VENDORS: FinanceVendor[] = [
  {
    ref_id: 201,
    vendor_code: 'VEND-WB-01',
    vendor_name: 'WebHostingBingo Datacenters',
    legal_name: 'WebHostingBingo Infrastructure Services Pvt Ltd',
    gstin: '27AABCW9876H1Z1',
    pan: 'AABCW9876H',
    state: 'Maharashtra',
    state_code: '27',
    address: 'BKC Complex, Bandra East, Mumbai 400051',
    email: 'noc@webhostingbingo.com',
    phone: '+91 22 6789 0000',
    payment_terms_days: 30,
    status: 'ACTIVE',
    created_at: '2026-01-05T09:00:00Z',
  },
];

export const INITIAL_SUBSCRIPTIONS: ServerSubscription[] = [
  {
    ref_id: 301,
    subscription_number: 'SUB-2026-0001',
    customer_ref_id: 101,
    customer_name: 'Kauvery Hospital Chennai',
    customer_code: 'CUST-KAUVERY-01',
    customer_gstin: '33AABCK1234F1Z8',
    billing_frequency: 'MONTHLY',
    billing_day: 1,
    start_date: '2026-01-01',
    next_billing_date: '2026-12-01',
    auto_generate_invoice: true,
    auto_send_email: false,
    approval_required: true,
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00Z',
    items: [
      {
        ref_id: 3001,
        service_ref_id: 1,
        service_name: 'Application Server Hosting',
        service_code: 'APP-SERVER',
        server_identifier: 'kauvery-app-srv-01',
        server_hostname: 'app.kauvery.sathus.cloud',
        server_ip: '157.20.172.186',
        quantity: 1,
        unit_price: 5500,
        gst_rate: 18,
        status: 'ACTIVE',
      },
      {
        ref_id: 3002,
        service_ref_id: 2,
        service_name: 'Database Server Hosting',
        service_code: 'DB-SERVER',
        server_identifier: 'kauvery-db-srv-01',
        server_hostname: 'db.kauvery.sathus.cloud',
        server_ip: '157.20.172.186',
        quantity: 1,
        unit_price: 3000,
        gst_rate: 18,
        status: 'ACTIVE',
      },
    ],
  },
];

export const INITIAL_INVOICES: SalesInvoice[] = [
  {
    ref_id: 401,
    invoice_no: 'SATH/26-27/00001',
    subscription_ref_id: 301,
    customer_ref_id: 101,
    customer_name: 'Kauvery Hospital Chennai',
    customer_company: 'Kauvery Hospital (Chennai) Limited',
    customer_gstin: '33AABCK1234F1Z8',
    customer_address: 'No 199, Luz Church Road, Mylapore, Chennai, Tamil Nadu 600004',
    invoice_date: '2026-11-01',
    due_date: '2026-11-16',
    billing_period_start: '2026-11-01',
    billing_period_end: '2026-11-30',
    place_of_supply: 'Tamil Nadu',
    place_of_supply_code: '33',
    supply_type: 'INTRA_STATE',
    taxable_amount: 8500,
    cgst_amount: 765,
    sgst_amount: 765,
    igst_amount: 0,
    total_gst: 1530,
    round_off: 0,
    grand_total: 10030,
    paid_amount: 10030,
    balance_due: 0,
    status: 'PAID',
    payment_terms: 'Net 15 Days',
    created_by_user_id: 'recurring_billing_worker',
    approved_by_user_id: 'finance_admin',
    approved_at: '2026-11-02T10:00:00Z',
    created_at: '2026-11-01T00:00:00Z',
    items: [
      {
        item_description: 'Application Server Hosting (kauvery-app-srv-01) - November 2026',
        sac_code: '998315',
        quantity: 1,
        unit_price: 5500,
        discount_amount: 0,
        taxable_amount: 5500,
        gst_rate: 18,
        cgst_rate: 9,
        cgst_amount: 495,
        sgst_rate: 9,
        sgst_amount: 495,
        igst_rate: 0,
        igst_amount: 0,
        total_amount: 6490,
      },
      {
        item_description: 'Database Server Hosting (kauvery-db-srv-01) - November 2026',
        sac_code: '998315',
        quantity: 1,
        unit_price: 3000,
        discount_amount: 0,
        taxable_amount: 3000,
        gst_rate: 18,
        cgst_rate: 9,
        cgst_amount: 270,
        sgst_rate: 9,
        sgst_amount: 270,
        igst_rate: 0,
        igst_amount: 0,
        total_amount: 3540,
      },
    ],
  },
];

export const INITIAL_PURCHASES: PurchaseBill[] = [
  {
    ref_id: 501,
    bill_no: 'WHB-INV-2026-8812',
    vendor_ref_id: 201,
    vendor_name: 'WebHostingBingo Datacenters',
    vendor_gstin: '27AABCW9876H1Z1',
    bill_date: '2026-11-01',
    due_date: '2026-11-30',
    service_period_start: '2026-11-01',
    service_period_end: '2026-11-30',
    taxable_amount: 2500,
    cgst_amount: 0,
    sgst_amount: 0,
    igst_amount: 450,
    total_gst: 450,
    grand_total: 2950,
    paid_amount: 2950,
    balance_due: 0,
    itc_eligible: true,
    itc_claim_status: 'CLAIMED',
    status: 'PAID',
    notes: 'VPS Purchase: 10 vCPU, 32 GB RAM, 200 GB SSD (Database infrastructure)',
    created_at: '2026-11-02T12:00:00Z',
    items: [
      {
        item_description: 'Dedicated Cloud VPS (10 vCPU, 32 GB RAM, 200 GB SSD)',
        sac_or_hsn: '998315',
        quantity: 1,
        unit_price: 2500,
        taxable_amount: 2500,
        gst_rate: 18,
        total_amount: 2950,
      },
    ],
  },
];

// ==============================================================================
// LOCAL STORAGE RESILIENT CLIENT
// ==============================================================================

class FinanceClient {
  private getStorage<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const stored = localStorage.getItem(`sathus_fin_${key}`);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setStorage<T>(key: string, val: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`sathus_fin_${key}`, JSON.stringify(val));
    } catch {
      // Ignore
    }
  }

  // --- Company Profile ---
  async getCompanyProfile(): Promise<CompanyProfile> {
    if (shouldFetchApi()) {
      try {
        const res = await fetch(`${API_BASE}/api/v1/finance/company-profile`);
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }
    const stored = this.getStorage<CompanyProfile>('company_profile', DEFAULT_COMPANY_PROFILE);
    return {
      ...DEFAULT_COMPANY_PROFILE,
      ...stored,
      logo_url: stored.logo_url || DEFAULT_COMPANY_PROFILE.logo_url,
      seal_url: stored.seal_url || DEFAULT_COMPANY_PROFILE.seal_url,
    };
  }

  async updateCompanyProfile(updates: Partial<CompanyProfile>): Promise<CompanyProfile> {
    if (shouldFetchApi()) {
      try {
        const res = await fetch(`${API_BASE}/api/v1/finance/company-profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        if (res.ok) return await res.json();
      } catch {
        // Fallback
      }
    }
    const current = await this.getCompanyProfile();
    const updated = { ...current, ...updates };
    this.setStorage('company_profile', updated);
    return updated;
  }

  // --- Services ---
  async getServices(): Promise<FinanceService[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/services`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return this.getStorage('services', INITIAL_SERVICES);
  }

  async updateService(
    service_ref_id: number,
    data: {
      service_name?: string;
      description?: string;
      sac_code?: string;
      default_gst_rate?: number;
      unit_price?: number;
    }
  ): Promise<FinanceService> {
    const services = await this.getServices();
    const svc = services.find((s) => s.ref_id === service_ref_id);
    if (!svc) throw new Error('Service not found');

    if (data.service_name !== undefined) svc.service_name = data.service_name;
    if (data.description !== undefined) svc.description = data.description;
    if (data.sac_code !== undefined) svc.sac_code = data.sac_code;
    if (data.default_gst_rate !== undefined) svc.default_gst_rate = data.default_gst_rate;

    if (data.unit_price !== undefined) {
      if (svc.prices && svc.prices.length > 0) {
        svc.prices[0].unit_price = data.unit_price;
        svc.prices[0].amount = data.unit_price;
      } else {
        svc.prices = [
          {
            ref_id: Date.now(),
            currency: 'INR',
            unit_price: data.unit_price,
            amount: data.unit_price,
            effective_from: new Date().toISOString().split('T')[0],
            is_active: true,
          },
        ];
      }
    }
    this.setStorage('services', services);
    return svc;
  }

  async updateServicePrice(
    service_ref_id: number,
    new_price: number
  ): Promise<FinanceService> {
    return this.updateService(service_ref_id, { unit_price: new_price });
  }

  // --- Customers ---
  async getCustomers(): Promise<FinanceCustomer[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/customers`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return this.getStorage('customers', INITIAL_CUSTOMERS);
  }

  async createCustomer(cust: Partial<FinanceCustomer>): Promise<FinanceCustomer> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cust),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const customers = await this.getCustomers();
    const newCust: FinanceCustomer = {
      ref_id: Date.now(),
      customer_code: cust.customer_code || `CUST-${Date.now() % 10000}`,
      customer_name: cust.customer_name || 'New Customer',
      legal_company_name: cust.legal_company_name || 'New Customer Legal',
      gstin: cust.gstin,
      pan: cust.pan,
      gst_reg_type: cust.gst_reg_type || 'REGISTERED_REGULAR',
      state: cust.state || 'Tamil Nadu',
      state_code: cust.state_code || '33',
      billing_address: cust.billing_address || 'Address',
      email: cust.email || '',
      phone: cust.phone || '',
      payment_terms_days: cust.payment_terms_days || 15,
      credit_limit: cust.credit_limit || 0,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    customers.unshift(newCust);
    this.setStorage('customers', customers);
    return newCust;
  }

  async updateCustomer(
    ref_id: number,
    cust: Partial<FinanceCustomer>
  ): Promise<FinanceCustomer> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/customers/${ref_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cust),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const customers = await this.getCustomers();
    const idx = customers.findIndex((c) => c.ref_id === ref_id);
    if (idx === -1) throw new Error('Customer not found');

    const updated: FinanceCustomer = {
      ...customers[idx],
      ...cust,
      customer_name: cust.customer_name || cust.legal_company_name || cust.legal_name || customers[idx].customer_name,
      legal_company_name: cust.legal_company_name || cust.legal_name || cust.customer_name || customers[idx].legal_company_name,
      legal_name: cust.legal_name || cust.legal_company_name || cust.customer_name || customers[idx].legal_name,
      trade_name: cust.trade_name !== undefined ? cust.trade_name : customers[idx].trade_name,
      gstin: cust.gstin !== undefined ? cust.gstin : customers[idx].gstin,
      pan: cust.pan !== undefined ? cust.pan : customers[idx].pan,
      state: cust.state || customers[idx].state,
      state_code: cust.state_code || customers[idx].state_code,
      billing_address: cust.billing_address || cust.billing_address_line1 || customers[idx].billing_address,
      billing_address_line1: cust.billing_address_line1 || cust.billing_address || customers[idx].billing_address_line1,
      email: cust.email || cust.contact_email || customers[idx].email,
      contact_email: cust.contact_email || cust.email || customers[idx].contact_email,
      phone: cust.phone || cust.contact_phone || customers[idx].phone,
      contact_phone: cust.contact_phone || cust.phone || customers[idx].contact_phone,
    };
    customers[idx] = updated;
    this.setStorage('customers', customers);

    // Propagate customer name updates to subscriptions and invoices in storage
    const subs = this.getStorage<ServerSubscription[]>('subscriptions', INITIAL_SUBSCRIPTIONS);
    let subsUpdated = false;
    for (const sub of subs) {
      if (sub.customer_ref_id === ref_id) {
        sub.customer_name = updated.customer_name || updated.legal_name || updated.legal_company_name;
        sub.customer_gstin = updated.gstin;
        subsUpdated = true;
      }
    }
    if (subsUpdated) {
      this.setStorage('subscriptions', subs);
    }

    return updated;
  }

  // --- Vendors ---
  async getVendors(): Promise<FinanceVendor[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/vendors`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return this.getStorage('vendors', INITIAL_VENDORS);
  }

  async createVendor(vend: Partial<FinanceVendor>): Promise<FinanceVendor> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vend),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const vendors = await this.getVendors();
    const newVend: FinanceVendor = {
      ref_id: Date.now(),
      vendor_code: vend.vendor_code || `VEND-${Date.now() % 10000}`,
      vendor_name: vend.vendor_name || 'New Vendor',
      legal_name: vend.legal_name || 'New Vendor Legal',
      gstin: vend.gstin,
      pan: vend.pan,
      state: vend.state || 'Maharashtra',
      state_code: vend.state_code || '27',
      address: vend.address || 'Address',
      email: vend.email || '',
      phone: vend.phone || '',
      payment_terms_days: vend.payment_terms_days || 30,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    vendors.unshift(newVend);
    this.setStorage('vendors', vendors);
    return newVend;
  }

  // --- Subscriptions ---
  async getSubscriptions(): Promise<ServerSubscription[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/subscriptions`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return this.getStorage('subscriptions', INITIAL_SUBSCRIPTIONS);
  }

  async createSubscription(payload: {
    customer_ref_id: number;
    items: Array<{ service_ref_id: number; quantity: number; unit_price: number; server_identifier?: string }>;
    billing_day?: number;
  }): Promise<ServerSubscription> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const subs = await this.getSubscriptions();
    const customers = await this.getCustomers();
    const cust = customers.find((c) => c.ref_id === payload.customer_ref_id);

    const newSub: ServerSubscription = {
      ref_id: Date.now(),
      subscription_number: `SUB-2026-${(Date.now() % 10000).toString().padStart(4, '0')}`,
      customer_ref_id: payload.customer_ref_id,
      customer_name: cust?.customer_name,
      customer_code: cust?.customer_code,
      customer_gstin: cust?.gstin,
      billing_frequency: 'MONTHLY',
      billing_day: payload.billing_day || 1,
      start_date: new Date().toISOString().split('T')[0],
      next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      auto_generate_invoice: true,
      auto_send_email: false,
      approval_required: true,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      items: payload.items.map((it, idx) => ({
        ref_id: Date.now() + idx,
        service_ref_id: it.service_ref_id,
        service_name: it.service_ref_id === 1 ? 'Application Server Hosting' : 'Database Server Hosting',
        service_code: it.service_ref_id === 1 ? 'APP-SERVER' : 'DB-SERVER',
        server_identifier: it.server_identifier || (it.service_ref_id === 1 ? 'app-srv-01' : 'db-srv-01'),
        quantity: it.quantity,
        unit_price: it.unit_price,
        gst_rate: 18,
        status: 'ACTIVE',
      })),
    };
    subs.unshift(newSub);
    this.setStorage('subscriptions', subs);
    return newSub;
  }

  async updateSubscription(
    ref_id: number,
    payload: {
      customer_ref_id?: number;
      customer_name?: string;
      server_hostname?: string;
      server_ip?: string;
      server_identifier?: string;
      server_specs?: string;
      base_amount_monthly?: number;
      plan_name?: string;
      billing_frequency?: string;
      next_billing_date?: string;
    }
  ): Promise<ServerSubscription> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/subscriptions/${ref_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const subs = await this.getSubscriptions();
    const idx = subs.findIndex((s) => s.ref_id === ref_id);
    if (idx === -1) throw new Error('Subscription not found');

    const sub = subs[idx];
    const newBase = payload.base_amount_monthly !== undefined ? payload.base_amount_monthly : sub.base_amount_monthly;

    const updatedItems = (sub.items || []).map((it) => ({
      ...it,
      server_hostname: payload.server_hostname !== undefined ? payload.server_hostname : it.server_hostname,
      server_ip: payload.server_ip !== undefined ? payload.server_ip : it.server_ip,
      server_identifier: payload.server_identifier !== undefined ? payload.server_identifier : it.server_identifier,
      server_specs: payload.server_specs !== undefined ? payload.server_specs : it.server_specs,
      unit_price: newBase !== undefined ? newBase : it.unit_price,
    }));

    const updated: ServerSubscription = {
      ...sub,
      customer_ref_id: payload.customer_ref_id !== undefined ? payload.customer_ref_id : sub.customer_ref_id,
      customer_name: payload.customer_name !== undefined ? payload.customer_name : sub.customer_name,
      plan_name: payload.plan_name !== undefined ? payload.plan_name : sub.plan_name,
      server_hostname: payload.server_hostname !== undefined ? payload.server_hostname : sub.server_hostname,
      server_ip: payload.server_ip !== undefined ? payload.server_ip : sub.server_ip,
      server_specs: payload.server_specs !== undefined ? payload.server_specs : sub.server_specs,
      base_amount_monthly: newBase,
      billing_frequency: payload.billing_frequency !== undefined ? payload.billing_frequency : sub.billing_frequency,
      next_billing_date: payload.next_billing_date !== undefined ? payload.next_billing_date : sub.next_billing_date,
      items: updatedItems.length > 0 ? updatedItems : sub.items,
    };

    subs[idx] = updated;
    this.setStorage('subscriptions', subs);
    return updated;
  }

  async pauseSubscription(ref_id: number): Promise<ServerSubscription> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/subscriptions/${ref_id}/pause`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const subs = await this.getSubscriptions();
    const s = subs.find((x) => x.ref_id === ref_id);
    if (s) {
      s.status = 'PAUSED';
      this.setStorage('subscriptions', subs);
      return s;
    }
    throw new Error('Subscription not found');
  }

  async resumeSubscription(ref_id: number): Promise<ServerSubscription> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/subscriptions/${ref_id}/resume`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const subs = await this.getSubscriptions();
    const s = subs.find((x) => x.ref_id === ref_id);
    if (s) {
      s.status = 'ACTIVE';
      this.setStorage('subscriptions', subs);
      return s;
    }
    throw new Error('Subscription not found');
  }

  async cancelSubscription(ref_id: number): Promise<ServerSubscription> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/subscriptions/${ref_id}/cancel`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const subs = await this.getSubscriptions();
    const s = subs.find((x) => x.ref_id === ref_id);
    if (s) {
      s.status = 'CANCELLED';
      this.setStorage('subscriptions', subs);
      return s;
    }
    throw new Error('Subscription not found');
  }

  // --- Sales Invoices ---
  async getInvoices(): Promise<SalesInvoice[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/sales-invoices`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return this.getStorage('invoices', INITIAL_INVOICES);
  }

  async getInvoice(ref_id: number): Promise<SalesInvoice | null> {
    const list = await this.getInvoices();
    return list.find((inv) => inv.ref_id === ref_id) || null;
  }

  async createInvoice(payload: {
    customer_ref_id: number;
    billing_period_start: string;
    billing_period_end: string;
    items: Array<{
      item_description: string;
      sac_code: string;
      quantity: number;
      unit_price: number;
      gst_rate?: number;
    }>;
  }): Promise<SalesInvoice> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/sales-invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const invoices = await this.getInvoices();
    const customers = await this.getCustomers();
    const cust = customers.find((c) => c.ref_id === payload.customer_ref_id);

    const isIntraState = (cust?.state_code || '33') === '33';
    let totalTaxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    const items = payload.items.map((it) => {
      const taxable = it.quantity * it.unit_price;
      const rate = it.gst_rate ?? 18;
      totalTaxable += taxable;
      if (isIntraState) {
        const cgst = Math.round(taxable * (rate / 2) / 100);
        const sgst = Math.round(taxable * (rate / 2) / 100);
        totalCgst += cgst;
        totalSgst += sgst;
        return {
          item_description: it.item_description,
          sac_code: it.sac_code,
          quantity: it.quantity,
          unit_price: it.unit_price,
          discount_amount: 0,
          taxable_amount: taxable,
          gst_rate: rate,
          cgst_rate: rate / 2,
          cgst_amount: cgst,
          sgst_rate: rate / 2,
          sgst_amount: sgst,
          igst_rate: 0,
          igst_amount: 0,
          total_amount: taxable + cgst + sgst,
        };
      } else {
        const igst = Math.round(taxable * rate / 100);
        totalIgst += igst;
        return {
          item_description: it.item_description,
          sac_code: it.sac_code,
          quantity: it.quantity,
          unit_price: it.unit_price,
          discount_amount: 0,
          taxable_amount: taxable,
          gst_rate: rate,
          cgst_rate: 0,
          cgst_amount: 0,
          sgst_rate: 0,
          sgst_amount: 0,
          igst_rate: rate,
          igst_amount: igst,
          total_amount: taxable + igst,
        };
      }
    });

    const grandTotal = totalTaxable + totalCgst + totalSgst + totalIgst;
    const invNo = `SATH/26-27/${(invoices.length + 1).toString().padStart(5, '0')}`;

    const newInv: SalesInvoice = {
      ref_id: Date.now(),
      invoice_no: invNo,
      customer_ref_id: payload.customer_ref_id,
      customer_name: cust?.customer_name,
      customer_company: cust?.legal_company_name,
      customer_gstin: cust?.gstin,
      customer_address: cust?.billing_address,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      billing_period_start: payload.billing_period_start,
      billing_period_end: payload.billing_period_end,
      place_of_supply: cust?.state || 'Tamil Nadu',
      place_of_supply_code: cust?.state_code || '33',
      supply_type: isIntraState ? 'INTRA_STATE' : 'INTER_STATE',
      taxable_amount: totalTaxable,
      cgst_amount: totalCgst,
      sgst_amount: totalSgst,
      igst_amount: totalIgst,
      total_gst: totalCgst + totalSgst + totalIgst,
      round_off: 0,
      grand_total: grandTotal,
      paid_amount: 0,
      balance_due: grandTotal,
      status: 'DRAFT',
      created_by_user_id: 'finance_executive',
      items,
      created_at: new Date().toISOString(),
    };
    invoices.unshift(newInv);
    this.setStorage('invoices', invoices);
    return newInv;
  }

  async approveInvoice(ref_id: number): Promise<SalesInvoice> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/sales-invoices/${ref_id}/approve?approver_user_id=finance_admin`, {
        method: 'POST',
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const invoices = await this.getInvoices();
    const inv = invoices.find((i) => i.ref_id === ref_id);
    if (inv) {
      inv.status = 'APPROVED';
      inv.approved_by_user_id = 'finance_admin';
      inv.approved_at = new Date().toISOString();
      this.setStorage('invoices', invoices);
      return inv;
    }
    throw new Error('Invoice not found');
  }

  async issueInvoice(ref_id: number): Promise<SalesInvoice> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/sales-invoices/${ref_id}/issue?issued_by_user_id=finance_admin`, {
        method: 'POST',
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const invoices = await this.getInvoices();
    const inv = invoices.find((i) => i.ref_id === ref_id);
    if (inv) {
      inv.status = 'ISSUED';
      this.setStorage('invoices', invoices);
      return inv;
    }
    throw new Error('Invoice not found');
  }

  async updateInvoiceStatus(
    ref_id: number,
    status: SalesInvoice['status'],
    paid_amount?: number
  ): Promise<SalesInvoice> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/sales-invoices/${ref_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paid_amount }),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const invoices = await this.getInvoices();
    const inv = invoices.find((i) => i.ref_id === ref_id);
    if (inv) {
      inv.status = status;
      if (status === 'PAID') {
        inv.paid_amount = inv.grand_total;
        inv.balance_due = 0;
      } else if (paid_amount !== undefined) {
        inv.paid_amount = paid_amount;
        inv.balance_due = Math.max(inv.grand_total - paid_amount, 0);
      }
      this.setStorage('invoices', invoices);
      return inv;
    }
    throw new Error('Invoice not found');
  }

  // --- Purchase Bills ---
  async getPurchaseBills(): Promise<PurchaseBill[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/purchase-bills`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return this.getStorage('purchase_bills', INITIAL_PURCHASES);
  }

  async createPurchaseBill(payload: {
    vendor_ref_id: number;
    bill_no: string;
    bill_date: string;
    due_date: string;
    itc_eligible: boolean;
    items: Array<{ item_description: string; quantity: number; unit_price: number; gst_rate?: number }>;
    notes?: string;
  }): Promise<PurchaseBill> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/purchase-bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const bills = await this.getPurchaseBills();
    const vendors = await this.getVendors();
    const vend = vendors.find((v) => v.ref_id === payload.vendor_ref_id);

    let taxable = 0;
    let gst = 0;
    const items = payload.items.map((it) => {
      const lineTaxable = it.quantity * it.unit_price;
      const rate = it.gst_rate ?? 18;
      const lineGst = Math.round((lineTaxable * rate) / 100);
      taxable += lineTaxable;
      gst += lineGst;
      return {
        item_description: it.item_description,
        quantity: it.quantity,
        unit_price: it.unit_price,
        taxable_amount: lineTaxable,
        gst_rate: rate,
        total_amount: lineTaxable + lineGst,
      };
    });

    const newBill: PurchaseBill = {
      ref_id: Date.now(),
      bill_no: payload.bill_no,
      vendor_ref_id: payload.vendor_ref_id,
      vendor_name: vend?.vendor_name,
      vendor_gstin: vend?.gstin,
      bill_date: payload.bill_date,
      due_date: payload.due_date,
      taxable_amount: taxable,
      cgst_amount: 0,
      sgst_amount: 0,
      igst_amount: gst,
      total_gst: gst,
      grand_total: taxable + gst,
      paid_amount: 0,
      balance_due: taxable + gst,
      itc_eligible: payload.itc_eligible,
      itc_claim_status: payload.itc_eligible ? 'CLAIMED' : 'INELIGIBLE',
      status: 'APPROVED',
      notes: payload.notes,
      items,
      created_at: new Date().toISOString(),
    };
    bills.unshift(newBill);
    this.setStorage('purchase_bills', bills);
    return newBill;
  }

  // --- Payments ---
  async getPayments(): Promise<PaymentTransaction[]> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/payments`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return this.getStorage('payments', [
      {
        ref_id: 601,
        payment_number: 'PAY-2026-0001',
        payment_type: 'CLIENT_RECEIPT',
        party_type: 'CUSTOMER',
        party_ref_id: 101,
        party_name: 'Kauvery Hospital Chennai',
        payment_date: '2026-11-05',
        payment_mode: 'BANK_TRANSFER',
        amount: 10030,
        transaction_reference: 'HDFCR52026110599881',
        status: 'POSTED',
        created_at: '2026-11-05T14:00:00Z',
      },
    ]);
  }

  async recordPayment(payload: {
    payment_type: 'CLIENT_RECEIPT' | 'VENDOR_PAYMENT';
    party_type: 'CUSTOMER' | 'VENDOR';
    party_ref_id: number;
    amount: number;
    transaction_reference: string;
    payment_mode: any;
    invoice_ref_ids?: number[];
  }): Promise<PaymentTransaction> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    const payments = await this.getPayments();
    const newPay: PaymentTransaction = {
      ref_id: Date.now(),
      payment_number: `PAY-2026-${(Date.now() % 10000).toString().padStart(4, '0')}`,
      payment_type: payload.payment_type,
      party_type: payload.party_type,
      party_ref_id: payload.party_ref_id,
      payment_date: new Date().toISOString().split('T')[0],
      payment_mode: payload.payment_mode,
      amount: payload.amount,
      transaction_reference: payload.transaction_reference,
      status: 'POSTED',
      created_at: new Date().toISOString(),
    };
    payments.unshift(newPay);
    this.setStorage('payments', payments);

    // If client receipt, mark invoice as paid
    if (payload.invoice_ref_ids && payload.invoice_ref_ids.length > 0) {
      const invoices = await this.getInvoices();
      for (const invRef of payload.invoice_ref_ids) {
        const inv = invoices.find((i) => i.ref_id === invRef);
        if (inv) {
          inv.paid_amount += payload.amount;
          inv.balance_due = Math.max(inv.grand_total - inv.paid_amount, 0);
          inv.status = inv.balance_due === 0 ? 'PAID' : 'PARTIALLY_PAID';
        }
      }
      this.setStorage('invoices', invoices);
    }

    return newPay;
  }

  // --- Dashboard Metrics ---
  async getDashboardMetrics(): Promise<FinanceDashboardMetrics> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/dashboard/summary`);
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const invoices = await this.getInvoices();
    const bills = await this.getPurchaseBills();
    const subs = await this.getSubscriptions();

    let totalRevenueMRR = 0;
    let appServerRev = 0;
    let dbServerRev = 0;
    let receivables = 0;
    let overdueCount = 0;
    let gstCollected = 0;

    for (const inv of invoices) {
      if (['ISSUED', 'PARTIALLY_PAID', 'PAID'].includes(inv.status)) {
        totalRevenueMRR += inv.taxable_amount;
        gstCollected += inv.total_gst;
        receivables += inv.balance_due;
        if (new Date(inv.due_date) < new Date() && inv.balance_due > 0) {
          overdueCount++;
        }
        for (const it of inv.items) {
          const desc = it.item_description.toUpperCase();
          if (desc.includes('APPLICATION SERVER')) {
            appServerRev += it.taxable_amount;
          } else if (desc.includes('DATABASE SERVER')) {
            dbServerRev += it.taxable_amount;
          }
        }
      }
    }

    let vendorExpenses = 0;
    let eligibleItc = 0;
    for (const b of bills) {
      vendorExpenses += b.grand_total;
      if (b.itc_eligible) {
        eligibleItc += b.total_gst;
      }
    }

    const activeSubs = subs.filter((s) => s.status === 'ACTIVE').length;

    return {
      total_revenue_mrr: totalRevenueMRR,
      app_server_revenue: appServerRev,
      db_server_revenue: dbServerRev,
      active_subscriptions_count: activeSubs,
      receivables_outstanding: receivables,
      overdue_invoices_count: overdueCount,
      vendor_expenses_total: vendorExpenses,
      gst_collected_total: gstCollected,
      eligible_itc_total: eligibleItc,
      net_gst_payable: Math.max(gstCollected - eligibleItc, 0),
      last_updated: new Date().toLocaleTimeString('en-IN'),
    };
  }

  // --- Aliases and Recurring Generation ---
  async createPayment(payload: any): Promise<PaymentTransaction> {
    return this.recordPayment(payload);
  }

  async updateSubscriptionStatus(
    ref_id: number,
    status: ServerSubscription['status']
  ): Promise<ServerSubscription> {
    if (status === 'ACTIVE') return this.resumeSubscription(ref_id);
    if (status === 'PAUSED') return this.pauseSubscription(ref_id);
    if (status === 'CANCELLED') return this.cancelSubscription(ref_id);
    const subs = await this.getSubscriptions();
    const s = subs.find((x) => x.ref_id === ref_id);
    if (s) {
      s.status = status;
      this.setStorage('subscriptions', subs);
      return s;
    }
    throw new Error('Subscription not found');
  }

  async generateRecurringInvoices(): Promise<{
    generated_count: number;
    skipped_count: number;
    failed_count: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/api/v1/finance/recurring-billing/trigger`, {
        method: 'POST',
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const subs = await this.getSubscriptions();
    const activeSubs = subs.filter((s) => s.status === 'ACTIVE');
    let generated = 0;
    for (const sub of activeSubs) {
      const items = (sub.items && sub.items.length > 0)
        ? sub.items.map((it) => ({
            item_description: it.service_name || 'Hosting Server Node',
            sac_code: '998315',
            quantity: it.quantity,
            unit_price: it.unit_price,
            gst_rate: it.gst_rate ?? 18,
          }))
        : [
            {
              item_description: sub.plan_name || 'Dedicated Server Hosting',
              sac_code: '998315',
              quantity: 1,
              unit_price: sub.base_amount_monthly || 8500,
              gst_rate: 18,
            },
          ];

      await this.createInvoice({
        customer_ref_id: sub.customer_ref_id,
        billing_period_start: new Date().toISOString().split('T')[0],
        billing_period_end: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        items,
      });
      generated++;
    }

    return { generated_count: generated, skipped_count: 0, failed_count: 0 };
  }
}

export const financeClient = new FinanceClient();
