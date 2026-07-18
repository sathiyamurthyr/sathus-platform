"""Workflow application services."""

from datetime import datetime
from uuid import UUID

from app.core.logging import logger
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
from app.workflow.infrastructure.models import (
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowAction,
    WorkflowComment,
    WorkflowStage,
    WorkflowStatus,
    WorkflowInstanceStatus,
    ApprovalAction,
    WorkflowStageType,
    AssignmentType,
)
from app.workflow.infrastructure.repositories import (
    WorkflowDefinitionRepository,
    WorkflowInstanceRepository,
    WorkflowActionRepository,
    WorkflowCommentRepository,
    WorkflowStageRepository,
)


class WorkflowDefinitionService:
    """Workflow definition service."""

    def __init__(self, workflow_repo: WorkflowDefinitionRepository):
        """Initialize service."""
        self.workflow_repo = workflow_repo

    async def create_workflow(
        self,
        name: str,
        created_by: UUID,
        description: str | None = None,
        stages: list[dict] | None = None,
    ) -> WorkflowDefinition:
        """Create a new workflow definition."""
        workflow = await self.workflow_repo.create(
            name=name,
            created_by=created_by,
            description=description,
            stages=stages,
        )

        event = WorkflowDefinitionCreated(
            workflow_id=workflow.id,
            name=name,
            created_by=created_by,
            created_at=workflow.created_at,
        )
        logger.info(f"WorkflowDefinitionCreated: {event.model_dump_json()}")

        return workflow

    async def publish_workflow(self, workflow_id: UUID) -> bool:
        """Publish a workflow definition."""
        workflow = await self.workflow_repo.get_by_id(workflow_id)
        if not workflow:
            return False

        await self.workflow_repo.publish(workflow)

        event = WorkflowDefinitionPublished(
            workflow_id=workflow_id,
            version=workflow.version,
            published_at=datetime.utcnow(),
        )
        logger.info(f"WorkflowDefinitionPublished: {event.model_dump_json()}")

        return True

    async def get_workflow(self, workflow_id: UUID) -> WorkflowDefinition | None:
        """Get workflow definition by ID."""
        return await self.workflow_repo.get_by_id(workflow_id)

    async def list_workflows(
        self,
        status: WorkflowStatus | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[WorkflowDefinition]:
        """List workflow definitions."""
        return await self.workflow_repo.list_all(status, limit, offset)


class WorkflowInstanceService:
    """Workflow instance service."""

    def __init__(
        self,
        instance_repo: WorkflowInstanceRepository,
        action_repo: WorkflowActionRepository,
        workflow_repo: WorkflowDefinitionRepository,
    ):
        """Initialize service."""
        self.instance_repo = instance_repo
        self.action_repo = action_repo
        self.workflow_repo = workflow_repo

    async def start_instance(
        self,
        workflow_definition_id: UUID,
        requester_id: UUID,
        name: str,
        description: str | None = None,
        due_date: datetime | None = None,
        metadata: dict | None = None,
    ) -> WorkflowInstance:
        """Start a new workflow instance."""
        workflow = await self.workflow_repo.get_by_id(workflow_definition_id)
        if not workflow:
            raise ValueError("Workflow definition not found")

        instance = await self.instance_repo.create(
            workflow_definition_id=workflow_definition_id,
            name=name,
            requester_id=requester_id,
            description=description,
            due_date=due_date,
            metadata=metadata,
        )

        event = WorkflowInstanceStarted(
            instance_id=instance.id,
            workflow_id=workflow_definition_id,
            requester_id=requester_id,
            started_at=instance.created_at,
        )
        logger.info(f"WorkflowInstanceStarted: {event.model_dump_json()}")

        return instance

    async def record_action(
        self,
        instance_id: UUID,
        action: ApprovalAction,
        actor_id: UUID,
        from_stage_id: UUID | None = None,
        to_stage_id: UUID | None = None,
        comment: str | None = None,
    ) -> WorkflowAction:
        """Record a workflow action."""
        action_obj = await self.action_repo.create(
            workflow_instance_id=instance_id,
            action=action,
            actor_id=actor_id,
            from_stage_id=from_stage_id,
            to_stage_id=to_stage_id,
            comment=comment,
        )

        event = WorkflowActionRecorded(
            action_id=action_obj.id,
            instance_id=instance_id,
            action=action.value,
            actor_id=actor_id,
            from_stage_id=from_stage_id,
            to_stage_id=to_stage_id,
            created_at=action_obj.created_at,
        )
        logger.info(f"WorkflowActionRecorded: {event.model_dump_json()}")

        return action_obj

    async def complete_instance(self, instance_id: UUID) -> bool:
        """Complete a workflow instance."""
        instance = await self.instance_repo.get_by_id(instance_id)
        if not instance:
            return False

        await self.instance_repo.update_status(instance, WorkflowInstanceStatus.COMPLETED)

        event = WorkflowInstanceCompleted(
            instance_id=instance_id,
            workflow_id=instance.workflow_definition_id,
            completed_at=datetime.utcnow(),
        )
        logger.info(f"WorkflowInstanceCompleted: {event.model_dump_json()}")

        return True

    async def cancel_instance(
        self,
        instance_id: UUID,
        cancelled_by: UUID,
        reason: str | None = None,
    ) -> bool:
        """Cancel a workflow instance."""
        instance = await self.instance_repo.get_by_id(instance_id)
        if not instance:
            return False

        await self.instance_repo.update_status(instance, WorkflowInstanceStatus.CANCELLED)

        event = WorkflowInstanceCancelled(
            instance_id=instance_id,
            cancelled_by=cancelled_by,
            reason=reason,
            cancelled_at=datetime.utcnow(),
        )
        logger.info(f"WorkflowInstanceCancelled: {event.model_dump_json()}")

        return True

    async def escalate_instance(
        self,
        instance_id: UUID,
        to_assignee: UUID,
    ) -> bool:
        """Escalate a workflow instance."""
        instance = await self.instance_repo.get_by_id(instance_id)
        if not instance:
            return False

        from_assignee = instance.assignee_id
        await self.instance_repo.update_assignee(instance, to_assignee)
        await self.instance_repo.update_status(instance, WorkflowInstanceStatus.ESCALATED)

        event = WorkflowEscalated(
            instance_id=instance_id,
            from_assignee=from_assignee,
            to_assignee=to_assignee,
            escalated_at=datetime.utcnow(),
        )
        logger.info(f"WorkflowEscalated: {event.model_dump_json()}")

        return True

    async def reassign_instance(
        self,
        instance_id: UUID,
        to_assignee: UUID,
    ) -> bool:
        """Reassign a workflow instance."""
        instance = await self.instance_repo.get_by_id(instance_id)
        if not instance:
            return False

        from_assignee = instance.assignee_id
        await self.instance_repo.update_assignee(instance, to_assignee)

        event = WorkflowReassigned(
            instance_id=instance_id,
            from_assignee=from_assignee,
            to_assignee=to_assignee,
            reassigned_at=datetime.utcnow(),
        )
        logger.info(f"WorkflowReassigned: {event.model_dump_json()}")

        return True

    async def get_instance(self, instance_id: UUID) -> WorkflowInstance | None:
        """Get workflow instance by ID."""
        return await self.instance_repo.get_by_id(instance_id)

    async def get_pending_for_user(self, user_id: UUID) -> list[WorkflowInstance]:
        """Get pending workflow instances for a user."""
        return await self.instance_repo.get_pending_for_user(user_id)


class WorkflowStageService:
    """Workflow stage service."""

    def __init__(self, stage_repo: WorkflowStageRepository):
        """Initialize service."""
        self.stage_repo = stage_repo

    async def create_stage(
        self,
        workflow_definition_id: UUID,
        name: str,
        order: int,
        stage_type: WorkflowStageType = WorkflowStageType.SEQUENTIAL,
        assignees: list[UUID] | None = None,
        assignment_type: AssignmentType = AssignmentType.USER,
        sla_hours: int | None = None,
        conditions: dict | None = None,
        is_final: bool = False,
    ) -> WorkflowStage:
        """Create a new workflow stage."""
        stage = await self.stage_repo.create(
            workflow_definition_id=workflow_definition_id,
            name=name,
            order=order,
            stage_type=stage_type,
            assignees=assignees,
            assignment_type=assignment_type,
            sla_hours=sla_hours,
            conditions=conditions,
            is_final=is_final,
        )
        return stage

    async def get_stage(self, stage_id: UUID) -> WorkflowStage | None:
        """Get workflow stage by ID."""
        return await self.stage_repo.get_by_id(stage_id)

    async def get_stages(
        self,
        workflow_definition_id: UUID,
        limit: int = 100,
    ) -> list[WorkflowStage]:
        """Get stages for a workflow definition."""
        return await self.stage_repo.get_by_workflow(workflow_definition_id, limit)

    async def update_stage(
        self,
        stage_id: UUID,
        name: str | None = None,
        order: int | None = None,
        is_final: bool | None = None,
    ) -> bool:
        """Update workflow stage."""
        stage = await self.stage_repo.get_by_id(stage_id)
        if not stage:
            return False
        await self.stage_repo.update(stage, name, order, is_final)
        return True

    async def delete_stage(self, stage_id: UUID) -> bool:
        """Delete workflow stage."""
        stage = await self.stage_repo.get_by_id(stage_id)
        if not stage:
            return False
        await self.stage_repo.delete(stage)
        return True


class WorkflowCommentService:
    """Workflow comment service."""

    def __init__(self, comment_repo: WorkflowCommentRepository):
        """Initialize service."""
        self.comment_repo = comment_repo

    async def add_comment(
        self,
        workflow_instance_id: UUID,
        author_id: UUID,
        content: str,
        mentions: list[UUID] | None = None,
    ) -> WorkflowComment:
        """Add a comment to a workflow instance."""
        comment = await self.comment_repo.create(
            workflow_instance_id=workflow_instance_id,
            author_id=author_id,
            content=content,
            mentions=mentions,
        )

        event = WorkflowCommentAdded(
            comment_id=comment.id,
            instance_id=workflow_instance_id,
            author_id=author_id,
            created_at=comment.created_at,
        )
        logger.info(f"WorkflowCommentAdded: {event.model_dump_json()}")

        return comment

    async def get_comments(
        self,
        instance_id: UUID,
        limit: int = 100,
    ) -> list[WorkflowComment]:
        """Get comments for a workflow instance."""
        return await self.comment_repo.get_by_instance(instance_id, limit)
