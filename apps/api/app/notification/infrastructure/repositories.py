"""Notification repositories."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select, update, delete, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.notification.infrastructure.models import (
    Notification,
    NotificationTemplate,
    NotificationPreferences,
    NotificationStatus,
    NotificationChannel,
    NotificationPriority,
    NotificationCategory,
)


class NotificationRepository:
    """Notification repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        user_id: UUID,
        category: NotificationCategory,
        channel: NotificationChannel,
        body: str,
        subject: str | None = None,
        template_id: UUID | None = None,
        priority: NotificationPriority = NotificationPriority.NORMAL,
        destination: str | None = None,
        scheduled_at: datetime | None = None,
        metadata: dict | None = None,
    ) -> Notification:
        """Create a new notification."""
        notification = Notification(
            user_id=user_id,
            category=category,
            channel=channel,
            body=body,
            subject=subject,
            template_id=template_id,
            priority=priority,
            destination=destination,
            scheduled_at=scheduled_at,
            notification_metadata=metadata,
        )
        self.session.add(notification)
        await self.session.flush()
        return notification

    async def get_by_id(self, notification_id: UUID) -> Notification | None:
        """Get notification by ID."""
        result = await self.session.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user(
        self,
        user_id: UUID,
        status: NotificationStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Notification]:
        """Get notifications for a user."""
        query = select(Notification).where(Notification.user_id == user_id)
        if status:
            query = query.where(Notification.status == status)
        query = query.order_by(Notification.created_at.desc()).limit(limit).offset(offset)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_unread_count(self, user_id: UUID) -> int:
        """Get unread notification count for a user."""
        result = await self.session.execute(
            select(Notification)
            .where(
                and_(
                    Notification.user_id == user_id,
                    Notification.status.in_([NotificationStatus.PENDING, NotificationStatus.QUEUED, NotificationStatus.SENT]),
                )
            )
        )
        return len(list(result.scalars().all()))

    async def update_status(
        self,
        notification: Notification,
        status: NotificationStatus,
        failure_reason: str | None = None,
    ) -> None:
        """Update notification status."""
        notification.status = status
        if failure_reason:
            notification.failure_reason = failure_reason
        if status == NotificationStatus.SENT:
            notification.sent_at = datetime.utcnow()
        elif status == NotificationStatus.DELIVERED:
            notification.delivered_at = datetime.utcnow()
        elif status == NotificationStatus.OPENED:
            notification.opened_at = datetime.utcnow()
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
                )
            )
            .order_by(Notification.scheduled_at)
        )
        return list(result.scalars().all())


class NotificationTemplateRepository:
    """Notification template repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        name: str,
        body: str,
        channel: NotificationChannel,
        subject: str | None = None,
        variables: list[str] | None = None,
    ) -> NotificationTemplate:
        """Create a new template."""
        template = NotificationTemplate(
            name=name,
            body=body,
            channel=channel,
            subject=subject,
            variables=variables,
        )
        self.session.add(template)
        await self.session.flush()
        return template

    async def get_by_id(self, template_id: UUID) -> NotificationTemplate | None:
        """Get template by ID."""
        result = await self.session.execute(
            select(NotificationTemplate).where(NotificationTemplate.id == template_id)
        )
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> NotificationTemplate | None:
        """Get template by name."""
        result = await self.session.execute(
            select(NotificationTemplate).where(NotificationTemplate.name == name)
        )
        return result.scalar_one_or_none()

    async def get_active_by_channel(
        self,
        channel: NotificationChannel,
    ) -> list[NotificationTemplate]:
        """Get active templates for a channel."""
        result = await self.session.execute(
            select(NotificationTemplate)
            .where(
                and_(
                    NotificationTemplate.channel == channel,
                    NotificationTemplate.is_active,
                )
            )
            .order_by(NotificationTemplate.name)
        )
        return list(result.scalars().all())

    async def list_all(self, limit: int = 100, offset: int = 0) -> list[NotificationTemplate]:
        """List all templates."""
        result = await self.session.execute(
            select(NotificationTemplate)
            .order_by(NotificationTemplate.name)
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())


class NotificationPreferencesRepository:
    """Notification preferences repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def get_by_user_id(self, user_id: UUID) -> NotificationPreferences | None:
        """Get preferences for a user."""
        result = await self.session.execute(
            select(NotificationPreferences).where(NotificationPreferences.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def create_or_update(
        self,
        user_id: UUID,
        email_enabled: bool = True,
        sms_enabled: bool = True,
        push_enabled: bool = True,
        in_app_enabled: bool = True,
        quiet_hours_start: str | None = None,
        quiet_hours_end: str | None = None,
        timezone: str = "UTC",
        language: str = "en",
        frequency: str = "immediate",
    ) -> NotificationPreferences:
        """Create or update preferences for a user."""
        existing = await self.get_by_user_id(user_id)
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
            await self.session.flush()
            return existing
        else:
            prefs = NotificationPreferences(
                user_id=user_id,
                email_enabled=email_enabled,
                sms_enabled=sms_enabled,
                push_enabled=push_enabled,
                in_app_enabled=in_app_enabled,
                quiet_hours_start=quiet_hours_start,
                quiet_hours_end=quiet_hours_end,
                timezone=timezone,
                language=language,
                frequency=frequency,
            )
            self.session.add(prefs)
            await self.session.flush()
            return prefs