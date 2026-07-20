'use client';

import React, { useState } from 'react';
import {
  Activity,
  Search,
  Sliders,
  Layers,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Radio,
  XCircle,
  Database,
  Cpu,
  Server,
  FileText,
  Download,
  Share2,
  Play,
  Square,
  Network,
  Shield,
  Gauge,
  BarChart3,
  Bot,
} from 'lucide-react';
import {
  mockTraceDetail,
  mockPerformanceHotspots,
  mockLiveRequests,
  mockSLOTargets,
  mockCapacityForecasts,
} from '../../data/mock-sre-data';
import type { LiveRequest } from '../../types';

export function SREOperationsCenterView() {
  const [activeSubTab, setActiveSubTab] = useState<'trace' | 'profiler' | 'live' | 'slo' | 'capacity'>('trace');
  const [searchQuery, setSearchQuery] = useState('tr-01j89x4m7v89bc21a009');
  const [liveRequests, setLiveRequests] = useState<LiveRequest[]>(mockLiveRequests);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleCancelRequest = (reqId: string) => {
    setLiveRequests((prev) => prev.filter((r) => r.id !== reqId));
    setExportNotice(`In-flight request ${reqId} has been cancelled by operator.`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportReport = (format: 'CSV' | 'PDF') => {
    setExportNotice(`Exporting SRE Operations Diagnostic Report as ${format}...`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* SRE Operations Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Gauge className="w-6 h-6 text-primary" />
            <span>SRE Operations & Distributed Diagnostics Center</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Story 13.4 OpenTelemetry trace waterfall visualizer, performance profiler, live request inspector, SLO compliance, and capacity forecasting.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExportReport('CSV')}
            className="inline-flex items-center space-x-1.5 bg-card border border-border hover:bg-muted/40 text-foreground px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExportReport('PDF')}
            className="inline-flex items-center space-x-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export SRE Report</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'trace', label: 'Distributed Trace Explorer', icon: <Layers className="w-4 h-4" /> },
          { id: 'profiler', label: 'Performance Profiler', icon: <Zap className="w-4 h-4" /> },
          { id: 'live', label: 'Live Request Inspector', icon: <Radio className="w-4 h-4" /> },
          { id: 'slo', label: 'SLO / SLA Manager', icon: <Shield className="w-4 h-4" /> },
          { id: 'capacity', label: 'Capacity Planning', icon: <TrendingUp className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as 'trace' | 'profiler' | 'live' | 'slo' | 'capacity')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeSubTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: DISTRIBUTED TRACE EXPLORER & WATERFALL VISUALIZER */}
      {activeSubTab === 'trace' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Trace ID or X-Correlation-ID..."
                  className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-muted-foreground">
                <span>Correlation ID: <strong className="text-foreground">{mockTraceDetail.correlationId}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Root Endpoint</div>
                <div className="text-xs font-bold text-foreground">{mockTraceDetail.rootEndpoint}</div>
              </div>
              <div className="space-y-0.5 sm:pl-4 pt-2 sm:pt-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Total Trace Latency</div>
                <div className="text-xs font-bold text-primary">{mockTraceDetail.totalDurationMs} ms</div>
              </div>
              <div className="space-y-0.5 sm:pl-4 pt-2 sm:pt-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">HTTP Status</div>
                <div className="text-xs font-bold text-emerald-500">{mockTraceDetail.statusCode} OK</div>
              </div>
              <div className="space-y-0.5 sm:pl-4 pt-2 sm:pt-0">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Spans Count</div>
                <div className="text-xs font-bold text-foreground">{mockTraceDetail.spans.length} Spans</div>
              </div>
            </div>
          </div>

          {/* Span Waterfall Timeline Visualizer */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">OpenTelemetry Trace Waterfall Timeline</div>

            <div className="space-y-3">
              {mockTraceDetail.spans.map((span) => {
                const widthPercent = Math.max((span.durationMs / mockTraceDetail.totalDurationMs) * 100, 4);
                const offsetPercent = (span.startOffsetMs / mockTraceDetail.totalDurationMs) * 100;

                return (
                  <div key={span.id} className="p-3 rounded-lg bg-background border border-border space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-foreground">{span.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
                          {span.service}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-primary">{span.durationMs}ms</span>
                    </div>

                    {/* Timeline Bar */}
                    <div className="w-full h-3 rounded-full bg-muted overflow-hidden relative">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          marginLeft: `${offsetPercent}%`,
                          width: `${widthPercent}%`,
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono text-muted-foreground">
                      {Object.entries(span.tags).map(([k, v], idx) => (
                        <span key={idx} className="bg-muted/50 px-1.5 py-0.5 rounded border border-border">
                          {k}: <strong className="text-foreground">{v}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PERFORMANCE PROFILER */}
      {activeSubTab === 'profiler' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">API & Microservice Performance Profiler</h3>
            <p className="text-xs text-muted-foreground">Automated regression detection across P95 and P99 latency percentiles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPerformanceHotspots.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{item.callCountPerMin} calls/min</span>
                  </div>

                  <h4 className="text-xs font-bold text-foreground leading-snug">{item.name}</h4>

                  {item.regressionAlert && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.regressionAlert}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span>P95: <strong className="text-foreground">{item.p95DurationMs}ms</strong></span>
                  <span>P99: <strong className="text-primary">{item.p99DurationMs}ms</strong></span>
                  <span>Error: <strong className="text-emerald-500">{item.errorRatePercent}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LIVE REQUEST INSPECTOR */}
      {activeSubTab === 'live' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Live Active Request Inspector</h3>
            <p className="text-xs text-muted-foreground">Real-time in-flight HTTP requests currently executing across platform microservices.</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {liveRequests.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">No active in-flight requests.</div>
            ) : (
              liveRequests.map((req) => (
                <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-foreground">{req.endpoint}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                        {req.correlationId}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tenant: <strong className="text-foreground">{req.tenantId}</strong> • User: <strong className="text-foreground">{req.userId}</strong>
                    </div>
                    <div className="text-xs text-primary font-semibold pt-1">
                      Stage: {req.currentStage} ({req.currentSpanService})
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right text-xs font-mono">
                      <div className="text-foreground font-bold">{req.durationSoFarMs}ms</div>
                      <div className="text-[10px] text-emerald-500 font-bold">Executing...</div>
                    </div>
                    {req.isCancellable && (
                      <button
                        onClick={() => handleCancelRequest(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SLO / SLA MANAGER */}
      {activeSubTab === 'slo' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Service Level Objectives (SLO) & Error Budget Manager</h3>
            <p className="text-xs text-muted-foreground">Continuous SLA/SLO tracking, error budget remaining %, and compliance status.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockSLOTargets.map((slo) => (
              <div key={slo.id} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        slo.status === 'met' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {slo.status === 'met' ? 'SLO Met' : 'SLO At Risk'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">{slo.timeWindow}</span>
                  </div>

                  <h4 className="text-xs font-bold text-foreground">{slo.name}</h4>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Current: <strong className="text-foreground">{slo.currentPercent}%</strong></span>
                      <span className="text-muted-foreground">Target: <strong className="text-foreground">{slo.targetPercent}%</strong></span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${slo.currentPercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Error Budget Remaining:</span>
                  <span className="font-mono font-bold text-primary">{slo.errorBudgetRemainingPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CAPACITY PLANNING & PREDICTIVE FORECASTING */}
      {activeSubTab === 'capacity' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">30-Day Predictive Capacity Forecasting</h3>
            <p className="text-xs text-muted-foreground">Historical telemetry forecasting storage growth, database pool requirements, and API throughput.</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {mockCapacityForecasts.map((item, idx) => (
              <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground">{item.resource}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.recommendation}</p>
                </div>

                <div className="flex items-center space-x-6 font-mono text-xs shrink-0">
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Current</div>
                    <div className="text-foreground font-bold">{item.currentValue}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">30-Day Projected</div>
                    <div className="text-primary font-bold">{item.projected30Days}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Utilization</div>
                    <div className="text-emerald-500 font-bold">{item.utilizationPercent}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
