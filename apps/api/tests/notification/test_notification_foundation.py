"""Unit tests for EPIC-018 Notification Foundation & Domain Layer."""

from datetime import datetime
from uuid import uuid4

import pytest

from app.notification.domain.events import (
    ContentPublished,
    EventPublisher,
    InvoicePaid,
    LoginSuccess,
    MediaUploaded,
    NotificationCancelled,
    NotificationCreated,
    NotificationDelivered,
    NotificationFailed,
    NotificationOpened,
    NotificationQueued,
    NotificationSent,
    PasswordReset,
    ProjectCreated,
    SubscriptionActivated,
    TaskAssigned,
    UserRegistered,
)
from app.notification.domain.models import (
    Notification,
    NotificationCategory,
    NotificationChannel,
    NotificationHistory,
    NotificationPreferences,
    NotificationPriority,
    NotificationProvider,
    NotificationRecipient,
    NotificationSender,
    NotificationStatus,
    NotificationTemplate,
    NotificationType,
)
from app.notification.domain.provider_contracts import (
    PushMessage,
    PushProvider,
    WebhookMessage,
    WebhookProvider,
)
from app.notification.domain.queue_interfaces import NotificationQueue
from app.notification.application.services import HistoryService, ProviderRegistry


# --- Domain Model Tests ---

def test_notification_domain_model():
    """Test Notification aggregate root instantiation."""
    notif_id = uuid4()
    user_id = uuid4()
    now = datetime.utcnow()

    recipient = NotificationRecipient(
        user_id=user_id,
        channel=NotificationChannel.EMAIL,
        destination="user@example.com",
    )
    sender = NotificationSender(
        user_id=uuid4(),
        name="System Admin",
        email="admin@example.com",
    )

    notif = Notification(
        id=notif_id,
        category=NotificationCategory.SECURITY,
        channel=NotificationChannel.EMAIL,
        priority=NotificationPriority.HIGH,
        type=NotificationType.SECURITY,
        sender=sender,
        recipient=recipient,
        subject="Security Alert",
        body="Unusual login attempt detected",
        status=NotificationStatus.PENDING,
        created_at=now,
    )

    assert notif.id == notif_id
    assert notif.category == NotificationCategory.SECURITY
    assert notif.channel == NotificationChannel.EMAIL
    assert notif.recipient.destination == "user@example.com"
    assert notif.sender.name == "System Admin"


def test_notification_template_model():
    """Test NotificationTemplate model creation."""
    template_id = uuid4()
    now = datetime.utcnow()

    template = NotificationTemplate(
        id=template_id,
        name="welcome_template",
        subject="Welcome {{ name }}",
        body="Hello {{ name }}, welcome to Sathus Platform!",
        channel=NotificationChannel.EMAIL,
        category=NotificationCategory.SYSTEM,
        variables=["name"],
        created_at=now,
    )

    assert template.id == template_id
    assert template.name == "welcome_template"
    assert "name" in template.variables
    assert template.is_active is True


def test_notification_history_model():
    """Test NotificationHistory audit log instantiation."""
    history_id = uuid4()
    notif_id = uuid4()
    user_id = uuid4()
    now = datetime.utcnow()

    history = NotificationHistory(
        id=history_id,
        notification_id=notif_id,
        user_id=user_id,
        channel=NotificationChannel.SMS,
        provider=NotificationProvider.TWILIO,
        status=NotificationStatus.SENT,
        event="sent",
        details={"sid": "SM123456"},
        created_at=now,
    )

    assert history.id == history_id
    assert history.provider == NotificationProvider.TWILIO
    assert history.details["sid"] == "SM123456"


# --- Event Contracts Tests ---

