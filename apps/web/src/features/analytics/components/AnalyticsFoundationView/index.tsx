'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Database,
  Users,
  Building2,
  DollarSign,
  Bot,
  Workflow,
  Sliders,
  RefreshCw,
  Search,
  Zap,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  Plus,
  Filter,
  Download,
  Calendar,
} from 'lucide-react';
import {
  mockExecutiveOverview,
  mockKPIDefinitions,
  mockTimeSeriesData,
  mockWidgets,
} from '../../data/mock-analytics-data';
import type { KPIDefinition, AggregationPeriod } from '../../types';

import { Crown, FileSpreadsheet, Sparkles } from 'lucide-react';
import { ExecutiveAnalyticsDashboardView } from '../ExecutiveAnalyticsDashboardView';
import { ReportBuilderPlatformView } from '../ReportBuilderPlatformView';
import { AIInsightsDashboardView } from '../AIInsightsDashboardView';

export function AnalyticsFoundationView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai_insights' | 'reports' | 'kpis' | 'timeseries' | 'widgets' | 'cache'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<AggregationPeriod>('month');
  const [kpiList, setKpiList] = useState<KPIDefinition[]>(mockKPIDefinitions);
  const [notice, setNotice] = useState<string | null>(null);

  const handleClearCache = () => {
    setNotice('Redis analytics cache invalidated successfully. Fresh metrics aggregated.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span>Enterprise Analytics & BI Platform</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Story 14.1 Foundation, 14.2 Executive Dashboard, 14.3 Visual Report Builder, and 14.4 AI Business Insights & Predictive Analytics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleClearCache}
            className="inline-flex items-center space-x-1.5 bg-card border border-border px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-muted/40 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'overview', label: 'Executive BI Overview', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'ai_insights', label: 'AI Insights & Copilot', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
          { id: 'reports', label: 'Visual Report Builder', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> },
          { id: 'kpis', label: 'Configurable KPI Engine', icon: <Sliders className="w-4 h-4" /> },
          { id: 'timeseries', label: 'Time-Series Aggregation', icon: <Clock className="w-4 h-4" /> },
          { id: 'widgets', label: 'Widget Visualizer Gallery', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'cache', label: 'Redis Cache & Security', icon: <Database className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as 'overview' | 'ai_insights' | 'reports' | 'kpis' | 'timeseries' | 'widgets' | 'cache')}
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

      {/* TAB 1: EXECUTIVE BI OVERVIEW */}
      {activeTab === 'overview' && (
        <ExecutiveAnalyticsDashboardView />
      )}

      {/* TAB 2: AI INSIGHTS & COPILOT */}
      {activeTab === 'ai_insights' && (
        <AIInsightsDashboardView />
      )}

      {/* TAB 3: VISUAL REPORT BUILDER */}
      {activeTab === 'reports' && (
        <ReportBuilderPlatformView />
      )}

      {/* TAB 2: CONFIGURABLE KPI ENGINE */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Configurable Executive KPI Catalog</h3>
              <p className="text-xs text-muted-foreground">Standardized metric definitions, targets, and automatic variance tracking.</p>
            </div>
            <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90">
              <Plus className="w-4 h-4" />
              <span>Define New KPI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kpiList.map((kpi) => (
              <div key={kpi.id} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                      {kpi.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-500 font-mono">
                      +{kpi.changePercent}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground">{kpi.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{kpi.description}</p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span>Current: <strong className="text-foreground">{kpi.unit === '$' ? `$${kpi.currentValue.toLocaleString()}` : `${kpi.currentValue} ${kpi.unit}`}</strong></span>
                  {kpi.targetValue && (
                    <span>Target: <strong className="text-primary">{kpi.unit === '$' ? `$${kpi.targetValue.toLocaleString()}` : `${kpi.targetValue} ${kpi.unit}`}</strong></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TIME-SERIES AGGREGATION */}
      {activeTab === 'timeseries' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Time-Series Aggregation & Grouping Engine</h3>
            <p className="text-xs text-muted-foreground">Aggregates high-frequency telemetry events into Hourly, Daily, Weekly, Monthly, and Yearly buckets.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-muted-foreground uppercase">
              <Clock className="w-4 h-4 text-primary" />
              <span>Select Aggregation Window</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {(['hour', 'day', 'week', 'month', 'quarter', 'year'] as AggregationPeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedPeriod === p
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-background border border-border space-y-2 text-xs">
              <div className="font-bold text-foreground">Active Window: {selectedPeriod.toUpperCase()} Aggregation</div>
              <p className="text-muted-foreground leading-relaxed">
                Telemetry raw events are bucketed using sliding window averages. Moving averages and period-over-period delta variance are cached in Redis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WIDGET VISUALIZER GALLERY */}
      {activeTab === 'widgets' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">BI Dashboard Widget Visualizer Gallery</h3>
            <p className="text-xs text-muted-foreground">Reusable charting widgets configurable for executive dashboards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockWidgets.map((w) => (
              <div key={w.id} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span>{w.title}</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground uppercase">
                    {w.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="h-28 rounded-xl bg-background border border-border p-4 flex items-center justify-center text-xs text-muted-foreground font-mono">
                  [ {w.type.toUpperCase()} Visualizer Preview Component ]
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REDIS CACHE & SECURITY */}
      {activeTab === 'cache' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-foreground">Redis-Backed Analytics Cache & RBAC Security</h3>
            <p className="text-xs text-muted-foreground">Tenant-isolated analytics query cache with automated invalidation hooks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-background border border-border space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase">Cache Status</div>
              <div className="text-emerald-500 font-bold">ACTIVE (Redis 7.2)</div>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase">Configured TTL</div>
              <div className="text-foreground font-bold">{mockExecutiveOverview.cacheStatus.ttlSeconds} Seconds (5 mins)</div>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase">Cached Entries</div>
              <div className="text-primary font-bold">{mockExecutiveOverview.cacheStatus.totalCachedEntries} Queries</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
