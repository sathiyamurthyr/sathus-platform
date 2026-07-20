import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { moduleStatusRegistry } from '../../config/nav-config';

interface ComingSoonViewProps {
  moduleKey: string;
}

export function ComingSoonView({ moduleKey }: ComingSoonViewProps) {
  const info = moduleStatusRegistry[moduleKey] || {
    title: 'Enterprise Module',
    description: 'This module is scheduled for development in upcoming roadmap sprints.',
    epicId: 'EPIC-018',
    quarter: 'Q3 2026',
    expectedFeatures: [
      'Multi-tenant workspace integration',
      'Role-based permission access',
      'Audit logging & SIEM event streams',
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Top Navigation Back */}
      <Link
        href="/workspace"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Enterprise Dashboard</span>
      </Link>

      {/* Main Banner */}
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Development Pipeline — {info.epicId}</span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground font-semibold">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Target Release: {info.quarter}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{info.title}</h1>
          <p className="text-muted-foreground leading-relaxed text-sm max-w-2xl">{info.description}</p>
        </div>

        <div className="pt-4 border-t border-border space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Target Architectural Capabilities</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {info.expectedFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 bg-muted/40 border border-border p-3.5 rounded-xl text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Architected under Sathus Zero-Trust Framework</span>
          </span>
          <Link
            href="/workspace"
            className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
