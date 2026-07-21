'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Sliders,
  DollarSign,
  Shield,
  Zap,
} from 'lucide-react';
import { mockSafetyGuardrails } from '../../data/mock-agents-data';
import type { SafetyGuardrailPolicy } from '../../types';

export function AgentSafetyGuardrailsView() {
  const [guardrails, setGuardrails] = useState<SafetyGuardrailPolicy[]>(mockSafetyGuardrails);
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleGuardrail = (id: string) => {
    setGuardrails((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextEnforced = !g.isEnforced;
          setNotice(`Policy "${g.name}" ${nextEnforced ? 'ENFORCED' : 'DISABLED'}.`);
          setTimeout(() => setNotice(null), 3500);
          return { ...g, isEnforced: nextEnforced };
        }
        return g;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>AI Safety, Prompt Injection Defense & Compliance Guardrails</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.4 Real-time safety filters, PII redaction, token spending throttles, and zero-trust data scoping policies.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
          <Shield className="w-4 h-4" />
          <span>Active Defense Gate Active</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Guardrail Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guardrails.map((policy) => (
          <div key={policy.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                  {policy.category.replace('_', ' ')}
                </span>
                <button
                  onClick={() => handleToggleGuardrail(policy.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    policy.isEnforced
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {policy.isEnforced ? 'ENFORCED' : 'DISABLED'}
                </button>
              </div>

              <h3 className="text-sm font-bold text-foreground">{policy.name}</h3>

              <div className="p-3 rounded-lg bg-background border border-border space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Threshold Rule:</span>
                  <strong className="text-foreground">{policy.threshold}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Blocked Violations (30d):</span>
                  <strong className={policy.violatedCount > 0 ? 'text-amber-500' : 'text-emerald-500'}>
                    {policy.violatedCount} Interceptions
                  </strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
