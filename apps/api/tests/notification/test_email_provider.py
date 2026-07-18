"""Tests for email provider implementations."""

import pytest
from datetime import datetime
from uuid import uuid4

from app.notification.domain.email_provider import (
    EmailMessage,
    EmailProvider,
    SMTPProvider,
    SESProvider,
    SendGridProvider,
    EmailFactory,
    EmailTemplateEngine,
    EmailDispatcher,
)
from app.notification.domain.email_exceptions import (
    EmailProviderError,
    TemplateRenderError,
    ProviderUnavailableError,
)


class TestEmailMessage:
    """Tests for EmailMessage dataclass."""

    def test_email_message_creation(self):
        """Test creating an email message."""
        message = EmailMessage(
            to="test@example.com",
            subject="Test Subject",
            body="Test Body",
        )
        assert message.to == "test@example.com"
        assert message.subject == "Test Subject"
        assert message.body == "Test Body"

    def test_email_message_with_html(self):
        """Test creating an email message with HTML."""
        message = EmailMessage(
            to="test@example.com",
            subject="Test Subject",
            body="Text body",
            html="<p>HTML body</p>",
        )
        assert message.html == "<p>HTML body</p>"

    def test_email_message_with_cc_bcc(self):
        """Test creating an email message with CC and BCC."""
        message = EmailMessage(
            to="test@example.com",
            subject="Test Subject",
            body="Test Body",
            cc=["cc@example.com"],
            bcc=["bcc@example.com"],
        )
        assert "cc@example.com" in message.cc
        assert "bcc@example.com" in message.bcc


class TestSMTPProvider:
    """Tests for SMTPProvider."""

    @pytest.mark.asyncio
    async def test_smtp_send(self):
        """Test SMTP send."""
        provider = SMTPProvider()
        message = EmailMessage(
            to="test@example.com",
            subject="Test",
            body="Body",
        )
        msg_id = await provider.send(message)
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_smtp_validate(self):
        """Test SMTP validate."""
        provider = SMTPProvider()
        result = await provider.validate()
        assert isinstance(result, bool)

    @pytest.mark.asyncio
    async def test_smtp_get_status(self):
        """Test SMTP get status."""
        provider = SMTPProvider()
        status = await provider.get_status("test-id")
        assert status["status"] == "sent"


class TestSESProvider:
    """Tests for SESProvider."""

    @pytest.mark.asyncio
    async def test_ses_send(self):
        """Test SES send."""
        provider = SESProvider()
        message = EmailMessage(
            to="test@example.com",
            subject="Test",
            body="Body",
        )
        msg_id = await provider.send(message)
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_ses_validate(self):
        """Test SES validate."""
        provider = SESProvider()
        result = await provider.validate()
        assert isinstance(result, bool)

    @pytest.mark.asyncio
    async def test_ses_get_status(self):
        """Test SES get status."""
        provider = SESProvider()
        status = await provider.get_status("test-id")
        assert status["provider"] == "ses"


class TestSendGridProvider:
    """Tests for SendGridProvider."""

    @pytest.mark.asyncio
    async def test_sendgrid_send(self):
        """Test SendGrid send."""
        provider = SendGridProvider()
        message = EmailMessage(
            to="test@example.com",
            subject="Test",
            body="Body",
        )
        msg_id = await provider.send(message)
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_sendgrid_validate(self):
        """Test SendGrid validate."""
        provider = SendGridProvider()
        result = await provider.validate()
        assert isinstance(result, bool)

    @pytest.mark.asyncio
    async def test_sendgrid_get_status(self):
        """Test SendGrid get status."""
        provider = SendGridProvider()
        status = await provider.get_status("test-id")
        assert status["provider"] == "sendgrid"


class TestEmailFactory:
    """Tests for EmailFactory."""

    def test_create_smtp(self):
        """Test creating SMTP provider."""
        provider = EmailFactory.create("smtp")
        assert isinstance(provider, SMTPProvider)

    def test_create_ses(self):
        """Test creating SES provider."""
        provider = EmailFactory.create("ses")
        assert isinstance(provider, SESProvider)

    def test_create_sendgrid(self):
        """Test creating SendGrid provider."""
        provider = EmailFactory.create("sendgrid")
        assert isinstance(provider, SendGridProvider)

    def test_create_default(self):
        """Test creating default provider."""
        provider = EmailFactory.create()
        assert isinstance(provider, SMTPProvider)


class TestEmailTemplateEngine:
    """Tests for EmailTemplateEngine."""

    def test_render_template(self):
        """Test rendering a template."""
        engine = EmailTemplateEngine()
        engine.add_template("welcome", "Hello {name}!")
        result = engine.render("welcome", {"name": "World"})
        assert "World" in result

    def test_render_missing_template(self):
        """Test rendering missing template."""
        engine = EmailTemplateEngine()
        result = engine.render("missing", {})
        assert result == ""


class TestEmailDispatcher:
    """Tests for EmailDispatcher."""

    @pytest.mark.asyncio
    async def test_dispatch(self):
        """Test dispatching an email."""
        dispatcher = EmailDispatcher()
        message = EmailMessage(
            to="test@example.com",
            subject="Test",
            body="Body",
        )
        msg_id = await dispatcher.dispatch(message)
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_dispatch_bulk(self):
        """Test dispatching bulk emails."""
        dispatcher = EmailDispatcher()
        messages = [
            EmailMessage(to="test1@example.com", subject="Test", body="Body"),
            EmailMessage(to="test2@example.com", subject="Test", body="Body"),
        ]
        msg_ids = await dispatcher.dispatch_bulk(messages)
        assert len(msg_ids) == 2