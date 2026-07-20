import {
  mockTraceDetail,
  mockPerformanceHotspots,
  mockLiveRequests,
  mockSLOTargets,
  mockCapacityForecasts,
} from '../features/observability/data/mock-sre-data';

describe('Story 13.4 Distributed Tracing, Performance Profiling & SRE Operations Center Verification', () => {
  it('validates OpenTelemetry trace waterfall span hierarchy and timing', () => {
    expect(mockTraceDetail.traceId).toBeTruthy();
    expect(mockTraceDetail.correlationId).toBeTruthy();
    expect(mockTraceDetail.spans.length).toBeGreaterThan(0);
    mockTraceDetail.spans.forEach((span) => {
      expect(span.id).toBeTruthy();
      expect(span.service).toBeTruthy();
      expect(span.durationMs).toBeGreaterThan(0);
    });
  });

  it('validates API and microservice performance profiling hotspots', () => {
    expect(mockPerformanceHotspots.length).toBeGreaterThan(0);
    mockPerformanceHotspots.forEach((item) => {
      expect(item.name).toBeTruthy();
      expect(item.p95DurationMs).toBeGreaterThan(0);
      expect(item.p99DurationMs).toBeGreaterThanOrEqual(item.p95DurationMs);
    });
  });

  it('validates live request inspector active state and correlation tracking', () => {
    expect(mockLiveRequests.length).toBeGreaterThan(0);
    mockLiveRequests.forEach((req) => {
      expect(req.correlationId).toBeTruthy();
      expect(req.currentStage).toBeTruthy();
      expect(req.currentSpanService).toBeTruthy();
    });
  });

  it('validates SLO compliance targets and remaining error budget percentages', () => {
    expect(mockSLOTargets.length).toBeGreaterThan(0);
    mockSLOTargets.forEach((slo) => {
      expect(slo.name).toBeTruthy();
      expect(slo.targetPercent).toBeGreaterThan(90);
      expect(slo.errorBudgetRemainingPercent).toBeGreaterThan(0);
    });
  });

  it('validates 30-day capacity forecasting projections and recommendations', () => {
    expect(mockCapacityForecasts.length).toBeGreaterThan(0);
    mockCapacityForecasts.forEach((item) => {
      expect(item.resource).toBeTruthy();
      expect(item.currentValue).toBeTruthy();
      expect(item.projected30Days).toBeTruthy();
      expect(item.recommendation).toBeTruthy();
    });
  });
});
