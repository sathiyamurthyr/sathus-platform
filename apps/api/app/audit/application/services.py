"""Audit application services."""

from datetime import datetime
from uuid import UUID

from app.audit.domain.models import (
    AuditEvent,
    AuditQuery,
    AuditLog,
    AuditEventType,
    AuditSeverity,
)
from app.audit.infrastructure.models import (
    AuditEvent as AuditEventModel,
    AuditEventType as AuditEventTypeModel,
    AuditSeverity as AuditSeverityModel,
)
from app.audit.infrastructure.repositories import AuditEventRepository
from app.core.logging import logger


class AuditService:
    """Audit service."""

    def __init__(self, event_repo: AuditEventRepository):
        """Initialize service."""
        self.event_repo = event_repo

    async def log_event(
        self,
        event_type: AuditEventType,
        action: str,
        description: str,
        severity: AuditSeverity = AuditSeverity.INFO,
        user_id: UUID | None = None,
        tenant_id: UUID | None = None,
        resource_id: UUID | None = None,
        resource_type: str | None = None,
        metadata: dict | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        correlation_id: str | None = None,
    ) -> AuditEvent:
        """Log an audit event."""
        event = await self.event_repo.create(
            event_type=event_type,
            action=action,
            description=description,
            severity=severity,
            user_id=user_id,
            tenant_id=tenant_id,
            resource_id=resource_id,
            resource_type=resource_type,
            metadata=metadata,
            ip_address=ip_address,
            user_agent=user_agent,
            correlation_id=correlation_id,
        )

        logger.info(
            f"Audit event logged: type={event_type.value}, "
            f"action={action}, user_id={user_id}, severity={severity.value}"
        )

        return AuditEvent(
            id=event.id,
            event_type=event_type,
            severity=severity,
            user_id=user_id,
            tenant_id=tenant_id,
            resource_id=resource_id,
            resource_type=resource_type,
            action=action,
            description=description,
            metadata=metadata,
            ip_address=ip_address,
            user_agent=user_agent,
            correlation_id=correlation_id,
            created_at=event.created_at,
        )

    async def search_events(
        self,
        query: AuditQuery,
    ) -> tuple[list[AuditLog], int]:
        """Search audit events."""
        # Convert domain types to infrastructure types
        event_types = None
        if query.event_types:
            event_types = [
                AuditEventTypeModel(et.value) for et in query.event_types
            ]

        severity = None
        if query.severity:
            severity = AuditSeverityModel(query.severity.value)

        events, total = await self.event_repo.search(
            event_types=event_types,
            user_id=query.user_id,
            tenant_id=query.tenant_id,
            severity=severity,
            start_date=query.start_date,
            end_date=query.end_date,
            search=query.search,
            limit=query.limit,
            offset=query.offset,
        )

        # Convert to domain models
        logs = [
            AuditLog(
                id=event.id,
                event_type=AuditEventType(event.event_type.value),
                severity=AuditSeverity(event.severity.value),
                user_id=event.user_id,
                tenant_id=event.tenant_id,
                resource_id=event.resource_id,
                resource_type=event.resource_type,
                action=event.action,
                description=event.description,
                metadata=event.audit_metadata,
                ip_address=event.ip_address,
                user_agent=event.user_agent,
                correlation_id=event.correlation_id,
                created_at=event.created_at,
            )
            for event in events
        ]

        return logs, total

    async def get_event(self, event_id: UUID) -> AuditEvent | None:
        """Get an audit event by ID."""
        event = await self.event_repo.get_by_id(event_id)
        if not event:
            return None

        return AuditEvent(
            id=event.id,
            event_type=AuditEventType(event.event_type.value),
            severity=AuditSeverity(event.severity.value),
            user_id=event.user_id,
            tenant_id=event.tenant_id,
            resource_id=event.resource_id,
            resource_type=event.resource_type,
            action=event.action,
            description=event.description,
            metadata=event.audit_metadata,
            ip_address=event.ip_address,
            user_agent=event.user_agent,
            correlation_id=event.correlation_id,
            created_at=event.created_at,
        )

    async def get_statistics(
        self,
        tenant_id: UUID | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> dict:
        """Get audit statistics."""
        return await self.event_repo.get_statistics(
            tenant_id=tenant_id,
            start_date=start_date,
            end_date=end_date,
        )


class AuditEventPublisher:
    """Audit event publisher for integration with other modules."""

    def __init__(self, audit_service: AuditService):
        """Initialize publisher."""
        self.audit_service = audit_service

    async def publish(
        self,
        event_type: AuditEventType,
        action: str,
        description: str,
        severity: AuditSeverity = AuditSeverity.INFO,
        user_id: UUID | None = None,
        tenant_id: UUID | None = None,
        resource_id: UUID | None = None,
        resource_type: str | None = None,
        metadata: dict | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
        correlation_id: str | None = None,
    ) -> None:
        """Publish an audit event (fire and forget)."""
        try:
            await self.audit_service.log_event(
                event_type=event_type,
                action=action,
                description=description,
                severity=severity,
                user_id=user_id,
                tenant_id=tenant_id,
                resource_id=resource_id,
                resource_type=resource_type,
                metadata=metadata,
                ip_address=ip_address,
                user_agent=user_agent,
                correlation_id=correlation_id,
            )
        except Exception as e:
            # Log error but don't fail the main operation
            logger.error(f"Failed to publish audit event: {e}")