import type { ExecutiveDashboardMetrics } from '../types';

export const mockExecutiveDashboardMetrics: ExecutiveDashboardMetrics = {
  mrrDollars: 24850,
  arrDollars: 298200,
  activeTenants: 16,
  activeUsers: 342,
  retentionRatePercent: 99.2,
  platformUptimePercent: 99.99,
  revenueByPlan: [
    {
      planTier: 'Enterprise Scale',
      subscriberCount: 8,
      mrrContributionDollars: 16000,
      growthPercent: 25.0,
    },
    {
      planTier: 'Pro',
      subscriberCount: 6,
      mrrContributionDollars: 7600,
      growthPercent: 12.5,
    },
    {
      planTier: 'Starter',
      subscriberCount: 2,
      mrrContributionDollars: 1250,
      growthPercent: 10.0,
    },
  ],
  topPayingCustomers: [
    {
      tenantId: 't-acme',
      name: 'Acme Global Corporation',
      plan: 'Enterprise Scale ($999/mo)',
      mrrDollars: 2999,
      userCount: 84,
      joinedDate: '2026-01-15',
    },
    {
      tenantId: 't-fintech',
      name: 'Nexus Fintech Solutions',
      plan: 'Enterprise Scale ($999/mo)',
      mrrDollars: 2499,
      userCount: 62,
      joinedDate: '2026-02-01',
    },
    {
      tenantId: 't-cloud',
      name: 'AeroCloud Systems Inc',
      plan: 'Enterprise Scale ($999/mo)',
      mrrDollars: 1999,
      userCount: 45,
      joinedDate: '2026-03-10',
    },
  ],
  customerSummary: {
    newSignupsThisMonth: 4,
    churnRatePercent: 0.8,
    retentionRatePercent: 99.2,
    avgRevenuePerUserDollars: 72.66,
  },
  productUsage: [
    {
      feature: 'Sathus AI Gateway Model Requests',
      monthlyCount: 48920,
      growthPercent: 42.1,
      unit: 'reqs',
    },
    {
      feature: 'pgvector Full-Text Search Scans',
      monthlyCount: 42100,
      growthPercent: 28.4,
      unit: 'scans',
    },
    {
      feature: 'Celery Workflow Executions',
      monthlyCount: 1240,
      growthPercent: 15.8,
      unit: 'runs',
    },
    {
      feature: 'Notification Dispatch Engine',
      monthlyCount: 148900,
      growthPercent: 32.0,
      unit: 'msgs',
    },
  ],
};
