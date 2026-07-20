'use client';

import React, { useState } from 'react';
import {
  Workflow,
  Zap,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  Plus,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  UserCheck,
  Check,
  X,
  FileCode,
  Globe,
  Radio,
} from 'lucide-react';
import {
  mockWorkflows,
  mockWorkflowInstances,
  mockPendingApprovals,
  mockWorkflowMetrics,
} from '../../data/mock-workflow-data';
import type { WorkflowDefinition, WorkflowApproval, WorkflowInstance } from '../../types';

export function AutomationPlatformView() {
  const [activeTab, setActiveTab] = useState<'workflows' | 'executions' | 'approvals' | 'schedules' | 'observability'>('workflows');

  // Workflows state
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>(mockWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(mockWorkflows[0]);

  // Executions state
  const [instances, setInstances] = useState<WorkflowInstance[]>(mockWorkflowInstances);

  // Approvals state
  const [approvals, setApprovals] = useState<WorkflowApproval[]>(mockPendingApprovals);
  const [approvalNotice, setApprovalNotice] = useState<string | null>(null);

  const handleTriggerWorkflow = (wf: WorkflowDefinition) => {
    const newInst: WorkflowInstance = {
      id: `inst-${Date.now().toString().slice(-4)}`,
      workflowId: wf.id,
      workflowName: wf.name,
      status: 'running',
      startedAt: new Date().toISOString(),
      triggeredBy: 'Manual Dispatch by User',
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          instanceId: `inst-${Date.now().toString().slice(-4)}`,
          stepId: wf.steps[0]?.id || 'step-1',
          stepName: wf.steps[0]?.name || 'Initiate Step',
          status: 'success',
          output: 'Manually dispatched from Sathus Cloud Automation Dashboard.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    };

    setInstances((prev) => [newInst, ...prev]);
    setActiveTab('executions');
  };

  const handleDecision = (approvalId: string, status: 'approved' | 'rejected') => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === approvalId ? { ...a, status, decidedAt: new Date().toISOString() } : a))
    );
    setApprovalNotice(`Approval request ${status === 'approved' ? 'APPROVED' : 'REJECTED'} successfully.`);
    setTimeout(() => setApprovalNotice(null), 3500);
  };

  const triggerBadge: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    event: { bg: 'bg-purple-500/10 border-purple-500/20 text-purple-500', text: 'Domain Event', icon: <Zap className="w-3 h-3" /> },
    schedule: { bg: 'bg-amber-500/10 border-amber-500/20 text-amber-500', text: 'Cron Schedule', icon: <Clock className="w-3 h-3" /> },
    webhook: { bg: 'bg-blue-500/10 border-blue-500/20 text-blue-500', text: 'Webhook', icon: <Globe className="w-3 h-3" /> },
    manual: { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500', text: 'Manual', icon: <Play className="w-3 h-3" /> },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Workflow className="w-6 h-6 text-primary" />
            <span>Enterprise Workflow & Automation Platform</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            EPIC-021 Multi-tenant business process engine, cron scheduler, AI steps, and human approvals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {approvals.filter((a) => a.status === 'pending').length > 0 && (
            <button
              onClick={() => setActiveTab('approvals')}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse flex items-center space-x-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{approvals.filter((a) => a.status === 'pending').length} Pending Approval</span>
            </button>
          )}
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Workflow Engine Active</span>
          </span>
        </div>
      </div>

      {approvalNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{approvalNotice}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'workflows', label: 'Workflow Directory', icon: <Layers className="w-4 h-4" /> },
          { id: 'executions', label: 'Live Executions & Audit', icon: <Radio className="w-4 h-4" /> },
          { id: 'approvals', label: 'Human Approval Queue', icon: <UserCheck className="w-4 h-4" /> },
          { id: 'schedules', label: 'Cron & Webhook Schedules', icon: <Calendar className="w-4 h-4" /> },
          { id: 'observability', label: 'Automation Metrics', icon: <BarChart3 className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as 'workflows' | 'executions' | 'approvals' | 'schedules' | 'observability')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: WORKFLOW DIRECTORY */}
      {activeTab === 'workflows' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configured Workflows</span>
              <button className="p-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 flex items-center space-x-1">
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            {workflows.map((wf) => {
              const trig = triggerBadge[wf.trigger.type] || triggerBadge.manual;
              return (
                <button
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`w-full p-4 rounded-xl text-left border transition-all space-y-2 ${
                    selectedWorkflow?.id === wf.id
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border flex items-center space-x-1 ${trig.bg}`}>
                      {trig.icon}
                      <span>{trig.text}</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">v{wf.version}</span>
                  </div>

                  <h4 className="text-xs font-bold text-foreground leading-snug">{wf.name}</h4>
                  <div className="text-[10px] text-muted-foreground flex items-center space-x-2">
                    <span>{wf.steps.length} Steps</span>
                    <span>• Author: {wf.author}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedWorkflow && (
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedWorkflow.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedWorkflow.description}</p>
                </div>
                <button
                  onClick={() => handleTriggerWorkflow(selectedWorkflow)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity flex items-center space-x-2 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Workflow</span>
                </button>
              </div>

              {/* Step Pipeline Visualization */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Step Execution Pipeline</div>
                <div className="space-y-3">
                  {selectedWorkflow.steps.map((step, idx) => (
                    <div key={step.id} className="relative flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                        {idx + 1}
                      </div>
                      <div className="flex-1 p-3 rounded-lg bg-background border border-border flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-foreground">{step.name}</div>
                          <div className="text-[10px] text-muted-foreground capitalize">
                            Type: {step.type} {step.actionType ? `(${step.actionType})` : ''}
                          </div>
                        </div>
                        {step.type === 'ai_step' && <Sparkles className="w-4 h-4 text-purple-500" />}
                        {step.type === 'approval' && <UserCheck className="w-4 h-4 text-amber-500" />}
                        {step.type === 'action' && <Zap className="w-4 h-4 text-primary" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIVE EXECUTIONS & AUDIT */}
      {activeTab === 'executions' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Live Workflow Executions</h3>
            <p className="text-xs text-muted-foreground">Real-time instance status, duration, and step-by-step audit logs.</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {instances.map((inst) => (
              <div key={inst.id} className="p-5 space-y-4 hover:bg-muted/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-foreground">{inst.workflowName}</span>
                      <span className="text-xs font-mono text-muted-foreground">({inst.id})</span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-0.5">
                      Triggered by <strong className="text-foreground">{inst.triggeredBy}</strong> at {new Date(inst.startedAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border shrink-0 ${
                      inst.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : inst.status === 'waiting_approval'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}
                  >
                    {inst.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Audit Logs */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Execution Audit Trail</div>
                  <div className="space-y-1.5">
                    {inst.auditLogs.map((log) => (
                      <div key={log.id} className="p-2.5 rounded-lg bg-background border border-border text-xs flex items-start space-x-2">
                        {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                        {log.status === 'pending' && <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                        <div>
                          <div className="font-bold text-foreground">{log.stepName}</div>
                          <div className="text-muted-foreground text-[11px]">{log.output}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HUMAN APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Human Approval Queue</h3>
            <p className="text-xs text-muted-foreground">Pending human decision steps required before workflow progression.</p>
          </div>

          {approvals.filter((a) => a.status === 'pending').length === 0 ? (
            <div className="p-8 text-center bg-card border border-border rounded-xl space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="text-sm font-bold text-foreground">Zero Pending Approvals</div>
              <p className="text-xs text-muted-foreground">All human approval steps have been completed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvals
                .filter((a) => a.status === 'pending')
                .map((appr) => (
                  <div key={appr.id} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {appr.approverRole}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(appr.requestedAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground">{appr.workflowName}</h4>
                      <p className="text-xs text-muted-foreground font-medium pt-1">{appr.stepName}</p>
                    </div>

                    <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg border border-border font-mono leading-relaxed">
                      {appr.details}
                    </p>

                    <div className="pt-2 flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleDecision(appr.id, 'rejected')}
                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 font-semibold text-xs hover:bg-red-500/20 flex items-center space-x-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleDecision(appr.id, 'approved')}
                        className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold text-xs hover:opacity-90 flex items-center space-x-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CRON & WEBHOOK SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Schedules & Webhooks Manager</h3>
            <p className="text-xs text-muted-foreground">Configured Cron schedules and incoming event webhook endpoints.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
              <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Cron Job Schedules</span>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border space-y-1 font-mono text-xs">
                <div className="flex justify-between font-bold text-foreground">
                  <span>Nightly DB Backup</span>
                  <span className="text-amber-500">0 2 * * *</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Next Execution: Tomorrow at 02:00 UTC</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
              <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Active Webhook Triggers</span>
              </div>
              <div className="p-3 rounded-lg bg-background border border-border space-y-1 font-mono text-xs">
                <div className="font-bold text-foreground">GitHub Release Tag Webhook</div>
                <div className="text-[10px] text-muted-foreground text-ellipsis overflow-hidden">
                  https://api.sathus.in/api/v1/workflows/webhooks/deploy-tag
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUTOMATION METRICS */}
      {activeTab === 'observability' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Workflow Observability & Queue Depth</h3>
            <p className="text-xs text-muted-foreground">Engine throughput, execution success rate, and duration metrics.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Workflow Definitions', val: mockWorkflowMetrics.totalWorkflows, icon: <Layers className="w-4 h-4 text-primary" /> },
              { label: 'Total Instance Executions', val: mockWorkflowMetrics.totalExecutions.toLocaleString(), icon: <Play className="w-4 h-4 text-purple-500" /> },
              { label: 'Success Rate', val: `${mockWorkflowMetrics.successRatePercent}%`, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
              { label: 'Avg Execution Time', val: `${mockWorkflowMetrics.averageExecutionDurationMs} ms`, icon: <Clock className="w-4 h-4 text-amber-500" /> },
            ].map((m, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>{m.label}</span>
                  {m.icon}
                </div>
                <div className="text-2xl font-extrabold text-foreground">{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
