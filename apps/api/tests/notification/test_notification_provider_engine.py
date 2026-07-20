"""Unit tests for EPIC-018 Phase 2 Notification Provider Integration Engine."""

from uuid import uuid4

import pytest

from app.notification.domain.email_provider import (
    AzureCommunicationEmailProvider,
    EmailFactory,
    EmailMessage,
    FailoverEmailProvider,
    MailgunProvider,
    SESProvider,
    SMTPProvider,
    SendGridProvider,
    mask_secret,
)
from app.notification.domain.exceptions import ProviderError, ProviderUnavailableError
from app.notification.domain.push_provider import (
    ApnsPushProvider,
    FailoverPushProvider,
    FcmPushProvider,
    HuaweiPushProvider,
    PushFactory,
    PushMessage,
)
from app.notification.domain.sms_provider import (
    AwsSnsProvider,
    AzureSmsProvider,
    FailoverSmsProvider,
    MessageBirdProvider,
    SmsFactory,
    SmsMessage,
    TwilioProvider,
)
from app.notification.application.services import NotificationDispatchEngine, ProviderRegistry
from app.notification.application.webhook_service import (
    GenericWebhookProvider,
    WebhookService,
    compute_hmac_signature,
)


def test_mask_secret():
    """Test secret masking helper for logging security."""
    assert mask_secret("super_secret_key_123") == "supe****************"
    assert mask_secret(None) == "********"
    assert mask_secret("123") == "***"


class MockEmailProvider(SMTPProvider):
    """Mock Email provider returning True on validate for testing failover engine."""

    async def validate(self) -> bool:
        return True


class MockPushProvider(FcmPushProvider):
    """Mock Push provider returning True on validate for testing failover engine."""

    async def validate(self) -> bool:
        return True


@pytest.mark.asyncio
async def test_email_adapters_and_factory():
    """Test Email provider adapters and factory."""
    smtp = MockEmailProvider()
    assert smtp.name == "smtp"
    msg = EmailMessage(to="user@example.com", subject="Test", body="Hello")
    assert await smtp.send(msg) is not None
    assert (await smtp.health_check())["status"] in ["healthy", "degraded", "unhealthy"]

    ses = SESProvider()
    assert ses.name == "ses"

    sendgrid = SendGridProvider()
    assert sendgrid.name == "sendgrid"

    azure_email = AzureCommunicationEmailProvider()
    assert azure_email.name == "azure_email"

    mailgun = MailgunProvider()
    assert mailgun.name == "mailgun"

    factory_provider = EmailFactory.create("smtp", enable_failover=False)
    assert factory_provider is not None


@pytest.mark.asyncio
async def test_email_failover_engine():
    """Test automatic failover chain for Email providers."""
    smtp = MockEmailProvider()
    ses = MockEmailProvider()
    failover_provider = FailoverEmailProvider([smtp, ses])

    assert "failover" in failover_provider.name
    msg = EmailMessage(to="test@example.com", subject="Failover Test", body="Body")
    msg_id = await failover_provider.send(msg)
    assert msg_id is not None


@pytest.mark.asyncio
async def test_sms_adapters_and_factory():
    """Test SMS provider adapters, phone validation, and factory."""
    twilio = TwilioProvider()
    assert twilio.name == "twilio"
    assert await twilio.validate_phone_number("+14155552671") is True
    assert await twilio.validate_phone_number("invalid") is False

    msg = SmsMessage(to="+14155552671", body="OTP: 998877")
    assert await twilio.send(msg) is not None

    sns = AwsSnsProvider()
    assert sns.name == "aws_sns"

    azure_sms = AzureSmsProvider()
    assert azure_sms.name == "azure_sms"

    mb = MessageBirdProvider()
    assert mb.name == "messagebird"

    factory_sms = SmsFactory.create("twilio", enable_failover=False)
    assert factory_sms is not None


@pytest.mark.asyncio
async def test_push_adapters_and_factory():
    """Test Push notification adapters and factory."""
    fcm = MockPushProvider()
    assert fcm.name == "fcm"

    apns = ApnsPushProvider()
    assert apns.name == "apns"

    huawei = HuaweiPushProvider()
    assert huawei.name == "huawei_push"

    push_msg = PushMessage(device_token="device_token_xyz", title="Alert", body="Push Body")
    msg_id = await fcm.send(push_msg)
    assert msg_id is not None

    failover_push = FailoverPushProvider([fcm, apns])
    assert "failover" in failover_push.name

    factory_push = PushFactory.create("fcm", enable_failover=False)
    assert factory_push is not None


@pytest.mark.asyncio
async def test_webhook_engine_and_hmac():
    """Test Webhook Engine, HMAC signature calculation, and verification."""
    secret = "my_webhook_secret_key"
    payload = {"event": "order.completed", "amount": 100}
    payload_bytes = b'{"amount":100,"event":"order.completed"}'

    sig = compute_hmac_signature(payload_bytes, secret)
    assert len(sig) == 64

    webhook_service = WebhookService()
    verified = await webhook_service.verify_signature(payload_bytes, sig, secret)
    assert verified is True

    res = await webhook_service.send_webhook(
        target_url="https://webhook.site/test",
        event_type="order.completed",
        payload=payload,
        secret=secret,
        max_retries=1,
    )
    assert res["success"] is True


@pytest.mark.asyncio
async def test_provider_registry_and_health_checks():
    """Test dynamic ProviderRegistry and health check engine."""
    registry = ProviderRegistry()
    registry.register("email", "custom_smtp", MockEmailProvider())

    resolved = registry.resolve("email", "custom_smtp")
    assert resolved.name == "smtp"

    health_report = await registry.health_check_all()
    assert "email" in health_report
    assert "sms" in health_report
    assert "push" in health_report


@pytest.mark.asyncio
async def test_notification_dispatch_engine():
    """Test channel-agnostic NotificationDispatchEngine."""
    registry = ProviderRegistry()
    registry.register("push", "primary", MockPushProvider())
    engine = NotificationDispatchEngine(registry)

    # Email dispatch
    res_email = await engine.send_direct(
        channel="email",
        destination="user@example.com",
        subject="Welcome",
        body="Welcome to Sathus Platform!",
    )
    assert res_email["success"] is True
    assert res_email["channel"] == "email"

    # SMS dispatch
    res_sms = await engine.send_direct(
        channel="sms",
        destination="+14155552671",
        subject=None,
        body="Your code is 123456",
    )
    assert res_sms["success"] is True
    assert res_sms["channel"] == "sms"

    # Push dispatch
    res_push = await engine.send_direct(
        channel="push",
        destination="device_token_abc",
        subject="New Task",
        body="You have a new task assigned",
    )
    assert res_push["success"] is True
    assert res_push["channel"] == "push"
