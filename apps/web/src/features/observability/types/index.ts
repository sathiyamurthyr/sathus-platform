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

// Story 13.2 Enterprise Monitoring Dashboard Types

export interface MonitoringOverview {
  healthScorePercent: number;
  status: ServiceHealthStatus;
  activeServices: number;
  totalServices: number;
  activeUsers: number;
  activeWorkspaces: number;
  activeTenants: number;
  runningJobs: number;
  totalAiRequests: number;
  totalApiRequests: number;
  errorRatePercent: number;
  uptimePercent: number;
  avgResponseTimeMs: number;
}

export interface SystemInfrastructureMetrics {
  cpuPercent: number;
  memoryPercent: number;
  diskPercent: number;
  networkInKbps: number;
  networkOutKbps: number;
  loadAverage: [number, number, number];
  dbActiveConnections: number;
  dbMaxConnections: number;
  redisMemoryMb: number;
  redisHitRatioPercent: number;
  celeryQueueDepth: number;
}

export interface TopIssueItem {
  id: string;
  title: string;
  category: 'api' | 'workflow' | 'db' | 'memory' | 'security';
  severity: 'critical' | 'high' | 'medium' | 'low';
  count: number;
  impact: string;
  timestamp: string;
  endpointOrService: string;
}

export interface ServiceGridItem {
  id: string;
  name: string;
  category: 'core' | 'ai' | 'automation' | 'data' | 'security';
  status: ServiceHealthStatus;
  responseTimeMs: number;
  uptimePercent: number;
  version: string;
  lastDeployment: string;
  lastHealthCheck: string;
}

export interface TrendPoint {
  timestamp: string;
  requests: number;
  latencyMs: number;
  errors: number;
  aiTokens: number;
  workflows: number;
}
