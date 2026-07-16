import type { ContentStatusValue, ContentWorkflow, WorkflowActionValue } from '@/types/content';

export interface WorkflowTransition {
  action: WorkflowActionValue;
  from: ContentStatusValue;
  to: ContentStatusValue;
}

export const WORKFLOW_TRANSITIONS: WorkflowTransition[] = [
  { action: 'submit', from: 'Draft', to: 'InReview' },
  { action: 'submit', from: 'Approved', to: 'InReview' },
  { action: 'reject', from: 'InReview', to: 'Draft' },
  { action: 'approve', from: 'InReview', to: 'Approved' },
  { action: 'schedule', from: 'Approved', to: 'Scheduled' },
  { action: 'schedule', from: 'Draft', to: 'Scheduled' },
  { action: 'publish', from: 'Approved', to: 'Published' },
  { action: 'publish', from: 'Scheduled', to: 'Published' },
  { action: 'publish', from: 'Draft', to: 'Published' },
  { action: 'unpublish', from: 'Published', to: 'Draft' },
  { action: 'archive', from: 'Published', to: 'Archived' },
  { action: 'archive', from: 'Draft', to: 'Archived' },
  { action: 'restore', from: 'Archived', to: 'Draft' },
];

export function canTransition(from: ContentStatusValue, action: WorkflowActionValue): boolean {
  return WORKFLOW_TRANSITIONS.some((t) => t.from === from && t.action === action);
}

export function nextStatus(from: ContentStatusValue, action: WorkflowActionValue): ContentStatusValue | null {
  const match = WORKFLOW_TRANSITIONS.find((t) => t.from === from && t.action === action);
  return match ? match.to : null;
}

export function availableActions(status: ContentStatusValue): WorkflowActionValue[] {
  return WORKFLOW_TRANSITIONS.filter((t) => t.from === status).map((t) => t.action);
}

export function canApprove(status: ContentStatusValue): boolean {
  return status === 'InReview';
}

export function isPublished(status: ContentStatusValue): boolean {
  return status === 'Published';
}

export function isArchived(status: ContentStatusValue): boolean {
  return status === 'Archived';
}

export function isLocked(status: ContentStatusValue): boolean {
  return status === 'Published' || status === 'Archived';
}

interface ApplyContext {
  reviewerName?: string;
  approvalNote?: string;
  scheduledAt?: string;
  authorName?: string;
}

export function applyWorkflowAction(
  workflow: ContentWorkflow,
  action: WorkflowActionValue,
  ctx: ApplyContext = {}
): ContentWorkflow {
  const target = nextStatus(workflow.status, action);
  if (!target) {
    throw new Error(`Cannot perform "${action}" from status "${workflow.status}"`);
  }

  const now = new Date().toISOString();
  const updated: ContentWorkflow = { ...workflow, status: target };

  switch (action) {
    case 'submit':
      updated.submittedForReviewAt = now;
      updated.rejectedAt = undefined;
      break;
    case 'approve':
      updated.approvedAt = now;
      updated.reviewerName = ctx.reviewerName ?? ctx.authorName;
      updated.approvalNote = ctx.approvalNote;
      updated.rejectedAt = undefined;
      break;
    case 'reject':
      updated.rejectedAt = now;
      updated.approvedAt = undefined;
      updated.approvalNote = ctx.approvalNote;
      break;
    case 'schedule':
      if (!ctx.scheduledAt) throw new Error('scheduledAt is required to schedule publishing');
      updated.scheduledAt = ctx.scheduledAt;
      break;
    case 'publish':
      updated.publishedAt = now;
      updated.scheduledAt = undefined;
      break;
    case 'unpublish':
      updated.publishedAt = undefined;
      break;
    case 'archive':
      updated.archivedAt = now;
      break;
    case 'restore':
      updated.archivedAt = undefined;
      break;
  }

  return updated;
}

export function parseScheduleDate(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function isPublishDue(workflow: ContentWorkflow, now: Date = new Date()): boolean {
  if (workflow.status !== 'Scheduled' || !workflow.scheduledAt) return false;
  return new Date(workflow.scheduledAt).getTime() <= now.getTime();
}
