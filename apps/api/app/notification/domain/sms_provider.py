"""SMS provider interface and implementations."""

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
    max_length: int = 1600  # For long SMS concatenation
    metadata: dict[str, Any] = field(default_factory=dict)


class SmsProvider(ABC):
    """Abstract SMS provider interface."""

    @abstractmethod
    async def send(self, message: SmsMessage) -> str:
        """Send an SMS message.

        Args:
            message: SMS message to send.

        Returns:
            Message ID.

        Raises:
            SmsProviderError: If sending fails.
        """
        pass

    @abstractmethod
    async def validate(self) -> bool:
        """Validate provider configuration.

        Returns:
            True if valid.

        Raises:
            ProviderUnavailableError: If provider is unavailable.
        """
        pass

    @abstractmethod
    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get delivery status for a message.

        Args:
            message_id: Message ID.

        Returns:
            Status information.
        """
        pass

    @abstractmethod
    async def validate_phone_number(self, phone_number: str) -> bool:
        """Validate a phone number.

        Args:
            phone_number: Phone number to validate.

        Returns:
            True if valid.
        """
        pass


class TwilioProvider(SmsProvider):
    """Twilio SMS provider implementation."""

    def __init__(self):
        """Initialize Twilio provider."""
        self.settings = get_settings()
        self._account_sid = self.settings.TWILIO_ACCOUNT_SID
        self._auth_token = self.settings.TWILIO_AUTH_TOKEN
        self._from_number = self.settings.TWILIO_FROM_NUMBER

    async def send(self, message: SmsMessage) -> str:
        """Send SMS via Twilio."""
        try:
            # Placeholder for Twilio implementation
            logger.info(f"Sending SMS via Twilio to {message.to}")
            return f"twilio-{message.to}"
        except Exception as e:
            raise SmsProviderError(f"Twilio send failed: {e}")

    async def validate(self) -> bool:
        """Validate Twilio configuration."""
        try:
            return bool(self._account_sid and self._auth_token and self._from_number)
        except Exception:
            raise ProviderUnavailableError("Twilio provider unavailable")

    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get Twilio message status."""
        return {"status": "sent", "provider": "twilio", "message_id": message_id}

    async def validate_phone_number(self, phone_number: str) -> bool:
        """Validate phone number format."""
        # Basic E.164 format validation
        if not phone_number:
            return False
        if not phone_number.startswith("+"):
            return False
        if len(phone_number) < 10 or len(phone_number) > 15:
            return False
        return True


class AwsSnsProvider(SmsProvider):
    """AWS SNS SMS provider implementation."""

    def __init__(self):
        """Initialize AWS SNS provider."""
        self.settings = get_settings()
        self._region = self.settings.AWS_REGION
        self._topic_arn = self.settings.SNS_TOPIC_ARN
        self._access_key = self.settings.AWS_ACCESS_KEY_ID
        self._secret_key = self.settings.AWS_SECRET_ACCESS_KEY

    async def send(self, message: SmsMessage) -> str:
        """Send SMS via AWS SNS."""
        try:
            # Placeholder for AWS SNS implementation
            logger.info(f"Sending SMS via AWS SNS to {message.to}")
            return f"aws-sns-{message.to}"
        except Exception as e:
            raise SmsProviderError(f"AWS SNS send failed: {e}")

    async def validate(self) -> bool:
        """Validate AWS SNS configuration."""
        try:
            return bool(self._region and self._access_key and self._secret_key)
        except Exception:
            raise ProviderUnavailableError("AWS SNS provider unavailable")

    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get AWS SNS message status."""
        return {"status": "sent", "provider": "aws_sns", "message_id": message_id}

    async def validate_phone_number(self, phone_number: str) -> bool:
        """Validate phone number format."""
        # Basic E.164 format validation
        if not phone_number:
            return False
        if not phone_number.startswith("+"):
            return False
        if len(phone_number) < 10 or len(phone_number) > 15:
            return False
        return True


class MessageBirdProvider(SmsProvider):
    """MessageBird SMS provider implementation."""

    def __init__(self):
        """Initialize MessageBird provider."""
        self.settings = get_settings()
        self._api_key = self.settings.MESSAGEBIRD_API_KEY
        self._originator = self.settings.TWILIO_FROM_NUMBER  # Reuse for originator

    async def send(self, message: SmsMessage) -> str:
        """Send SMS via MessageBird."""
        try:
            # Placeholder for MessageBird implementation
            logger.info(f"Sending SMS via MessageBird to {message.to}")
            return f"messagebird-{message.to}"
        except Exception as e:
            raise SmsProviderError(f"MessageBird send failed: {e}")

    async def validate(self) -> bool:
        """Validate MessageBird configuration."""
        try:
            return bool(self._api_key)
        except Exception:
            raise ProviderUnavailableError("MessageBird provider unavailable")

    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get MessageBird message status."""
        return {"status": "sent", "provider": "messagebird", "message_id": message_id}

    async def validate_phone_number(self, phone_number: str) -> bool:
        """Validate phone number format."""
        # Basic E.164 format validation
        if not phone_number:
            return False
        if not phone_number.startswith("+"):
            return False
        if len(phone_number) < 10 or len(phone_number) > 15:
            return False
        return True


