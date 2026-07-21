'use client';

import React, { useState } from 'react';
import {
  GitMerge,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Plus,
  Zap,
} from 'lucide-react';
import { mockMultiAgentWorkflows } from '../../data/mock-agents-data';

export function MultiAgentWorkflowCanvasView() {
  const [workflows, setWorkflows] = useState(mockMultiAgentWorkflows);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState('wf-101');
  const [notice, setNotice] = useState<string | null>(null);

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  const handleTriggerWorkflow = (id: string) => {
    setNotice(`Workflow "${selectedWorkflow.name}" manually triggered. Multi-agent DAG execution started.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <GitMerge className="w-5 h-5 text-primary" />
            <span>Multi-Agent Workflow Canvas & DAG Orchestrator</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.4 Multi-agent orchestration DAG passing context, memory state, and execution outputs between specialized agents.
          </p>
        </div>

        <button
          onClick={() => handleTriggerWorkflow(selectedWorkflow.id)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Execute Multi-Agent DAG</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Workflow Selector & Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
          <label className="text-xs font-bold text-foreground">Select Multi-Agent Pipeline:</label>
          <div className="space-y-2">
            {workflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => setSelectedWorkflowId(wf.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedWorkflowId === wf.id
                    ? 'border-primary bg-primary/5 font-semibold text-primary'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="font-bold">{wf.name}</div>
                <div className="text-[10px] text-muted-foreground pt-1">Trigger: {wf.triggerEvent}</div>
              </button>
            ))}
          </div>
        </div>

        {/* DAG Visualizer */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">{selectedWorkflow.name}</h3>
              <p className="text-xs text-muted-foreground">{selectedWorkflow.description}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {selectedWorkflow.status}
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
              Multi-Agent DAG Execution Sequence:
            </span>

            <div className="flex flex-col md:flex-row items-center gap-4">
              {selectedWorkflow.nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div className="w-full md:w-1/3 bg-background border border-border rounded-xl p-4 space-y-2 relative shadow-sm">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono font-bold text-primary">Node #{index + 1}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          node.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : node.status === 'running'
                            ? 'bg-amber-500/10 text-amber-500 animate-pulse'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {node.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-foreground">{node.name}</div>

                    <div className="p-2 rounded bg-card border border-border text-[10px] font-mono text-muted-foreground">
                      Output context key: <strong className="text-primary">{node.outputKey}</strong>
                    </div>
                  </div>

                  {index < selectedWorkflow.nodes.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 hidden md:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Total Pipeline Executions: {selectedWorkflow.totalRunsCount}</span>
              <span>Last Run: {new Date(selectedWorkflow.lastRunAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
