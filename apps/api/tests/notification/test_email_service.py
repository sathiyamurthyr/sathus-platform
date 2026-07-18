"""Tests for email service implementations."""

import pytest

from app.notification.application.email_service import (
    EmailService,
    EmailQueue,
    EmailRetryPolicy,
)
from app.notification.domain.email_provider import EmailMessage
from app.notification.domain.email_exceptions import QueueError


class TestEmailService:
    """Tests for EmailService."""

    @pytest.mark.asyncio
    async def test_send_email(self):
        """Test sending an email."""
        service = EmailService()
        msg_id = await service.send_email(
            to="test@example.com",
            subject="Test Subject",
            body="Test Body",
        )
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_send_email_with_html(self):
        """Test sending an email with HTML."""
        service = EmailService()
        msg_id = await service.send_email(
            to="test@example.com",
            subject="Test Subject",
            body="Text body",
            html="<p>HTML body</p>",
        )
        assert msg_id is not None

    @pytest.mark.asyncio
    async def test_send_bulk_email(self):
        """Test sending bulk emails."""
        service = EmailService()
        messages = [
            {"to": "test1@example.com", "subject": "Test", "body": "Body"},
            {"to": "test2@example.com", "subject": "Test", "body": "Body"},
        ]
        msg_ids = await service.send_bulk_email(messages)
        assert len(msg_ids) == 2

    @pytest.mark.asyncio
    async def test_get_delivery_status(self):
        """Test getting delivery status."""
        service = EmailService()
        status = await service.get_delivery_status("test-id")
        assert "status" in status

    @pytest.mark.asyncio
    async def test_validate_provider(self):
        """Test validating provider."""
        service = EmailService()
        result = await service.validate_provider()
        assert isinstance(result, bool)


class TestEmailQueue:
    """Tests for EmailQueue."""

    def test_queue_initialization(self):
        """Test queue initialization."""
        queue = EmailQueue()
        assert queue.queue_name == "email_queue"

    @pytest.mark.asyncio
    async def test_get_queue_length_without_redis(self):
        """Test getting queue length without Redis."""
        queue = EmailQueue()
        length = await queue.get_queue_length()
        assert length == 0

    @pytest.mark.asyncio
    async def test_enqueue_without_redis(self):
        """Test enqueue without Redis raises error."""
        queue = EmailQueue()
        message = EmailMessage(
            to="test@example.com",
            subject="Test",
            body="Body",
        )
        with pytest.raises(QueueError):
            await queue.enqueue(message)

    @pytest.mark.asyncio
    async def test_dequeue_without_redis(self):
        """Test dequeue without Redis raises error."""
        queue = EmailQueue()
        with pytest.raises(QueueError):
            await queue.dequeue()


class TestEmailRetryPolicy:
    """Tests for EmailRetryPolicy."""

    def test_calculate_delay(self):
        """Test delay calculation."""
        policy = EmailRetryPolicy(max_retries=3, base_delay=1.0)
        assert policy.calculate_delay(0) == 1.0
        assert policy.calculate_delay(1) == 2.0
        assert policy.calculate_delay(2) == 4.0

    def test_should_retry(self):
        """Test should retry logic."""
        policy = EmailRetryPolicy(max_retries=3, base_delay=1.0)
        from app.notification.domain.email_exceptions import EmailProviderError

        error = EmailProviderError("Test error")
        assert policy.should_retry(0, error) is True
        assert policy.should_retry(3, error) is False

    def test_should_not_retry_other_errors(self):
        """Test should not retry other errors."""
        policy = EmailRetryPolicy(max_retries=3, base_delay=1.0)
        error = ValueError("Test error")
        assert policy.should_retry(0, error) is False