// EPIC-021 Enterprise Workflow & Automation Domain Types

export type WorkflowStatus = 'active' | 'draft' | 'paused' | 'archived';

export type WorkflowInstanceStatus = 'running' | 'completed' | 'failed' | 'waiting_approval' | 'cancelled';

export type TriggerType = 'event' | 'schedule' | 'webhook' | 'manual';

export type ActionType =
  | 'send_notification'
  | 'create_task'
  | 'generate_ai_content'
  | 'move_file'
  | 'call_api'
  | 'run_webhook'
  | 'approval_request';

export interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  eventName?: string;
  cronExpression?: string;
  webhookUrl?: string;
  parameters?: Record<string, unknown>;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'approval' | 'ai_step' | 'delay';
  actionType?: ActionType;
  parameters?: Record<string, unknown>;
  nextStepId?: string;
  onFailureStepId?: string;
  retryCount?: number;
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  version: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowAuditLog {
  id: string;
  instanceId: string;
  stepId: string;
  stepName: string;
  status: 'success' | 'failed' | 'skipped' | 'pending';
  output?: string;
  timestamp: string;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  workflowName: string;
  status: WorkflowInstanceStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  currentStepId?: string;
  triggeredBy: string;
  auditLogs: WorkflowAuditLog[];
}

export interface WorkflowApproval {
  id: string;
  instanceId: string;
  workflowName: string;
  stepName: string;
  approverRole: string;
  requester: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  decidedAt?: string;
  decidedBy?: string;
}

export interface WorkflowMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successRatePercent: number;
  pendingApprovalsCount: number;
  averageExecutionDurationMs: number;
  failedExecutions: number;
  retryCount: number;
}
