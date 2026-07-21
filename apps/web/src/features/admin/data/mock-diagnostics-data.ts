import type { PlatformHealthMetric, ServiceDependencyHealth, ProductionReadinessCheck } from '../types';

export const mockLiveHealthMetrics: PlatformHealthMetric = {
  cpuUsagePercent: 24.2,
  memoryUsagePercent: 42.8,
  diskUsagePercent: 28.4,
  networkInboundMbps: 145.2,
  networkOutboundMbps: 380.6,
  activeDbConnections: 48,
  redisMemoryMB: 512,
  apiRequestsPerSec: 1240,
};

export const mockDependenciesHealth: ServiceDependencyHealth[] = [
  {
    id: 'dep-1',
    name: 'PostgreSQL 16 Multi-Tenant DB Cluster',
    category: 'database',
    status: 'healthy',
    latencyMs: 4.2,
    uptimePercent: 99.99,
    lastCheckedAt: '2026-07-21T18:30:00Z',
  },
  {
    id: 'dep-2',
    name: 'Redis 7.2 L2 Cache & Session Store',
    category: 'cache',
    status: 'healthy',
    latencyMs: 0.8,
    uptimePercent: 100,
    lastCheckedAt: '2026-07-21T18:30:00Z',
  },
  {
    id: 'dep-3',
    name: 'Claude 3.5 Sonnet / OpenAI AI Gateway',
    category: 'ai_provider',
    status: 'healthy',
    latencyMs: 180.5,
    uptimePercent: 99.95,
    lastCheckedAt: '2026-07-21T18:30:00Z',
  },
  {
    id: 'dep-4',
    name: 'AWS S3 Dedicated Object Storage',
    category: 'storage',
    status: 'healthy',
    latencyMs: 12.4,
    uptimePercent: 99.99,
    lastCheckedAt: '2026-07-21T18:30:00Z',
  },
  {
    id: 'dep-5',
    name: 'OpenSearch HNSW Vector Index Engine',
    category: 'search',
    status: 'healthy',
    latencyMs: 8.1,
    uptimePercent: 99.98,
    lastCheckedAt: '2026-07-21T18:30:00Z',
  },
  {
    id: 'dep-6',
    name: 'Celery / RQ Asynchronous Queue Workers',
    category: 'workers',
    status: 'healthy',
    latencyMs: 1.5,
    uptimePercent: 100,
    lastCheckedAt: '2026-07-21T18:30:00Z',
  },
];

export const mockProductionReadinessChecks: ProductionReadinessCheck[] = [
  { id: 'chk-1', category: 'security', title: 'Mandatory MFA Policy Active for Admins', status: 'passed', details: 'Enforced across all Platform and Tenant Admins.' },
  { id: 'chk-2', category: 'database', title: 'PostgreSQL 16 Connection Pooling & Vacuum', status: 'passed', details: 'pgBouncer active with vacuum scheduled.' },
  { id: 'chk-3', category: 'backup', title: 'Point-in-Time Restore & Secondary Region DR', status: 'passed', details: 'RPO < 5 mins, RTO < 15 mins validated.' },
  { id: 'chk-4', category: 'performance', title: 'Next.js 15 Static Route Compilation (80/80)', status: 'passed', details: '80 static routes compiled with 0 errors.' },
];
