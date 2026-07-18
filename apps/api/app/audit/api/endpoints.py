"""Audit API endpoints."""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.api.schemas import (
    AuditEventResponse,
    AuditEventCreate,
    AuditQueryRequest,
    AuditSearchResponse,
    AuditStatisticsResponse,
)
from app.audit.application.services import AuditService
from app.audit.domain.models import AuditEventType, AuditSeverity
from app.audit.infrastructure.repositories import AuditEventRepository
from app.core.database import get_db

router = APIRouter()


async def get_audit_service(
    session: AsyncSession = Depends(get_db),
) -> AuditService:
    """Get audit service."""
    return AuditService(AuditEventRepository(session))


@router.post("/", response_model=AuditEventResponse, status_code=status.HTTP_201_CREATED)
async def log_event(
    event: AuditEventCreate,
    service: AuditService = Depends(get_audit_service),
) -> AuditEventResponse:
    """Log an audit event."""
    audit_event = await service.log_event(
        event_type=event.event_type,
        action=event.action,
        description=event.description,
        severity=event.severity,
        user_id=event.user_id,
        tenant_id=event.tenant_id,
        resource_id=event.resource_id,
        resource_type=event.resource_type,
        metadata=event.metadata,
        ip_address=event.ip_address,
        user_agent=event.user_agent,
        correlation_id=event.correlation_id,
    )

    return AuditEventResponse(
        id=audit_event.id,
        event_type=audit_event.event_type.value,
        severity=audit_event.severity.value,
        user_id=audit_event.user_id,
        tenant_id=audit_event.tenant_id,
        resource_id=audit_event.resource_id,
        resource_type=audit_event.resource_type,
        action=audit_event.action,
        description=audit_event.description,
        metadata=audit_event.metadata,
        ip_address=audit_event.ip_address,
        user_agent=audit_event.user_agent,
        correlation_id=audit_event.correlation_id,
        created_at=audit_event.created_at,
    )


@router.post("/search", response_model=AuditSearchResponse)
async def search_events(
    query: AuditQueryRequest,
    service: AuditService = Depends(get_audit_service),
) -> AuditSearchResponse:
    """Search audit events."""
    from app.audit.domain.models import AuditQuery

    audit_query = AuditQuery(
        event_types=query.event_types,
        user_id=query.user_id,
        tenant_id=query.tenant_id,
        severity=query.severity,
        start_date=query.start_date,
        end_date=query.end_date,
        search=query.search,
        limit=query.limit,
        offset=query.offset,
    )

    events, total = await service.search_events(audit_query)

    return AuditSearchResponse(
        events=[
            AuditEventResponse(
                id=event.id,
                event_type=event.event_type.value,
                severity=event.severity.value,
                user_id=event.user_id,
                tenant_id=event.tenant_id,
                resource_id=event.resource_id,
                resource_type=event.resource_type,
                action=event.action,
                description=event.description,
                metadata=event.metadata,
                ip_address=event.ip_address,
                user_agent=event.user_agent,
                correlation_id=event.correlation_id,
                created_at=event.created_at,
            )
            for event in events
        ],
        total=total,
        limit=query.limit,
        offset=query.offset,
    )


@router.get("/statistics", response_model=AuditStatisticsResponse)
async def get_statistics(
    tenant_id: UUID | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    service: AuditService = Depends(get_audit_service),
) -> AuditStatisticsResponse:
    """Get audit statistics."""
    stats = await service.get_statistics(
        tenant_id=tenant_id,
        start_date=start_date,
        end_date=end_date,
    )

    return AuditStatisticsResponse(
        event_type_counts=stats["event_type_counts"],
        severity_counts=stats["severity_counts"],
        total=stats["total"],
    )


@router.get("/{event_id}", response_model=AuditEventResponse)
async def get_event(
    event_id: UUID,
    service: AuditService = Depends(get_audit_service),
) -> AuditEventResponse:
    """Get an audit event by ID."""
    event = await service.get_event(event_id)

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit event not found",
        )

    return AuditEventResponse(
        id=event.id,
        event_type=event.event_type.value,
        severity=event.severity.value,
        user_id=event.user_id,
        tenant_id=event.tenant_id,
        resource_id=event.resource_id,
        resource_type=event.resource_type,
        action=event.action,
        description=event.description,
        metadata=event.metadata,
        ip_address=event.ip_address,
        user_agent=event.user_agent,
        correlation_id=event.correlation_id,
        created_at=event.created_at,
    )