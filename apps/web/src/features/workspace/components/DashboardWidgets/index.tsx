import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Bot,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  FolderKanban,
  HardDrive,
  Layers,
  Plus,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { quickActions } from '../../config/nav-config';

export function DashboardWidgets() {
  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden shadow-sm">
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise Workspace Shell — Production Ready</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Sathus Platform Overview</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Welcome back, <span className="font-semibold text-foreground">Sathish Kumar</span>. All enterprise services, zero-trust security controls, and multi-tenant nodes are operational.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/workspace/ai"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Agent</span>
            </Link>
            <Link
              href="/workspace/settings"
              className="inline-flex items-center space-x-2 bg-muted border border-border text-foreground px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-muted/80 transition-colors"
            >
              <span>Workspace Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Cluster Status</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">Operational</div>
          <div className="text-xs text-muted-foreground flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
            99.99% Availability SLA
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Active Agentic Tasks</span>
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">1,248</div>
          <div className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="w-3.5 h-3.5 text-primary mr-1.5" />
            +18% throughput this week
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Memomes Vault Storage</span>
            <HardDrive className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">412.8 GB</div>
          <div className="text-xs text-muted-foreground">AES-256 Zero-Knowledge Encrypted</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Active Team Members</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">24 Seats</div>
          <div className="text-xs text-muted-foreground">Sathus Enterprise Tier</div>
        </div>
      </div>

      {/* Main 2-Column Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Actions & Active Projects */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions Framework Widget */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Quick Launch Actions</h3>
                <p className="text-xs text-muted-foreground">Execute common enterprise tasks across the platform.</p>
              </div>
              <Zap className="w-5 h-5 text-primary" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="group bg-muted/40 border border-border hover:border-primary/50 p-5 rounded-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{action.description}</div>
                  </div>
                  <div className="pt-4 flex items-center text-xs font-medium text-primary">
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Projects Widget (Framework placeholder) */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Active Workspace Projects</h3>
                <p className="text-xs text-muted-foreground">EPIC-016 Project Synchronization</p>
              </div>
              <Link href="/workspace/projects" className="text-xs font-medium text-primary hover:underline">
                View All Projects &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Core Banking Lakehouse Migration', repo: 'sathus-platform/lakehouse-core', status: 'In Progress', tier: 'High Priority' },
                { name: 'Agentic AI Eval Harness Gateway', repo: 'sathus-platform/ai-eval-core', status: 'Completed', tier: 'GA 2.0' },
                { name: 'FHIR R4 OneHealthID Gateway', repo: 'sathus-platform/onehealthid-api', status: 'In Progress', tier: 'Healthcare' },
              ].map((proj, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/60">
                  <div className="flex items-center space-x-3">
                    <FolderKanban className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{proj.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{proj.repo}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                      {proj.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Stream & AI Status Widget */}
        <div className="space-y-8">
          {/* AI Assistant Widget */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-foreground">
                <Bot className="w-5 h-5 text-primary" />
                <span>Sathus AI Copilot</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">
                Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Connected to Model Context Protocol (MCP) gateway with zero data retention guardrails enabled.
            </p>
            <Link
              href="/workspace/ai"
              className="w-full flex items-center justify-center space-x-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <span>Open Agent Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Activity Feed Widget */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground">Recent Audit Stream</h3>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              {[
                { text: 'Sathish Kumar generated new API key for Staging Cluster', time: '10m ago' },
                { text: 'SOC 2 Type II compliance audit log bundle exported', time: '1h ago' },
                { text: 'Memomes Vault sync completed: 1.2 GB object payload', time: '3h ago' },
                { text: 'Sathus AI Agent deployed: Risk Assessment Workflow', time: '5h ago' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />
                  <div>
                    <div className="text-foreground font-medium">{item.text}</div>
                    <div className="text-[10px] text-muted-foreground">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
