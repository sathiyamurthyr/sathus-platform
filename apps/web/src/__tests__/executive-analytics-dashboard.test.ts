import { mockExecutiveDashboardMetrics } from '../features/analytics/data/mock-executive-dashboard-data';

describe('Story 14.2 Executive Analytics Dashboard Verification', () => {
  it('validates C-level revenue metrics (MRR, ARR) and growth trajectory', () => {
    expect(mockExecutiveDashboardMetrics.mrrDollars).toBeGreaterThan(0);
    expect(mockExecutiveDashboardMetrics.arrDollars).toBe(mockExecutiveDashboardMetrics.mrrDollars * 12);
    expect(mockExecutiveDashboardMetrics.activeTenants).toBeGreaterThan(0);
    expect(mockExecutiveDashboardMetrics.activeUsers).toBeGreaterThan(0);
    expect(mockExecutiveDashboardMetrics.platformUptimePercent).toBeGreaterThan(99.9);
  });

  it('validates revenue breakdown by plan tier (Enterprise, Pro, Starter)', () => {
    expect(mockExecutiveDashboardMetrics.revenueByPlan.length).toBeGreaterThan(0);
    const totalTierMrr = mockExecutiveDashboardMetrics.revenueByPlan.reduce(
      (acc, tier) => acc + tier.mrrContributionDollars,
      0
    );
    expect(totalTierMrr).toBe(24850);
  });

  it('validates top enterprise customer accounts dataset', () => {
    expect(mockExecutiveDashboardMetrics.topPayingCustomers.length).toBeGreaterThan(0);
    mockExecutiveDashboardMetrics.topPayingCustomers.forEach((cust) => {
      expect(cust.tenantId).toBeTruthy();
      expect(cust.name).toBeTruthy();
      expect(cust.mrrDollars).toBeGreaterThan(0);
    });
  });

  it('validates customer acquisition, retention %, and churn rate', () => {
    expect(mockExecutiveDashboardMetrics.customerSummary.newSignupsThisMonth).toBeGreaterThan(0);
    expect(mockExecutiveDashboardMetrics.customerSummary.retentionRatePercent).toBeGreaterThan(95.0);
    expect(mockExecutiveDashboardMetrics.customerSummary.churnRatePercent).toBeLessThan(5.0);
  });

  it('validates product usage & adoption metrics per module', () => {
    expect(mockExecutiveDashboardMetrics.productUsage.length).toBeGreaterThan(0);
    mockExecutiveDashboardMetrics.productUsage.forEach((item) => {
      expect(item.feature).toBeTruthy();
      expect(item.monthlyCount).toBeGreaterThan(0);
      expect(item.growthPercent).toBeGreaterThan(0);
    });
  });
});
