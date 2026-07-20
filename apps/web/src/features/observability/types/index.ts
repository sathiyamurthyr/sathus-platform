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

// Story 13.3 Enterprise Alerting & Incident Management Types

export type AlertSeverity = 'P0_CRITICAL' | 'P1_HIGH' | 'P2_MEDIUM' | 'P3_LOW';

export type AlertCategory =
  | 'metric'
  | 'error_rate'
  | 'latency'
  | 'availability'
  | 'database'
  | 'ai'
  | 'workflow';

export type IncidentStatus = 'open' | 'acknowledged' | 'investigating' | 'mitigated' | 'resolved' | 'closed';

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  condition: string;
  threshold: number;
  unit: string;
  evaluationWindowMin: number;
  cooldownMin: number;
  isEnabled: boolean;
  tenantScope?: string;
  channels: Array<'in_app' | 'email' | 'slack' | 'teams' | 'webhook'>;
}

export interface AlertInstance {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: AlertSeverity;
  status: 'firing' | 'acknowledged' | 'resolved' | 'closed';
  triggeredAt: string;
  resolvedAt?: string;
  value: number;
  threshold: number;
  affectedService: string;
  summary: string;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: IncidentStatus;
  owner: string;
  affectedServices: string[];
  relatedAlerts: string[];
  createdAt: string;
  updatedAt: string;
  mttaMinutes?: number;
  mttrMinutes?: number;
  rootCause?: string;
  timeline: IncidentTimelineEvent[];
}

export interface EscalationPolicy {
  id: string;
  name: string;
  level1: string[];
  level2: string[];
  level3: string[];
  timeoutMin: number;
}

export interface ServiceDependencyNode {
  id: string;
  name: string;
  parentServiceId?: string;
  status: ServiceHealthStatus;
  impactedByIncidentId?: string;
}
