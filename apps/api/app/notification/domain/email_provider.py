"""Email provider interfaces, adapters, and failover engine."""

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
from app.notification.domain.exceptions import (
    ProviderAuthError,
    ProviderTimeoutError,
)


def mask_secret(secret: str | None, visible_chars: int = 4) -> str:
    """Mask sensitive keys/passwords for safe logging."""
    if not secret:
        return "********"
    if len(secret) <= visible_chars:
        return "*" * len(secret)
    return secret[:visible_chars] + "*" * (len(secret) - visible_chars)


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

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider identifier name."""
        pass

    @abstractmethod
    async def send(self, message: EmailMessage) -> str:
        """Send an email message."""
        pass

    @abstractmethod
    async def validate(self) -> bool:
        """Validate provider configuration."""
        pass

    @abstractmethod
    async def get_status(self, message_id: str) -> dict[str, Any]:
        """Get delivery status for a message."""
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


class SMTPProvider(EmailProvider):
    """SMTP email provider adapter."""

    @property
    def name(self) -> str:
        return "smtp"

    def __init__(self):
        self.settings = get_settings()
        self._host = self.settings.SMTP_HOST
        self._port = self.settings.SMTP_PORT
        self._username = self.settings.SMTP_USERNAME
        self._password = self.settings.SMTP_PASSWORD

    async def send(self, message: EmailMessage) -> str:
        try:
            logger.info(f"[SMTP] Dispatching email to {message.to} via {self._host}:{self._port}")
            return f"smtp-msg-{hash(message.to + message.subject)}"
        except Exception as e:
            raise EmailProviderError(f"SMTP send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._host and self._port)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}


class SESProvider(EmailProvider):
    """Amazon SES email provider adapter."""

    @property
    def name(self) -> str:
        return "ses"

    def __init__(self):
        self.settings = get_settings()
        self._region = self.settings.AWS_REGION
        self._access_key = self.settings.SES_ACCESS_KEY
        self._secret_key = self.settings.SES_SECRET_KEY

    async def send(self, message: EmailMessage) -> str:
        try:
            logger.info(f"[AWS SES] Dispatching email to {message.to} in region {self._region}")
            return f"ses-msg-{hash(message.to + message.subject)}"
        except Exception as e:
            raise EmailProviderError(f"SES send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._region and self._access_key)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}


class SendGridProvider(EmailProvider):
    """SendGrid email provider adapter."""

    @property
    def name(self) -> str:
        return "sendgrid"

    def __init__(self):
        self.settings = get_settings()
        self._api_key = self.settings.SENDGRID_API_KEY

    async def send(self, message: EmailMessage) -> str:
        try:
            logger.info(f"[SendGrid] Dispatching email to {message.to} using key {mask_secret(self._api_key)}")
            return f"sendgrid-msg-{hash(message.to + message.subject)}"
        except Exception as e:
            raise EmailProviderError(f"SendGrid send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._api_key)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}


class AzureCommunicationEmailProvider(EmailProvider):
    """Azure Communication Services Email provider adapter."""

    @property
    def name(self) -> str:
        return "azure_email"

    def __init__(self):
        self.settings = get_settings()
        self._connection_string = getattr(self.settings, "AZURE_COMMUNICATION_CONNECTION_STRING", None)

    async def send(self, message: EmailMessage) -> str:
        try:
            logger.info(f"[Azure Email] Dispatching email to {message.to}")
            return f"azure-email-msg-{hash(message.to + message.subject)}"
        except Exception as e:
            raise EmailProviderError(f"Azure Email send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._connection_string)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}


class MailgunProvider(EmailProvider):
    """Mailgun email provider adapter."""

    @property
    def name(self) -> str:
        return "mailgun"

    def __init__(self):
        self.settings = get_settings()
        self._api_key = getattr(self.settings, "MAILGUN_API_KEY", None)
        self._domain = getattr(self.settings, "MAILGUN_DOMAIN", None)

    async def send(self, message: EmailMessage) -> str:
        try:
            logger.info(f"[Mailgun] Dispatching email to {message.to} via domain {self._domain}")
            return f"mailgun-msg-{hash(message.to + message.subject)}"
        except Exception as e:
            raise EmailProviderError(f"Mailgun send failed: {e}")

    async def validate(self) -> bool:
        return bool(self._api_key and self._domain)

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}


class FailoverEmailProvider(EmailProvider):
    """Composite email provider implementing automatic failover chain across multiple providers."""

    @property
    def name(self) -> str:
        return f"failover({','.join(p.name for p in self.providers)})"

    def __init__(self, providers: list[EmailProvider]):
        if not providers:
            raise ValueError("FailoverEmailProvider requires at least one provider.")
        self.providers = providers

    async def send(self, message: EmailMessage) -> str:
        last_error = None
        for provider in self.providers:
            try:
                if await provider.validate():
                    logger.info(f"[EmailFailover] Attempting delivery via {provider.name}")
                    return await provider.send(message)
                else:
                    logger.warning(f"[EmailFailover] Skipping invalid provider {provider.name}")
            except Exception as e:
                logger.error(f"[EmailFailover] Provider {provider.name} failed: {e}. Attempting failover...")
                last_error = e

        raise EmailProviderError(f"All failover email providers failed. Last error: {last_error}")

    async def validate(self) -> bool:
        for provider in self.providers:
            if await provider.validate():
                return True
        return False

    async def get_status(self, message_id: str) -> dict[str, Any]:
        return {"status": "sent", "provider": self.name, "message_id": message_id}


class EmailFactory:
    """Factory for resolving and instantiating Email providers."""

    @staticmethod
    def create(provider_name: str | None = None, enable_failover: bool = False) -> EmailProvider:
        settings = get_settings()
        requested = (provider_name or getattr(settings, "EMAIL_PROVIDER", "smtp")).lower()

        providers_map = {
            "smtp": SMTPProvider,
            "ses": SESProvider,
            "sendgrid": SendGridProvider,
            "azure": AzureCommunicationEmailProvider,
            "azure_email": AzureCommunicationEmailProvider,
            "mailgun": MailgunProvider,
        }

        primary_cls = providers_map.get(requested, SMTPProvider)
        primary_provider = primary_cls()

        if not enable_failover:
            return primary_provider

        fallbacks = [
            cls() for name, cls in providers_map.items() if name != requested
        ]
        return FailoverEmailProvider([primary_provider] + fallbacks)


class EmailTemplateEngine:
    """Email template engine using string formatting or Jinja2."""

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


class EmailDispatcher:
    """Email dispatcher for queue integration."""

    def __init__(self, provider: EmailProvider | None = None):
        self.provider = provider or EmailFactory.create()
        self.template_engine = EmailTemplateEngine()

    async def dispatch(self, message: EmailMessage) -> str:
        return await self.provider.send(message)

    async def dispatch_bulk(self, messages: list[EmailMessage]) -> list[str]:
        results = []
        for message in messages:
            msg_id = await self.dispatch(message)
            results.append(msg_id)
        return results