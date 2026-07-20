"""Notification application services and Provider Dispatch Engine."""

from datetime import datetime
from typing import Any
from uuid import UUID

from app.core.logging import logger
from app.notification.domain.email_provider import EmailFactory, EmailMessage, EmailProvider
from app.notification.domain.events import (
    NotificationCancelled,
    NotificationCreated,
    NotificationDelivered,
    NotificationFailed,
    NotificationOpened,
    NotificationSent,
)
from app.notification.domain.exceptions import ProviderError, ProviderUnavailableError
from app.notification.domain.models import (
    NotificationCategory,
    NotificationChannel,
    NotificationPriority,
    NotificationProvider,
    NotificationStatus,
)
from app.notification.domain.push_provider import PushFactory, PushMessage, PushProvider
from app.notification.domain.sms_provider import SmsFactory, SmsMessage, SmsProvider
from app.notification.infrastructure.models import (
    Notification,
    NotificationHistory,
    NotificationPreferences,
    NotificationTemplate,
)
from app.notification.infrastructure.repositories import (
    NotificationHistoryRepository,
    NotificationPreferencesRepository,
    NotificationRepository,
    NotificationTemplateRepository,
)


class ProviderRegistry:
    """Dynamic Provider Registry with priority routing, health monitoring, and fallback resolution."""

    def __init__(self):
        self._registry: dict[str, dict[str, Any]] = {
            "email": {},
            "sms": {},
            "push": {},
            "webhook": {},
            "in_app": {},
            "fcm": {},
        }
        self._bootstrap_defaults()

    def _bootstrap_defaults(self) -> None:
        """Bootstrap default configured providers."""
        try:
            self.register("email", "primary", EmailFactory.create())
            self.register("sms", "primary", SmsFactory.create())
            self.register("push", "primary", PushFactory.create())
        except Exception as e:
            logger.warning(f"Default provider bootstrap warning: {e}")

    def register(self, channel: str, name_or_provider: Any, provider: Any = None, priority: int = 10) -> None:
        """Register a provider for a channel."""
        ch = channel.lower()
        if provider is None:
            p_inst = name_or_provider
            p_name = getattr(p_inst, "name", type(p_inst).__name__).lower()
        else:
            p_name = str(name_or_provider).lower()
            p_inst = provider

        if ch not in self._registry:
            self._registry[ch] = {}
        self._registry[ch][p_name] = {
            "instance": p_inst,
            "priority": priority,
            "registered_at": datetime.utcnow(),
        }
        logger.info(f"[ProviderRegistry] Registered provider '{p_name}' for channel '{ch}'")

    def get(self, name: str) -> Any | None:
        """Get a registered provider instance by name across channels."""
        name_lower = name.lower()
        for channel_dict in self._registry.values():
            if name_lower in channel_dict:
                return channel_dict[name_lower]["instance"]
        return None

    def resolve(self, channel: str, provider_name: str | None = None) -> Any:
        """Resolve a provider instance by channel and optional name."""
        ch = channel.lower()
        channel_providers = self._registry.get(ch, {})

        if provider_name and provider_name.lower() in channel_providers:
            return channel_providers[provider_name.lower()]["instance"]

        if "primary" in channel_providers:
            return channel_providers["primary"]["instance"]

        if channel_providers:
            sorted_provs = sorted(channel_providers.values(), key=lambda x: x["priority"])
            return sorted_provs[0]["instance"]

        # Factory fallback
        if ch == "email":
            return EmailFactory.create(provider_name)
        elif ch == "sms":
            return SmsFactory.create(provider_name)
        elif ch in ("push", "fcm"):
            return PushFactory.create(provider_name)

        raise ProviderUnavailableError(f"No provider registered for channel '{channel}'")

    async def health_check_all(self) -> dict[str, Any]:
        """Perform health checks on all registered providers."""
        results = {}
        for channel, providers in self._registry.items():
            results[channel] = []
            for name, entry in providers.items():
                provider = entry["instance"]
                if hasattr(provider, "health_check"):
                    health = await provider.health_check()
                elif hasattr(provider, "validate"):
                    try:
                        valid = await provider.validate()
                        health = {"provider": name, "status": "healthy" if valid else "degraded", "available": valid}
                    except Exception as ex:
                        health = {"provider": name, "status": "unhealthy", "available": False, "error": str(ex)}
                else:
                    health = {"provider": name, "status": "healthy", "available": True}
                results[channel].append(health)
        return results


