"""Workflow API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

from app.core.database import get_db
from app.workflow.api.schemas import (
    WorkflowDefinitionCreateRequest,
    WorkflowDefinitionResponse,
    WorkflowInstanceStartRequest,
    WorkflowInstanceResponse,
    WorkflowActionRequest,
    WorkflowActionResponse,
    WorkflowCommentCreateRequest,
    WorkflowCommentResponse,
    WorkflowStatusResponse,
    WorkflowStageCreateRequest,
    WorkflowStageResponse,
)
from app.workflow.application.services import (
    WorkflowDefinitionService,
    WorkflowInstanceService,
    WorkflowCommentService,
    WorkflowStageService,
)
from app.workflow.infrastructure.models import (
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

router = APIRouter()
security = HTTPBearer()


async def get_current_user(token: str = Depends(security)) -> dict:
    """Get current user from token."""
    return {"sub": "test-user-id"}


def get_workflow_definition_service(db=Depends(get_db)) -> WorkflowDefinitionService:
    """Get workflow definition service."""
    return WorkflowDefinitionService(
        workflow_repo=WorkflowDefinitionRepository(db),
    )


def get_workflow_instance_service(db=Depends(get_db)) -> WorkflowInstanceService:
    """Get workflow instance service."""
    return WorkflowInstanceService(
        instance_repo=WorkflowInstanceRepository(db),
        action_repo=WorkflowActionRepository(db),
        workflow_repo=WorkflowDefinitionRepository(db),
    )


def get_workflow_comment_service(db=Depends(get_db)) -> WorkflowCommentService:
    """Get workflow comment service."""
    return WorkflowCommentService(
        comment_repo=WorkflowCommentRepository(db),
    )


def get_workflow_stage_service(db=Depends(get_db)) -> WorkflowStageService:
    """Get workflow stage service."""
    return WorkflowStageService(
        stage_repo=WorkflowStageRepository(db),
    )


# Workflow Definition endpoints
@router.post("/definitions", response_model=WorkflowDefinitionResponse, status_code=201)
async def create_workflow_definition(
    request: WorkflowDefinitionCreateRequest,
    user=Depends(get_current_user),
    service: WorkflowDefinitionService = Depends(get_workflow_definition_service),
) -> WorkflowDefinitionResponse:
    """Create a new workflow definition."""
    workflow = await service.create_workflow(
        name=request.name,
        created_by=UUID(user["sub"]),
        description=request.description,
        stages=request.stages,
    )

    return WorkflowDefinitionResponse(
        id=workflow.id,
        name=workflow.name,
        description=workflow.description,
        status=workflow.status.value,
        version=workflow.version,
        stages=workflow.stages,
        created_by=workflow.created_by,
        created_at=workflow.created_at,
        updated_at=workflow.updated_at,
    )


@router.post("/{workflow_id}/publish", response_model=WorkflowStatusResponse)
async def publish_workflow(
    workflow_id: UUID,
    service: WorkflowDefinitionService = Depends(get_workflow_definition_service),
) -> WorkflowStatusResponse:
    """Publish a workflow definition."""
    success = await service.publish_workflow(workflow_id)
    if not success:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return WorkflowStatusResponse(success=True, message="Workflow published")


@router.get("/definitions", response_model=list[WorkflowDefinitionResponse])
async def list_workflow_definitions(
    status: str | None = None,
    limit: int = 100,
    offset: int = 0,
    service: WorkflowDefinitionService = Depends(get_workflow_definition_service),
) -> list[WorkflowDefinitionResponse]:
    """List workflow definitions."""
    status_enum = None
    if status:
        try:
            status_enum = WorkflowStatus(status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status")

    workflows = await service.list_workflows(status_enum, limit, offset)
    return [
        WorkflowDefinitionResponse(
            id=w.id,
            name=w.name,
            description=w.description,
            status=w.status.value,
            version=w.version,
            stages=w.stages,
            created_by=w.created_by,
            created_at=w.created_at,
            updated_at=w.updated_at,
        )
        for w in workflows
    ]


# Workflow Instance endpoints
@router.post("/instances", response_model=WorkflowInstanceResponse, status_code=201)
async def start_workflow_instance(
    request: WorkflowInstanceStartRequest,
    user=Depends(get_current_user),
    service: WorkflowInstanceService = Depends(get_workflow_instance_service),
) -> WorkflowInstanceResponse:
    """Start a new workflow instance."""
    instance = await service.start_instance(
        workflow_definition_id=request.workflow_definition_id,
        requester_id=UUID(user["sub"]),
        name=request.name,
        description=request.description,
        due_date=request.due_date,
        metadata=request.metadata,
    )

    return WorkflowInstanceResponse(
        id=instance.id,
        workflow_definition_id=instance.workflow_definition_id,
        name=instance.name,
        description=instance.description,
        status=instance.status.value,
        current_stage_id=instance.current_stage_id,
        requester_id=instance.requester_id,
        assignee_id=instance.assignee_id,
        due_date=instance.due_date,
        completed_at=instance.completed_at,
        cancelled_at=instance.cancelled_at,
        created_at=instance.created_at,
        updated_at=instance.updated_at,
    )


@router.get("/instances", response_model=list[WorkflowInstanceResponse])
async def list_workflow_instances(
    status: str | None = None,
    limit: int = 50,
    offset: int = 0,
    user=Depends(get_current_user),
    service: WorkflowInstanceService = Depends(get_workflow_instance_service),
) -> list[WorkflowInstanceResponse]:
    """List workflow instances for current user."""
    status_enum = None
    if status:
        try:
            status_enum = WorkflowInstanceStatus(status)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid status")

    instances = await service.get_pending_for_user(UUID(user["sub"]))
    return [
        WorkflowInstanceResponse(
            id=i.id,
            workflow_definition_id=i.workflow_definition_id,
            name=i.name,
            description=i.description,
            status=i.status.value,
            current_stage_id=i.current_stage_id,
            requester_id=i.requester_id,
            assignee_id=i.assignee_id,
            due_date=i.due_date,
            completed_at=i.completed_at,
            cancelled_at=i.cancelled_at,
            created_at=i.created_at,
            updated_at=i.updated_at,
        )
        for i in instances
    ]


@router.post("/{instance_id}/actions", response_model=WorkflowActionResponse)
async def record_workflow_action(
    instance_id: UUID,
    request: WorkflowActionRequest,
    user=Depends(get_current_user),
    service: WorkflowInstanceService = Depends(get_workflow_instance_service),
) -> WorkflowActionResponse:
    """Record a workflow action."""
    try:
        action = ApprovalAction(request.action)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid action")

    action_obj = await service.record_action(
        instance_id=instance_id,
        action=action,
        actor_id=UUID(user["sub"]),
        from_stage_id=request.from_stage_id,
        to_stage_id=request.to_stage_id,
        comment=request.comment,
    )

    return WorkflowActionResponse(
        id=action_obj.id,
        workflow_instance_id=action_obj.workflow_instance_id,
        action=action_obj.action.value,
        actor_id=action_obj.actor_id,
        from_stage_id=action_obj.from_stage_id,
        to_stage_id=action_obj.to_stage_id,
        comment=action_obj.comment,
        created_at=action_obj.created_at,
    )


@router.post("/{instance_id}/complete", response_model=WorkflowStatusResponse)
async def complete_workflow_instance(
    instance_id: UUID,
    service: WorkflowInstanceService = Depends(get_workflow_instance_service),
) -> WorkflowStatusResponse:
    """Complete a workflow instance."""
    success = await service.complete_instance(instance_id)
    if not success:
        raise HTTPException(status_code=404, detail="Instance not found")
    return WorkflowStatusResponse(success=True, message="Workflow completed")


@router.post("/{instance_id}/cancel", response_model=WorkflowStatusResponse)
async def cancel_workflow_instance(
    instance_id: UUID,
    user=Depends(get_current_user),
    service: WorkflowInstanceService = Depends(get_workflow_instance_service),
) -> WorkflowStatusResponse:
    """Cancel a workflow instance."""
    success = await service.cancel_instance(instance_id, UUID(user["sub"]))
    if not success:
        raise HTTPException(status_code=404, detail="Instance not found")
    return WorkflowStatusResponse(success=True, message="Workflow cancelled")


# Stage endpoints
@router.post("/stages", response_model=WorkflowStageResponse, status_code=201)
async def create_workflow_stage(
    request: WorkflowStageCreateRequest,
    user=Depends(get_current_user),
    service: WorkflowStageService = Depends(get_workflow_stage_service),
) -> WorkflowStageResponse:
    """Create a new workflow stage."""
    stage = await service.create_stage(
        workflow_definition_id=request.workflow_definition_id,
        name=request.name,
        order=request.order,
        stage_type=request.stage_type,
        assignees=request.assignees,
        assignment_type=request.assignment_type,
        sla_hours=request.sla_hours,
        conditions=request.conditions,
        is_final=request.is_final,
    )
    return WorkflowStageResponse(
        id=stage.id,
        workflow_definition_id=stage.workflow_definition_id,
        name=stage.name,
        stage_type=stage.stage_type.value,
        order=stage.order,
        assignees=stage.assignees,
        assignment_type=stage.assignment_type.value,
        sla_hours=stage.sla_hours,
        conditions=stage.conditions,
        is_final=stage.is_final,
        created_at=stage.created_at,
    )


@router.get("/stages", response_model=list[WorkflowStageResponse])
async def list_workflow_stages(
    workflow_definition_id: UUID,
    service: WorkflowStageService = Depends(get_workflow_stage_service),
) -> list[WorkflowStageResponse]:
    """List stages for a workflow definition."""
    stages = await service.get_stages(workflow_definition_id)
    return [
        WorkflowStageResponse(
            id=s.id,
            workflow_definition_id=s.workflow_definition_id,
            name=s.name,
            stage_type=s.stage_type.value,
            order=s.order,
            assignees=s.assignees,
            assignment_type=s.assignment_type.value,
            sla_hours=s.sla_hours,
            conditions=s.conditions,
            is_final=s.is_final,
            created_at=s.created_at,
        )
        for s in stages
    ]


# Comment endpoints
@router.post("/{instance_id}/comments", response_model=WorkflowCommentResponse, status_code=201)
async def add_workflow_comment(
    instance_id: UUID,
    request: WorkflowCommentCreateRequest,
    user=Depends(get_current_user),
    service: WorkflowCommentService = Depends(get_workflow_comment_service),
) -> WorkflowCommentResponse:
    """Add a comment to a workflow instance."""
    comment = await service.add_comment(
        workflow_instance_id=instance_id,
        author_id=UUID(user["sub"]),
        content=request.content,
        mentions=request.mentions,
    )

    return WorkflowCommentResponse(
        id=comment.id,
        workflow_instance_id=comment.workflow_instance_id,
        author_id=comment.author_id,
        content=comment.content,
        mentions=comment.mentions,
        created_at=comment.created_at,
    )
