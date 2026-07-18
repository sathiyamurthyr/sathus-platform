"""Workflow domain events."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class WorkflowDefinitionCreated(BaseModel):
    """Event emitted when a workflow definition is created."""

    workflow_id: UUID
    name: str
    created_by: UUID
    created_at: datetime


class WorkflowDefinitionPublished(BaseModel):
    """Event emitted when a workflow definition is published."""

    workflow_id: UUID
    version: int
    published_at: datetime


class WorkflowInstanceStarted(BaseModel):
    """Event emitted when a workflow instance is started."""

    instance_id: UUID
    workflow_id: UUID
    requester_id: UUID
    started_at: datetime


class WorkflowInstanceCompleted(BaseModel):
    """Event emitted when a workflow instance is completed."""

    instance_id: UUID
    workflow_id: UUID
    completed_at: datetime


class WorkflowInstanceCancelled(BaseModel):
    """Event emitted when a workflow instance is cancelled."""

    instance_id: UUID
    cancelled_by: UUID
    reason: str | None = None
    cancelled_at: datetime


class WorkflowActionRecorded(BaseModel):
    """Event emitted when a workflow action is recorded."""

    action_id: UUID
    instance_id: UUID
    action: str
    actor_id: UUID
    from_stage_id: UUID | None = None
    to_stage_id: UUID | None = None
    created_at: datetime


class WorkflowEscalated(BaseModel):
    """Event emitted when a workflow is escalated."""

    instance_id: UUID
    from_assignee: UUID | None = None
    to_assignee: UUID | None = None
    escalated_at: datetime


class WorkflowReassigned(BaseModel):
    """Event emitted when a workflow is reassigned."""

    instance_id: UUID
    from_assignee: UUID | None = None
    to_assignee: UUID
    reassigned_at: datetime


class WorkflowCommentAdded(BaseModel):
    """Event emitted when a comment is added to a workflow."""

    comment_id: UUID
    instance_id: UUID
    author_id: UUID
    created_at: datetime