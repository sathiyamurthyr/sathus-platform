import type {
  BusinessInsight,
  PredictiveMetricForecast,
  AnalyticsAnomaly,
  CopilotQueryResponse,
  AIExecutiveSummary,
} from '../types';

export const mockBusinessInsights: BusinessInsight[] = [
  {
    id: 'ins-101',
    title: 'Enterprise Tier MRR Expansion Surge',
    summary: 'MRR increased by 18.4% over the last 30 days, driven primarily by 3 Enterprise Scale tier upgrades in FinTech and Healthcare verticals.',
    category: 'revenue',
    priority: 'high',
    confidenceScorePercent: 96,
    businessImpact: 'high_positive',
    supportingMetrics: [
      { label: 'MRR Growth', value: '+$3,850', change: '+18.4%' },
      { label: 'Enterprise Accounts', value: '6', change: '+50.0%' },
    ],
    recommendedActions: [
      'Expand dedicated account management for Top 5 Enterprise tenants.',
      'Promote annual pre-payment discounts to locked-in Pro accounts.',
    ],
    createdAt: '2026-07-20T09:30:00Z',
  },
  {
    id: 'ins-102',
    title: 'AI Gateway Token Volume Spike',
    summary: 'LLM token usage increased by 42.1% across workspace RAG agents, reaching 48.9k total invocations. High demand observed for GPT-4o and Claude 3.5 Sonnet.',
    category: 'ai_usage',
    priority: 'high',
    confidenceScorePercent: 94,
    businessImpact: 'high_positive',
    supportingMetrics: [
      { label: 'Monthly AI Token Calls', value: '48,920', change: '+42.1%' },
      { label: 'Avg Latency', value: '185ms', change: '-12.0%' },
    ],
    recommendedActions: [
      'Increase Redis semantic cache TTL for repeated RAG queries.',
      'Implement rate-limiting controls for starter tier tenants.',
    ],
    createdAt: '2026-07-19T14:15:00Z',
  },
  {
    id: 'ins-103',
    title: 'Workflow Step Failure Anomaly Detected',
    summary: 'Workflow execution retries increased by 6.2% on third-party webhook integrations during peak trading hours.',
    category: 'automation',
    priority: 'medium',
    confidenceScorePercent: 89,
    businessImpact: 'moderate_risk',
    supportingMetrics: [
      { label: 'Failed Steps', value: '14', change: '+6.2%' },
      { label: 'Retry Success Rate', value: '98.5%', change: '-1.2%' },
    ],
    recommendedActions: [
      'Enable automatic exponential backoff for partner API Webhook calls.',
      'Notify SRE operations squad of webhook latency drift.',
    ],
    createdAt: '2026-07-18T11:00:00Z',
  },
];

export const mockPredictiveForecasts: PredictiveMetricForecast[] = [
  {
    metricKey: 'mrr_dollars',
    metricName: 'Monthly Recurring Revenue (MRR)',
    unit: '$',
    horizon: '90d',
    currentValue: 24850,
    projectedValue: 34200,
    growthPercent: 37.6,
    confidenceScorePercent: 92,
    forecastPoints: [
      { date: '2026-07-01', projectedValue: 24850, lowerBound: 24850, upperBound: 24850 },
      { date: '2026-08-01', projectedValue: 27900, lowerBound: 26500, upperBound: 29300 },
      { date: '2026-09-01', projectedValue: 31100, lowerBound: 29200, upperBound: 33000 },
      { date: '2026-10-01', projectedValue: 34200, lowerBound: 31800, upperBound: 36600 },
    ],
  },
  {
    metricKey: 'active_tenants',
    metricName: 'Active Enterprise Tenants',
    unit: 'tenants',
    horizon: '90d',
    currentValue: 16,
    projectedValue: 24,
    growthPercent: 50.0,
    confidenceScorePercent: 95,
    forecastPoints: [
      { date: '2026-07-01', projectedValue: 16, lowerBound: 16, upperBound: 16 },
      { date: '2026-08-01', projectedValue: 19, lowerBound: 18, upperBound: 20 },
      { date: '2026-09-01', projectedValue: 21, lowerBound: 20, upperBound: 23 },
      { date: '2026-10-01', projectedValue: 24, lowerBound: 22, upperBound: 26 },
    ],
  },
  {
    metricKey: 'ai_tokens',
    metricName: 'AI Token Request Volume',
    unit: 'calls',
    horizon: '90d',
    currentValue: 48920,
    projectedValue: 85000,
    growthPercent: 73.7,
    confidenceScorePercent: 90,
    forecastPoints: [
      { date: '2026-07-01', projectedValue: 48920, lowerBound: 48920, upperBound: 48920 },
      { date: '2026-08-01', projectedValue: 61000, lowerBound: 57000, upperBound: 65000 },
      { date: '2026-09-01', projectedValue: 73000, lowerBound: 68000, upperBound: 78000 },
      { date: '2026-10-01', projectedValue: 85000, lowerBound: 78000, upperBound: 92000 },
    ],
  },
];

