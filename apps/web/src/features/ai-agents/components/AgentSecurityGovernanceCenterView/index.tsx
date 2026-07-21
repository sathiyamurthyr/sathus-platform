'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { mockAgentSecurityPolicies } from '../../data/mock-agents-data';
import type { AgentSecurityPolicy } from '../../types';

export function AgentSecurityGovernanceCenterView() {
  const [policies, setPolicies] = useState<AgentSecurityPolicy[]>(mockAgentSecurityPolicies);
  const [notice, setNotice] = useState<string | null>(null);

  const handleTogglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextEnforced = !p.isEnforced;
          setNotice(`Policy "${p.name}" ${nextEnforced ? 'ENFORCED' : 'DISABLED'}.`);
          setTimeout(() => setNotice(null), 3500);
          return { ...p, isEnforced: nextEnforced };
        }
        return p;
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
            <span>Agent Security & Governance Center</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.13 Zero-trust data scoping, prompt injection defense, PII protection, and policy evaluation matrix.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
          <Lock className="w-4 h-4" />
          <span>Tenant Trust Score: 98/100 (Optimal)</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((pol) => (
          <div key={pol.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                  {pol.policyType.replace('_', ' ')}
                </span>
                <button
                  onClick={() => handleTogglePolicy(pol.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    pol.isEnforced
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {pol.isEnforced ? 'ENFORCED' : 'DISABLED'}
                </button>
              </div>

              <h3 className="text-sm font-bold text-foreground">{pol.name}</h3>

              <div className="p-3 rounded-lg bg-background border border-border space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Policy Scope:</span>
                  <strong className="text-foreground uppercase">{pol.scope}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Blocked Interceptions:</span>
                  <strong className="text-emerald-500">{pol.blockedAttemptsCount} violations blocked</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
