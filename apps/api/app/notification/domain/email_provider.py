"""Email provider interface and implementations."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

from app.core.config import get_settings
from app.core.logging import logger
from app.notification.domain.email_exceptions import (
    AttachmentError,
    DeliveryFailedError,
    EmailProviderError,
    ProviderUnavailableError,
    TemplateRenderError,
)


@dataclass
class EmailMessage:
    """Email message data structure."""

    to: str
    subject: str
    body: str
    html: str | None = None
    cc: list[str] = field(default_factory=list)
    bcc: list[str] = field(default_factory=list)
    reply_to: str | None = None
    priority: str = "normal"
    attachments: list[dict[str, Any]] = field(default_factory=list)
    inline_images: list[dict[str, Any]] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


class EmailProvider(ABC):
    """Abstract email provider interface."""

    @abstractmethod
    async def send(self, message: EmailMessage) -> str:
        """Send an email message.

        Args:
            message: Email message to send.

        Returns:
            Message ID.

        Raises:
            EmailProviderError: If sending fails.
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


class SMTPProvider(EmailProvider):
    """SMTP email provider implementation."""

    def __init__(self):
        """Initialize SMTP provider."""
        self.settings = get_settings()
        self._host = self.settings.SMTP_HOST
        self._port = self.settings.SMTP_PORT
        self._username = self.settings.SMTP_USERNAME
        self._password = self.settings.SMTP_PASSWORD
        self._tls = self.settings.SMTP_TLS
        self._ssl = self.settings.SMTP_SSL

    async def send(self, message: EmailMessage) -> str:
        """Send email via SMTP."""
        try:
            # Placeholder for SMTP implementation
            logger.info(f"Sending email via SMTP to {message.to}")
            return f"smtp-{message.to}"
        except Exception as e:
            raise EmailProviderError(f"SMTP send failed: {e}")

    async def validate(self) -> bool:
        """Validate SMTP configuration."""
        try:
            return bool(self._host and self._port)
        except Exception:
            raise ProviderUnavailableError("SMTP provider unavailable")

    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get SMTP message status."""
        return {"status": "sent", "provider": "smtp", "message_id": message_id}


class SESProvider(EmailProvider):
    """Amazon SES email provider implementation."""

    def __init__(self):
        """Initialize SES provider."""
        self.settings = get_settings()
        self._region = self.settings.AWS_REGION
        self._access_key = self.settings.SES_ACCESS_KEY
        self._secret_key = self.settings.SES_SECRET_KEY

    async def send(self, message: EmailMessage) -> str:
        """Send email via SES."""
        try:
            # Placeholder for SES implementation
            logger.info(f"Sending email via SES to {message.to}")
            return f"ses-{message.to}"
        except Exception as e:
            raise EmailProviderError(f"SES send failed: {e}")

    async def validate(self) -> bool:
        """Validate SES configuration."""
        try:
            return bool(self._region and self._access_key)
        except Exception:
            raise ProviderUnavailableError("SES provider unavailable")

    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get SES message status."""
        return {"status": "sent", "provider": "ses", "message_id": message_id}


class SendGridProvider(EmailProvider):
    """SendGrid email provider implementation."""

    def __init__(self):
        """Initialize SendGrid provider."""
        self.settings = get_settings()
        self._api_key = self.settings.SENDGRID_API_KEY

    async def send(self, message: EmailMessage) -> str:
        """Send email via SendGrid."""
        try:
            # Placeholder for SendGrid implementation
            logger.info(f"Sending email via SendGrid to {message.to}")
            return f"sendgrid-{message.to}"
        except Exception as e:
            raise EmailProviderError(f"SendGrid send failed: {e}")

    async def validate(self) -> bool:
        """Validate SendGrid configuration."""
        try:
            return bool(self._api_key)
        except Exception:
            raise ProviderUnavailableError("SendGrid provider unavailable")

    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get SendGrid message status."""
        return {"status": "sent", "provider": "sendgrid", "message_id": message_id}


class EmailFactory:
    """Factory for creating email providers."""

    @staticmethod
    def create(provider: str | None = None) -> EmailProvider:
        """Create an email provider.

        Args:
            provider: Provider name (smtp, ses, sendgrid).

        Returns:
            Email provider instance.
        """
        settings = get_settings()
        provider_name = provider or settings.EMAIL_PROVIDER

        if provider_name == "smtp":
            return SMTPProvider()
        elif provider_name == "ses":
            return SESProvider()
        elif provider_name == "sendgrid":
            return SendGridProvider()
        else:
            return SMTPProvider()


class EmailTemplateEngine:
    """Email template engine using Jinja2."""

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


class EmailDispatcher:
    """Email dispatcher for queue integration."""

    def __init__(self, provider: EmailProvider | None = None):
        """Initialize dispatcher.

        Args:
            provider: Email provider to use.
        """
        self.provider = provider or EmailFactory.create()
        self.template_engine = EmailTemplateEngine()

    async def dispatch(self, message: EmailMessage) -> str:
        """Dispatch an email.

        Args:
            message: Email message.

        Returns:
            Message ID.
        """
        return await self.provider.send(message)

    async def dispatch_bulk(self, messages: list[EmailMessage]) -> list[str]:
        """Dispatch multiple emails.

        Args:
            messages: Email messages.

        Returns:
            List of message IDs.
        """
        results = []
        for message in messages:
            msg_id = await self.dispatch(message)
            results.append(msg_id)
        return results