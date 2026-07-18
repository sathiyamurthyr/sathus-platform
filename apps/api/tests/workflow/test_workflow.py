"""Workflow module tests."""

import pytest
from datetime import datetime
from uuid import UUID, uuid4

from app.workflow.domain.models import (
    WorkflowStatus,
    WorkflowInstanceStatus,
    ApprovalAction,
    AssignmentType,
    WorkflowStageType,
    WorkflowDefinition,
    WorkflowStage,
    WorkflowInstance,
    WorkflowAction,
    WorkflowComment,
)
from app.workflow.domain.events import (
    WorkflowDefinitionCreated,
    WorkflowDefinitionPublished,
    WorkflowInstanceStarted,
    WorkflowInstanceCompleted,
    WorkflowInstanceCancelled,
    WorkflowActionRecorded,
    WorkflowEscalated,
    WorkflowReassigned,
    WorkflowCommentAdded,
)


# Domain Model Tests
class TestWorkflowStatus:
    """Test WorkflowStatus enum."""

    def test_status_values(self):
        """Test workflow status enum values."""
        assert WorkflowStatus.DRAFT == "draft"
        assert WorkflowStatus.PUBLISHED == "published"
        assert WorkflowStatus.ARCHIVED == "archived"

    def test_status_is_string_enum(self):
        """Test that WorkflowStatus is a string enum."""
        assert isinstance(WorkflowStatus.DRAFT.value, str)


class TestWorkflowInstanceStatus:
    """Test WorkflowInstanceStatus enum."""

    def test_status_values(self):
        """Test workflow instance status enum values."""
        assert WorkflowInstanceStatus.PENDING == "pending"
        assert WorkflowInstanceStatus.RUNNING == "running"
        assert WorkflowInstanceStatus.APPROVED == "approved"
        assert WorkflowInstanceStatus.REJECTED == "rejected"
        assert WorkflowInstanceStatus.CHANGES_REQUESTED == "changes_requested"
        assert WorkflowInstanceStatus.ESCALATED == "escalated"
        assert WorkflowInstanceStatus.CANCELLED == "cancelled"
        assert WorkflowInstanceStatus.COMPLETED == "completed"


class TestApprovalAction:
    """Test ApprovalAction enum."""

    def test_action_values(self):
        """Test approval action enum values."""
        assert ApprovalAction.APPROVE == "approve"
        assert ApprovalAction.REJECT == "reject"
        assert ApprovalAction.REQUEST_CHANGES == "request_changes"
        assert ApprovalAction.ESCALATE == "escalate"
        assert ApprovalAction.REASSIGN == "reassign"
        assert ApprovalAction.DELEGATE == "delegate"
        assert ApprovalAction.CANCEL == "cancel"


class TestAssignmentType:
    """Test AssignmentType enum."""

    def test_assignment_type_values(self):
        """Test assignment type enum values."""
        assert AssignmentType.USER == "user"
        assert AssignmentType.ROLE == "role"
        assert AssignmentType.DEPARTMENT == "department"
        assert AssignmentType.MANAGER == "manager"
        assert AssignmentType.DYNAMIC == "dynamic"


class TestWorkflowStageType:
    """Test WorkflowStageType enum."""

    def test_stage_type_values(self):
        """Test workflow stage type enum values."""
        assert WorkflowStageType.SEQUENTIAL == "sequential"
        assert WorkflowStageType.PARALLEL == "parallel"
        assert WorkflowStageType.CONDITIONAL == "conditional"
        assert WorkflowStageType.DECISION == "decision"
        assert WorkflowStageType.AUTOMATIC == "automatic"


