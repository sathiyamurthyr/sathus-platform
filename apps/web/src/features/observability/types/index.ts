// Story 13.1 Enterprise Observability Foundation Domain Types

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type ServiceHealthStatus = 'Healthy' | 'Degraded' | 'Unhealthy';

export interface LogEntry {
  id: string;
  timestamp: string;
  environment: string;
  serviceName: string;
  serviceVersion: string;
  level: LogLevel;
  correlationId: string;
  traceId: string;
  spanId: string;
  requestId: string;
  tenantId?: string;
  workspaceId?: string;
  userId?: string;
  httpMethod: string;
  path: string;
  statusCode: number;
  executionTimeMs: number;
  host: string;
  ipAddress: string;
  userAgent: string;
  module: string;
  functionName: string;
  message: string;
  stackTrace?: string;
}

export interface ServiceHealthItem {
  name: string;
  status: ServiceHealthStatus;
  latencyMs: number;
  details?: string;
  lastChecked: string;
}

export interface HealthCheckResult {
  status: ServiceHealthStatus;
  version: string;
  uptime: string;
  timestamp: string;
  services: ServiceHealthItem[];
}

export interface MetricCounter {
  name: string;
  value: number;
  unit: string;
  type: 'counter' | 'gauge' | 'histogram';
  labels: Record<string, string>;
}

export interface TraceSpan {
  id: string;
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  service: string;
  durationMs: number;
  status: 'ok' | 'error';
  attributes: Record<string, string>;
}

export interface ObservabilityConfig {
  logLevel: LogLevel;
  logFormat: 'json' | 'pretty';
  enableLogging: boolean;
  enableMetrics: boolean;
  enableTracing: boolean;
  enableHealth: boolean;
  prometheusEnabled: boolean;
  otelEndpoint: string;
  serviceName: string;
  serviceVersion: string;
  environment: string;
}