export const mockAnalyticsAnomalies: AnalyticsAnomaly[] = [
  {
    id: 'anom-301',
    metricName: 'API Latency P99 Spike',
    category: 'infrastructure',
    severity: 'warning',
    detectedAt: '2026-07-20T08:45:00Z',
    expectedValue: 120,
    actualValue: 285,
    deviationPercent: 137.5,
    rootCauseSummary: 'Transient PostgreSQL connection pool exhaustion during concurrent analytics batch query processing.',
    status: 'active',
  },
  {
    id: 'anom-302',
    metricName: 'Billing Upgrade Spike',
    category: 'billing',
    severity: 'info',
    detectedAt: '2026-07-19T16:20:00Z',
    expectedValue: 2,
    actualValue: 5,
    deviationPercent: 150.0,
    rootCauseSummary: 'Unusually high enterprise plan conversions following product demo webinar.',
    status: 'acknowledged',
  },
];

export const mockCopilotQueries: CopilotQueryResponse[] = [
  {
    id: 'cop-1',
    prompt: 'What caused revenue to increase so rapidly over the last month?',
    narrativeAnswer: 'Revenue increased by 18.4% (MRR reached $24,850) due to 3 Enterprise Scale tier conversions (Acme Global, FinTech Labs, BioHealth AI) and a 42% surge in AI Gateway billable token usage.',
    confidenceScorePercent: 96,
    supportingChartType: 'bar',
    chartData: [
      { label: 'Enterprise Plan', value: 16000 },
      { label: 'Pro Plan', value: 7600 },
      { label: 'Starter Plan', value: 1250 },
    ],
    recommendedDrillDowns: [
      { label: 'View Revenue Breakdown', targetUrl: '/workspace/analytics' },
      { label: 'View Enterprise Billing', targetUrl: '/workspace/billing' },
    ],
    timestamp: '2026-07-20T10:00:00Z',
  },
  {
    id: 'cop-2',
    prompt: 'Which enterprise tenants are consuming the most AI tokens?',
    narrativeAnswer: 'Acme Global Corp leads AI token consumption with 18.4k requests (37.6% of total), followed by FinTech Labs (12.1k requests) and Healthcare Systems (8.5k requests).',
    confidenceScorePercent: 94,
    supportingChartType: 'pie',
    chartData: [
      { label: 'Acme Global Corp', value: 18400 },
      { label: 'FinTech Labs', value: 12100 },
      { label: 'Healthcare Systems', value: 8500 },
      { label: 'Others', value: 9920 },
    ],
    recommendedDrillDowns: [
      { label: 'View AI Gateway Telemetry', targetUrl: '/workspace/ai' },
    ],
    timestamp: '2026-07-20T10:05:00Z',
  },
];

export const mockAIExecutiveSummary: AIExecutiveSummary = {
  period: 'July 2026 Executive Performance Briefing',
  generatedAt: '2026-07-20T07:00:00Z',
  executiveHeadline: 'Sathus Cloud platform growth accelerates with 18.4% MRR expansion, 99.99% operational SLA uptime, and zero security compliance incidents.',
  summaryParagraphs: [
    'Platform revenue reached $24,850 MRR ($298,200 ARR), representing an 18.4% month-over-month growth. Enterprise Scale customer retention stands at 99.2% with zero customer churn this quarter.',
    'AI Platform adoption doubled with 48.9k API requests processed across vector retrieval and LLM agent workflows, maintaining an average response latency of 185ms.',
    'Infrastructure SLA targets were fully maintained at 99.99% uptime with Redis 7.2 semantic cache hit ratio exceeding 96.4%.',
  ],
  keyWins: [
    'MRR reached $24,850 (+18.4% YoY)',
    'Customer Retention rate sustained at 99.2%',
    'Zero critical security incidents or compliance breaches',
  ],
  riskAlerts: [
    'Database connection pool P99 latency drift during analytics batch queries',
    'Third-party Webhook endpoint retry rate increased by 6.2%',
  ],
  growthOpportunities: [
    'Cross-sell AI Agent workflows to existing Pro tier subscribers',
    'Expand annual enterprise contract locks before Q4 billing cycle',
  ],
};
