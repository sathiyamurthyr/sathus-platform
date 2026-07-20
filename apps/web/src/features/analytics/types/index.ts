// Story 14.1 Enterprise Analytics Platform Foundation Types

export type AggregationPeriod = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export type KPICategory =
  | 'user_growth'
  | 'tenant_scale'
  | 'revenue'
  | 'ai_usage'
  | 'automation'
  | 'search'
  | 'storage'
  | 'system_health';

export interface KPIDefinition {
  id: string;
  name: string;
  category: KPICategory;
  currentValue: number;
  previousValue: number;
  unit: string;
  changePercent: number;
  isPositiveGood: boolean;
  targetValue?: number;
  description: string;
}

export interface TimeSeriesDataPoint {
  period: string;
  activeUsers: number;
  mrrDollars: number;
  aiRequests: number;
  workflowExecutions: number;
  searchQueries: number;
  errorRatePercent: number;
}

export type WidgetType = 'kpi_card' | 'line_chart' | 'bar_chart' | 'pie_chart' | 'area_chart' | 'table';

export interface AnalyticsWidgetConfig {
  id: string;
  title: string;
  type: WidgetType;
  metric: string;
  period: AggregationPeriod;
  size: 'small' | 'medium' | 'large' | 'full';
}

export interface AnalyticsCacheStatus {
  isEnabled: boolean;
  ttlSeconds: number;
  hitRatioPercent: number;
  totalCachedEntries: number;
  lastInvalidated: string;
}

export interface AnalyticsQueryFilter {
  tenantId?: string;
  workspaceId?: string;
  period: AggregationPeriod;
  startDate?: string;
  endDate?: string;
}

export interface ExecutiveAnalyticsOverview {
  totalMrrDollars: number;
  mrrGrowthPercent: number;
  totalActiveUsers: number;
  userGrowthPercent: number;
  totalActiveTenants: number;
  tenantGrowthPercent: number;
  totalAiTokensFormatted: string;
  cacheStatus: AnalyticsCacheStatus;
}

// Story 14.2 Executive Analytics Dashboard Types

export interface RevenueByPlan {
  planTier: 'Starter' | 'Pro' | 'Enterprise Scale';
  subscriberCount: number;
  mrrContributionDollars: number;
  growthPercent: number;
}

export interface TopPayingCustomer {
  tenantId: string;
  name: string;
  plan: string;
  mrrDollars: number;
  userCount: number;
  joinedDate: string;
}

export interface CustomerAnalyticsSummary {
  newSignupsThisMonth: number;
  churnRatePercent: number;
  retentionRatePercent: number;
  avgRevenuePerUserDollars: number;
}

export interface ProductUsageItem {
  feature: string;
  monthlyCount: number;
  growthPercent: number;
  unit: string;
}

export interface ExecutiveDashboardMetrics {
  mrrDollars: number;
  arrDollars: number;
  activeTenants: number;
  activeUsers: number;
  retentionRatePercent: number;
  platformUptimePercent: number;
  revenueByPlan: RevenueByPlan[];
  topPayingCustomers: TopPayingCustomer[];
  customerSummary: CustomerAnalyticsSummary;
  productUsage: ProductUsageItem[];
}
