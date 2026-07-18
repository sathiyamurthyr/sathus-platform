"""Workflow domain models."""

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, Field


class WorkflowStatus(StrEnum):
    """Workflow status enumeration."""

    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class WorkflowInstanceStatus(StrEnum):
    """Workflow instance status enumeration."""

    PENDING = "pending"
    RUNNING = "running"
    APPROVED = "approved"
    REJECTED = "rejected"
    CHANGES_REQUESTED = "changes_requested"
    ESCALATED = "escalated"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class ApprovalAction(StrEnum):
    """Approval action enumeration."""

    APPROVE = "approve"
    REJECT = "reject"
    REQUEST_CHANGES = "request_changes"
    ESCALATE = "escalate"
    REASSIGN = "reassign"
    DELEGATE = "delegate"
    CANCEL = "cancel"


class AssignmentType(StrEnum):
    """Assignment type enumeration."""

    USER = "user"
    ROLE = "role"
    DEPARTMENT = "department"
    MANAGER = "manager"
    DYNAMIC = "dynamic"


class WorkflowStageType(StrEnum):
    """Workflow stage type enumeration."""

    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    DECISION = "decision"
    AUTOMATIC = "automatic"


class WorkflowDefinition(BaseModel):
    """Workflow definition aggregate root."""

    id: UUID
    name: str
    description: str | None = None
    status: WorkflowStatus = WorkflowStatus.DRAFT
    version: int = 1
    stages: list[dict] = Field(default_factory=list)  # JSON array of stage definitions
    created_by: UUID
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class WorkflowStage(BaseModel):
    """Workflow stage value object."""

    id: UUID
    workflow_id: UUID
    name: str
    stage_type: WorkflowStageType
    order: int
    assignees: list[UUID] = Field(default_factory=list)  # User IDs
    assignment_type: AssignmentType = AssignmentType.USER
    sla_hours: int | None = None
    conditions: dict | None = None  # JSON for conditional logic
    is_final: bool = False


class WorkflowInstance(BaseModel):
    """Workflow instance aggregate root."""

    id: UUID
    workflow_definition_id: UUID
    name: str
    description: str | None = None
    status: WorkflowInstanceStatus = WorkflowInstanceStatus.PENDING
    current_stage_id: UUID | None = None
    requester_id: UUID
    assignee_id: UUID | None = None
    due_date: datetime | None = None
    completed_at: datetime | None = None
    cancelled_at: datetime | None = None
    metadata: dict = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        """Pydantic config."""

        frozen = True


class WorkflowAction(BaseModel):
    """Workflow action value object."""

    id: UUID
    workflow_instance_id: UUID
    action: ApprovalAction
    actor_id: UUID
    from_stage_id: UUID | None = None
    to_stage_id: UUID | None = None
    comment: str | None = None
    created_at: datetime

    class Config:
        """Pydantic config."""

        frozen = True


class WorkflowComment(BaseModel):
    """Workflow comment value object."""

    id: UUID
    workflow_instance_id: UUID
    author_id: UUID
    content: str
    mentions: list[UUID] = Field(default_factory=list)
    created_at: datetime

    class Config:
        """Pydantic config."""

        frozen = True