class SmsFactory:
    """Factory for creating SMS providers."""

    @staticmethod
    def create(provider: str | None = None) -> SmsProvider:
        """Create an SMS provider.

        Args:
            provider: Provider name (twilio, aws_sns, messagebird).

        Returns:
            SMS provider instance.
        """
        settings = get_settings()
        provider_name = provider or settings.SMS_PROVIDER

        if provider_name == "twilio":
            return TwilioProvider()
        elif provider_name == "aws_sns":
            return AwsSnsProvider()
        elif provider_name == "messagebird":
            return MessageBirdProvider()
        else:
            return TwilioProvider()


class SmsTemplateEngine:
    """SMS template engine using Jinja2."""

    def __init__(self):
        """Initialize template engine."""
        self._templates: dict[str, str] = {}

    def render(self, template_name: str, variables: dict[str, Any]) -> str:
        """Render a template.

        Args:
            template_name: Template name.
            variables: Template variables.

        Returns:
            Rendered content.

        Raises:
            TemplateRenderError: If rendering fails.
        """
        try:
            template = self._templates.get(template_name, "")
            # Placeholder for Jinja2 rendering
            return template.format(**variables) if variables else template
        except Exception as e:
            raise TemplateRenderError(f"Template render failed: {e}")

    def add_template(self, name: str, content: str) -> None:
        """Add a template.

        Args:
            name: Template name.
            content: Template content.
        """
        self._templates[name] = content


class SmsDispatcher:
    """SMS dispatcher for queue integration."""

    def __init__(self, provider: SmsProvider | None = None):
        """Initialize dispatcher.

        Args:
            provider: SMS provider to use.
        """
        self.provider = provider or SmsFactory.create()
        self.template_engine = SmsTemplateEngine()

    async def dispatch(self, message: SmsMessage) -> str:
        """Dispatch an SMS.

        Args:
            message: SMS message.

        Returns:
            Message ID.
        """
        return await self.provider.send(message)

    async def dispatch_bulk(self, messages: list[SmsMessage]) -> list[str]:
        """Dispatch multiple SMS messages.

        Args:
            messages: SMS messages.

        Returns:
            List of message IDs.
        """
        results = []
        for message in messages:
            msg_id = await self.dispatch(message)
            results.append(msg_id)
        return results

    async def validate_phone(self, phone_number: str) -> bool:
        """Validate a phone number.

        Args:
            phone_number: Phone number to validate.

        Returns:
            True if valid.
        """
        return await self.provider.validate_phone_number(phone_number)