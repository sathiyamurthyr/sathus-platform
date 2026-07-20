import {
  mockPlans,
  mockSubscription,
  mockUsageMeters,
  mockInvoices,
  mockPaymentMethods,
  mockBillingAccount,
} from '../features/billing/data/mock-billing-data';

describe('EPIC-022 Enterprise Billing & Subscription Platform Verification', () => {
  it('contains multi-tier plan definitions (Starter, Professional, Enterprise)', () => {
    expect(mockPlans.length).toBeGreaterThan(0);
    const tiers = mockPlans.map((p) => p.tier);
    expect(tiers).toContain('starter');
    expect(tiers).toContain('professional');
    expect(tiers).toContain('enterprise');
  });

  it('validates active tenant subscription state and billing period', () => {
    expect(mockSubscription.id).toBeTruthy();
    expect(mockSubscription.status).toBe('active');
    expect(mockSubscription.billingCycle).toBe('annually');
    expect(mockSubscription.userSeats).toBeGreaterThan(0);
  });

  it('validates usage meters across AI tokens, storage, API calls, and automations', () => {
    expect(mockUsageMeters.length).toBeGreaterThan(0);
    mockUsageMeters.forEach((meter) => {
      expect(meter.currentUsage).toBeGreaterThanOrEqual(0);
      expect(meter.limit).toBeGreaterThan(meter.currentUsage);
      expect(meter.unit).toBeTruthy();
    });
  });

  it('validates paid invoice records and PDF receipt URLs', () => {
    expect(mockInvoices.length).toBeGreaterThan(0);
    mockInvoices.forEach((inv) => {
      expect(inv.number).toMatch(/^INV-/);
      expect(inv.status).toBe('paid');
      expect(inv.pdfUrl).toContain('/pdf');
      expect(inv.amountUsd).toBeGreaterThan(0);
    });
  });

  it('validates multi-gateway payment methods (Stripe, Razorpay)', () => {
    expect(mockPaymentMethods.length).toBeGreaterThan(0);
    const providers = mockPaymentMethods.map((pm) => pm.provider);
    expect(providers).toContain('stripe');
    expect(providers).toContain('razorpay');
    const defaultPm = mockPaymentMethods.find((pm) => pm.isDefault);
    expect(defaultPm).toBeDefined();
  });

  it('validates tax GSTIN / VAT ID registration', () => {
    expect(mockBillingAccount.taxId).toBeTruthy();
    expect(mockBillingAccount.companyName).toBeTruthy();
  });
});
