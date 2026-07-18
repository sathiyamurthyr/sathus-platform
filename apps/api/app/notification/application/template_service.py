"""Template engine service for notification templates."""

import json
from datetime import datetime
from typing import Any
from uuid import UUID

from jinja2 import Environment, BaseLoader, TemplateSyntaxError, UndefinedError

from app.core.logging import logger
from app.notification.domain.models import (
    NotificationChannel,
    NotificationCategory,
    NotificationPriority,
)
from app.notification.domain.template_exceptions import (
    TemplateError,
    TemplateNotFoundError,
    TemplateValidationError,
    TemplateRenderError,
    TemplateVersionError,
)


class TemplateVariable:
    """Template variable definition."""

    def __init__(self, name: str, required: bool = True, default: Any = None):
        """Initialize variable."""
        self.name = name
        self.required = required
        self.default = default

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "name": self.name,
            "required": self.required,
            "default": self.default,
        }


class TemplateLayout:
    """Template layout definition."""

    def __init__(self, name: str, content: str):
        """Initialize layout."""
        self.name = name
        self.content = content


class TemplateEngine:
    """Jinja2-based template engine for notifications."""

    def __init__(self):
        """Initialize template engine."""
        self.env = Environment(loader=BaseLoader())
        self._layouts: dict[str, TemplateLayout] = {}
        self._templates: dict[str, str] = {}

    def add_layout(self, name: str, content: str) -> None:
        """Add a layout template."""
        self._layouts[name] = TemplateLayout(name=name, content=content)

    def add_template(self, name: str, content: str) -> None:
        """Add a template."""
        self._templates[name] = content

    def render(
        self,
        template_name: str,
        variables: dict[str, Any],
        language: str = "en",
    ) -> str:
        """Render a template with variables."""
        if template_name not in self._templates:
            raise TemplateNotFoundError(f"Template {template_name} not found")

        try:
            template = self.env.from_string(self._templates[template_name])
            return template.render(**variables)
        except TemplateSyntaxError as e:
            raise TemplateRenderError(f"Template syntax error: {e}")
        except UndefinedError as e:
            raise TemplateRenderError(f"Undefined variable: {e}")

    def validate_template(
        self,
        content: str,
        variables: list[str],
    ) -> bool:
        """Validate template syntax and variables."""
        try:
            template = self.env.from_string(content)
            # Check for undefined variables
            for var in variables:
                if f"{{{{ {var} }}}}" in content or f"{{{{ {var}|" in content:
                    continue
            return True
        except TemplateSyntaxError:
            return False

    def extract_variables(self, content: str) -> list[str]:
        """Extract variable names from template content."""
        import re
        pattern = r"\{\{\s*(\w+)"
        matches = re.findall(pattern, content)
        return list(set(matches))


