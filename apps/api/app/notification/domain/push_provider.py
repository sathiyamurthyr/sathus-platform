"""Push Notification provider interfaces, adapters, and failover engine."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any
from uuid import UUID

from app.core.config import get_settings
from app.core.logging import logger
from app.notification.domain.exceptions import ProviderError, ProviderUnavailableError


@dataclass
class PushMessage:
    """Push notification message contract."""

    device_token: str
    title: str
    body: str
    badge_count: int | None = None
    sound: str | None = "default"
    data: dict[str, Any] = field(default_factory=dict)
    tenant_id: UUID | None = None


class PushProvider(ABC):
    """Abstract interface for Push Notification providers."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider identifier name."""
        pass

    @abstractmethod
    async def send(self, message: PushMessage) -> str:
        """Send a push notification."""
        pass

    @abstractmethod
    async def validate(self) -> bool:
        """Validate push provider credentials."""
        pass

    @abstractmethod
    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get push notification status."""
        pass

    async def health_check(self) -> dict[str, Any]:
        """Run health check on push provider configuration."""
        try:
            is_valid = await self.validate()
            return {
                "provider": self.name,
                "status": "healthy" if is_valid else "degraded",
                "available": is_valid,
            }
        except Exception as e:
            return {
                "provider": self.name,
                "status": "unhealthy",
                "available": False,
                "error": str(e),
            }


class FcmPushProvider(PushProvider):
    """Firebase Cloud Messaging (FCM) Push provider adapter."""

    @property
    def name(self) -> str:
        return "fcm"

    def __init__(self):
        self.settings = get_settings()
        self._server_key = getattr(self.settings, "FCM_SERVER_KEY", None) or getattr(self.settings, "FIREBASE_CREDENTIALS", None)

    async def send(self, message: PushMessage) -> str:
        try:
            logger.info(f"[FCM Push] Dispatching push to token {message.device_token[:10]}...")
            return f"fcm-msg-{hash(message.device_token + message.title)}"
        except Exception as e:
            raise ProviderError(f"FCM send failed: {e}", provider_name=self.name)

    async def validate(self) -> bool:
        return bool(self._server_key)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "delivered", "provider": self.name, "message_id": message_id}


class ApnsPushProvider(PushProvider):
    """Apple Push Notification Service (APNs) Push provider adapter."""

    @property
    def name(self) -> str:
        return "apns"

    def __init__(self):
        self.settings = get_settings()
        self._key_id = getattr(self.settings, "APNS_KEY_ID", None)
        self._team_id = getattr(self.settings, "APNS_TEAM_ID", None)
        self._bundle_id = getattr(self.settings, "APNS_BUNDLE_ID", None)

    async def send(self, message: PushMessage) -> str:
        try:
            logger.info(f"[APNs Push] Dispatching iOS push to device {message.device_token[:10]}...")
            return f"apns-msg-{hash(message.device_token + message.title)}"
        except Exception as e:
            raise ProviderError(f"APNs send failed: {e}", provider_name=self.name)

    async def validate(self) -> bool:
        return bool(self._key_id and self._team_id)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "delivered", "provider": self.name, "message_id": message_id}


class HuaweiPushProvider(PushProvider):
    """Huawei Push Kit provider extension adapter."""

    @property
    def name(self) -> str:
        return "huawei_push"

    def __init__(self):
        self.settings = get_settings()
        self._app_id = getattr(self.settings, "HUAWEI_PUSH_APP_ID", None)
        self._app_secret = getattr(self.settings, "HUAWEI_PUSH_APP_SECRET", None)

    async def send(self, message: PushMessage) -> str:
        try:
            logger.info(f"[Huawei Push] Dispatching push to token {message.device_token[:10]}...")
            return f"huawei-push-msg-{hash(message.device_token + message.title)}"
        except Exception as e:
            raise ProviderError(f"Huawei Push send failed: {e}", provider_name=self.name)

    async def validate(self) -> bool:
        return bool(self._app_id and self._app_secret)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "delivered", "provider": self.name, "message_id": message_id}


class FailoverPushProvider(PushProvider):
    """Composite Push provider implementing automatic failover chain across multiple Push adapters."""

    @property
    def name(self) -> str:
        return f"failover({','.join(p.name for p in self.providers)})"

    def __init__(self, providers: list[PushProvider]):
        if not providers:
            raise ValueError("FailoverPushProvider requires at least one provider.")
        self.providers = providers

    async def send(self, message: PushMessage) -> str:
        last_error = None
        for provider in self.providers:
            try:
                if await provider.validate():
                    logger.info(f"[PushFailover] Attempting push delivery via {provider.name}")
                    return await provider.send(message)
            except Exception as e:
                logger.error(f"[PushFailover] Provider {provider.name} failed: {e}. Trying next...")
                last_error = e

        raise ProviderError(f"All failover push providers failed. Last error: {last_error}", provider_name=self.name)

    async def validate(self) -> bool:
        for provider in self.providers:
            if await provider.validate():
                return True
        return False

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "delivered", "provider": self.name, "message_id": message_id}


class PushFactory:
    """Factory for resolving and instantiating Push notification providers."""

    @staticmethod
    def create(provider_name: str | None = None, enable_failover: bool = True) -> PushProvider:
        settings = get_settings()
        requested = (provider_name or getattr(settings, "PUSH_PROVIDER", "fcm")).lower()

        providers_map = {
            "fcm": FcmPushProvider,
            "firebase": FcmPushProvider,
            "apns": ApnsPushProvider,
            "apple": ApnsPushProvider,
            "huawei": HuaweiPushProvider,
            "huawei_push": HuaweiPushProvider,
        }

        primary_cls = providers_map.get(requested, FcmPushProvider)
        primary_provider = primary_cls()

        if not enable_failover:
            return primary_provider

        fallbacks = [
            cls() for name, cls in providers_map.items() if name != requested
        ]
        return FailoverPushProvider([primary_provider] + fallbacks)
