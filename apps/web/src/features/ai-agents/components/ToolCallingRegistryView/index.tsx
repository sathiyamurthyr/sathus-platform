'use client';

import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle2,
  Lock,
  Play,
  Terminal,
  Activity,
} from 'lucide-react';
import { mockEnterpriseTools } from '../../data/mock-agents-data';
import type { ToolItem } from '../../types';

export function ToolCallingRegistryView() {
  const [tools] = useState<ToolItem[]>(mockEnterpriseTools);
  const [selectedToolId, setSelectedToolId] = useState('tool-sql-exec');
  const [notice, setNotice] = useState<string | null>(null);

  const selectedTool = tools.find((t) => t.id === selectedToolId) || tools[0];

  const handleTestInvocation = (toolName: string) => {
    setNotice(`Sandboxed tool invocation for "${toolName}" executed successfully (140ms).`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-primary" />
            <span>Enterprise Tool Calling & Function Execution Framework</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.7 Tool registry, sandboxed execution runtime, parallel/sequential function calling, and schema validation.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Sandboxed Runtime Active</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Tools Catalog & Schema Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Registered Enterprise Tools ({tools.length})
          </h3>

          <div className="space-y-2">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedToolId(t.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedToolId === t.id
                    ? 'border-primary bg-primary/5 text-primary font-bold'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono">{t.name}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-extrabold">
                    {t.category}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center justify-between font-mono">
                  <span>SLA: {t.successRatePercent}%</span>
                  <span>{t.avgLatencyMs}ms</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Tool Details & JSON Schema Inspector */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground font-sans">{selectedTool.name}</h3>
                <p className="text-xs text-muted-foreground font-sans">{selectedTool.description}</p>
              </div>

              <button
                onClick={() => handleTestInvocation(selectedTool.name)}
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-sans font-semibold hover:opacity-90 flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Execution</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[11px] font-sans">
              <div className="p-3 rounded-lg bg-background border border-border space-y-1">
                <span className="text-muted-foreground font-bold">Execution Environment:</span>
                <div className="font-mono text-emerald-500 font-bold">
                  {selectedTool.isSandboxed ? 'Sandboxed MicroVM Isolation' : 'Host Direct Execution'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border space-y-1">
                <span className="text-muted-foreground font-bold">Required Permissions:</span>
                <div className="font-mono text-primary font-bold">{selectedTool.permissionsRequired.join(', ')}</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-muted-foreground font-bold text-[11px] font-sans block">
                Function Calling JSON Schema Definition:
              </span>
              <pre className="p-3 rounded-lg bg-background border border-border text-emerald-500 text-[11px] overflow-x-auto">
                {selectedTool.schemaJson}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Total Invocations: {selectedTool.totalInvocationsCount}</span>
            <span>Version: {selectedTool.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