class TestWorkflowDefinition:
    """Test WorkflowDefinition model."""

    def test_create_workflow_definition(self):
        """Test creating a workflow definition."""
        workflow_id = uuid4()
        created_by = uuid4()

        workflow = WorkflowDefinition(
            id=workflow_id,
            name="Test Workflow",
            description="Test Description",
            created_by=created_by,
            created_at=datetime.utcnow(),
        )

        assert workflow.id == workflow_id
        assert workflow.name == "Test Workflow"
        assert workflow.description == "Test Description"
        assert workflow.status == WorkflowStatus.DRAFT
        assert workflow.version == 1
        assert workflow.stages == []

    def test_workflow_definition_frozen(self):
        """Test that workflow definition is frozen (immutable)."""
        workflow_id = uuid4()
        created_by = uuid4()

        workflow = WorkflowDefinition(
            id=workflow_id,
            name="Test Workflow",
            created_by=created_by,
            created_at=datetime.utcnow(),
        )

        with pytest.raises(Exception):
            workflow.name = "Modified Name"


class TestWorkflowStage:
    """Test WorkflowStage model."""

    def test_create_workflow_stage(self):
        """Test creating a workflow stage."""
        stage_id = uuid4()
        workflow_id = uuid4()

        stage = WorkflowStage(
            id=stage_id,
            workflow_id=workflow_id,
            name="Review Stage",
            stage_type=WorkflowStageType.SEQUENTIAL,
            order=1,
        )

        assert stage.id == stage_id
        assert stage.workflow_id == workflow_id
        assert stage.name == "Review Stage"
        assert stage.stage_type == WorkflowStageType.SEQUENTIAL
        assert stage.order == 1
        assert stage.assignees == []
        assert stage.assignment_type == AssignmentType.USER
        assert stage.is_final is False


class TestWorkflowInstance:
    """Test WorkflowInstance model."""

    def test_create_workflow_instance(self):
        """Test creating a workflow instance."""
        instance_id = uuid4()
        workflow_def_id = uuid4()
        requester_id = uuid4()

        instance = WorkflowInstance(
            id=instance_id,
            workflow_definition_id=workflow_def_id,
            name="Test Instance",
            requester_id=requester_id,
            created_at=datetime.utcnow(),
        )

        assert instance.id == instance_id
        assert instance.workflow_definition_id == workflow_def_id
        assert instance.name == "Test Instance"
        assert instance.status == WorkflowInstanceStatus.PENDING
        assert instance.requester_id == requester_id
        assert instance.metadata == {}

    def test_workflow_instance_frozen(self):
        """Test that workflow instance is frozen (immutable)."""
        instance_id = uuid4()
        workflow_def_id = uuid4()
        requester_id = uuid4()

        instance = WorkflowInstance(
            id=instance_id,
            workflow_definition_id=workflow_def_id,
            name="Test Instance",
            requester_id=requester_id,
            created_at=datetime.utcnow(),
        )

        with pytest.raises(Exception):
            instance.name = "Modified Name"


class TestWorkflowAction:
    """Test WorkflowAction model."""

    def test_create_workflow_action(self):
        """Test creating a workflow action."""
        action_id = uuid4()
        instance_id = uuid4()
        actor_id = uuid4()

        action = WorkflowAction(
            id=action_id,
            workflow_instance_id=instance_id,
            action=ApprovalAction.APPROVE,
            actor_id=actor_id,
            created_at=datetime.utcnow(),
        )

        assert action.id == action_id
        assert action.workflow_instance_id == instance_id
        assert action.action == ApprovalAction.APPROVE
        assert action.actor_id == actor_id


class TestWorkflowComment:
    """Test WorkflowComment model."""

    def test_create_workflow_comment(self):
        """Test creating a workflow comment."""
        comment_id = uuid4()
        instance_id = uuid4()
        author_id = uuid4()

        comment = WorkflowComment(
            id=comment_id,
            workflow_instance_id=instance_id,
            author_id=author_id,
            content="This is a test comment",
            created_at=datetime.utcnow(),
        )

        assert comment.id == comment_id
        assert comment.workflow_instance_id == instance_id
        assert comment.author_id == author_id
        assert comment.content == "This is a test comment"
        assert comment.mentions == []


# Domain Events Tests
class TestWorkflowDefinitionCreated:
    """Test WorkflowDefinitionCreated event."""

    def test_event_creation(self):
        """Test creating workflow definition created event."""
        workflow_id = uuid4()
        created_by = uuid4()

        event = WorkflowDefinitionCreated(
            workflow_id=workflow_id,
            name="Test Workflow",
            created_by=created_by,
            created_at=datetime.utcnow(),
        )

        assert event.workflow_id == workflow_id
        assert event.name == "Test Workflow"
        assert event.created_by == created_by


