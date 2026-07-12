'use client';

import * as React from 'react';
import { Check, X, Send, CalendarClock, Archive, RotateCcw, Eye, EyeOff } from 'lucide-react';
import type { ContentItem, ContentWorkflow, WorkflowActionValue } from '@/types/content';
import { availableActions, canApprove } from '@/lib/content-workflow';

export interface ContentWorkflowProps {
  item: ContentItem;
  currentUser: string;
  onAction: (action: WorkflowActionValue, payload?: { approvalNote?: string; scheduledAt?: string }) => Promise<void> | void;
}

const ACTION_META: Record<WorkflowActionValue, { label: string; icon: React.ReactNode; variant?: 'default' | 'destructive' | 'outline' }> = {
  submit: { label: 'Submit for Review', icon: <Send className="h-4 w-4" /> },
  approve: { label: 'Approve', icon: <Check className="h-4 w-4" /> },
  reject: { label: 'Request Changes', icon: <X className="h-4 w-4" />, variant: 'outline' },
  schedule: { label: 'Schedule Publish', icon: <CalendarClock className="h-4 w-4" /> },
  publish: { label: 'Publish', icon: <Eye className="h-4 w-4" /> },
  unpublish: { label: 'Unpublish', icon: <EyeOff className="h-4 w-4" />, variant: 'outline' },
  archive: { label: 'Archive', icon: <Archive className="h-4 w-4" />, variant: 'outline' },
  restore: { label: 'Restore', icon: <RotateCcw className="h-4 w-4" /> },
};

const buttonClass =
  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

function buttonVariant(variant: 'default' | 'destructive' | 'outline' | undefined): string {
  switch (variant) {
    case 'destructive':
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
    case 'outline':
      return 'border border-input hover:bg-muted';
    default:
      return 'bg-primary text-primary-foreground hover:bg-primary/90';
  }
}

export function ContentWorkflow({ item, currentUser, onAction }: ContentWorkflowProps) {
  const workflow: ContentWorkflow = item.workflow ?? { status: item.status };
  const actions = availableActions(item.status);
  const [scheduleAt, setScheduleAt] = React.useState('');
  const [note, setNote] = React.useState('');
  const [pending, setPending] = React.useState<WorkflowActionValue | null>(null);

  const run = async (action: WorkflowActionValue, payload?: { approvalNote?: string; scheduledAt?: string }) => {
    setPending(action);
    try {
      await onAction(action, payload);
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h3 className="text-sm font-medium">Workflow state</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="font-medium">{item.status}</dd></div>
          {workflow.submittedForReviewAt && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Submitted</dt><dd>{new Date(workflow.submittedForReviewAt).toLocaleString()}</dd></div>
          )}
          {workflow.reviewerName && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Reviewer</dt><dd>{workflow.reviewerName}</dd></div>
          )}
          {workflow.approvedAt && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Approved</dt><dd>{new Date(workflow.approvedAt).toLocaleString()}</dd></div>
          )}
          {workflow.scheduledAt && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Scheduled</dt><dd>{new Date(workflow.scheduledAt).toLocaleString()}</dd></div>
          )}
          {workflow.publishedAt && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Published</dt><dd>{new Date(workflow.publishedAt).toLocaleString()}</dd></div>
          )}
          {workflow.archivedAt && (
            <div className="flex justify-between"><dt className="text-muted-foreground">Archived</dt><dd>{new Date(workflow.archivedAt).toLocaleString()}</dd></div>
          )}
        </dl>
      </div>

      {canApprove(item.status) && (
        <div className="rounded-lg border p-6 space-y-3">
          <h3 className="text-sm font-medium">Review decision</h3>
          <textarea
            className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Approval or change request note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="button" className={buttonClass + ' ' + buttonVariant('default')} disabled={pending !== null} onClick={() => run('approve', { approvalNote: note || undefined })}>
              {ACTION_META.approve.icon} Approve
            </button>
            <button type="button" className={buttonClass + ' ' + buttonVariant('outline')} disabled={pending !== null} onClick={() => run('reject', { approvalNote: note || undefined })}>
              {ACTION_META.reject.icon} Request Changes
            </button>
          </div>
        </div>
      )}

      {actions.includes('schedule') && (
        <div className="rounded-lg border p-6 space-y-3">
          <h3 className="text-sm font-medium">Schedule publishing</h3>
          <input
            type="datetime-local"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
          />
          <button
            type="button"
            className={buttonClass + ' ' + buttonVariant('default')}
            disabled={pending !== null || !scheduleAt}
            onClick={() => run('schedule', { scheduledAt: new Date(scheduleAt).toISOString() })}
          >
            {ACTION_META.schedule.icon} Schedule
          </button>
        </div>
      )}

      <div className="rounded-lg border p-6">
        <h3 className="mb-3 text-sm font-medium">Actions</h3>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              aria-label={ACTION_META[action].label}
              className={buttonClass + ' ' + buttonVariant(ACTION_META[action].variant)}
              disabled={pending !== null}
              onClick={() => run(action, { approvalNote: note || undefined })}
            >
              {ACTION_META[action].icon}
              {ACTION_META[action].label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Acting as {currentUser}. Status transitions follow the content workflow policy.</p>
      </div>
    </div>
  );
}
