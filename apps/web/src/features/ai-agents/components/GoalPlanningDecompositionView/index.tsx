'use client';

import React, { useState } from 'react';
import {
  Target,
  GitPullRequest,
  CheckCircle2,
  Calendar,
  Layers,
  Flag,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { mockGoalPlans } from '../../data/mock-agents-data';
import type { GoalItem } from '../../types';

export function GoalPlanningDecompositionView() {
  const [plans] = useState(mockGoalPlans);
  const activePlan = plans[0];

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Goal Planning Engine & Recursive Decomposition</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.5 Strategic, Tactical, and Execution Planner hierarchy, goal trees, and milestone tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
          <TrendingUp className="w-4 h-4" />
          <span>Strategic Goal Progress: 78%</span>
        </div>
      </div>

      {/* Goal Plan Tree & Milestones */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-foreground">{activePlan.title}</h3>
          <p className="text-xs text-muted-foreground">{activePlan.description}</p>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
            Hierarchical Goal Tree & Task Decomposition:
          </span>

          {activePlan.strategicGoals.map((stratGoal) => (
            <div key={stratGoal.id} className="p-4 rounded-xl bg-background border border-border space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    {stratGoal.plannerType} PLANNER
                  </span>
                  <h4 className="text-xs font-bold text-foreground">{stratGoal.title}</h4>
                </div>
                <span className="text-xs font-bold font-mono text-primary">{stratGoal.progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${stratGoal.progressPercent}%` }} />
              </div>

              {/* Tactical Sub-goals */}
              <div className="pl-4 border-l-2 border-border space-y-3 pt-1">
                {stratGoal.subGoals.map((tacGoal) => (
                  <div key={tacGoal.id} className="p-3 rounded-lg bg-card border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {tacGoal.plannerType}
                        </span>
                        <span className="text-xs font-semibold text-foreground">{tacGoal.title}</span>
                      </div>
                      <span className="text-xs font-bold font-mono text-emerald-500">{tacGoal.progressPercent}%</span>
                    </div>

                    {/* Milestones */}
                    {tacGoal.milestones.length > 0 && (
                      <div className="pl-6 space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center space-x-1">
                          <Flag className="w-3 h-3 text-amber-500" />
                          <span>Key Milestones:</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tacGoal.milestones.map((m) => (
                            <div key={m.id} className="p-2 rounded bg-background border border-border flex items-center justify-between text-[11px]">
                              <span className="text-foreground">{m.title}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                m.isReached ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'
                              }`}>
                                {m.isReached ? 'REACHED' : m.dueDate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
