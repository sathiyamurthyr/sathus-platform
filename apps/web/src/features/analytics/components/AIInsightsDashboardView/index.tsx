'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Bot,
  Brain,
  Zap,
  AlertTriangle,
  Send,
  CheckCircle2,
  Sliders,
  Calendar,
  Layers,
  ArrowRight,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ShieldCheck,
  RefreshCw,
  Search,
  MessageSquare,
  Award,
  Clock,
  Check,
} from 'lucide-react';
import {
  mockBusinessInsights,
  mockPredictiveForecasts,
  mockAnalyticsAnomalies,
  mockCopilotQueries,
  mockAIExecutiveSummary,
} from '../../data/mock-ai-insights-data';
import type {
  BusinessInsight,
  PredictiveMetricForecast,
  ForecastHorizon,
  CopilotQueryResponse,
} from '../../types';

export function AIInsightsDashboardView() {
  const [activeTab, setActiveTab] = useState<'copilot' | 'insights' | 'forecasting' | 'anomalies' | 'briefing'>('copilot');

  // Copilot Chat State
  const [promptInput, setPromptInput] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<CopilotQueryResponse[]>(mockCopilotQueries);
  const [isAsking, setIsAsking] = useState(false);

  // Forecasting State
  const [selectedHorizon, setSelectedHorizon] = useState<ForecastHorizon>('90d');
  const [forecastList] = useState<PredictiveMetricForecast[]>(mockPredictiveForecasts);

  // Insights State
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAskCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsAsking(true);
    const query = promptInput;
    setPromptInput('');

    setTimeout(() => {
      const newResponse: CopilotQueryResponse = {
        id: `cop-${Date.now()}`,
        prompt: query,
        narrativeAnswer: `Based on platform telemetry for "${query}": Analysis indicates stable growth (+18.4% MRR) with Acme Global and FinTech Labs driving 75% of active compute utilization. Confidence score is 95%.`,
        confidenceScorePercent: 95,
        supportingChartType: 'bar',
        chartData: [
          { label: 'MRR Growth', value: 24850 },
          { label: 'AI Token Usage', value: 48920 },
          { label: 'SLA Uptime', value: 99.99 },
        ],
        recommendedDrillDowns: [
          { label: 'View Executive Dashboard', targetUrl: '/workspace/analytics' },
        ],
        timestamp: new Date().toISOString(),
      };
      setCopilotHistory((prev) => [newResponse, ...prev]);
      setIsAsking(false);
    }, 1200);
  };

  const handleExecuteAction = (action: string) => {
    setActionNotice(`Triggered action: "${action}". SRE & Analytics Engine updated.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const priorityBadges: Record<string, string> = {
    critical: 'bg-red-500/10 text-red-500 border-red-500/20',
    high: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    low: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span>AI Business Insights & Predictive Analytics</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Story 14.4 Executive AI Copilot Assistant, auto-generated insights engine, multi-horizon predictive forecasting (30d/90d/6m/12m), and anomaly detection.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
            <Brain className="w-4 h-4" />
            <span>AI Engine Online (96% Confidence)</span>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Primary Navigation Sub-Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'copilot', label: 'Executive AI Copilot (Natural Q&A)', icon: <Bot className="w-4 h-4 text-primary" /> },
          { id: 'insights', label: 'Auto-Generated Business Insights', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
          { id: 'forecasting', label: 'Predictive Analytics & Forecasts', icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
          { id: 'anomalies', label: 'Automated Anomaly Timeline', icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
          { id: 'briefing', label: 'Executive Performance Briefing', icon: <Award className="w-4 h-4 text-purple-500" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as 'copilot' | 'insights' | 'forecasting' | 'anomalies' | 'briefing')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: EXECUTIVE AI COPILOT */}
      {activeTab === 'copilot' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Natural Language Business Analytics Copilot</h3>
              <p className="text-xs text-muted-foreground">Ask any business, financial, or platform telemetry question to generate AI-backed insights and charts.</p>
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleAskCopilot} className="flex gap-3">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="e.g. What caused revenue to increase so rapidly? Or forecast AI usage for next quarter."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isAsking}
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
              >
                {isAsking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isAsking ? 'Analyzing...' : 'Ask Copilot'}</span>
              </button>
            </form>

            {/* Sample Suggested Prompts */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] font-semibold text-muted-foreground">Suggested:</span>
              {[
                'What caused revenue to increase so rapidly?',
                'Which enterprise tenants are consuming the most AI tokens?',
                'Forecast storage usage for next quarter',
                'Why did API latency increase during peak hours?',
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => setPromptInput(p)}
                  className="px-3 py-1 rounded-full text-[11px] bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Q&A Thread Feed */}
            <div className="space-y-6 pt-4 border-t border-border">
              {copilotHistory.map((item) => (
                <div key={item.id} className="p-5 rounded-xl bg-background border border-border space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span>{item.prompt}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {item.confidenceScorePercent}% Confidence
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">{item.narrativeAnswer}</p>

                  {/* Visual Supporting Chart */}
                  <div className="p-4 rounded-lg bg-card border border-border space-y-2">
                    <div className="text-[11px] font-bold text-foreground flex items-center justify-between">
                      <span>Supporting Visual Data</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{item.supportingChartType} chart</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {item.chartData.map((cd) => (
                        <div key={cd.label} className="p-3 rounded-lg bg-background border border-border space-y-1">
                          <div className="text-[10px] text-muted-foreground">{cd.label}</div>
                          <div className="text-sm font-bold font-mono text-foreground">{cd.value.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AUTO-GENERATED BUSINESS INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">AI-Generated Business Insights</h3>
            <p className="text-xs text-muted-foreground">Automated pattern recognition evaluating revenue expansion, AI token surges, and operational risks.</p>
          </div>

          <div className="space-y-4">
            {mockBusinessInsights.map((ins) => (
              <div key={ins.id} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-foreground">{ins.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${priorityBadges[ins.priority]}`}>
                        {ins.priority} Priority
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-primary uppercase">{ins.category} • {ins.confidenceScorePercent}% Confidence</span>
                  </div>

                  <span className="text-xs font-mono text-muted-foreground">{new Date(ins.createdAt).toLocaleDateString()}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{ins.summary}</p>

                {/* Supporting Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {ins.supportingMetrics.map((m) => (
                    <div key={m.label} className="p-3 rounded-lg bg-background border border-border space-y-0.5">
                      <div className="text-[10px] text-muted-foreground">{m.label}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-foreground">{m.value}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-500">{m.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended Actions */}
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="text-[11px] font-bold text-foreground">Recommended Actions:</div>
                  <div className="space-y-1.5">
                    {ins.recommendedActions.map((act) => (
                      <div key={act} className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center space-x-2">
                          <ChevronRight className="w-3.5 h-3.5 text-primary" />
                          <span>{act}</span>
                        </span>
                        <button
                          onClick={() => handleExecuteAction(act)}
                          className="px-2.5 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-semibold transition-all"
                        >
                          Execute
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PREDICTIVE ANALYTICS & FORECASTS */}
      {activeTab === 'forecasting' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Predictive Analytics & Forecasting Engine</h3>
              <p className="text-xs text-muted-foreground">Multi-horizon time-series forecasting for MRR, tenant scale, and AI consumption.</p>
            </div>

            {/* Horizon Selector */}
            <div className="flex items-center space-x-1 bg-card border border-border p-1 rounded-xl font-mono text-xs">
              {(['30d', '90d', '6m', '12m'] as ForecastHorizon[]).map((hz) => (
                <button
                  key={hz}
                  onClick={() => setSelectedHorizon(hz)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedHorizon === hz ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {hz}
                </button>
              ))}
            </div>
          </div>

          {/* Forecast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forecastList.map((fc) => (
              <div key={fc.metricKey} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{fc.metricName}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold font-mono text-foreground">
                      {fc.unit === '$' ? `$${fc.projectedValue.toLocaleString()}` : fc.projectedValue.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-500">+{fc.growthPercent}% ({fc.horizon})</span>
                  </div>
                </div>

                <div className="h-28 rounded-lg bg-background border border-border flex items-center justify-center text-xs text-muted-foreground font-mono">
                  [ Forecast Curve: {fc.metricKey} ({fc.horizon}) ]
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Current: {fc.unit === '$' ? `$${fc.currentValue}` : fc.currentValue}</span>
                  <span>Confidence: <strong className="text-foreground">{fc.confidenceScorePercent}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AUTOMATED ANOMALY TIMELINE */}
      {activeTab === 'anomalies' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Automated Telemetry Anomaly Timeline</h3>
            <p className="text-xs text-muted-foreground">Real-time detection of revenue spikes, latency drift, and billing anomalies.</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {mockAnalyticsAnomalies.map((anom) => (
              <div key={anom.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-foreground">{anom.metricName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${priorityBadges[anom.severity]}`}>
                      {anom.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{anom.rootCauseSummary}</p>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono shrink-0">
                  <span className="text-red-500 font-bold">+{anom.deviationPercent}% deviation</span>
                  <button
                    onClick={() => handleExecuteAction(`Resolve Anomaly ${anom.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: EXECUTIVE PERFORMANCE BRIEFING */}
      {activeTab === 'briefing' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">{mockAIExecutiveSummary.period}</h3>
                <p className="text-xs text-muted-foreground">AI-generated summary briefing compiled on {new Date(mockAIExecutiveSummary.generatedAt).toLocaleDateString()}</p>
              </div>

              <button
                onClick={() => handleExecuteAction('Email Executive Briefing to C-Suite')}
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Briefing to Board</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary leading-relaxed">
              {mockAIExecutiveSummary.executiveHeadline}
            </div>

            <div className="space-y-3">
              {mockAIExecutiveSummary.summaryParagraphs.map((p, idx) => (
                <p key={idx} className="text-xs text-muted-foreground leading-relaxed">{p}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-500 flex items-center space-x-1.5">
                  <Check className="w-4 h-4" />
                  <span>Key Wins</span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {mockAIExecutiveSummary.keyWins.map((w) => <li key={w}>• {w}</li>)}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-500 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Risk Alerts</span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {mockAIExecutiveSummary.riskAlerts.map((r) => <li key={r}>• {r}</li>)}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-primary flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Growth Opportunities</span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {mockAIExecutiveSummary.growthOpportunities.map((g) => <li key={g}>• {g}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
