'use client';

import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  BarChart3,
  GitCommit,
  Settings,
  Search,
  Layers,
} from 'lucide-react';
import {
  mockHealthCheck,
  mockLogStream,
  mockPrometheusMetrics,
  mockTraceSpans,
  mockObservabilityConfig,
} from '../../data/mock-observability-data';
import type { LogEntry, LogLevel, ServiceHealthStatus } from '../../types';

export function ObservabilityPlatformView() {
  const [activeTab, setActiveTab] = useState<'health' | 'logs' | 'metrics' | 'tracing' | 'config'>('health');

  // Logs state
  const [logSearch, setLogSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(mockLogStream[0]);

  // Filter logs
  const filteredLogs = mockLogStream.filter((log) => {
    if (selectedLevel !== 'ALL' && log.level !== selectedLevel) return false;
    if (!logSearch.trim()) return true;
    const q = logSearch.toLowerCase();
    return (
      log.correlationId.toLowerCase().includes(q) ||
      log.message.toLowerCase().includes(q) ||
      log.path.toLowerCase().includes(q) ||
      log.serviceName.toLowerCase().includes(q)
    );
  });

  const levelBadges: Record<LogLevel, string> = {
    TRACE: 'bg-muted text-muted-foreground border-border',
    DEBUG: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    INFO: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    WARNING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    ERROR: 'bg-red-500/10 text-red-500 border-red-500/20',
    CRITICAL: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  const statusIcons: Record<ServiceHealthStatus, React.ReactNode> = {
    Healthy: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    Degraded: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    Unhealthy: <XCircle className="w-5 h-5 text-red-500" />,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Activity className="w-6 h-6 text-primary" />
            <span>Enterprise Observability Foundation</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Story 13.1 Structured logging, correlation ID propagation, `/health` framework, Prometheus metrics, and OpenTelemetry tracing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Status: Healthy</span>
          </span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'health', label: 'Health Check Framework', icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: 'logs', label: 'Structured Log Stream', icon: <FileText className="w-4 h-4" /> },
          { id: 'metrics', label: 'Prometheus Metrics', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'tracing', label: 'OpenTelemetry Tracing', icon: <GitCommit className="w-4 h-4" /> },
          { id: 'config', label: 'Observability Config', icon: <Settings className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as 'health' | 'logs' | 'metrics' | 'tracing' | 'config')}
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

      {/* TAB 1: HEALTH CHECK FRAMEWORK */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall Platform Health</div>
              <div className="text-2xl font-extrabold text-foreground flex items-center space-x-2">
                {statusIcons[mockHealthCheck.status]}
                <span>{mockHealthCheck.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Uptime: <strong className="text-foreground">{mockHealthCheck.uptime}</strong> • Version: v{mockHealthCheck.version}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-background border border-border font-mono text-muted-foreground">
                GET /health
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-background border border-border font-mono text-muted-foreground">
                GET /health/live
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-background border border-border font-mono text-muted-foreground">
                GET /health/ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockHealthCheck.services.map((srv, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {statusIcons[srv.status]}
                    <span className="text-sm font-bold text-foreground">{srv.name}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-muted-foreground">{srv.latencyMs} ms</span>
                </div>

                {srv.details && (
                  <p className="text-xs text-muted-foreground font-mono bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    {srv.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STRUCTURED LOG STREAM */}
      {activeTab === 'logs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Search by Correlation ID, path..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none"
              >
                <option value="ALL">All Levels</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>

            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <button
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`w-full p-4 rounded-xl text-left border transition-all space-y-2 ${
                    selectedLog?.id === log.id
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${levelBadges[log.level]}`}>
                      {log.level}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{log.executionTimeMs}ms</span>
                  </div>

                  <div className="text-xs font-bold text-foreground leading-snug">{log.message}</div>
                  <div className="text-[10px] font-mono text-muted-foreground text-ellipsis overflow-hidden">
                    {log.httpMethod} {log.path} ({log.statusCode})
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedLog && (
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase border ${levelBadges[selectedLog.level]}`}>
                      {selectedLog.level}
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">{selectedLog.serviceName} v{selectedLog.serviceVersion}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pt-1">{selectedLog.timestamp}</p>
                </div>
              </div>

              {/* Correlation ID & Context Fields */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Correlation ID (UUIDv7)</label>
                  <div className="font-mono text-primary font-bold">{selectedLog.correlationId}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Trace ID / Span ID</label>
                  <div className="font-mono text-foreground">{selectedLog.traceId.slice(0, 12)}... / {selectedLog.spanId}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Tenant / Workspace</label>
                  <div className="font-bold text-foreground">{selectedLog.tenantId || 'global'} / {selectedLog.workspaceId || 'none'}</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">HTTP Method & Path</label>
                  <div className="font-bold text-foreground">{selectedLog.httpMethod} {selectedLog.path} ({selectedLog.statusCode})</div>
                </div>
              </div>

              {/* Message Payload */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Log Message</label>
                <div className="p-4 rounded-xl bg-background border border-border text-xs text-foreground font-mono leading-relaxed">
                  {selectedLog.message}
                </div>
              </div>

              {/* Stack Trace if present */}
              {selectedLog.stackTrace && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-red-500">Stack Trace</label>
                  <pre className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-[11px] font-mono text-red-500 overflow-x-auto leading-relaxed">
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROMETHEUS METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Prometheus Metrics Infrastructure</h3>
            <p className="text-xs text-muted-foreground">Scrapable metrics counters, HTTP latency histograms, and cache hit ratios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockPrometheusMetrics.map((m, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary">{m.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-muted text-muted-foreground border border-border">
                    {m.type}
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-foreground">
                  {m.value.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{m.unit}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                  {Object.entries(m.labels).map(([k, v], lIdx) => (
                    <span key={lIdx} className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">
                      {k}=&quot;{v}&quot;
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OPENTELEMETRY TRACING */}
      {activeTab === 'tracing' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">OpenTelemetry Distributed Trace Graphs</h3>
            <p className="text-xs text-muted-foreground">Trace context propagation across FastAPI Gateway, SQLAlchemy PostgreSQL, and LLM Providers.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between text-xs border-b border-border pb-3">
              <div>
                <span className="font-bold text-foreground">Trace ID: </span>
                <span className="font-mono text-primary font-bold">4bf92f3577b34da6a3ce929d0e0e4736</span>
              </div>
              <span className="text-muted-foreground">Total Span Latency: 118ms</span>
            </div>

            <div className="space-y-3">
              {mockTraceSpans.map((span) => (
                <div key={span.id} className="p-4 rounded-xl bg-background border border-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-bold text-foreground">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>{span.name}</span>
                    </div>
                    <span className="font-mono text-emerald-500 font-bold">{span.durationMs}ms</span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-muted-foreground pt-1">
                    <span>Service: {span.service}</span>
                    <span>• Span ID: {span.spanId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OBSERVABILITY CONFIG */}
      {activeTab === 'config' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm max-w-2xl">
          <h3 className="text-base font-bold text-foreground">Environment-Driven Observability Settings</h3>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">LOG_LEVEL</label>
              <div className="font-bold text-primary">{mockObservabilityConfig.logLevel}</div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">LOG_FORMAT</label>
              <div className="font-bold text-foreground">{mockObservabilityConfig.logFormat}</div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">PROMETHEUS_ENABLED</label>
              <div className="font-bold text-emerald-500">True</div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase">ENABLE_TRACING</label>
              <div className="font-bold text-emerald-500">True</div>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">OTEL_ENDPOINT</label>
              <div className="font-bold text-foreground">{mockObservabilityConfig.otelEndpoint}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
