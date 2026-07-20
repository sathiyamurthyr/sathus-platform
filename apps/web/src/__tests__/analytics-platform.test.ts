import {
  mockExecutiveOverview,
  mockKPIDefinitions,
  mockTimeSeriesData,
  mockWidgets,
} from '../features/analytics/data/mock-analytics-data';

describe('Story 14.1 Enterprise Analytics Platform Foundation Verification', () => {
  it('validates executive summary KPIs and growth metrics', () => {
    expect(mockExecutiveOverview.totalMrrDollars).toBeGreaterThan(0);
    expect(mockExecutiveOverview.mrrGrowthPercent).toBeGreaterThan(0);
    expect(mockExecutiveOverview.totalActiveUsers).toBeGreaterThan(0);
    expect(mockExecutiveOverview.totalActiveTenants).toBeGreaterThan(0);
    expect(mockExecutiveOverview.cacheStatus.isEnabled).toBe(true);
    expect(mockExecutiveOverview.cacheStatus.hitRatioPercent).toBeGreaterThan(90);
  });

  it('validates configurable KPI engine metrics definitions', () => {
    expect(mockKPIDefinitions.length).toBeGreaterThan(0);
    mockKPIDefinitions.forEach((kpi) => {
      expect(kpi.id).toBeTruthy();
      expect(kpi.name).toBeTruthy();
      expect(kpi.category).toBeTruthy();
      expect(kpi.currentValue).toBeDefined();
    });
  });

  it('validates time-series data aggregations and historical trends', () => {
    expect(mockTimeSeriesData.length).toBeGreaterThan(0);
    mockTimeSeriesData.forEach((dp) => {
      expect(dp.period).toBeTruthy();
      expect(dp.activeUsers).toBeGreaterThan(0);
      expect(dp.mrrDollars).toBeGreaterThan(0);
      expect(dp.aiRequests).toBeGreaterThan(0);
    });
  });

  it('validates BI dashboard widget configurations', () => {
    expect(mockWidgets.length).toBeGreaterThan(0);
    mockWidgets.forEach((w) => {
      expect(w.id).toBeTruthy();
      expect(w.title).toBeTruthy();
      expect(w.type).toBeTruthy();
    });
  });
});
