"""Tests for webhook service."""

import pytest
from uuid import UUID

from app.notification.application.webhook_service import (
    WebhookDelivery,
    WebhookService,
    WEBHOOK_EVENTS,
)


class TestWebhookDelivery:
    """Tests for WebhookDelivery."""

    def test_webhook_delivery_creation(self):
        """Test creating a webhook delivery."""
        delivery = WebhookDelivery(
            url="https://example.com/webhook",
            secret="secret123",
            headers={"X-Custom": "value"},
            timeout=60,
            retry_count=5,
        )
        assert delivery.url == "https://example.com/webhook"
        assert delivery.secret == "secret123"
        assert delivery.headers == {"X-Custom": "value"}
        assert delivery.timeout == 60
        assert delivery.retry_count == 5

    def test_webhook_delivery_defaults(self):
        """Test webhook delivery defaults."""
        delivery = WebhookDelivery(url="https://example.com/webhook")
        assert delivery.secret is None
        assert delivery.headers == {}
        assert delivery.timeout == 30
        assert delivery.retry_count == 3

    def test_webhook_delivery_to_dict(self):
        """Test converting webhook delivery to dict."""
        delivery = WebhookDelivery(
            url="https://example.com/webhook",
            headers={"X-Custom": "value"},
        )
        result = delivery.to_dict()
        assert result["url"] == "https://example.com/webhook"
        assert result["headers"] == {"X-Custom": "value"}
        assert result["timeout"] == 30
        assert result["retry_count"] == 3


class TestWebhookService:
    """Tests for WebhookService."""

    @pytest.mark.asyncio
    async def test_send_webhook_no_repo(self):
        """Test send webhook with no repository."""
        service = WebhookService(None)
        result = await service.send_webhook(
            url="https://example.com/webhook",
            payload={"test": "data"},
        )
        assert result["success"] is False
        assert result["error"] is None

    @pytest.mark.asyncio
    async def test_send_notification_webhook_no_repo(self):
        """Test send notification webhook with no repository."""
        service = WebhookService(None)
        result = await service.send_notification_webhook(
            UUID("00000000-0000-0000-0000-000000000001"),
        )
        assert result["success"] is False
        assert "error" in result


class TestWebhookEvents:
    """Tests for webhook events."""

    def test_webhook_events_exist(self):
        """Test that webhook events are defined."""
        assert "notification.created" in WEBHOOK_EVENTS
        assert "notification.sent" in WEBHOOK_EVENTS
        assert "notification.delivered" in WEBHOOK_EVENTS
        assert "notification.failed" in WEBHOOK_EVENTS
        assert "notification.opened" in WEBHOOK_EVENTS
        assert "notification.cancelled" in WEBHOOK_EVENTS

    def test_webhook_events_values(self):
        """Test webhook events values."""
        assert WEBHOOK_EVENTS["notification.created"] == "Notification was created"
        assert WEBHOOK_EVENTS["notification.sent"] == "Notification was sent"
        assert WEBHOOK_EVENTS["notification.delivered"] == "Notification was delivered"