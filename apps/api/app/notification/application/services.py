"""Notification application services."""

from datetime import datetime
from uuid import UUID

from app.core.logging import logger
from app.notification.domain.events import (
    NotificationCreated,
    NotificationQueued,
    NotificationSent,
    NotificationDelivered,
    NotificationOpened,
    NotificationFailed,
    NotificationCancelled,
)
from app.notification.infrastructure.models import (
    Notification,
    NotificationTemplate,
    NotificationPreferences,
    NotificationStatus,
    NotificationChannel,
    NotificationPriority,
    NotificationCategory,
)
from app.notification.infrastructure.repositories import (
    NotificationRepository,
    NotificationTemplateRepository,
    NotificationPreferencesRepository,
)


class NotificationService:
    """Notification service."""

    def __init__(
        self,
        notification_repo: NotificationRepository,
        template_repo: NotificationTemplateRepository,
        preferences_repo: NotificationPreferencesRepository,
    ):
        """Initialize service."""
        self.notification_repo = notification_repo
        self.template_repo = template_repo
        self.preferences_repo = preferences_repo

    async def create_notification(
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
        notification = await self.notification_repo.create(
            user_id=user_id,
            category=category,
            channel=channel,
            body=body,
            subject=subject,
            template_id=template_id,
            priority=priority,
            destination=destination,
            scheduled_at=scheduled_at,
            metadata=metadata,
        )

        # Emit event
        event = NotificationCreated(
            notification_id=notification.id,
            user_id=user_id,
            category=category.value,
            priority=priority.value,
            channel=channel.value,
            created_at=notification.created_at,
        )
        logger.info(f"NotificationCreated: {event.model_dump_json()}")

        return notification

    async def get_user_notifications(
        self,
        user_id: UUID,
        status: NotificationStatus | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Notification]:
        """Get notifications for a user."""
        return await self.notification_repo.get_by_user(
            user_id=user_id,
            status=status,
            limit=limit,
            offset=offset,
        )

    async def get_unread_count(self, user_id: UUID) -> int:
        """Get unread notification count for a user."""
        return await self.notification_repo.get_unread_count(user_id)

    async def mark_as_read(self, notification_id: UUID, user_id: UUID) -> bool:
        """Mark a notification as read/opened."""
        notification = await self.notification_repo.get_by_id(notification_id)
        if not notification or notification.user_id != user_id:
            return False

        await self.notification_repo.update_status(notification, NotificationStatus.OPENED)

        event = NotificationOpened(
            notification_id=notification_id,
            opened_at=datetime.utcnow(),
        )
        logger.info(f"NotificationOpened: {event.model_dump_json()}")

        return True

    async def cancel_notification(
        self,
        notification_id: UUID,
        user_id: UUID,
        reason: str | None = None,
    ) -> bool:
        """Cancel a pending notification."""
        notification = await self.notification_repo.get_by_id(notification_id)
        if not notification or notification.user_id != user_id:
            return False

        if notification.status not in [NotificationStatus.PENDING, NotificationStatus.QUEUED]:
            return False

        await self.notification_repo.update_status(notification, NotificationStatus.CANCELLED, reason)

        event = NotificationCancelled(
            notification_id=notification_id,
            cancelled_at=datetime.utcnow(),
            reason=reason,
        )
        logger.info(f"NotificationCancelled: {event.model_dump_json()}")

        return True

    async def get_pending_for_queue(self, limit: int = 100) -> list[Notification]:
        """Get pending notifications ready for queue processing."""
        return await self.notification_repo.get_pending_for_queue(limit)

    async def get_scheduled_for_delivery(self) -> list[Notification]:
        """Get scheduled notifications ready for delivery."""
        return await self.notification_repo.get_scheduled_for_delivery()

    async def update_status(
        self,
        notification: Notification,
        status: NotificationStatus,
        failure_reason: str | None = None,
    ) -> None:
        """Update notification status."""
        await self.notification_repo.update_status(notification, status, failure_reason)

        if status == NotificationStatus.SENT:
            event = NotificationSent(
                notification_id=notification.id,
                sent_at=datetime.utcnow(),
            )
            logger.info(f"NotificationSent: {event.model_dump_json()}")
        elif status == NotificationStatus.DELIVERED:
            event = NotificationDelivered(
                notification_id=notification.id,
                delivered_at=datetime.utcnow(),
            )
            logger.info(f"NotificationDelivered: {event.model_dump_json()}")
        elif status == NotificationStatus.FAILED:
            event = NotificationFailed(
                notification_id=notification.id,
                failed_at=datetime.utcnow(),
                reason=failure_reason or "Unknown error",
                retry_count=notification.retry_count,
            )
            logger.error(f"NotificationFailed: {event.model_dump_json()}")


class NotificationTemplateService:
    """Notification template service."""

    def __init__(self, template_repo: NotificationTemplateRepository):
        """Initialize service."""
        self.template_repo = template_repo

    async def create_template(
        self,
        name: str,
        body: str,
        channel: NotificationChannel,
        subject: str | None = None,
        variables: list[str] | None = None,
    ) -> NotificationTemplate:
        """Create a new template."""
        return await self.template_repo.create(
            name=name,
            body=body,
            channel=channel,
            subject=subject,
            variables=variables,
        )

    async def get_template(self, template_id: UUID) -> NotificationTemplate | None:
        """Get template by ID."""
        return await self.template_repo.get_by_id(template_id)

    async def get_template_by_name(self, name: str) -> NotificationTemplate | None:
        """Get template by name."""
        return await self.template_repo.get_by_name(name)

    async def list_templates(self, limit: int = 100, offset: int = 0) -> list[NotificationTemplate]:
        """List all templates."""
        return await self.template_repo.list_all(limit, offset)


class NotificationPreferencesService:
    """Notification preferences service."""

    def __init__(self, preferences_repo: NotificationPreferencesRepository):
        """Initialize service."""
        self.preferences_repo = preferences_repo

    async def get_preferences(self, user_id: UUID) -> NotificationPreferences | None:
        """Get preferences for a user."""
        return await self.preferences_repo.get_by_user_id(user_id)

    async def update_preferences(
        self,
        user_id: UUID,
        email_enabled: bool | None = None,
        sms_enabled: bool | None = None,
        push_enabled: bool | None = None,
        in_app_enabled: bool | None = None,
        quiet_hours_start: str | None = None,
        quiet_hours_end: str | None = None,
        timezone: str | None = None,
        language: str | None = None,
        frequency: str | None = None,
    ) -> NotificationPreferences:
        """Update preferences for a user."""
        existing = await self.preferences_repo.get_by_user_id(user_id)

        if existing:
            if email_enabled is not None:
                existing.email_enabled = email_enabled
            if sms_enabled is not None:
                existing.sms_enabled = sms_enabled
            if push_enabled is not None:
                existing.push_enabled = push_enabled
            if in_app_enabled is not None:
                existing.in_app_enabled = in_app_enabled
            if quiet_hours_start is not None:
                existing.quiet_hours_start = quiet_hours_start
            if quiet_hours_end is not None:
                existing.quiet_hours_end = quiet_hours_end
            if timezone is not None:
                existing.timezone = timezone
            if language is not None:
                existing.language = language
            if frequency is not None:
                existing.frequency = frequency
            await self.preferences_repo.session.flush()
            return existing
        else:
            return await self.preferences_repo.create_or_update(
                user_id=user_id,
                email_enabled=email_enabled if email_enabled is not None else True,
                sms_enabled=sms_enabled if sms_enabled is not None else True,
                push_enabled=push_enabled if push_enabled is not None else True,
                in_app_enabled=in_app_enabled if in_app_enabled is not None else True,
                quiet_hours_start=quiet_hours_start,
                quiet_hours_end=quiet_hours_end,
                timezone=timezone or "UTC",
                language=language or "en",
                frequency=frequency or "immediate",
            )