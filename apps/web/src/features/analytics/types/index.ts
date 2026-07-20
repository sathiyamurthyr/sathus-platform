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
