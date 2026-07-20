import {
  mockMonitoringOverview,
  mockSystemInfrastructure,
  mockTopIssues,
  mockServicesGrid,
  mockTrendPoints,
} from '../features/observability/data/mock-monitoring-data';

describe('Story 13.2 Enterprise Monitoring Dashboard Verification', () => {
  it('validates overall platform health score and active scale metrics', () => {
    expect(mockMonitoringOverview.healthScorePercent).toBeGreaterThan(99.0);
    expect(mockMonitoringOverview.status).toBe('Healthy');
    expect(mockMonitoringOverview.activeTenants).toBeGreaterThan(0);
    expect(mockMonitoringOverview.activeUsers).toBeGreaterThan(0);
    expect(mockMonitoringOverview.uptimePercent).toBeGreaterThan(99.9);
  });

  it('validates infrastructure resource gauges (CPU, Memory, DB pool, Redis)', () => {
    expect(mockSystemInfrastructure.cpuPercent).toBeGreaterThan(0);
    expect(mockSystemInfrastructure.memoryPercent).toBeGreaterThan(0);
    expect(mockSystemInfrastructure.dbActiveConnections).toBeLessThanOrEqual(mockSystemInfrastructure.dbMaxConnections);
    expect(mockSystemInfrastructure.redisHitRatioPercent).toBeGreaterThan(95.0);
  });

  it('validates top operational issues panel dataset', () => {
    expect(mockTopIssues.length).toBeGreaterThan(0);
    mockTopIssues.forEach((issue) => {
      expect(issue.id).toBeTruthy();
      expect(issue.title).toBeTruthy();
      expect(issue.severity).toBeTruthy();
      expect(issue.endpointOrService).toBeTruthy();
    });
  });

  it('validates microservices status grid entries', () => {
    expect(mockServicesGrid.length).toBeGreaterThan(0);
    mockServicesGrid.forEach((srv) => {
      expect(srv.name).toBeTruthy();
      expect(srv.status).toBe('Healthy');
      expect(srv.responseTimeMs).toBeGreaterThan(0);
      expect(srv.uptimePercent).toBeGreaterThan(99);
    });
  });

  it('validates 24-hour performance trend data series', () => {
    expect(mockTrendPoints.length).toBeGreaterThan(0);
    mockTrendPoints.forEach((point) => {
      expect(point.timestamp).toBeTruthy();
      expect(point.requests).toBeGreaterThan(0);
      expect(point.latencyMs).toBeGreaterThan(0);
    });
  });
});
