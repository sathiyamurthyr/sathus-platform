"""Workflow repositories."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.workflow.infrastructure.models import (
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowAction,
    WorkflowComment,
    WorkflowStatus,
    WorkflowInstanceStatus,
    ApprovalAction,
)


class WorkflowDefinitionRepository:
    """Workflow definition repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        name: str,
        created_by: UUID,
        description: str | None = None,
        stages: list[dict] | None = None,
    ) -> WorkflowDefinition:
        """Create a new workflow definition."""
        workflow = WorkflowDefinition(
            name=name,
            created_by=created_by,
            description=description,
            stages=stages,
        )
        self.session.add(workflow)
        await self.session.flush()
        return workflow

    async def get_by_id(self, workflow_id: UUID) -> WorkflowDefinition | None:
        """Get workflow definition by ID."""
        result = await self.session.execute(
            select(WorkflowDefinition).where(WorkflowDefinition.id == workflow_id)
        )
        return result.scalar_one_or_none()

    async def get_published(self) -> list[WorkflowDefinition]:
        """Get all published workflow definitions."""
        result = await self.session.execute(
            select(WorkflowDefinition).where(
                WorkflowDefinition.status == WorkflowStatus.PUBLISHED
            )
        )
        return list(result.scalars().all())

    async def list_all(
        self,
        status: WorkflowStatus | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[WorkflowDefinition]:
        """List workflow definitions."""
        query = select(WorkflowDefinition)
        if status:
            query = query.where(WorkflowDefinition.status == status)
        query = query.order_by(WorkflowDefinition.name).limit(limit).offset(offset)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def publish(self, workflow: WorkflowDefinition) -> None:
        """Publish a workflow definition."""
        workflow.status = WorkflowStatus.PUBLISHED
        await self.session.flush()

    async def archive(self, workflow: WorkflowDefinition) -> None:
        """Archive a workflow definition."""
        workflow.status = WorkflowStatus.ARCHIVED
        await self.session.flush()


class WorkflowInstanceRepository:
    """Workflow instance repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        workflow_definition_id: UUID,
        name: str,
        requester_id: UUID,
        description: str | None = None,
        due_date: datetime | None = None,
        metadata: dict | None = None,
    ) -> WorkflowInstance:
        """Create a new workflow instance."""
        instance = WorkflowInstance(
            workflow_definition_id=workflow_definition_id,
            name=name,
            requester_id=requester_id,
            description=description,
            due_date=due_date,
            instance_metadata=metadata,
        )
        self.session.add(instance)
        await self.session.flush()
        return instance

    async def get_by_id(self, instance_id: UUID) -> WorkflowInstance | None:
        """Get workflow instance by ID."""
        result = await self.session.execute(
            select(WorkflowInstance).where(WorkflowInstance.id == instance_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user(
        self,
        user_id: UUID,
        status: WorkflowInstanceStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[WorkflowInstance]:
        """Get workflow instances for a user (as requester or assignee)."""
        query = select(WorkflowInstance).where(
            and_(
                WorkflowInstance.requester_id == user_id,
                WorkflowInstance.assignee_id == user_id,
            )
        )
        if status:
            query = query.where(WorkflowInstance.status == status)
        query = query.order_by(WorkflowInstance.created_at.desc()).limit(limit).offset(offset)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_pending_for_user(self, user_id: UUID) -> list[WorkflowInstance]:
        """Get pending workflow instances for a user to approve."""
        result = await self.session.execute(
            select(WorkflowInstance)
            .where(
                and_(
                    WorkflowInstance.assignee_id == user_id,
                    WorkflowInstance.status == WorkflowInstanceStatus.PENDING,
                )
            )
            .order_by(WorkflowInstance.due_date)
        )
        return list(result.scalars().all())

    async def update_status(
        self,
        instance: WorkflowInstance,
        status: WorkflowInstanceStatus,
    ) -> None:
        """Update workflow instance status."""
        instance.status = status
        if status == WorkflowInstanceStatus.COMPLETED:
            instance.completed_at = datetime.utcnow()
        elif status == WorkflowInstanceStatus.CANCELLED:
            instance.cancelled_at = datetime.utcnow()
        await self.session.flush()

    async def update_assignee(
        self,
        instance: WorkflowInstance,
        assignee_id: UUID | None,
    ) -> None:
        """Update workflow instance assignee."""
        instance.assignee_id = assignee_id
        await self.session.flush()


class WorkflowActionRepository:
    """Workflow action repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        workflow_instance_id: UUID,
        action: ApprovalAction,
        actor_id: UUID,
        from_stage_id: UUID | None = None,
        to_stage_id: UUID | None = None,
        comment: str | None = None,
    ) -> WorkflowAction:
        """Create a new workflow action."""
        action_obj = WorkflowAction(
            workflow_instance_id=workflow_instance_id,
            action=action,
            actor_id=actor_id,
            from_stage_id=from_stage_id,
            to_stage_id=to_stage_id,
            comment=comment,
        )
        self.session.add(action_obj)
        await self.session.flush()
        return action_obj

    async def get_by_instance(
        self,
        instance_id: UUID,
        limit: int = 100,
    ) -> list[WorkflowAction]:
        """Get actions for a workflow instance."""
        result = await self.session.execute(
            select(WorkflowAction)
            .where(WorkflowAction.workflow_instance_id == instance_id)
            .order_by(WorkflowAction.created_at)
            .limit(limit)
        )
        return list(result.scalars().all())


class WorkflowCommentRepository:
    """Workflow comment repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        workflow_instance_id: UUID,
        author_id: UUID,
        content: str,
        mentions: list[UUID] | None = None,
    ) -> WorkflowComment:
        """Create a new workflow comment."""
        comment = WorkflowComment(
            workflow_instance_id=workflow_instance_id,
            author_id=author_id,
            content=content,
            mentions=mentions,
        )
        self.session.add(comment)
        await self.session.flush()
        return comment

    async def get_by_instance(
        self,
        instance_id: UUID,
        limit: int = 100,
    ) -> list[WorkflowComment]:
        """Get comments for a workflow instance."""
        result = await self.session.execute(
            select(WorkflowComment)
            .where(WorkflowComment.workflow_instance_id == instance_id)
            .order_by(WorkflowComment.created_at)
            .limit(limit)
        )
        return list(result.scalars().all())