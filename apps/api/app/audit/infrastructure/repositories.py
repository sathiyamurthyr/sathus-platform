"""Audit repositories."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit.infrastructure.models import (
    AuditEvent,
    AuditEventType,
    AuditSeverity,
)


class AuditEventRepository:
    """Audit event repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
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
        """Create an audit event."""
        event = AuditEvent(
            event_type=event_type,
            action=action,
            description=description,
            severity=severity,
            user_id=user_id,
            tenant_id=tenant_id,
            resource_id=resource_id,
            resource_type=resource_type,
            audit_metadata=metadata,
            ip_address=ip_address,
            user_agent=user_agent,
            correlation_id=correlation_id,
        )
        self.session.add(event)
        await self.session.flush()
        return event

    async def get_by_id(self, event_id: UUID) -> AuditEvent | None:
        """Get audit event by ID."""
        result = await self.session.execute(
            select(AuditEvent).where(AuditEvent.id == event_id)
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        event_types: list[AuditEventType] | None = None,
        user_id: UUID | None = None,
        tenant_id: UUID | None = None,
        severity: AuditSeverity | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        search: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[AuditEvent], int]:
        """Search audit events with filters."""
        query = select(AuditEvent)

        # Build filter conditions
        conditions = []

        if event_types:
            conditions.append(AuditEvent.event_type.in_(event_types))

        if user_id:
            conditions.append(AuditEvent.user_id == user_id)

        if tenant_id:
            conditions.append(AuditEvent.tenant_id == tenant_id)

        if severity:
            conditions.append(AuditEvent.severity == severity)

        if start_date:
            conditions.append(AuditEvent.created_at >= start_date)

        if end_date:
            conditions.append(AuditEvent.created_at <= end_date)

        if search:
            search_pattern = f"%{search}%"
            conditions.append(
                AuditEvent.action.ilike(search_pattern)
                | AuditEvent.description.ilike(search_pattern)
            )

        if conditions:
            query = query.where(and_(*conditions))

        # Get total count
        count_query = select(func.count()).select_from(AuditEvent)
        if conditions:
            count_query = count_query.where(and_(*conditions))

        count_result = await self.session.execute(count_query)
        total = count_result.scalar_one()

        # Get paginated results
        query = (
            query
            .order_by(AuditEvent.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(query)
        events = list(result.scalars().all())

        return events, total

    async def get_recent(
        self,
        user_id: UUID | None = None,
        tenant_id: UUID | None = None,
        limit: int = 50,
    ) -> list[AuditEvent]:
        """Get recent audit events."""
        query = select(AuditEvent)

        if user_id:
            query = query.where(AuditEvent.user_id == user_id)

        if tenant_id:
            query = query.where(AuditEvent.tenant_id == tenant_id)

        query = (
            query
            .order_by(AuditEvent.created_at.desc())
            .limit(limit)
        )

        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_statistics(
        self,
        tenant_id: UUID | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> dict:
        """Get audit statistics."""
        conditions = []

        if tenant_id:
            conditions.append(AuditEvent.tenant_id == tenant_id)

        if start_date:
            conditions.append(AuditEvent.created_at >= start_date)

        if end_date:
            conditions.append(AuditEvent.created_at <= end_date)

        # Event type counts
        event_counts = {}
        for event_type in AuditEventType:
            query = select(func.count()).select_from(AuditEvent)
            if conditions:
                query = query.where(and_(*conditions, AuditEvent.event_type == event_type))
            else:
                query = query.where(AuditEvent.event_type == event_type)

            result = await self.session.execute(query)
            event_counts[event_type.value] = result.scalar_one()

        # Severity counts
        severity_counts = {}
        for sev in AuditSeverity:
            query = select(func.count()).select_from(AuditEvent)
            if conditions:
                query = query.where(and_(*conditions, AuditEvent.severity == sev))
            else:
                query = query.where(AuditEvent.severity == sev)

            result = await self.session.execute(query)
            severity_counts[sev.value] = result.scalar_one()

        return {
            "event_type_counts": event_counts,
            "severity_counts": severity_counts,
            "total": sum(event_counts.values()),
        }