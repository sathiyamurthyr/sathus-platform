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

// Story 14.3 Enterprise Report Builder & Scheduled Reporting Types

export type ReportExportFormat = 'pdf' | 'xlsx' | 'csv' | 'json';

export type ReportDistributionChannel = 'email' | 'in_app' | 'download' | 'webhook';

export type ReportScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly';

export type ReportStatus = 'draft' | 'published' | 'archived';

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  widgetIds: string[];
  defaultFormat: ReportExportFormat;
  isBuiltIn: boolean;
}

export interface ReportSchedule {
  id: string;
  frequency: ReportScheduleFrequency;
  cronExpression: string;
  timeZone: string;
  recipients: string[];
  channels: ReportDistributionChannel[];
  lastExecutedAt?: string;
  nextExecutionAt: string;
  isEnabled: boolean;
}

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: ReportStatus;
  templateId?: string;
  widgets: AnalyticsWidgetConfig[];
  schedule?: ReportSchedule;
  version: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
}

export interface ReportExecutionHistory {
  id: string;
  reportId: string;
  reportTitle: string;
  executedAt: string;
  format: ReportExportFormat;
  status: 'success' | 'failed';
  fileSizeBytes: number;
  deliveryChannel: ReportDistributionChannel;
  downloadUrl: string;
}

// Story 14.4 AI-Powered Business Insights & Predictive Analytics Types

export type InsightCategory =
  | 'revenue'
  | 'customers'
  | 'ai_usage'
  | 'automation'
  | 'infrastructure'
  | 'billing'
  | 'search';

export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';

export interface BusinessInsight {
  id: string;
  title: string;
  summary: string;
  category: InsightCategory;
  priority: InsightPriority;
  confidenceScorePercent: number;
  businessImpact: 'high_positive' | 'moderate_positive' | 'high_risk' | 'moderate_risk';
  supportingMetrics: { label: string; value: string; change: string }[];
  recommendedActions: string[];
  createdAt: string;
}

export type ForecastHorizon = '30d' | '90d' | '6m' | '12m';

export interface PredictiveForecastPoint {
  date: string;
  projectedValue: number;
  lowerBound: number;
  upperBound: number;
}

export interface PredictiveMetricForecast {
  metricKey: string;
  metricName: string;
  unit: string;
  horizon: ForecastHorizon;
  currentValue: number;
  projectedValue: number;
  growthPercent: number;
  confidenceScorePercent: number;
  forecastPoints: PredictiveForecastPoint[];
}

export interface AnalyticsAnomaly {
  id: string;
  metricName: string;
  category: InsightCategory;
  severity: 'critical' | 'warning' | 'info';
  detectedAt: string;
  expectedValue: number;
  actualValue: number;
  deviationPercent: number;
  rootCauseSummary: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface CopilotQueryResponse {
  id: string;
  prompt: string;
  narrativeAnswer: string;
  confidenceScorePercent: number;
  supportingChartType: 'line' | 'bar' | 'pie' | 'metric_card';
  chartData: { label: string; value: number }[];
  recommendedDrillDowns: { label: string; targetUrl: string }[];
  timestamp: string;
}

export interface AIExecutiveSummary {
  period: string;
  generatedAt: string;
  executiveHeadline: string;
  summaryParagraphs: string[];
  keyWins: string[];
  riskAlerts: string[];
  growthOpportunities: string[];
}

