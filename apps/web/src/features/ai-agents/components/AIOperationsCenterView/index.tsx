'use client';

import React, { useState } from 'react';
import {
  Activity,
  DollarSign,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  PauseCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { mockAIOperationsOverview, mockAgentDeployments } from '../../data/mock-agents-data';
import type { AgentDeployment } from '../../types';

export function AIOperationsCenterView() {
  const [metrics] = useState(mockAIOperationsOverview);
  const [deployments, setDeployments] = useState<AgentDeployment[]>(mockAgentDeployments);
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleDeploymentStatus = (depId: string) => {
    setDeployments((prev) =>
      prev.map((d) => {
        if (d.id === depId) {
          const nextStatus = d.status === 'healthy' ? 'paused' : 'healthy';
          setNotice(`Deployment "${d.agentName}" status changed to ${nextStatus.toUpperCase()}.`);
          setTimeout(() => setNotice(null), 3500);
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>AI Operations Center & Deployment Manager</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.10 Centralized monitoring for agent health, token consumption, cost analysis, and production deployments.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
          <Zap className="w-4 h-4" />
          <span>Active Deployments: {metrics.activeDeploymentsCount} / {metrics.totalDeploymentsCount}</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Monthly Token Usage</span>
          <div className="text-xl font-bold text-foreground font-mono">{(metrics.totalTokenUsageMonth / 1000000).toFixed(1)}M</div>
          <div className="text-[10px] text-muted-foreground">Across all agent LLM calls</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Monthly Cost USD</span>
          <div className="text-xl font-bold text-emerald-500 font-mono">${metrics.totalCostMonthUSD.toFixed(2)}</div>
          <div className="text-[10px] text-muted-foreground">Budget cap: $1,000.00</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Avg Response Latency</span>
          <div className="text-xl font-bold text-primary font-mono">{metrics.avgLatencyMs}ms</div>
          <div className="text-[10px] text-muted-foreground">P95 threshold: &lt; 200ms</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Error Rate</span>
          <div className="text-xl font-bold text-emerald-500 font-mono">{metrics.errorRatePercent}%</div>
          <div className="text-[10px] text-muted-foreground">Target SLA: &lt; 0.5%</div>
        </div>
      </div>

      {/* Deployments Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Layers className="w-4 h-4 text-primary" />
          <span>Live Agent Production Deployments</span>
        </h3>

        <div className="divide-y divide-border">
          {deployments.map((dep) => (
            <div key={dep.id} className="py-4 space-y-2 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-foreground">{dep.agentName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                      {dep.environment}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-muted-foreground">
                      {dep.version}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    24h Token Usage: {(dep.tokensUsed24h / 1000).toFixed(0)}k • 24h Cost: ${dep.costUSD24h.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleDeploymentStatus(dep.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      dep.status === 'healthy'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {dep.status === 'healthy' ? 'HEALTHY (Pause)' : 'PAUSED (Resume)'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
