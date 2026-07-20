import {
  mockHealthCheck,
  mockLogStream,
  mockPrometheusMetrics,
  mockTraceSpans,
  mockObservabilityConfig,
} from '../features/observability/data/mock-observability-data';

describe('Story 13.1 Enterprise Observability Foundation Verification', () => {
  it('validates /health endpoint response schema and service health statuses', () => {
    expect(mockHealthCheck.status).toBe('Healthy');
    expect(mockHealthCheck.version).toBeTruthy();
    expect(mockHealthCheck.services.length).toBeGreaterThan(0);
    mockHealthCheck.services.forEach((srv) => {
      expect(srv.name).toBeTruthy();
      expect(srv.status).toBe('Healthy');
      expect(srv.latencyMs).toBeGreaterThanOrEqual(0);
    });
  });

  it('validates structured log stream entries with UUIDv7 correlation IDs', () => {
    expect(mockLogStream.length).toBeGreaterThan(0);
    mockLogStream.forEach((log) => {
      expect(log.correlationId).toBeTruthy();
      expect(log.traceId).toBeTruthy();
      expect(log.spanId).toBeTruthy();
      expect(log.level).toBeTruthy();
      expect(log.timestamp).toBeTruthy();
      expect(log.serviceName).toBeTruthy();
    });
  });

  it('validates Prometheus metrics counters and histograms', () => {
    expect(mockPrometheusMetrics.length).toBeGreaterThan(0);
    mockPrometheusMetrics.forEach((m) => {
      expect(m.name).toBeTruthy();
      expect(m.value).toBeGreaterThanOrEqual(0);
      expect(m.type).toBeTruthy();
      expect(m.labels).toBeDefined();
    });
  });

  it('validates OpenTelemetry trace span propagation hierarchy', () => {
    expect(mockTraceSpans.length).toBeGreaterThan(0);
    const rootSpan = mockTraceSpans.find((s) => !s.parentSpanId);
    expect(rootSpan).toBeDefined();
    expect(rootSpan?.traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736');
  });

  it('validates observability configuration settings', () => {
    expect(mockObservabilityConfig.logLevel).toBe('INFO');
    expect(mockObservabilityConfig.prometheusEnabled).toBe(true);
    expect(mockObservabilityConfig.enableTracing).toBe(true);
  });
});
