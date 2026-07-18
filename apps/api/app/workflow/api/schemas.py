"""Workflow API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


# Request schemas
class WorkflowDefinitionCreateRequest(BaseModel):
    """Create workflow definition request schema."""

    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    stages: list[dict] | None = None


class WorkflowInstanceStartRequest(BaseModel):
    """Start workflow instance request schema."""

    workflow_definition_id: UUID
    name: str
    description: str | None = None
    due_date: datetime | None = None
    metadata: dict | None = None


class WorkflowActionRequest(BaseModel):
    """Workflow action request schema."""

    action: str
    from_stage_id: UUID | None = None
    to_stage_id: UUID | None = None
    comment: str | None = None


class WorkflowCommentCreateRequest(BaseModel):
    """Create workflow comment request schema."""

    content: str
    mentions: list[UUID] | None = None


class WorkflowStageCreateRequest(BaseModel):
    """Create workflow stage request schema."""

    workflow_definition_id: UUID
    name: str = Field(..., min_length=1, max_length=255)
    order: int = Field(..., ge=0)
    stage_type: str | None = "sequential"
    assignees: list[UUID] | None = None
    assignment_type: str | None = "user"
    sla_hours: int | None = None
    conditions: dict | None = None
    is_final: bool = False


# Response schemas
class WorkflowDefinitionResponse(BaseModel):
    """Workflow definition response schema."""

    id: UUID
    name: str
    description: str | None = None
    status: str
    version: int
    stages: list[dict] | None = None
    created_by: UUID
    created_at: datetime
    updated_at: datetime | None = None


class WorkflowStageResponse(BaseModel):
    """Workflow stage response schema."""

    id: UUID
    workflow_definition_id: UUID
    name: str
    stage_type: str
    order: int
    assignees: list[UUID] | None = None
    assignment_type: str
    sla_hours: int | None = None
    conditions: dict | None = None
    is_final: bool
    created_at: datetime


class WorkflowInstanceResponse(BaseModel):
    """Workflow instance response schema."""

    id: UUID
    workflow_definition_id: UUID
    name: str
    description: str | None = None
    status: str
    current_stage_id: UUID | None = None
    requester_id: UUID
    assignee_id: UUID | None = None
    due_date: datetime | None = None
    completed_at: datetime | None = None
    cancelled_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None


class WorkflowActionResponse(BaseModel):
    """Workflow action response schema."""

    id: UUID
    workflow_instance_id: UUID
    action: str
    actor_id: UUID
    from_stage_id: UUID | None = None
    to_stage_id: UUID | None = None
    comment: str | None = None
    created_at: datetime


class WorkflowCommentResponse(BaseModel):
    """Workflow comment response schema."""

    id: UUID
    workflow_instance_id: UUID
    author_id: UUID
    content: str
    mentions: list[UUID] | None = None
    created_at: datetime


class WorkflowStatusResponse(BaseModel):
    """Workflow status response schema."""

    success: bool
    message: str