'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import { mockAgentPerformanceAnalytics, mockAgentLearningFeedback } from '../../data/mock-agents-data';

export function AgentAnalyticsContinuousLearningView() {
  const [analytics] = useState(mockAgentPerformanceAnalytics);
  const [feedbacks] = useState(mockAgentLearningFeedback);

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Agent Analytics & Continuous Learning Engine</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.14 Reasoning quality scores, business impact, user feedback loops, and auto-optimization recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 text-xs font-bold font-mono">
          <Award className="w-4 h-4" />
          <span>Fleet Reasoning Score: 4.88 / 5.0</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Award className="w-4 h-4 text-primary" />
          <span>Enterprise Agent Performance Leaderboard</span>
        </h3>

        <div className="divide-y divide-border">
          {analytics.map((item) => (
            <div key={item.agentId} className="py-4 space-y-2 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-foreground">{item.agentName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Success Rate: <strong className="text-emerald-500">{item.taskSuccessRatePercent}%</strong> • Reasoning Score: {item.reasoningQualityScore}/5.0
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-500 font-mono">Impact Score: {item.businessImpactScore}/100</div>
                    <div className="text-[10px] text-muted-foreground">Satisfaction: {item.userSatisfactionPercent}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continuous Learning & Feedback Stream */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>Continuous Learning Feedback & Auto-Optimization Stream</span>
        </h3>

        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="p-4 rounded-xl bg-background border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">{fb.agentName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500">
                  {fb.userFeedback} FEEDBACK
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{fb.comment}</p>
              <div className="p-2.5 rounded bg-card border border-border text-[11px] font-mono text-primary flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Optimization Suggestion: {fb.autoOptimizationSuggestion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
