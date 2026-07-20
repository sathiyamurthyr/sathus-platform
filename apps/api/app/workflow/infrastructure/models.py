"""Workflow database models."""

from enum import Enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy import (
    Enum as SQLEnum,
)
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class WorkflowStatus(str, Enum):
    """Workflow status enumeration."""

    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class WorkflowInstanceStatus(str, Enum):
    """Workflow instance status enumeration."""

    PENDING = "pending"
    RUNNING = "running"
    APPROVED = "approved"
    REJECTED = "rejected"
    CHANGES_REQUESTED = "changes_requested"
    ESCALATED = "escalated"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class ApprovalAction(str, Enum):
    """Approval action enumeration."""

    APPROVE = "approve"
    REJECT = "reject"
    REQUEST_CHANGES = "request_changes"
    ESCALATE = "escalate"
    REASSIGN = "reassign"
    DELEGATE = "delegate"
    CANCEL = "cancel"


class AssignmentType(str, Enum):
    """Assignment type enumeration."""

    USER = "user"
    ROLE = "role"
    DEPARTMENT = "department"
    MANAGER = "manager"
    DYNAMIC = "dynamic"


class WorkflowStageType(str, Enum):
    """Workflow stage type enumeration."""

    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    DECISION = "decision"
    AUTOMATIC = "automatic"


class WorkflowDefinition(Base):
    """Workflow definition database model."""

    __tablename__ = "workflow_definitions"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(WorkflowStatus), default=WorkflowStatus.DRAFT)
    version = Column(Integer, default=1)
    stages = Column(Text, nullable=True)  # JSON array of stage definitions
    created_by = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class WorkflowInstance(Base):
    """Workflow instance database model."""

    __tablename__ = "workflow_instances"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    workflow_definition_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("workflow_definitions.id"),
        nullable=False,
    )
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(WorkflowInstanceStatus), default=WorkflowInstanceStatus.PENDING)
    current_stage_id = Column(PostgresUUID(as_uuid=True), nullable=True)
    requester_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    assignee_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
    )
    due_date = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    instance_metadata = Column(Text, nullable=True)  # JSON object
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    workflow = relationship("WorkflowDefinition", backref="instances")


class WorkflowAction(Base):
    """Workflow action database model."""

    __tablename__ = "workflow_actions"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    workflow_instance_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("workflow_instances.id"),
        nullable=False,
    )
    action = Column(SQLEnum(ApprovalAction), nullable=False)
    actor_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    from_stage_id = Column(PostgresUUID(as_uuid=True), nullable=True)
    to_stage_id = Column(PostgresUUID(as_uuid=True), nullable=True)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class WorkflowStage(Base):
    """Workflow stage database model."""

    __tablename__ = "workflow_stages"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    workflow_definition_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("workflow_definitions.id"),
        nullable=False,
    )
    name = Column(String(255), nullable=False)
    stage_type = Column(SQLEnum(WorkflowStageType), default=WorkflowStageType.SEQUENTIAL)
    order = Column(Integer, nullable=False)
    assignees = Column(Text, nullable=True)  # JSON array of user IDs
    assignment_type = Column(SQLEnum(AssignmentType), default=AssignmentType.USER)
    sla_hours = Column(Integer, nullable=True)
    conditions = Column(Text, nullable=True)  # JSON for conditional logic
    is_final = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    workflow = relationship("WorkflowDefinition", backref="workflow_stages")


class WorkflowComment(Base):
    """Workflow comment database model."""

    __tablename__ = "workflow_comments"
    __allow_unmapped__ = True

    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    workflow_instance_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("workflow_instances.id"),
        nullable=False,
    )
    author_id = Column(
        PostgresUUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )
    content = Column(Text, nullable=False)
    mentions = Column(Text, nullable=True)  # JSON array of user IDs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
