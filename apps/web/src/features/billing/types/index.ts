// EPIC-022 Enterprise Billing & Subscription Domain Types

export type PlanTier = 'starter' | 'professional' | 'enterprise' | 'custom';

export type BillingCycle = 'monthly' | 'annually';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export type PaymentProvider = 'stripe' | 'razorpay' | 'custom_invoice';

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  priceMonthlyUsd: number;
  priceAnnuallyUsd: number;
  description: string;
  features: string[];
  limits: {
    storageGb: number;
    aiTokens: number;
    apiRequests: number;
    userSeats: number;
    projects: number;
    automationRuns: number;
  };
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  planName: string;
  tier: PlanTier;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  userSeats: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethodId: string;
}

export interface UsageMeter {
  metric: 'storage_gb' | 'ai_tokens' | 'api_requests' | 'users' | 'projects' | 'automation_runs';
  label: string;
  currentUsage: number;
  limit: number;
  unit: string;
  status: 'normal' | 'warning' | 'exceeded';
}

export interface Invoice {
  id: string;
  number: string;
  tenantId: string;
  amountUsd: number;
  status: 'paid' | 'open' | 'void';
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  pdfUrl: string;
  lineItems: Array<{ description: string; amountUsd: number }>;
}

export interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  type: 'card' | 'upi' | 'wire';
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  upiId?: string;
  isDefault: boolean;
}

export interface BillingAccount {
  id: string;
  tenantId: string;
  companyName: string;
  billingEmail: string;
  taxId?: string; // GSTIN or VAT ID
  currency: string;
  country: string;
  address: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  validUntil: string;
  description: string;
}
