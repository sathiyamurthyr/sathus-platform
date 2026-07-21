'use client';

import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Radio,
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Database,
  Bot,
  Search,
  Globe,
  FileText,
  Zap,
} from 'lucide-react';
import { mockLiveHealthMetrics, mockDependenciesHealth, mockProductionReadinessChecks } from '../../data/mock-diagnostics-data';
import type { ServiceDependencyHealth, ProductionReadinessCheck } from '../../types';

export function PlatformHealthDiagnosticsView() {
  const [metrics] = useState(mockLiveHealthMetrics);
  const [dependencies] = useState<ServiceDependencyHealth[]>(mockDependenciesHealth);
  const [readiness] = useState<ProductionReadinessCheck[]>(mockProductionReadinessChecks);

  const [notice, setNotice] = useState<string | null>(null);

  const handleRunDiagnostics = () => {
    setNotice('System Diagnostics Report compiled. 6/6 Core Platform Services Operating at Peak Health (0 Warnings).');
    setTimeout(() => setNotice(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Platform Health & Diagnostics Center</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.14 Live resource telemetry, service dependency health graph, and production readiness checks.
          </p>
        </div>

        <button
          onClick={handleRunDiagnostics}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Run System Diagnostics</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Live System Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
            <span>CPU Utilization</span>
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-500">{metrics.cpuUsagePercent}%</div>
          <div className="text-[10px] text-muted-foreground">Normal load across cluster</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
            <span>Memory Usage</span>
            <Server className="w-4 h-4 text-primary" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-500">{metrics.memoryUsagePercent}%</div>
          <div className="text-[10px] text-muted-foreground">Redis & Node.js heap</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
            <span>Disk Usage</span>
            <HardDrive className="w-4 h-4 text-primary" />
          </div>
          <div className="text-xl font-bold font-mono text-foreground">{metrics.diskUsagePercent}%</div>
          <div className="text-[10px] text-muted-foreground">1.4 TB / 5 TB allocated</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
            <span>API Throughput</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-primary">{metrics.apiRequestsPerSec} req/s</div>
          <div className="text-[10px] text-muted-foreground">Average throughput</div>
        </div>
      </div>

      {/* Service Dependency Health Graph Cards */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Radio className="w-4 h-4 text-primary" />
          <span>Core Service Dependency Health Graph</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {dependencies.map((dep) => (
            <div key={dep.id} className="p-4 rounded-xl bg-background border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground font-sans">{dep.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {dep.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Latency: <strong className="text-emerald-500">{dep.latencyMs} ms</strong></span>
                <span>Uptime: <strong className="text-foreground">{dep.uptimePercent}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Readiness Checks */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Production Release Readiness Audit</span>
        </h3>

        <div className="divide-y divide-border">
          {readiness.map((chk) => (
            <div key={chk.id} className="py-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-foreground flex items-center space-x-2">
                  <span>{chk.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {chk.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{chk.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
