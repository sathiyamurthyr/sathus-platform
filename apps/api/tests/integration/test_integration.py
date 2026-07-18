"""Integration Hub tests."""

import pytest
from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.integration.domain.models import (
    ConnectorType,
    IntegrationStatus,
    SyncDirection,
    SyncType,
    JobStatus,
    AuthType,
    Connector,
    Integration,
    IntegrationJob,
    Webhook,
    WebhookDelivery,
    EventBusMessage,
    DataMapping,
    OAuthToken,
)


# Enum Tests
class TestConnectorType:
    """Test ConnectorType enum."""

    def test_connector_type_values(self):
        """Test connector type enum values."""
        assert ConnectorType.REST == "rest"
        assert ConnectorType.GRAPHQL == "graphql"
        assert ConnectorType.SOAP == "soap"
        assert ConnectorType.WEBHOOK == "webhook"
        assert ConnectorType.SFTP == "sftp"
        assert ConnectorType.DATABASE == "database"
        assert ConnectorType.MESSAGE_QUEUE == "message_queue"


class TestIntegrationStatus:
    """Test IntegrationStatus enum."""

    def test_integration_status_values(self):
        """Test integration status enum values."""
        assert IntegrationStatus.ACTIVE == "active"
        assert IntegrationStatus.INACTIVE == "inactive"
        assert IntegrationStatus.ERROR == "error"
        assert IntegrationStatus.CONNECTING == "connecting"
        assert IntegrationStatus.DISCONNECTING == "disconnecting"


class TestSyncDirection:
    """Test SyncDirection enum."""

    def test_sync_direction_values(self):
        """Test sync direction enum values."""
        assert SyncDirection.ONE_WAY == "one_way"
        assert SyncDirection.TWO_WAY == "two_way"


class TestSyncType:
    """Test SyncType enum."""

    def test_sync_type_values(self):
        """Test sync type enum values."""
        assert SyncType.INCREMENTAL == "incremental"
        assert SyncType.FULL == "full"
        assert SyncType.REALTIME == "realtime"


class TestJobStatus:
    """Test JobStatus enum."""

    def test_job_status_values(self):
        """Test job status enum values."""
        assert JobStatus.PENDING == "pending"
        assert JobStatus.RUNNING == "running"
        assert JobStatus.COMPLETED == "completed"
        assert JobStatus.FAILED == "failed"
        assert JobStatus.CANCELLED == "cancelled"
        assert JobStatus.RETRY == "retry"


class TestAuthType:
    """Test AuthType enum."""

    def test_auth_type_values(self):
        """Test auth type enum values."""
        assert AuthType.API_KEY == "api_key"
        assert AuthType.OAUTH2 == "oauth2"
        assert AuthType.BASIC == "basic"
        assert AuthType.BEARER == "bearer"
        assert AuthType.HMAC == "hmac"


# Domain Model Tests
class TestConnector:
    """Test Connector domain model."""

    def test_create_connector(self):
        """Test creating a connector."""
        connector = Connector(
            id=uuid4(),
            name="Salesforce Connector",
            connector_type=ConnectorType.REST,
            base_url="https://api.salesforce.com",
            config={"timeout": 30},
            auth_type=AuthType.OAUTH2,
            auth_config={"client_id": "test"},
            created_at=datetime.now(timezone.utc),
        )

        assert connector.name == "Salesforce Connector"
        assert connector.connector_type == ConnectorType.REST
        assert connector.is_active is True
        assert connector.status == IntegrationStatus.ACTIVE

    def test_connector_frozen(self):
        """Test that connector is frozen (immutable)."""
        connector = Connector(
            id=uuid4(),
            name="Test Connector",
            connector_type=ConnectorType.REST,
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            connector.name = "Updated Connector"


class TestIntegration:
    """Test Integration domain model."""

    def test_create_integration(self):
        """Test creating an integration."""
        integration = Integration(
            id=uuid4(),
            name="Salesforce to HubSpot Sync",
            connector_id=uuid4(),
            source_system="salesforce",
            target_system="hubspot",
            sync_direction=SyncDirection.ONE_WAY,
            sync_type=SyncType.INCREMENTAL,
            created_at=datetime.now(timezone.utc),
        )

        assert integration.name == "Salesforce to HubSpot Sync"
        assert integration.source_system == "salesforce"
        assert integration.target_system == "hubspot"
        assert integration.sync_direction == SyncDirection.ONE_WAY
        assert integration.is_active is True

    def test_integration_frozen(self):
        """Test that integration is frozen (immutable)."""
        integration = Integration(
            id=uuid4(),
            name="Test Integration",
            connector_id=uuid4(),
            source_system="source",
            target_system="target",
            sync_direction=SyncDirection.ONE_WAY,
            sync_type=SyncType.FULL,
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            integration.name = "Updated Integration"


class TestWebhook:
    """Test Webhook domain model."""

    def test_create_webhook(self):
        """Test creating a webhook."""
        webhook = Webhook(
            id=uuid4(),
            name="Slack Notification",
            url="https://hooks.slack.com/services/test",
            events=["user.created", "user.updated"],
            created_at=datetime.now(timezone.utc),
        )

        assert webhook.name == "Slack Notification"
        assert webhook.url == "https://hooks.slack.com/services/test"
        assert webhook.events == ["user.created", "user.updated"]
        assert webhook.is_active is True

    def test_webhook_frozen(self):
        """Test that webhook is frozen (immutable)."""
        webhook = Webhook(
            id=uuid4(),
            name="Test Webhook",
            url="https://example.com/webhook",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            webhook.name = "Updated Webhook"


class TestEventBusMessage:
    """Test EventBusMessage domain model."""

    def test_create_event_bus_message(self):
        """Test creating an event bus message."""
        message = EventBusMessage(
            id=uuid4(),
            topic="user.events",
            event_type="user.created",
            payload={"user_id": "123"},
            source="identity-service",
            created_at=datetime.now(timezone.utc),
        )

        assert message.topic == "user.events"
        assert message.event_type == "user.created"
        assert message.source == "identity-service"
        assert message.is_processed is False

    def test_event_bus_message_frozen(self):
        """Test that event bus message is frozen (immutable)."""
        message = EventBusMessage(
            id=uuid4(),
            topic="test.topic",
            event_type="test.event",
            source="test-service",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            message.topic = "updated.topic"