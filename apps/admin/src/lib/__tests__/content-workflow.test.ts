import { describe, expect, it } from 'vitest';
import {
  canTransition,
  nextStatus,
  availableActions,
  applyWorkflowAction,
  isPublishDue,
  canApprove,
  isLocked,
} from '../content-workflow';

describe('workflow transitions', () => {
  it('allows submitting a draft for review', () => {
    expect(canTransition('Draft', 'submit')).toBe(true);
    expect(nextStatus('Draft', 'submit')).toBe('InReview');
  });

  it('does not allow publishing a draft directly in a strict flow', () => {
    expect(canTransition('Draft', 'publish')).toBe(true);
    expect(canTransition('InReview', 'publish')).toBe(false);
  });

  it('allows approve only from InReview', () => {
    expect(canApprove('InReview')).toBe(true);
    expect(canApprove('Draft')).toBe(false);
  });

  it('lists available actions per status', () => {
    expect(availableActions('InReview').sort()).toEqual(['approve', 'reject'].sort());
    expect(availableActions('Published').sort()).toEqual(['archive', 'unpublish'].sort());
  });

  it('archives and restores', () => {
    expect(nextStatus('Published', 'archive')).toBe('Archived');
    expect(nextStatus('Archived', 'restore')).toBe('Draft');
  });

  it('locks published and archived content', () => {
    expect(isLocked('Published')).toBe(true);
    expect(isLocked('Draft')).toBe(false);
  });
});

describe('applyWorkflowAction', () => {
  it('records reviewer and approval time on approve', () => {
    const wf = applyWorkflowAction({ status: 'InReview' }, 'approve', {
      reviewerName: 'Jane',
      approvalNote: 'Looks good',
    });
    expect(wf.status).toBe('Approved');
    expect(wf.reviewerName).toBe('Jane');
    expect(wf.approvalNote).toBe('Looks good');
    expect(wf.approvedAt).toBeTypeOf('string');
  });

  it('throws on invalid transition', () => {
    expect(() => applyWorkflowAction({ status: 'Draft' }, 'approve')).toThrow();
  });

  it('requires scheduledAt for scheduling', () => {
    expect(() => applyWorkflowAction({ status: 'Approved' }, 'schedule')).toThrow();
  });

  it('sets publishedAt on publish', () => {
    const wf = applyWorkflowAction({ status: 'Approved' }, 'publish');
    expect(wf.status).toBe('Published');
    expect(wf.publishedAt).toBeTypeOf('string');
  });
});

describe('isPublishDue', () => {
  it('is false when not scheduled', () => {
    expect(isPublishDue({ status: 'Draft' })).toBe(false);
  });

  it('is true when scheduled time has passed', () => {
    const past = new Date(Date.now() - 1000).toISOString();
    expect(isPublishDue({ status: 'Scheduled', scheduledAt: past })).toBe(true);
  });

  it('is false when scheduled time is in the future', () => {
    const future = new Date(Date.now() + 100000).toISOString();
    expect(isPublishDue({ status: 'Scheduled', scheduledAt: future })).toBe(false);
  });
});