def test_event_contracts():
    """Test trigger event contracts serialization."""
    now = datetime.utcnow()
    user_id = uuid4()

    reg_event = UserRegistered(
        user_id=user_id,
        email="test@example.com",
        registered_at=now,
    )
    assert reg_event.user_id == user_id
    assert reg_event.email == "test@example.com"

    pwd_event = PasswordReset(
        user_id=user_id,
        email="test@example.com",
        reset_token="token123",
        requested_at=now,
    )
    assert pwd_event.reset_token == "token123"

    login_event = LoginSuccess(
        user_id=user_id,
        ip_address="127.0.0.1",
        logged_in_at=now,
    )
    assert login_event.ip_address == "127.0.0.1"

    media_event = MediaUploaded(
        asset_id=uuid4(),
        owner_id=user_id,
        file_name="logo.png",
        mime_type="image/png",
        file_size_bytes=2048,
        uploaded_at=now,
    )
    assert media_event.file_name == "logo.png"

    content_event = ContentPublished(
        content_id=uuid4(),
        author_id=user_id,
        title="Odyssey Platform Architecture",
        slug="odyssey-platform-architecture",
        published_at=now,
    )
    assert content_event.title == "Odyssey Platform Architecture"

    invoice_event = InvoicePaid(
        invoice_id=uuid4(),
        customer_id=user_id,
        amount_cents=5000,
        currency="USD",
        paid_at=now,
    )
    assert invoice_event.amount_cents == 5000

    sub_event = SubscriptionActivated(
        subscription_id=uuid4(),
        plan_name="Enterprise Plan",
        activated_at=now,
    )
    assert sub_event.plan_name == "Enterprise Plan"

    task_event = TaskAssigned(
        task_id=uuid4(),
        assignee_id=user_id,
        assigner_id=uuid4(),
        task_name="Review PR #104",
        assigned_at=now,
    )
    assert task_event.task_name == "Review PR #104"

    proj_event = ProjectCreated(
        project_id=uuid4(),
        owner_id=user_id,
        project_name="Odyssey Digital HQ",
        created_at=now,
    )
    assert proj_event.project_name == "Odyssey Digital HQ"


# --- Provider & Queue Abstraction Stubs ---

class StubPushProvider(PushProvider):
    """Stub push notification provider for testing."""

    @property
    def name(self) -> str:
        return "fcm"

    async def send(self, message: PushMessage) -> str:
        return f"push-{message.device_token}"

    async def validate(self) -> bool:
        return True

    async def get_status(self, message_id: str) -> dict:
        return {"message_id": message_id, "status": "delivered"}


class StubWebhookProvider(WebhookProvider):
    """Stub webhook provider for testing."""

    @property
    def name(self) -> str:
        return "generic_webhook"

    async def send(self, message: WebhookMessage) -> str:
        return f"webhook-{message.event_type}"

    async def validate(self) -> bool:
        return True

    async def get_status(self, message_id: str) -> dict:
        return {"message_id": message_id, "status": "delivered"}


class StubNotificationQueue(NotificationQueue):
    """Stub notification queue for testing."""

    def __init__(self):
        self.queue = []

    async def enqueue(self, notification_id, payload) -> bool:
        self.queue.append((notification_id, payload))
        return True

    async def retry(self, notification_id) -> bool:
        return True

    async def cancel(self, notification_id) -> bool:
        self.queue = [item for item in self.queue if item[0] != notification_id]
        return True

    async def schedule(self, notification_id, run_at) -> bool:
        return True

    async def get_status(self, notification_id) -> dict:
        return {"notification_id": str(notification_id), "status": "queued"}


@pytest.mark.asyncio
async def test_provider_contracts():
    """Test Provider abstraction stubs."""
    push_provider = StubPushProvider()
    assert await push_provider.validate() is True
    push_msg = PushMessage(device_token="tok123", title="Alert", body="Test message")
    msg_id = await push_provider.send(push_msg)
    assert msg_id == "push-tok123"

    webhook_provider = StubWebhookProvider()
    assert await webhook_provider.validate() is True
    webhook_msg = WebhookMessage(target_url="https://example.com/webhook", event_type="user.created", payload={})
    wb_id = await webhook_provider.send(webhook_msg)
    assert wb_id == "webhook-user.created"


@pytest.mark.asyncio
async def test_queue_interfaces():
    """Test Queue abstraction stubs."""
    queue = StubNotificationQueue()
    notif_id = uuid4()
    assert await queue.enqueue(notif_id, {"body": "test"}) is True
    assert len(queue.queue) == 1
    assert await queue.cancel(notif_id) is True
    assert len(queue.queue) == 0


def test_provider_registry():
    """Test ProviderRegistry service."""
    registry = ProviderRegistry()
    stub_push = StubPushProvider()
    registry.register("fcm", stub_push)

    assert registry.get("fcm") == stub_push
