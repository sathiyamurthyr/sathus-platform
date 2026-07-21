'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Cpu,
  CheckCircle2,
  Code,
  Zap,
  Bot,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { mockAgentTasks } from '../../data/mock-agents-data';
import type { AgentTaskItem } from '../../types';

export function AgentRuntimeExecutionViewer() {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-9001');
  const currentTask = mockAgentTasks.find((t) => t.id === selectedTaskId) || mockAgentTasks[0];

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-primary" />
            <span>Agent Runtime & Chain-of-Thought (CoT) Execution Inspector</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.1 Live step-by-step LLM kernel thought traces, tool call parameters, output snippets, and memory state inspection.
          </p>
        </div>

        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground"
        >
          {mockAgentTasks.map((t) => (
            <option key={t.id} value={t.id}>
              Trace: {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Chain-of-Thought Trace Panel */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground font-sans flex items-center space-x-2">
              <Bot className="w-4 h-4 text-primary" />
              <span>{currentTask.title}</span>
            </h3>
            <div className="text-[11px] text-muted-foreground font-sans">Agent: {currentTask.agentName}</div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {currentTask.status}
            </span>
          </div>
        </div>

        {/* Step-by-Step Chain-of-Thought Stream */}
        <div className="space-y-4 pt-2">
          {currentTask.executionSteps.map((step) => (
            <div key={step.stepIndex} className="p-4 rounded-xl bg-background border border-border space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-primary flex items-center space-x-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Step #{step.stepIndex} Reasoning Phase</span>
                </span>
                <span className="text-muted-foreground">{new Date(step.timestamp).toLocaleTimeString()}</span>
              </div>

              {/* LLM Thought Trace */}
              <div className="text-foreground font-sans text-xs bg-muted/30 p-3 rounded-lg border border-border/50">
                <strong className="text-primary block text-[10px] uppercase font-mono mb-1">LLM Thought & Strategy:</strong>
                {step.thought}
              </div>

              {/* Tool Invocation Trace */}
              {step.toolInvocation && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center space-x-2 text-[11px]">
                    <Code className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-muted-foreground">Invoked Tool:</span>
                    <strong className="text-amber-500">{step.toolInvocation.toolName}</strong>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                    <div className="p-2.5 rounded bg-card border border-border space-y-1">
                      <span className="text-muted-foreground font-bold">Tool Input Parameters:</span>
                      <pre className="text-emerald-500 overflow-x-auto">{step.toolInvocation.parametersJson}</pre>
                    </div>

                    <div className="p-2.5 rounded bg-card border border-border space-y-1">
                      <span className="text-muted-foreground font-bold">Execution Output Snippet:</span>
                      <pre className="text-foreground overflow-x-auto">{step.toolInvocation.outputSnippet}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
