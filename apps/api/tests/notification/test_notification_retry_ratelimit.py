"""Unit tests for Retry Engine, Rate Limiter, Batch Processor, and Event Bus Router."""

from datetime import datetime
from uuid import uuid4

import pytest

from app.notification.application.batch_processor import BatchNotificationProcessor
from app.notification.application.event_bus_handlers import EventBusNotificationRouter
from app.notification.application.rate_limiter import NotificationRateLimiter
from app.notification.application.retry_engine import NotificationRetryEngine
from app.notification.domain.events import PasswordReset, UserRegistered
from app.notification.domain.exceptions import ProviderAuthError, ProviderTimeoutError


@pytest.mark.asyncio
async def test_retry_engine_failure_classification():
    """Test transient vs permanent failure classification and backoff calculation."""
    retry_engine = NotificationRetryEngine()

    transient_err = ProviderTimeoutError("Connection timed out")
    permanent_err = ProviderAuthError("Invalid API Key")

    assert retry_engine.is_transient(transient_err) is True
    assert retry_engine.is_transient(permanent_err) is False

    backoff = retry_engine.calculate_backoff(attempt=2)
    assert backoff > 0.0


@pytest.mark.asyncio
async def test_retry_engine_handle_failure():
    """Test failure handling and DLQ routing on permanent error."""
    retry_engine = NotificationRetryEngine()
    notif_id = uuid4()
    payload = {"channel": "sms", "body": "test"}

    # Permanent failure -> DLQ
    res = await retry_engine.handle_failure(
        notification_id=notif_id,
        payload=payload,
        error=ProviderAuthError("Invalid credentials"),
        current_attempt=1,
    )
    assert res["action"] == "moved_to_dlq"


@pytest.mark.asyncio
async def test_rate_limiter():
    """Test sliding window rate limiter."""
    limiter = NotificationRateLimiter()

    # Under limit
    allowed = await limiter.is_allowed("test_key", limit=5, window_seconds=60)
    assert allowed is True

    # Multi limit check
    allowed_multi, blocked_rule = await limiter.check_multi_limits(
        tenant_id=str(uuid4()),
        user_id=str(uuid4()),
    )
    assert allowed_multi is True
    assert blocked_rule is None


@pytest.mark.asyncio
async def test_batch_processor():
    """Test bulk batch notification processing and chunking."""
    processor = BatchNotificationProcessor(chunk_size=2)
    recipients = [
        {"email": "user1@example.com"},
        {"email": "user2@example.com"},
        {"email": "user3@example.com"},
    ]

    job = await processor.process_batch(
        recipients=recipients,
        channel="email",
        subject="Bulk Subject",
        body="Bulk Body",
    )

    assert job.total_recipients == 3
    assert job.processed_count == 3
    assert job.status == "completed"


@pytest.mark.asyncio
async def test_event_bus_router():
    """Test platform event listeners auto-enqueueing notifications."""
    router = EventBusNotificationRouter()
    event = UserRegistered(
        user_id=uuid4(),
        email="newuser@example.com",
        registered_at=datetime.utcnow(),
    )

    notif_id = await router.handle_user_registered(event)
    assert notif_id is not None