class TemplateLibrary:
    """Template library for managing notification templates."""

    def __init__(self, template_repo=None, localization_repo=None):
        """Initialize template library."""
        self.template_repo = template_repo
        self.localization_repo = localization_repo
        self.engine = TemplateEngine()

    async def create_template(
        self,
        name: str,
        body: str,
        channel: NotificationChannel,
        subject: str | None = None,
        variables: list[str] | None = None,
    ) -> dict[str, Any]:
        """Create a new notification template."""
        # Validate template
        if not self.engine.validate_template(body, variables or []):
            raise TemplateValidationError("Invalid template syntax")

        # Create in repository
        template = await self.template_repo.create(
            name=name,
            body=body,
            channel=channel,
            subject=subject,
            variables=variables,
        )

        return {
            "id": str(template.id),
            "name": template.name,
            "subject": template.subject,
            "body": template.body,
            "channel": template.channel.value,
            "variables": template.variables,
            "version": template.version,
            "is_active": template.is_active,
        }

    async def add_localization(
        self,
        template_id: UUID,
        language_code: str,
        subject: str | None,
        body: str,
    ) -> dict[str, Any]:
        """Add localization for a template."""
        localization = await self.localization_repo.create(
            template_id=template_id,
            language_code=language_code,
            subject=subject,
            body=body,
        )

        return {
            "id": str(localization.id),
            "template_id": str(localization.template_id),
            "language_code": localization.language_code,
            "subject": localization.subject,
            "body": localization.body,
        }

    async def render_template(
        self,
        template_name: str,
        variables: dict[str, Any],
        language: str = "en",
    ) -> str:
        """Render a template with variables."""
        return self.engine.render(template_name, variables, language)

    async def get_template(
        self,
        template_id: UUID,
        language: str = "en",
    ) -> dict[str, Any]:
        """Get a template with optional localization."""
        template = await self.template_repo.get(template_id)
        if not template:
            raise TemplateNotFoundError(f"Template {template_id} not found")

        result = {
            "id": str(template.id),
            "name": template.name,
            "subject": template.subject,
            "body": template.body,
            "channel": template.channel.value,
            "variables": template.variables,
            "version": template.version,
            "is_active": template.is_active,
        }

        # Get localization if available
        if language != "en":
            localization = await self.localization_repo.get_by_template_and_language(
                template_id, language
            )
            if localization:
                result["subject"] = localization.subject or template.subject
                result["body"] = localization.body

        return result

    async def list_templates(
        self,
        limit: int = 100,
        offset: int = 0,
    ) -> list[dict[str, Any]]:
        """List all templates."""
        if self.template_repo is None:
            return []
        templates = await self.template_repo.list(limit, offset)
        return [
            {
                "id": str(t.id),
                "name": t.name,
                "subject": t.subject,
                "body": t.body,
                "channel": t.channel.value,
                "variables": t.variables,
                "version": t.version,
                "is_active": t.is_active,
            }
            for t in templates
        ]

    async def preview_template(
        self,
        body: str,
        variables: dict[str, Any],
    ) -> str:
        """Preview a template with sample variables."""
        try:
            template = self.engine.env.from_string(body)
            return template.render(**variables)
        except Exception as e:
            raise TemplateRenderError(f"Preview error: {e}")

    async def create_new_version(
        self,
        template_id: UUID,
        body: str,
        subject: str | None = None,
        variables: list[str] | None = None,
    ) -> dict[str, Any]:
        """Create a new version of a template."""
        template = await self.template_repo.get(template_id)
        if not template:
            raise TemplateNotFoundError(f"Template {template_id} not found")

        # Validate new version
        if not self.engine.validate_template(body, variables or []):
            raise TemplateValidationError("Invalid template syntax")

        # Create new version
        new_template = await self.template_repo.create(
            name=template.name,
            body=body,
            channel=template.channel,
            subject=subject or template.subject,
            variables=variables or template.variables,
            version=template.version + 1,
        )

        return {
            "id": str(new_template.id),
            "name": new_template.name,
            "subject": new_template.subject,
            "body": new_template.body,
            "channel": new_template.channel.value,
            "variables": new_template.variables,
            "version": new_template.version,
            "is_active": new_template.is_active,
        }


# Default templates
DEFAULT_TEMPLATES: dict[str, dict[str, Any]] = {
    "welcome_email": {
        "name": "welcome_email",
        "subject": "Welcome to {{ platform_name }}!",
        "body": "<h1>Hello {{ user_name }}!</h1><p>Welcome to {{ platform_name }}. Your account has been created successfully.</p>",
        "channel": NotificationChannel.EMAIL,
        "variables": ["user_name", "platform_name"],
    },
    "password_reset": {
        "name": "password_reset",
        "subject": "Password Reset Request",
        "body": "<p>Hello {{ user_name }},</p><p>Click the link to reset your password: {{ reset_link }}</p>",
        "channel": NotificationChannel.EMAIL,
        "variables": ["user_name", "reset_link"],
    },
    "security_alert": {
        "name": "security_alert",
        "subject": "Security Alert - {{ alert_type }}",
        "body": "<p>Security alert detected: {{ alert_message }}</p><p>Time: {{ timestamp }}</p>",
        "channel": NotificationChannel.IN_APP,
        "variables": ["alert_type", "alert_message", "timestamp"],
    },
    "workflow_notification": {
        "name": "workflow_notification",
        "subject": "Workflow Update: {{ workflow_name }}",
        "body": "<p>Workflow {{ workflow_name }} status: {{ status }}</p>",
        "channel": NotificationChannel.IN_APP,
        "variables": ["workflow_name", "status"],
    },
    "sms_otp": {
        "name": "sms_otp",
        "body": "Your verification code is: {{ otp_code }}. It expires in {{ expiry_minutes }} minutes.",
        "channel": NotificationChannel.SMS,
        "variables": ["otp_code", "expiry_minutes"],
    },
}