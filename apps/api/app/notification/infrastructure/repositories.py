"""Notification infrastructure repositories."""

import json
from datetime import datetime
from uuid import UUID

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.notification.infrastructure.models import (
    Notification,
    NotificationCategory,
    NotificationChannel,
    NotificationHistory,
    NotificationPreferences,
    NotificationPriority,
    NotificationStatus,
    NotificationTemplate,
)


class NotificationRepository:
    """Notification repository implementation."""

    def __init__(self, session: AsyncSession):
        """Initialize repository with DB session."""
        self.session = session

    async def create(
        self,
        user_id: UUID,
        category: NotificationCategory | str,
        channel: NotificationChannel | str,
        body: str,
        subject: str | None = None,
        template_id: UUID | None = None,
        priority: NotificationPriority | str = NotificationPriority.NORMAL,
        destination: str | None = None,
        scheduled_at: datetime | None = None,
        tenant_id: UUID | None = None,
        created_by: UUID | None = None,
        metadata: dict | None = None,
    ) -> Notification:
        """Create a new notification record."""
        notification = Notification(
            user_id=user_id,
            tenant_id=tenant_id,
            category=category,
            channel=channel,
            body=body,
            subject=subject,
            template_id=template_id,
            priority=priority,
            destination=destination,
            scheduled_at=scheduled_at,
            created_by=created_by,
            notification_metadata=json.dumps(metadata) if metadata else None,
        )
        self.session.add(notification)
        await self.session.flush()
        return notification

    async def get_by_id(self, notification_id: UUID, tenant_id: UUID | None = None) -> Notification | None:
        """Get notification by ID with optional tenant filtering."""
        query = select(Notification).where(
            and_(
                Notification.id == notification_id,
                Notification.is_deleted == False,
            )
        )
        if tenant_id:
            query = query.where(Notification.tenant_id == tenant_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_user(
        self,
        user_id: UUID,
        tenant_id: UUID | None = None,
        status: NotificationStatus | str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Notification]:
        """Get notifications for a user."""
        query = select(Notification).where(
            and_(
                Notification.user_id == user_id,
                Notification.is_deleted == False,
            )
        )
        if tenant_id:
            query = query.where(Notification.tenant_id == tenant_id)
        if status:
            query = query.where(Notification.status == status)
        query = query.order_by(Notification.created_at.desc()).limit(limit).offset(offset)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_unread_count(self, user_id: UUID, tenant_id: UUID | None = None) -> int:
        """Get unread notification count for a user."""
        query = select(Notification).where(
            and_(
                Notification.user_id == user_id,
                Notification.is_deleted == False,
                Notification.status.in_([NotificationStatus.PENDING, NotificationStatus.QUEUED, NotificationStatus.SENT]),
            )
        )
        if tenant_id:
            query = query.where(Notification.tenant_id == tenant_id)
        result = await self.session.execute(query)
        return len(list(result.scalars().all()))

    async def update_status(
        self,
        notification: Notification,
        status: NotificationStatus | str,
        failure_reason: str | None = None,
    ) -> None:
        """Update notification status."""
        notification.status = status
        if failure_reason:
            notification.failure_reason = failure_reason
        now = datetime.utcnow()
        if status == NotificationStatus.SENT:
            notification.sent_at = now
        elif status == NotificationStatus.DELIVERED:
            notification.delivered_at = now
        elif status in (NotificationStatus.OPENED, NotificationStatus.READ):
            notification.opened_at = now
        await self.session.flush()

    async def soft_delete(self, notification: Notification, updated_by: UUID | None = None) -> None:
        """Soft delete a notification."""
        notification.is_deleted = True
        if updated_by:
            notification.updated_by = updated_by
        await self.session.flush()

    async def increment_retry(self, notification: Notification) -> None:
        """Increment retry count."""
        notification.retry_count += 1
        await self.session.flush()

    async def get_pending_for_queue(self, limit: int = 100) -> list[Notification]:
        """Get pending notifications ready for queue processing."""
        result = await self.session.execute(
            select(Notification)
            .where(
                and_(
                    Notification.status == NotificationStatus.PENDING,
                    Notification.scheduled_at.is_(None),
                    Notification.is_deleted == False,
                )
            )
            .order_by(Notification.priority, Notification.created_at)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_scheduled_for_delivery(self) -> list[Notification]:
        """Get scheduled notifications ready for delivery."""
        now = datetime.utcnow()
        result = await self.session.execute(
            select(Notification)
            .where(
                and_(
                    Notification.status == NotificationStatus.PENDING,
                    Notification.scheduled_at.is_not(None),
                    Notification.scheduled_at <= now,
                    Notification.is_deleted == False,
                )
            )
            .order_by(Notification.scheduled_at)
        )
        return list(result.scalars().all())


class NotificationTemplateRepository:
    """Notification template repository implementation."""

    def __init__(self, session: AsyncSession):
        """Initialize repository with DB session."""
        self.session = session

    async def create(
        self,
        name: str,
        body: str,
        channel: NotificationChannel | str,
        category: NotificationCategory | str = NotificationCategory.SYSTEM,
        subject: str | None = None,
        variables: list[str] | None = None,
        tenant_id: UUID | None = None,
        created_by: UUID | None = None,
    ) -> NotificationTemplate:
        """Create a new notification template."""
        template = NotificationTemplate(
            name=name,
            body=body,
            channel=channel,
            category=category,
            subject=subject,
            variables=json.dumps(variables) if variables else None,
            tenant_id=tenant_id,
            created_by=created_by,
        )
        self.session.add(template)
        await self.session.flush()
        return template

    async def get_by_id(self, template_id: UUID, tenant_id: UUID | None = None) -> NotificationTemplate | None:
        """Get template by ID."""
        query = select(NotificationTemplate).where(
            and_(
                NotificationTemplate.id == template_id,
                NotificationTemplate.is_deleted == False,
            )
        )
        if tenant_id:
            query = query.where(NotificationTemplate.tenant_id == tenant_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str, tenant_id: UUID | None = None) -> NotificationTemplate | None:
        """Get template by name."""
        query = select(NotificationTemplate).where(
            and_(
                NotificationTemplate.name == name,
                NotificationTemplate.is_deleted == False,
            )
        )
        if tenant_id:
            query = query.where(NotificationTemplate.tenant_id == tenant_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def update(
        self,
        template: NotificationTemplate,
        subject: str | None = None,
        body: str | None = None,
        is_active: bool | None = None,
        variables: list[str] | None = None,
        updated_by: UUID | None = None,
    ) -> NotificationTemplate:
        """Update notification template."""
        if subject is not None:
            template.subject = subject
        if body is not None:
            template.body = body
        if is_active is not None:
            template.is_active = is_active
        if variables is not None:
            template.variables = json.dumps(variables)
        if updated_by is not None:
            template.updated_by = updated_by
        template.version += 1
        await self.session.flush()
        return template

    async def soft_delete(self, template: NotificationTemplate, updated_by: UUID | None = None) -> None:
        """Soft delete template."""
        template.is_deleted = True
        template.is_active = False
        if updated_by:
            template.updated_by = updated_by
        await self.session.flush()

    async def list_all(self, tenant_id: UUID | None = None, limit: int = 100, offset: int = 0) -> list[NotificationTemplate]:
        """List all templates."""
        query = select(NotificationTemplate).where(NotificationTemplate.is_deleted == False)
        if tenant_id:
            query = query.where(NotificationTemplate.tenant_id == tenant_id)
        query = query.order_by(NotificationTemplate.name).limit(limit).offset(offset)
        result = await self.session.execute(query)
        return list(result.scalars().all())


class NotificationPreferencesRepository:
    """Notification preferences repository implementation."""

    def __init__(self, session: AsyncSession):
        """Initialize repository with DB session."""
        self.session = session

    async def get_by_user_id(self, user_id: UUID, tenant_id: UUID | None = None) -> NotificationPreferences | None:
        """Get preferences for a user."""
        query = select(NotificationPreferences).where(NotificationPreferences.user_id == user_id)
        if tenant_id:
            query = query.where(NotificationPreferences.tenant_id == tenant_id)
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def create_or_update(
        self,
        user_id: UUID,
        tenant_id: UUID | None = None,
        email_enabled: bool = True,
        sms_enabled: bool = True,
        push_enabled: bool = True,
        in_app_enabled: bool = True,
        quiet_hours_start: str | None = None,
        quiet_hours_end: str | None = None,
        timezone: str = "UTC",
        language: str = "en",
        frequency: str = "immediate",
        category_preferences: dict | None = None,
    ) -> NotificationPreferences:
        """Create or update preferences for a user."""
        existing = await self.get_by_user_id(user_id, tenant_id)
        if existing:
            existing.email_enabled = email_enabled
            existing.sms_enabled = sms_enabled
            existing.push_enabled = push_enabled
            existing.in_app_enabled = in_app_enabled
            existing.quiet_hours_start = quiet_hours_start
            existing.quiet_hours_end = quiet_hours_end
            existing.timezone = timezone
            existing.language = language
            existing.frequency = frequency
            if category_preferences:
                existing.category_preferences = json.dumps(category_preferences)
            await self.session.flush()
            return existing
        else:
            prefs = NotificationPreferences(
                user_id=user_id,
                tenant_id=tenant_id,
                email_enabled=email_enabled,
                sms_enabled=sms_enabled,
                push_enabled=push_enabled,
                in_app_enabled=in_app_enabled,
                quiet_hours_start=quiet_hours_start,
                quiet_hours_end=quiet_hours_end,
                timezone=timezone,
                language=language,
                frequency=frequency,
                category_preferences=json.dumps(category_preferences) if category_preferences else None,
            )
            self.session.add(prefs)
            await self.session.flush()
            return prefs


class NotificationHistoryRepository:
    """Notification history repository implementation."""

    def __init__(self, session: AsyncSession):
        """Initialize repository with DB session."""
        self.session = session

    async def create(
        self,
        notification_id: UUID,
        user_id: UUID,
        channel: NotificationChannel | str,
        status: NotificationStatus | str,
        event: str,
        provider: str | None = None,
        tenant_id: UUID | None = None,
        created_by: UUID | None = None,
        details: dict | None = None,
    ) -> NotificationHistory:
        """Create a notification history log record."""
        history = NotificationHistory(
            notification_id=notification_id,
            user_id=user_id,
            tenant_id=tenant_id,
            channel=channel,
            provider=provider,
            status=status,
            event=event,
            details=json.dumps(details) if details else None,
            created_by=created_by,
        )
        self.session.add(history)
        await self.session.flush()
        return history

    async def get_by_notification_id(self, notification_id: UUID) -> list[NotificationHistory]:
        """Get history logs for a notification."""
        query = (
            select(NotificationHistory)
            .where(NotificationHistory.notification_id == notification_id)
            .order_by(NotificationHistory.created_at.asc())
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_user_id(self, user_id: UUID, limit: int = 50, offset: int = 0) -> list[NotificationHistory]:
        """Get history logs for a user."""
        query = (
            select(NotificationHistory)
            .where(NotificationHistory.user_id == user_id)
            .order_by(NotificationHistory.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(query)
        return list(result.scalars().all())