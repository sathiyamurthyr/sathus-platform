import {
  mockBusinessInsights,
  mockPredictiveForecasts,
  mockAnalyticsAnomalies,
  mockCopilotQueries,
  mockAIExecutiveSummary,
} from '../features/analytics/data/mock-ai-insights-data';

describe('Story 14.4 AI-Powered Business Insights & Predictive Analytics Verification', () => {
  it('validates auto-generated business insights confidence scoring and supporting metrics', () => {
    expect(mockBusinessInsights.length).toBeGreaterThan(0);
    mockBusinessInsights.forEach((ins) => {
      expect(ins.id).toBeTruthy();
      expect(ins.title).toBeTruthy();
      expect(ins.category).toBeTruthy();
      expect(ins.priority).toBeTruthy();
      expect(ins.confidenceScorePercent).toBeGreaterThanOrEqual(80);
      expect(ins.supportingMetrics.length).toBeGreaterThan(0);
      expect(ins.recommendedActions.length).toBeGreaterThan(0);
    });
  });

  it('validates multi-horizon predictive forecasting curves and growth rates', () => {
    expect(mockPredictiveForecasts.length).toBeGreaterThan(0);
    mockPredictiveForecasts.forEach((fc) => {
      expect(fc.metricKey).toBeTruthy();
      expect(fc.metricName).toBeTruthy();
      expect(fc.horizon).toBeTruthy();
      expect(fc.projectedValue).toBeGreaterThan(fc.currentValue);
      expect(fc.growthPercent).toBeGreaterThan(0);
      expect(fc.forecastPoints.length).toBeGreaterThan(0);
    });
  });

  it('validates automated telemetry anomaly detection feed and root-cause summaries', () => {
    expect(mockAnalyticsAnomalies.length).toBeGreaterThan(0);
    mockAnalyticsAnomalies.forEach((anom) => {
      expect(anom.id).toBeTruthy();
      expect(anom.metricName).toBeTruthy();
      expect(anom.deviationPercent).toBeGreaterThan(0);
      expect(anom.rootCauseSummary).toBeTruthy();
      expect(['active', 'acknowledged', 'resolved']).toContain(anom.status);
    });
  });

  it('validates Executive AI Copilot Q&A prompt narrative answers and chart data', () => {
    expect(mockCopilotQueries.length).toBeGreaterThan(0);
    mockCopilotQueries.forEach((cop) => {
      expect(cop.prompt).toBeTruthy();
      expect(cop.narrativeAnswer).toBeTruthy();
      expect(cop.confidenceScorePercent).toBeGreaterThanOrEqual(90);
      expect(cop.chartData.length).toBeGreaterThan(0);
    });
  });

  it('validates AI Executive Summary briefing structure', () => {
    expect(mockAIExecutiveSummary.period).toBeTruthy();
    expect(mockAIExecutiveSummary.executiveHeadline).toBeTruthy();
    expect(mockAIExecutiveSummary.summaryParagraphs.length).toBeGreaterThan(0);
    expect(mockAIExecutiveSummary.keyWins.length).toBeGreaterThan(0);
    expect(mockAIExecutiveSummary.riskAlerts.length).toBeGreaterThan(0);
    expect(mockAIExecutiveSummary.growthOpportunities.length).toBeGreaterThan(0);
  });
});
