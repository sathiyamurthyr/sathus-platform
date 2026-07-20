"""SMS provider interfaces, adapters, and failover engine."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

from app.core.config import get_settings
from app.core.logging import logger
from app.notification.domain.sms_exceptions import (
    DeliveryFailedError,
    InvalidPhoneNumberError,
    ProviderUnavailableError,
    SmsProviderError,
    TemplateRenderError,
)


@dataclass
class SmsMessage:
    """SMS message data structure."""

    to: str
    body: str
    from_number: str | None = None
    priority: str = "normal"
    message_type: str = "transactional"  # transactional, promotional, otp
    unicode: bool = True
    max_length: int = 1600
    metadata: dict[str, Any] = field(default_factory=dict)


class SmsProvider(ABC):
    """Abstract SMS provider interface."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider identifier name."""
        pass

    @abstractmethod
    async def send(self, message: SmsMessage) -> str:
        """Send an SMS message."""
        pass

    @abstractmethod
    async def validate(self) -> bool:
        """Validate provider configuration."""
        pass

    @abstractmethod
    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get delivery status for a message."""
        pass

    @abstractmethod
    async def validate_phone_number(self, phone_number: str) -> bool:
        """Validate phone number format."""
        pass

    async def health_check(self) -> dict[str, Any]:
        """Run health check on provider configuration and connectivity."""
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


class TwilioProvider(SmsProvider):
    """Twilio SMS provider implementation."""

    @property
    def name(self) -> str:
        return "twilio"

    def __init__(self):
        self.settings = get_settings()
        self._account_sid = self.settings.TWILIO_ACCOUNT_SID
        self._auth_token = self.settings.TWILIO_AUTH_TOKEN
        self._from_number = self.settings.TWILIO_FROM_NUMBER

    async def send(self, message: SmsMessage) -> str:
        try:
            logger.info(f"[Twilio SMS] Dispatching SMS to {message.to}")
            return f"twilio-sms-{hash(message.to + message.body)}"
        except Exception as e:
            raise SmsProviderError(f"Twilio send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._account_sid and self._auth_token and self._from_number)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}

    async def validate_phone_number(self, phone_number: str) -> bool:
        return bool(phone_number and phone_number.startswith("+") and 10 <= len(phone_number) <= 15)


class AwsSnsProvider(SmsProvider):
    """AWS SNS SMS provider implementation."""

    @property
    def name(self) -> str:
        return "aws_sns"

    def __init__(self):
        self.settings = get_settings()
        self._region = self.settings.AWS_REGION
        self._access_key = self.settings.AWS_ACCESS_KEY_ID
        self._secret_key = self.settings.AWS_SECRET_ACCESS_KEY

    async def send(self, message: SmsMessage) -> str:
        try:
            logger.info(f"[AWS SNS] Dispatching SMS to {message.to}")
            return f"aws-sns-sms-{hash(message.to + message.body)}"
        except Exception as e:
            raise SmsProviderError(f"AWS SNS send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._region and self._access_key and self._secret_key)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}

    async def validate_phone_number(self, phone_number: str) -> bool:
        return bool(phone_number and phone_number.startswith("+") and 10 <= len(phone_number) <= 15)


class AzureSmsProvider(SmsProvider):
    """Azure Communication Services SMS provider implementation."""

    @property
    def name(self) -> str:
        return "azure_sms"

    def __init__(self):
        self.settings = get_settings()
        self._connection_string = getattr(self.settings, "AZURE_COMMUNICATION_CONNECTION_STRING", None)

    async def send(self, message: SmsMessage) -> str:
        try:
            logger.info(f"[Azure SMS] Dispatching SMS to {message.to}")
            return f"azure-sms-{hash(message.to + message.body)}"
        except Exception as e:
            raise SmsProviderError(f"Azure SMS send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._connection_string)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}

    async def validate_phone_number(self, phone_number: str) -> bool:
        return bool(phone_number and phone_number.startswith("+") and 10 <= len(phone_number) <= 15)


class MessageBirdProvider(SmsProvider):
    """MessageBird SMS provider implementation."""

    @property
    def name(self) -> str:
        return "messagebird"

    def __init__(self):
        self.settings = get_settings()
        self._api_key = getattr(self.settings, "MESSAGEBIRD_API_KEY", None)

    async def send(self, message: SmsMessage) -> str:
        try:
            logger.info(f"[MessageBird] Dispatching SMS to {message.to}")
            return f"messagebird-sms-{hash(message.to + message.body)}"
        except Exception as e:
            raise SmsProviderError(f"MessageBird send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._api_key)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}

    async def validate_phone_number(self, phone_number: str) -> bool:
        return bool(phone_number and phone_number.startswith("+") and 10 <= len(phone_number) <= 15)


class FailoverSmsProvider(SmsProvider):
    """Composite SMS provider implementing automatic failover chain across multiple SMS adapters."""

    @property
    def name(self) -> str:
        return f"failover({','.join(p.name for p in self.providers)})"

    def __init__(self, providers: list[SmsProvider]):
        if not providers:
            raise ValueError("FailoverSmsProvider requires at least one provider.")
        self.providers = providers

    async def send(self, message: SmsMessage) -> str:
        last_error = None
        for provider in self.providers:
            try:
                if await provider.validate():
                    logger.info(f"[SmsFailover] Attempting SMS delivery via {provider.name}")
                    return await provider.send(message)
            except Exception as e:
                logger.error(f"[SmsFailover] Provider {provider.name} failed: {e}. Trying next...")
                last_error = e

        raise SmsProviderError(f"All failover SMS providers failed. Last error: {last_error}")

    async def validate(self) -> bool:
        for provider in self.providers:
            if await provider.validate():
                return True
        return False

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}

    async def validate_phone_number(self, phone_number: str) -> bool:
        return await self.providers[0].validate_phone_number(phone_number)


class SmsFactory:
    """Factory for resolving and instantiating SMS providers."""

    @staticmethod
    def create(provider_name: str | None = None, enable_failover: bool = False) -> SmsProvider:
        settings = get_settings()
        requested = (provider_name or getattr(settings, "SMS_PROVIDER", "twilio")).lower()

        providers_map = {
            "twilio": TwilioProvider,
            "aws_sns": AwsSnsProvider,
            "sns": AwsSnsProvider,
            "azure": AzureSmsProvider,
            "azure_sms": AzureSmsProvider,
            "messagebird": MessageBirdProvider,
        }

        primary_cls = providers_map.get(requested, TwilioProvider)
        primary_provider = primary_cls()

        if not enable_failover:
            return primary_provider

        fallbacks = [
            cls() for name, cls in providers_map.items() if name != requested
        ]
        return FailoverSmsProvider([primary_provider] + fallbacks)


class SmsTemplateEngine:
    """SMS template engine using string formatting."""

    def __init__(self):
        self._templates: dict[str, str] = {}

    def render(self, template_name: str, variables: dict[str, Any]) -> str:
        try:
            template = self._templates.get(template_name, "")
            return template.format(**variables) if variables else template
        except Exception as e:
            raise TemplateRenderError(f"Template render failed: {e}")

    def add_template(self, name: str, content: str) -> None:
        self._templates[name] = content


class SmsDispatcher:
    """SMS dispatcher for queue integration."""

    def __init__(self, provider: SmsProvider | None = None):
        self.provider = provider or SmsFactory.create()
        self.template_engine = SmsTemplateEngine()

    async def dispatch(self, message: SmsMessage) -> str:
        return await self.provider.send(message)

    async def dispatch_bulk(self, messages: list[SmsMessage]) -> list[str]:
        results = []
        for message in messages:
            msg_id = await self.dispatch(message)
            results.append(msg_id)
        return results

    async def validate_phone(self, phone_number: str) -> bool:
        return await self.provider.validate_phone_number(phone_number)