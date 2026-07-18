"""Tests for SMS provider implementations."""

import pytest

from app.notification.domain.sms_provider import (
    SmsMessage,
    SmsProvider,
    TwilioProvider,
    AwsSnsProvider,
    MessageBirdProvider,
    SmsFactory,
    SmsTemplateEngine,
    SmsDispatcher,
)
from app.notification.domain.sms_exceptions import (
    SmsProviderError,
    TemplateRenderError,
    ProviderUnavailableError,
)


class TestSmsMessage:
    """Tests for SmsMessage."""

    def test_sms_message_creation(self):
        """Test creating an SMS message."""
        message = SmsMessage(
            to="+1234567890",
            body="Test message",
        )
        assert message.to == "+1234567890"
        assert message.body == "Test message"

    def test_sms_message_with_options(self):
        """Test creating an SMS message with options."""
        message = SmsMessage(
            to="+1234567890",
            body="Test message",
            from_number="+0987654321",
            priority="high",
            message_type="otp",
            unicode=True,
        )
        assert message.from_number == "+0987654321"
        assert message.message_type == "otp"

    def test_sms_message_default_values(self):
        """Test SMS message default values."""
        message = SmsMessage(to="+1234567890", body="Test")
        assert message.priority == "normal"
        assert message.message_type == "transactional"
        assert message.unicode is True


class TestTwilioProvider:
    """Tests for TwilioProvider."""

    @pytest.mark.asyncio
    async def test_twilio_send(self):
        """Test Twilio send."""
        provider = TwilioProvider()
        message = SmsMessage(to="+1234567890", body="Test")
        msg_id = await provider.send(message)
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_twilio_validate(self):
        """Test Twilio validate."""
        provider = TwilioProvider()
        result = await provider.validate()
        assert isinstance(result, bool)

    @pytest.mark.asyncio
    async def test_twilio_get_status(self):
        """Test Twilio get status."""
        provider = TwilioProvider()
        status = await provider.get_status("test-id")
        assert status["provider"] == "twilio"

    @pytest.mark.asyncio
    async def test_twilio_validate_phone_number(self):
        """Test Twilio phone number validation."""
        provider = TwilioProvider()
        assert await provider.validate_phone_number("+1234567890") is True
        assert await provider.validate_phone_number("invalid") is False


class TestAwsSnsProvider:
    """Tests for AwsSnsProvider."""

    @pytest.mark.asyncio
    async def test_aws_sns_send(self):
        """Test AWS SNS send."""
        provider = AwsSnsProvider()
        message = SmsMessage(to="+1234567890", body="Test")
        msg_id = await provider.send(message)
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_aws_sns_validate(self):
        """Test AWS SNS validate."""
        provider = AwsSnsProvider()
        result = await provider.validate()
        assert isinstance(result, bool)

    @pytest.mark.asyncio
    async def test_aws_sns_get_status(self):
        """Test AWS SNS get status."""
        provider = AwsSnsProvider()
        status = await provider.get_status("test-id")
        assert status["provider"] == "aws_sns"

    @pytest.mark.asyncio
    async def test_aws_sns_validate_phone_number(self):
        """Test AWS SNS phone number validation."""
        provider = AwsSnsProvider()
        assert await provider.validate_phone_number("+1234567890") is True
        assert await provider.validate_phone_number("invalid") is False


class TestMessageBirdProvider:
    """Tests for MessageBirdProvider."""

    @pytest.mark.asyncio
    async def test_messagebird_send(self):
        """Test MessageBird send."""
        provider = MessageBirdProvider()
        message = SmsMessage(to="+1234567890", body="Test")
        msg_id = await provider.send(message)
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_messagebird_validate(self):
        """Test MessageBird validate."""
        provider = MessageBirdProvider()
        result = await provider.validate()
        assert isinstance(result, bool)

    @pytest.mark.asyncio
    async def test_messagebird_get_status(self):
        """Test MessageBird get status."""
        provider = MessageBirdProvider()
        status = await provider.get_status("test-id")
        assert status["provider"] == "messagebird"

    @pytest.mark.asyncio
    async def test_messagebird_validate_phone_number(self):
        """Test MessageBird phone number validation."""
        provider = MessageBirdProvider()
        assert await provider.validate_phone_number("+1234567890") is True
        assert await provider.validate_phone_number("invalid") is False


class TestSmsFactory:
    """Tests for SmsFactory."""

    def test_create_twilio(self):
        """Test creating Twilio provider."""
        provider = SmsFactory.create("twilio")
        assert isinstance(provider, TwilioProvider)

    def test_create_aws_sns(self):
        """Test creating AWS SNS provider."""
        provider = SmsFactory.create("aws_sns")
        assert isinstance(provider, AwsSnsProvider)

    def test_create_messagebird(self):
        """Test creating MessageBird provider."""
        provider = SmsFactory.create("messagebird")
        assert isinstance(provider, MessageBirdProvider)

    def test_create_default(self):
        """Test creating default provider."""
        provider = SmsFactory.create()
        assert isinstance(provider, TwilioProvider)


class TestSmsTemplateEngine:
    """Tests for SmsTemplateEngine."""

    def test_render_template(self):
        """Test rendering a template."""
        engine = SmsTemplateEngine()
        engine.add_template("welcome", "Hello {name}!")
        result = engine.render("welcome", {"name": "World"})
        assert "World" in result

    def test_render_missing_template(self):
        """Test rendering missing template."""
        engine = SmsTemplateEngine()
        result = engine.render("missing", {})
        assert result == ""


class TestSmsDispatcher:
    """Tests for SmsDispatcher."""

    @pytest.mark.asyncio
    async def test_dispatch(self):
        """Test dispatching an SMS."""
        dispatcher = SmsDispatcher()
        message = SmsMessage(to="+1234567890", body="Test")
        msg_id = await dispatcher.dispatch(message)
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_dispatch_bulk(self):
        """Test dispatching bulk SMS."""
        dispatcher = SmsDispatcher()
        messages = [
            SmsMessage(to="+1111111111", body="Test"),
            SmsMessage(to="+2222222222", body="Test"),
        ]
        msg_ids = await dispatcher.dispatch_bulk(messages)
        assert len(msg_ids) == 2

    @pytest.mark.asyncio
    async def test_validate_phone(self):
        """Test validating phone number."""
        dispatcher = SmsDispatcher()
        assert await dispatcher.validate_phone("+1234567890") is True
        assert await dispatcher.validate_phone("invalid") is False