class TestWorkflowDefinitionPublished:
    """Test WorkflowDefinitionPublished event."""

    def test_event_creation(self):
        """Test creating workflow definition published event."""
        workflow_id = uuid4()

        event = WorkflowDefinitionPublished(
            workflow_id=workflow_id,
            version=1,
            published_at=datetime.utcnow(),
        )

        assert event.workflow_id == workflow_id
        assert event.version == 1


class TestWorkflowInstanceStarted:
    """Test WorkflowInstanceStarted event."""

    def test_event_creation(self):
        """Test creating workflow instance started event."""
        instance_id = uuid4()
        workflow_id = uuid4()
        requester_id = uuid4()

        event = WorkflowInstanceStarted(
            instance_id=instance_id,
            workflow_id=workflow_id,
            requester_id=requester_id,
            started_at=datetime.utcnow(),
        )

        assert event.instance_id == instance_id
        assert event.workflow_id == workflow_id
        assert event.requester_id == requester_id


class TestWorkflowInstanceCompleted:
    """Test WorkflowInstanceCompleted event."""

    def test_event_creation(self):
        """Test creating workflow instance completed event."""
        instance_id = uuid4()
        workflow_id = uuid4()

        event = WorkflowInstanceCompleted(
            instance_id=instance_id,
            workflow_id=workflow_id,
            completed_at=datetime.utcnow(),
        )

        assert event.instance_id == instance_id
        assert event.workflow_id == workflow_id


class TestWorkflowInstanceCancelled:
    """Test WorkflowInstanceCancelled event."""

    def test_event_creation(self):
        """Test creating workflow instance cancelled event."""
        instance_id = uuid4()
        cancelled_by = uuid4()

        event = WorkflowInstanceCancelled(
            instance_id=instance_id,
            cancelled_by=cancelled_by,
            reason="Test reason",
            cancelled_at=datetime.utcnow(),
        )

        assert event.instance_id == instance_id
        assert event.cancelled_by == cancelled_by
        assert event.reason == "Test reason"


class TestWorkflowActionRecorded:
    """Test WorkflowActionRecorded event."""

    def test_event_creation(self):
        """Test creating workflow action recorded event."""
        action_id = uuid4()
        instance_id = uuid4()
        actor_id = uuid4()

        event = WorkflowActionRecorded(
            action_id=action_id,
            instance_id=instance_id,
            action="approve",
            actor_id=actor_id,
            created_at=datetime.utcnow(),
        )

        assert event.action_id == action_id
        assert event.instance_id == instance_id
        assert event.action == "approve"


class TestWorkflowEscalated:
    """Test WorkflowEscalated event."""

    def test_event_creation(self):
        """Test creating workflow escalated event."""
        instance_id = uuid4()
        to_assignee = uuid4()

        event = WorkflowEscalated(
            instance_id=instance_id,
            to_assignee=to_assignee,
            escalated_at=datetime.utcnow(),
        )

        assert event.instance_id == instance_id
        assert event.to_assignee == to_assignee


class TestWorkflowReassigned:
    """Test WorkflowReassigned event."""

    def test_event_creation(self):
        """Test creating workflow reassigned event."""
        instance_id = uuid4()
        to_assignee = uuid4()

        event = WorkflowReassigned(
            instance_id=instance_id,
            to_assignee=to_assignee,
            reassigned_at=datetime.utcnow(),
        )

        assert event.instance_id == instance_id
        assert event.to_assignee == to_assignee


class TestWorkflowCommentAdded:
    """Test WorkflowCommentAdded event."""

    def test_event_creation(self):
        """Test creating workflow comment added event."""
        comment_id = uuid4()
        instance_id = uuid4()
        author_id = uuid4()

        event = WorkflowCommentAdded(
            comment_id=comment_id,
            instance_id=instance_id,
            author_id=author_id,
            created_at=datetime.utcnow(),
        )

        assert event.comment_id == comment_id
        assert event.instance_id == instance_id
        assert event.author_id == author_id