class NotificationDispatchEngine:
    """Channel-agnostic Notification Dispatch Engine."""

    def __init__(self, registry: ProviderRegistry | None = None):
        self.registry = registry or ProviderRegistry()

    async def send_direct(
        self,
        channel: str,
        destination: str,
        subject: str | None,
        body: str,
        provider_name: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Dispatch a message directly to destination using resolved provider."""
        ch = channel.lower()
        provider = self.registry.resolve(ch, provider_name)

        if ch == "email":
            msg = EmailMessage(to=destination, subject=subject or "Notification", body=body, metadata=metadata or {})
            msg_id = await provider.send(msg)
        elif ch == "sms":
            msg = SmsMessage(to=destination, body=body, metadata=metadata or {})
            msg_id = await provider.send(msg)
        elif ch in ("push", "fcm"):
            msg = PushMessage(device_token=destination, title=subject or "Alert", body=body, data=metadata or {})
            msg_id = await provider.send(msg)
        else:
            msg_id = f"direct-{ch}-{hash(destination + body)}"

        return {
            "success": True,
            "channel": ch,
            "provider": getattr(provider, "name", "default"),
            "message_id": msg_id,
            "destination": destination,
        }


class HistoryService:
    """Notification history logging service."""

    def __init__(self, history_repo: NotificationHistoryRepository):
        self.history_repo = history_repo

    async def log_event(
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
        return await self.history_repo.create(
            notification_id=notification_id,
            user_id=user_id,
            channel=channel,
            status=status,
            event=event,
            provider=provider,
            tenant_id=tenant_id,
            created_by=created_by,
            details=details,
        )

    async def get_history_by_notification(self, notification_id: UUID) -> list[NotificationHistory]:
        return await self.history_repo.get_by_notification_id(notification_id)

    async def get_history_by_user(self, user_id: UUID, limit: int = 50, offset: int = 0) -> list[NotificationHistory]:
        return await self.history_repo.get_by_user_id(user_id, limit, offset)


class NotificationService:
    """Notification service managing notification lifecycle."""

    def __init__(
        self,
        notification_repo: NotificationRepository,
        template_repo: NotificationTemplateRepository,
        preferences_repo: NotificationPreferencesRepository,
        history_repo: NotificationHistoryRepository | None = None,
        provider_registry: ProviderRegistry | None = None,
    ):
        self.notification_repo = notification_repo
        self.template_repo = template_repo
        self.preferences_repo = preferences_repo
        self.history_repo = history_repo
        self.provider_registry = provider_registry or ProviderRegistry()
        self.dispatch_engine = NotificationDispatchEngine(self.provider_registry)

    async def create_notification(
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
            tenant_id=tenant_id,
            created_by=created_by,
            metadata=metadata,
        )

        if self.history_repo:
            await self.history_repo.create(
                notification_id=notification.id,
                user_id=user_id,
                channel=channel,
                status=NotificationStatus.PENDING,
                event="created",
                tenant_id=tenant_id,
                created_by=created_by,
                details=metadata,
            )

        event = NotificationCreated(
            notification_id=notification.id,
            tenant_id=tenant_id,
            user_id=user_id,
            category=str(category),
            priority=str(priority),
            channel=str(channel),
            created_at=notification.created_at or datetime.utcnow(),
        )
        logger.info(f"NotificationCreated: {event.model_dump_json()}")

        return notification

    async def get_notification_by_id(self, notification_id: UUID, tenant_id: UUID | None = None) -> Notification | None:
        return await self.notification_repo.get_by_id(notification_id, tenant_id)

    async def get_user_notifications(
        self,
        user_id: UUID,
        tenant_id: UUID | None = None,
        status: NotificationStatus | str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[Notification]:
        return await self.notification_repo.get_by_user(
            user_id=user_id,
            tenant_id=tenant_id,
            status=status,
            limit=limit,
            offset=offset,
        )

    async def get_unread_count(self, user_id: UUID, tenant_id: UUID | None = None) -> int:
        return await self.notification_repo.get_unread_count(user_id, tenant_id)

    async def mark_as_read(self, notification_id: UUID, user_id: UUID, tenant_id: UUID | None = None) -> bool:
        notification = await self.notification_repo.get_by_id(notification_id, tenant_id)
        if not notification or notification.user_id != user_id:
            return False

        await self.notification_repo.update_status(notification, NotificationStatus.OPENED)

        if self.history_repo:
            await self.history_repo.create(
                notification_id=notification_id,
                user_id=user_id,
                channel=notification.channel,
                status=NotificationStatus.OPENED,
                event="read",
                tenant_id=tenant_id,
            )

        event = NotificationOpened(
            notification_id=notification_id,
            tenant_id=tenant_id,
            opened_at=datetime.utcnow(),
        )
        logger.info(f"NotificationOpened: {event.model_dump_json()}")

        return True

    async def cancel_notification(
        self,
        notification_id: UUID,
        user_id: UUID,
        tenant_id: UUID | None = None,
        reason: str | None = None,
    ) -> bool:
        notification = await self.notification_repo.get_by_id(notification_id, tenant_id)
        if not notification or notification.user_id != user_id:
            return False

        if notification.status not in [NotificationStatus.PENDING, NotificationStatus.QUEUED]:
            return False

        await self.notification_repo.update_status(notification, NotificationStatus.CANCELLED, reason)

        if self.history_repo:
            await self.history_repo.create(
                notification_id=notification_id,
                user_id=user_id,
                channel=notification.channel,
                status=NotificationStatus.CANCELLED,
                event="cancelled",
                tenant_id=tenant_id,
                details={"reason": reason} if reason else None,
            )

        event = NotificationCancelled(
            notification_id=notification_id,
            tenant_id=tenant_id,
            cancelled_at=datetime.utcnow(),
            reason=reason,
        )
        logger.info(f"NotificationCancelled: {event.model_dump_json()}")

        return True


class NotificationTemplateService:
    """Notification template application service."""

    def __init__(self, template_repo: NotificationTemplateRepository):
        self.template_repo = template_repo

    async def create_template(
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
        return await self.template_repo.create(
            name=name,
            body=body,
            channel=channel,
            category=category,
            subject=subject,
            variables=variables,
            tenant_id=tenant_id,
            created_by=created_by,
        )

    async def get_template(self, template_id: UUID, tenant_id: UUID | None = None) -> NotificationTemplate | None:
        return await self.template_repo.get_by_id(template_id, tenant_id)

    async def list_templates(self, tenant_id: UUID | None = None, limit: int = 100, offset: int = 0) -> list[NotificationTemplate]:
        return await self.template_repo.list_all(tenant_id, limit, offset)


class NotificationPreferencesService:
    """Notification preferences application service."""

    def __init__(self, preferences_repo: NotificationPreferencesRepository):
        self.preferences_repo = preferences_repo

    async def get_preferences(self, user_id: UUID, tenant_id: UUID | None = None) -> NotificationPreferences | None:
        return await self.preferences_repo.get_by_user_id(user_id, tenant_id)

    async def update_preferences(
        self,
        user_id: UUID,
        tenant_id: UUID | None = None,
        email_enabled: bool | None = None,
        sms_enabled: bool | None = None,
        push_enabled: bool | None = None,
        in_app_enabled: bool | None = None,
        quiet_hours_start: str | None = None,
        quiet_hours_end: str | None = None,
        timezone: str | None = None,
        language: str | None = None,
        frequency: str | None = None,
        category_preferences: dict | None = None,
    ) -> NotificationPreferences:
        return await self.preferences_repo.create_or_update(
            user_id=user_id,
            tenant_id=tenant_id,
            email_enabled=email_enabled if email_enabled is not None else True,
            sms_enabled=sms_enabled if sms_enabled is not None else True,
            push_enabled=push_enabled if push_enabled is not None else True,
            in_app_enabled=in_app_enabled if in_app_enabled is not None else True,
            quiet_hours_start=quiet_hours_start,
            quiet_hours_end=quiet_hours_end,
            timezone=timezone or "UTC",
            language=language or "en",
            frequency=frequency or "immediate",
            category_preferences=category_preferences,
        )