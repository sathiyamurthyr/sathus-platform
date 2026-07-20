'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  Database,
  Clock,
  Layers,
  BarChart3,
  RefreshCw,
  Search,
  Zap,
  Users,
  Building2,
  Server,
  AlertCircle,
  TrendingUp,
  Shield,
  Bot,
  Workflow,
  Radio,
  Sliders,
} from 'lucide-react';
import {
  mockMonitoringOverview,
  mockSystemInfrastructure,
  mockTopIssues,
  mockServicesGrid,
  mockTrendPoints,
} from '../../data/mock-monitoring-data';
import type { ServiceHealthStatus, ServiceGridItem, TopIssueItem } from '../../types';

export function MonitoringDashboardView() {
  const [refreshInterval, setRefreshInterval] = useState<number>(10); // seconds
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [serviceSearch, setServiceSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Auto-refresh timer simulator
  useEffect(() => {
    if (refreshInterval === 0) return;
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, refreshInterval * 1000);
    return () => clearInterval(timer);
  }, [refreshInterval]);

  const handleManualRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const filteredServices = mockServicesGrid.filter((srv) => {
    if (categoryFilter !== 'all' && srv.category !== categoryFilter) return false;
    if (!serviceSearch.trim()) return true;
    const q = serviceSearch.toLowerCase();
    return srv.name.toLowerCase().includes(q) || srv.version.toLowerCase().includes(q);
  });

  const statusBadges: Record<ServiceHealthStatus, { bg: string; icon: React.ReactNode }> = {
    Healthy: { bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    Degraded: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    Unhealthy: { bg: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <XCircle className="w-3.5 h-3.5" /> },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Activity className="w-6 h-6 text-primary" />
            <span>Enterprise Monitoring Dashboard</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Story 13.2 Real-time platform health, system infrastructure metrics, top issues, and service grid.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-lg shadow-sm">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Refreshed: <strong>{lastUpdated}</strong></span>
          </div>

          <div className="flex items-center space-x-1 bg-card border border-border rounded-lg p-1 text-xs">
            {[
              { label: 'Off', val: 0 },
              { label: '5s', val: 5 },
              { label: '10s', val: 10 },
              { label: '30s', val: 30 },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setRefreshInterval(opt.val)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  refreshInterval === opt.val
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleManualRefresh}
            className="p-2 rounded-lg bg-card border border-border hover:bg-muted/40 text-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Health Score Banner & Primary KPIs */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Health Score Gauge */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Platform Health Score</span>
            </div>
            <div className="text-3xl font-extrabold text-foreground flex items-baseline space-x-2">
              <span className="text-emerald-500">{mockMonitoringOverview.healthScorePercent}%</span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Optimal</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {mockMonitoringOverview.activeServices}/{mockMonitoringOverview.totalServices} Microservices Healthy
            </p>
          </div>

          {/* Active Counters */}
          <div className="space-y-2 md:pl-6 pt-4 md:pt-0">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span>Active Platform Scale</span>
            </div>
            <div className="text-xl font-extrabold text-foreground">
              {mockMonitoringOverview.activeUsers} <span className="text-xs font-normal text-muted-foreground">Users</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {mockMonitoringOverview.activeTenants} Enterprise Tenants • {mockMonitoringOverview.activeWorkspaces} Workspaces
            </div>
          </div>

          {/* Response Latency & Uptime */}
          <div className="space-y-2 md:pl-6 pt-4 md:pt-0">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Latency & SLA Uptime</span>
            </div>
            <div className="text-xl font-extrabold text-foreground">
              {mockMonitoringOverview.avgResponseTimeMs} ms <span className="text-xs font-normal text-muted-foreground">Avg</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {mockMonitoringOverview.uptimePercent}% SLA Availability
            </div>
          </div>

          {/* Throughput & Error Rate */}
          <div className="space-y-2 md:pl-6 pt-4 md:pt-0">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>Throughput & Error %</span>
            </div>
            <div className="text-xl font-extrabold text-foreground">
              {(mockMonitoringOverview.totalApiRequests / 1000).toFixed(1)}k <span className="text-xs font-normal text-muted-foreground">API Req</span>
            </div>
            <div className="text-xs font-bold text-emerald-500">
              Error Rate: {mockMonitoringOverview.errorRatePercent}%
            </div>
          </div>
        </div>
      </div>

      {/* PART 2: SYSTEM & INFRASTRUCTURE METRICS GAUGES */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Infrastructure & Resource Metrics</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-primary" />
                <span>CPU Utilization</span>
              </span>
              <span className="font-mono font-bold text-foreground">{mockSystemInfrastructure.cpuPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${mockSystemInfrastructure.cpuPercent}%` }} />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">Load Avg: {mockSystemInfrastructure.loadAverage.join(', ')}</div>
          </div>

          {/* Memory */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center space-x-1.5">
                <Server className="w-4 h-4 text-purple-500" />
                <span>RAM Usage</span>
              </span>
              <span className="font-mono font-bold text-foreground">{mockSystemInfrastructure.memoryPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${mockSystemInfrastructure.memoryPercent}%` }} />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">Redis Memory: {mockSystemInfrastructure.redisMemoryMb} MB</div>
          </div>

          {/* Database Connections */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center space-x-1.5">
                <Database className="w-4 h-4 text-blue-500" />
                <span>DB Pool Connections</span>
              </span>
              <span className="font-mono font-bold text-foreground">{mockSystemInfrastructure.dbActiveConnections}/{mockSystemInfrastructure.dbMaxConnections}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(mockSystemInfrastructure.dbActiveConnections / mockSystemInfrastructure.dbMaxConnections) * 100}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">Redis Hit Ratio: {mockSystemInfrastructure.redisHitRatioPercent}%</div>
          </div>

          {/* Worker Queue */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span className="flex items-center space-x-1.5">
                <Workflow className="w-4 h-4 text-amber-500" />
                <span>Celery Worker Queue</span>
              </span>
              <span className="font-mono font-bold text-emerald-500">0 queued</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '5%' }} />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">Active Jobs: {mockMonitoringOverview.runningJobs}</div>
          </div>
        </div>
      </div>

      {/* PART 6: TOP OPERATIONAL ISSUES PANEL */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Operational Issues & Bottlenecks</div>
        <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
          {mockTopIssues.map((issue) => (
            <div key={issue.id} className="p-5 space-y-2 hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                      issue.severity === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}
                  >
                    {issue.severity}
                  </span>
                  <h4 className="text-sm font-bold text-foreground">{issue.title}</h4>
                </div>

                <span className="text-[10px] font-mono text-muted-foreground">{new Date(issue.timestamp).toLocaleTimeString()}</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{issue.impact}</p>
              <div className="text-[10px] font-mono text-primary font-semibold">Affected: {issue.endpointOrService}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PART 7: SERVICE STATUS GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Microservices & Infrastructure Status Grid</div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Filter services..."
                className="h-8 pl-8 pr-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="core">Core API</option>
              <option value="ai">AI Platform</option>
              <option value="automation">Automation</option>
              <option value="data">Data & Database</option>
              <option value="security">Security & Billing</option>
            </select>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
          {filteredServices.map((srv) => {
            const badge = statusBadges[srv.status];
            return (
              <div key={srv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase border flex items-center space-x-1.5 ${badge.bg}`}>
                    {badge.icon}
                    <span>{srv.status}</span>
                  </span>
                  <div>
                    <div className="text-xs font-bold text-foreground">{srv.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">Version: {srv.version}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs text-muted-foreground font-mono">
                  <span>Latency: <strong className="text-foreground">{srv.responseTimeMs}ms</strong></span>
                  <span>Uptime: <strong className="text-emerald-500">{srv.uptimePercent}%</strong></span>
                  <span className="hidden md:inline">Checked: {srv.lastHealthCheck}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
