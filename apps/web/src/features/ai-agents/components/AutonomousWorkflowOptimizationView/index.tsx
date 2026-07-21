'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Zap,
  CheckCircle2,
  Sliders,
  DollarSign,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { mockWorkflowOptimizations } from '../../data/mock-agents-data';
import type { WorkflowOptimizationRecommendation } from '../../types';

export function AutonomousWorkflowOptimizationView() {
  const [recommendations, setRecommendations] = useState<WorkflowOptimizationRecommendation[]>(mockWorkflowOptimizations);
  const [notice, setNotice] = useState<string | null>(null);

  const handleApplyOptimization = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          setNotice(`Optimization "${rec.suggestion}" APPLIED in simulation mode.`);
          setTimeout(() => setNotice(null), 3500);
          return { ...rec, status: 'applied' as const };
        }
        return rec;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Autonomous Workflow Optimization & Performance Engine</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.9 Self-improving bottleneck detection, dynamic task reordering, simulation mode, and token/speed savings.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
          <Sparkles className="w-4 h-4" />
          <span>Average Performance Gain: +38.5%</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Recommendations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                  OPTIMIZE: {rec.targetMetric.replace('_', ' ')}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    rec.status === 'applied'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}
                >
                  {rec.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-foreground">{rec.workflowName}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{rec.suggestion}</p>

              <div className="p-3 rounded-lg bg-background border border-border space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Detected Bottleneck:</span>
                  <strong className="text-amber-500">{rec.bottleneckNode}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Savings:</span>
                  <strong className="text-emerald-500">-{rec.estimatedSavingsPercent}% {rec.targetMetric}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">Simulation Verified</span>
              {rec.status === 'suggested' && (
                <button
                  onClick={() => handleApplyOptimization(rec.id)}
                  className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
                >
                  Apply Optimization
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
