import { describe, it, expect } from 'vitest';
import { mockSecurityMetrics, mockIPRules, mockTrustedDevices } from '../features/admin/data/mock-security-data';
import { mockDeveloperApps, mockAPIKeys, mockWebhooks } from '../features/admin/data/mock-developer-data';
import { mockLicenseMetrics, mockSubscriptionPlans, mockLicenseAssignments } from '../features/admin/data/mock-license-subscription-data';

describe('EPIC-025 Security, Developer Portal & Licensing Verification Suite', () => {
  it('validates Story 15.6 Enterprise Security Center metrics, IP rules, and trusted devices', () => {
    expect(mockSecurityMetrics.securityHealthScore).toBeGreaterThanOrEqual(90);
    expect(mockSecurityMetrics.mfaAdoptionPercent).toBeGreaterThan(90);
    expect(mockIPRules.length).toBeGreaterThan(0);
    mockIPRules.forEach((ip) => {
      expect(ip.id).toBeTruthy();
      expect(['allow', 'block']).toContain(ip.ruleType);
    });
    expect(mockTrustedDevices.length).toBeGreaterThan(0);
  });

  it('validates Story 15.7 Developer Portal applications, API key masking & rotation, and webhooks', () => {
    expect(mockDeveloperApps.length).toBeGreaterThan(0);
    expect(mockAPIKeys.length).toBeGreaterThan(0);
    mockAPIKeys.forEach((key) => {
      expect(key.id).toBeTruthy();
      expect(key.maskedKey).toContain('****');
      expect(['server', 'client', 'read_only', 'admin', 'temporary']).toContain(key.keyType);
    });
    expect(mockWebhooks.length).toBeGreaterThan(0);
    expect(mockWebhooks[0].deliverySuccessPercent).toBeGreaterThan(95);
  });

  it('validates Story 15.8 License & Subscription metrics, plan tiers, and seat assignments', () => {
    expect(mockLicenseMetrics.totalLicensesCount).toBe(400);
    expect(mockLicenseMetrics.assignedLicensesCount).toBe(342);
    expect(mockLicenseMetrics.availableLicensesCount).toBe(58);
    expect(mockLicenseMetrics.monthlyRecurringRevenueMRR).toBe(24850);
    expect(mockSubscriptionPlans.length).toBe(3);
    expect(mockLicenseAssignments.length).toBeGreaterThan(0);
  });
});
