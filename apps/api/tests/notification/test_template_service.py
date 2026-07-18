"""Tests for template service."""

import pytest
from uuid import UUID

from app.notification.application.template_service import (
    TemplateEngine,
    TemplateLibrary,
    TemplateVariable,
    TemplateLayout,
    DEFAULT_TEMPLATES,
)
from app.notification.domain.template_exceptions import (
    TemplateNotFoundError,
    TemplateValidationError,
    TemplateRenderError,
)
from app.notification.domain.models import NotificationChannel


class TestTemplateVariable:
    """Tests for TemplateVariable."""

    def test_variable_creation(self):
        """Test creating a template variable."""
        var = TemplateVariable(name="user_name", required=True, default=None)
        assert var.name == "user_name"
        assert var.required is True
        assert var.default is None

    def test_variable_to_dict(self):
        """Test converting variable to dict."""
        var = TemplateVariable(name="user_name", required=True, default="John")
        result = var.to_dict()
        assert result["name"] == "user_name"
        assert result["required"] is True
        assert result["default"] == "John"


class TestTemplateLayout:
    """Tests for TemplateLayout."""

    def test_layout_creation(self):
        """Test creating a template layout."""
        layout = TemplateLayout(name="email", content="<html>{{ body }}</html>")
        assert layout.name == "email"
        assert layout.content == "<html>{{ body }}</html>"


class TestTemplateEngine:
    """Tests for TemplateEngine."""

    def test_render_simple_template(self):
        """Test rendering a simple template."""
        engine = TemplateEngine()
        engine.add_template("test", "Hello {{ name }}!")
        result = engine.render("test", {"name": "World"})
        assert result == "Hello World!"

    def test_render_template_not_found(self):
        """Test rendering a non-existent template."""
        engine = TemplateEngine()
        with pytest.raises(TemplateNotFoundError):
            engine.render("nonexistent", {})

    def test_validate_valid_template(self):
        """Test validating a valid template."""
        engine = TemplateEngine()
        assert engine.validate_template("Hello {{ name }}!", ["name"]) is True

    def test_validate_invalid_template(self):
        """Test validating an invalid template."""
        engine = TemplateEngine()
        assert engine.validate_template("Hello {{ name }!", ["name"]) is False

    def test_extract_variables(self):
        """Test extracting variables from template."""
        engine = TemplateEngine()
        variables = engine.extract_variables("Hello {{ name }}, your id is {{ user_id }}")
        assert "name" in variables
        assert "user_id" in variables


class TestTemplateLibrary:
    """Tests for TemplateLibrary."""

    @pytest.mark.asyncio
    async def test_list_templates(self):
        """Test listing templates."""
        library = TemplateLibrary()
        # Without repository, should return empty list
        templates = await library.list_templates()
        assert isinstance(templates, list)

    @pytest.mark.asyncio
    async def test_preview_template(self):
        """Test previewing a template."""
        library = TemplateLibrary()
        result = await library.preview_template(
            "Hello {{ name }}!",
            {"name": "World"},
        )
        assert result == "Hello World!"

    @pytest.mark.asyncio
    async def test_preview_template_error(self):
        """Test previewing an invalid template."""
        library = TemplateLibrary()
        with pytest.raises(TemplateRenderError):
            await library.preview_template("{{ invalid", {})

    def test_default_templates_exist(self):
        """Test that default templates are defined."""
        assert "welcome_email" in DEFAULT_TEMPLATES
        assert "password_reset" in DEFAULT_TEMPLATES
        assert "security_alert" in DEFAULT_TEMPLATES
        assert "workflow_notification" in DEFAULT_TEMPLATES
        assert "sms_otp" in DEFAULT_TEMPLATES

    def test_default_template_structure(self):
        """Test default template structure."""
        template = DEFAULT_TEMPLATES["welcome_email"]
        assert template["name"] == "welcome_email"
        assert template["channel"] == NotificationChannel.EMAIL
        assert "user_name" in template["variables"]
        assert "platform_name" in template["variables"]