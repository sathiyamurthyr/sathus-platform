export type HealthStatus = 'healthy' | 'degraded' | 'critical' | 'unknown' | 'operational' | 'down';

export interface SystemMetric {
  current: number;
  unit: string;
  warningThreshold: number;
  criticalThreshold: number;
  status: 'healthy' | 'degraded' | 'critical' | 'unknown';
  formatted: string;
  detail?: string;
}

export interface ContainerTelemetry {
  name: string;
  status: string;
  cpuPercent: number;
  memoryUsageFormatted: string;
  memoryLimitFormatted: string;
  memoryPercent: number;
  networkIO: string;
}

export interface SSLCertificateInfo {
  domain: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface ServerHealthData {
  host: string;
  ip: string;
  os: string;
  kernel: string;
  uptime: string;
  loadAverage: {
    m1: number;
    m5: number;
    m15: number;
  };
  cpu: SystemMetric & { cores: number };
  ram: SystemMetric & {
    totalBytes: number;
    usedBytes: number;
    freeBytes: number;
    availableBytes: number;
    totalFormatted: string;
    usedFormatted: string;
    availableFormatted: string;
  };
  disk: SystemMetric & {
    mount: string;
    totalBytes: number;
    usedBytes: number;
    freeBytes: number;
    totalFormatted: string;
    usedFormatted: string;
    freeFormatted: string;
  };
  network: {
    inboundFormatted: string;
    outboundFormatted: string;
    status: 'healthy' | 'degraded' | 'unknown';
  };
  dockerEngine: {
    status: 'healthy' | 'degraded' | 'down' | 'unknown';
    version: string;
    activeContainersCount: number;
    totalContainersCount: number;
  };
  nginx: {
    status: 'healthy' | 'degraded' | 'down' | 'unknown';
    detail: string;
  };
  backups: {
    status: 'healthy' | 'degraded' | 'down' | 'unknown';
    lastRun: string;
    lastStatus: string;
    nextScheduled: string;
    target: string;
  };
  sslCertificates: SSLCertificateInfo[];
}

export interface SchemaTableCount {
  schema: string;
  tablesCount: number;
}

export interface SupabaseHealthData {
  projectRef: string;
  host: string;
  region: string;
  status: 'healthy' | 'degraded' | 'critical' | 'unknown';
  latencyMs: number;
  database: {
    sizeBytes: number;
    sizeFormatted: string;
    quotaBytes: number;
    quotaFormatted: string;
    quotaPercent: number;
    status: 'healthy' | 'degraded' | 'critical' | 'unknown';
    activeConnections: number;
    idleConnections: number;
    totalConnections: number;
    maxConnections: number;
    poolUtilizationPercent: number;
    version: string;
    schemaBreakdown: SchemaTableCount[];
  };
  storage: {
    usedBytes: number;
    usedFormatted: string;
    quotaBytes: number;
    quotaFormatted: string;
    quotaPercent: number;
    bucketsCount: number;
    objectsCount: number;
    status: 'healthy' | 'degraded' | 'unknown';
  };
  authentication: {
    totalUsers: number;
    activeUsers: number;
    status: 'healthy' | 'degraded' | 'unknown';
  };
  realtime: {
    status: 'healthy' | 'degraded' | 'unknown';
    activeChannelsCount: number;
  };
  billing: {
    plan: string;
    computePlan: string;
    overageStatus: 'nominal' | 'warning' | 'overage';
  };
}

export interface ServiceHealthItem {
  id: string;
  name: string;
  type: 'vps' | 'docker' | 'nginx' | 'api' | 'database' | 'auth' | 'backup' | 'ssl';
  status: 'operational' | 'degraded' | 'down' | 'unknown';
  detail: string;
  latencyMs?: number;
  endpoint?: string;
}

export interface InfrastructureAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
}

export interface InfrastructureTelemetryResponse {
  success: boolean;
  timestamp: string;
  cached: boolean;
  overallStatus: 'healthy' | 'degraded' | 'critical';
  summary: {
    totalServices: number;
    healthyCount: number;
    degradedCount: number;
    downCount: number;
    lastChecked: string;
  };
  server: ServerHealthData;
  supabase: SupabaseHealthData;
  services: ServiceHealthItem[];
  containers: ContainerTelemetry[];
  alerts: InfrastructureAlert[];
}
