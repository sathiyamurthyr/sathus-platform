'use client';

import React, { useState } from 'react';
import {
  Layers,
  Play,
  PauseCircle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Zap,
  Activity,
  Filter,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { mockAgentTasks } from '../../data/mock-agents-data';
import type { AgentTaskItem, TaskPriority, TaskStatus } from '../../types';

export function AutonomousTaskOrchestratorView() {
  const [tasks, setTasks] = useState<AgentTaskItem[]>(mockAgentTasks);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [notice, setNotice] = useState<string | null>(null);

  const handleCancelTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'cancelled' as TaskStatus, progressPercent: 0 } : t))
    );
    setNotice(`Task "${taskId}" execution cancelled by administrator.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const filteredTasks = tasks.filter((t) => {
    return filterPriority === 'all' || t.priority === filterPriority;
  });

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Layers className="w-5 h-5 text-primary" />
            <span>Autonomous Task Orchestrator & Execution Pipeline</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.3 Task scheduling, priority execution queue (P0-P3), parallel worker allocation, and step checkpointing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
            4 Active Parallel Workers
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
          <Filter className="w-4 h-4 text-primary" />
          <span>Filter Task Queue:</span>
        </div>

        <div className="flex items-center space-x-2">
          {[
            { id: 'all', label: 'All Priorities' },
            { id: 'P0_critical', label: 'P0 Critical' },
            { id: 'P1_high', label: 'P1 High' },
            { id: 'P2_normal', label: 'P2 Normal' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPriority(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterPriority === p.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Queue Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Activity className="w-4 h-4 text-primary" />
          <span>Live Task Execution Stream</span>
        </h3>

        <div className="divide-y divide-border">
          {filteredTasks.map((task) => (
            <div key={task.id} className="py-4 space-y-3 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 font-sans">
                    <span className="text-sm font-bold text-foreground">{task.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      task.priority === 'P0_critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {task.priority.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      task.status === 'running' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-sans">
                    Assigned Agent: <strong className="text-foreground">{task.agentName}</strong> • Tenant: {task.assignedTenant}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {task.status === 'running' && (
                    <button
                      onClick={() => handleCancelTask(task.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                    >
                      Cancel Execution
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Execution Progress</span>
                  <span>{task.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${task.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
