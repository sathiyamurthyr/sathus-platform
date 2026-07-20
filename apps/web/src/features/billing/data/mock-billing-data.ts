import type {
  Plan,
  Subscription,
  UsageMeter,
  Invoice,
  PaymentMethod,
  BillingAccount,
} from '../types';

export const mockPlans: Plan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    tier: 'starter',
    priceMonthlyUsd: 49,
    priceAnnuallyUsd: 39,
    description: 'Essential AI, search, and project tools for early-stage engineering squads.',
    features: [
      'Up to 10 User Seats',
      '50 GB Zero-Knowledge Vault Storage',
      '1 Million AI Tokens / month',
      '100,000 API Requests / month',
      'Standard In-App Notifications',
    ],
    limits: {
      storageGb: 50,
      aiTokens: 1000000,
      apiRequests: 100000,
      userSeats: 10,
      projects: 5,
      automationRuns: 500,
    },
  },
  {
    id: 'plan-professional',
    name: 'Professional',
    tier: 'professional',
    priceMonthlyUsd: 199,
    priceAnnuallyUsd: 159,
    description: 'Advanced autonomous agents, full RAG vector retrieval, and custom workflows.',
    features: [
      'Up to 50 User Seats',
      '500 GB Storage Vault',
      '10 Million AI Tokens / month',
      '1 Million API Requests / month',
      'pgvector Full-Text Search Engine',
      '5,000 Automation Executions / month',
    ],
    limits: {
      storageGb: 500,
      aiTokens: 10000000,
      apiRequests: 1000000,
      userSeats: 50,
      projects: 25,
      automationRuns: 5000,
    },
    isPopular: true,
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Scale',
    tier: 'enterprise',
    priceMonthlyUsd: 999,
    priceAnnuallyUsd: 799,
    description: 'Mission-critical platform with SOC 2 compliance, dedicated AI Gateway, and 99.99% SLA.',
    features: [
      'Unlimited User Seats',
      '2,000 GB High-Speed Storage Vault',
      '50 Million AI Tokens / month',
      '10 Million API Requests / month',
      'Dedicated LLM Provider Gateway (OpenAI, Anthropic, Gemini, Ollama)',
      'Unlimited Workflow Executions',
      '24/7 Priority Support & Dedicated TAM',
    ],
    limits: {
      storageGb: 2000,
      aiTokens: 50000000,
      apiRequests: 10000000,
      userSeats: 1000,
      projects: 500,
      automationRuns: 100000,
    },
  },
];

export const mockSubscription: Subscription = {
  id: 'sub-88912',
  tenantId: 'sathus-prod',
  planId: 'plan-enterprise',
  planName: 'Enterprise Scale',
  tier: 'enterprise',
  status: 'active',
  billingCycle: 'annually',
  userSeats: 45,
  currentPeriodStart: '2026-01-01T00:00:00Z',
  currentPeriodEnd: '2026-12-31T23:59:59Z',
  cancelAtPeriodEnd: false,
  paymentMethodId: 'pm-101',
};

export const mockUsageMeters: UsageMeter[] = [
  {
    metric: 'ai_tokens',
    label: 'AI Gateway Tokens',
    currentUsage: 18450000,
    limit: 50000000,
    unit: 'tokens',
    status: 'normal',
  },
  {
    metric: 'storage_gb',
    label: 'Vault Storage',
    currentUsage: 420,
    limit: 2000,
    unit: 'GB',
    status: 'normal',
  },
  {
    metric: 'api_requests',
    label: 'Platform API Requests',
    currentUsage: 489200,
    limit: 10000000,
    unit: 'requests',
    status: 'normal',
  },
  {
    metric: 'automation_runs',
    label: 'Workflow Executions',
    currentUsage: 3840,
    limit: 100000,
    unit: 'runs',
    status: 'normal',
  },
  {
    metric: 'users',
    label: 'Active User Seats',
    currentUsage: 45,
    limit: 1000,
    unit: 'seats',
    status: 'normal',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-2026-001',
    number: 'INV-2026-001',
    tenantId: 'sathus-prod',
    amountUsd: 9588,
    status: 'paid',
    issueDate: '2026-01-01T00:00:00Z',
    dueDate: '2026-01-15T00:00:00Z',
    paidAt: '2026-01-02T10:14:20Z',
    pdfUrl: '/api/v1/billing/invoices/inv-2026-001/pdf',
    lineItems: [
      { description: 'Enterprise Scale Plan (Annual Subscription 2026)', amountUsd: 9588 },
    ],
  },
  {
    id: 'inv-2025-012',
    number: 'INV-2025-012',
    tenantId: 'sathus-prod',
    amountUsd: 199,
    status: 'paid',
    issueDate: '2025-12-01T00:00:00Z',
    dueDate: '2025-12-15T00:00:00Z',
    paidAt: '2025-12-01T14:22:00Z',
    pdfUrl: '/api/v1/billing/invoices/inv-2025-012/pdf',
    lineItems: [{ description: 'Professional Plan (Monthly Subscription)', amountUsd: 199 }],
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-101',
    provider: 'stripe',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2028,
    isDefault: true,
  },
  {
    id: 'pm-102',
    provider: 'razorpay',
    type: 'upi',
    upiId: 'sathus@icici',
    isDefault: false,
  },
];

export const mockBillingAccount: BillingAccount = {
  id: 'acct-301',
  tenantId: 'sathus-prod',
  companyName: 'Sathus Technology Pvt. Ltd.',
  billingEmail: 'billing@sathus.in',
  taxId: '33AAACS1234F1Z9', // GSTIN
  currency: 'USD',
  country: 'India',
  address: 'Sathus Tech Park, Financial District, Hyderabad, India',
};
