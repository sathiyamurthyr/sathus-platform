"""Audit module tests."""

import pytest
from datetime import datetime, timezone
from uuid import UUID, uuid4

from app.audit.domain.models import (
    AuditEventType,
    AuditSeverity,
    AuditEvent,
    AuditQuery,
    AuditLog,
)


# Domain Model Tests
class TestAuditEventType:
    """Test AuditEventType enum."""

    def test_audit_event_type_values(self):
        """Test audit event type enum values."""
        assert AuditEventType.USER_LOGIN == "user_login"
        assert AuditEventType.USER_LOGOUT == "user_logout"
        assert AuditEventType.AUTH_FAILURE == "auth_failure"
        assert AuditEventType.AUTH_SUCCESS == "auth_success"
        assert AuditEventType.DATA_CREATE == "data_create"
        assert AuditEventType.DATA_UPDATE == "data_update"
        assert AuditEventType.DATA_DELETE == "data_delete"
        assert AuditEventType.SYSTEM_STARTUP == "system_startup"
        assert AuditEventType.CONTENT_PUBLISH == "content_publish"
        assert AuditEventType.WORKFLOW_START == "workflow_start"
        assert AuditEventType.NOTIFICATION_SENT == "notification_sent"
        assert AuditEventType.SEARCH_PERFORMED == "search_performed"


class TestAuditSeverity:
    """Test AuditSeverity enum."""

    def test_audit_severity_values(self):
        """Test audit severity enum values."""
        assert AuditSeverity.INFO == "info"
        assert AuditSeverity.WARNING == "warning"
        assert AuditSeverity.ERROR == "error"
        assert AuditSeverity.CRITICAL == "critical"


class TestAuditEvent:
    """Test AuditEvent model."""

    def test_create_audit_event(self):
        """Test creating an audit event."""
        event_id = uuid4()
        user_id = uuid4()
        tenant_id = uuid4()
        resource_id = uuid4()

        event = AuditEvent(
            id=event_id,
            event_type=AuditEventType.USER_LOGIN,
            severity=AuditSeverity.INFO,
            user_id=user_id,
            tenant_id=tenant_id,
            resource_id=resource_id,
            resource_type="user",
            action="login",
            description="User logged in successfully",
            metadata={"ip": "127.0.0.1"},
            ip_address="127.0.0.1",
            user_agent="Mozilla/5.0",
            correlation_id="corr-123",
            created_at=datetime.now(timezone.utc),
        )

        assert event.id == event_id
        assert event.event_type == AuditEventType.USER_LOGIN
        assert event.severity == AuditSeverity.INFO
        assert event.user_id == user_id
        assert event.tenant_id == tenant_id
        assert event.resource_id == resource_id
        assert event.resource_type == "user"
        assert event.action == "login"
        assert event.description == "User logged in successfully"
        assert event.metadata == {"ip": "127.0.0.1"}
        assert event.ip_address == "127.0.0.1"
        assert event.user_agent == "Mozilla/5.0"
        assert event.correlation_id == "corr-123"

    def test_audit_event_frozen(self):
        """Test that audit event is frozen (immutable)."""
        event = AuditEvent(
            id=uuid4(),
            event_type=AuditEventType.USER_LOGIN,
            severity=AuditSeverity.INFO,
            action="login",
            description="User logged in",
            created_at=datetime.now(timezone.utc),
        )

        with pytest.raises(Exception):
            event.action = "logout"


class TestAuditQuery:
    """Test AuditQuery value object."""

    def test_create_audit_query(self):
        """Test creating an audit query."""
        query = AuditQuery(
            event_types=[AuditEventType.USER_LOGIN, AuditEventType.USER_LOGOUT],
            user_id=uuid4(),
            tenant_id=uuid4(),
            severity=AuditSeverity.INFO,
            start_date=datetime(2024, 1, 1, tzinfo=timezone.utc),
            end_date=datetime(2024, 12, 31, tzinfo=timezone.utc),
            search="test",
            limit=100,
            offset=10,
        )

        assert query.event_types == [AuditEventType.USER_LOGIN, AuditEventType.USER_LOGOUT]
        assert query.user_id is not None
        assert query.tenant_id is not None
        assert query.severity == AuditSeverity.INFO
        assert query.start_date is not None
        assert query.end_date is not None
        assert query.search == "test"
        assert query.limit == 100
        assert query.offset == 10

    def test_audit_query_defaults(self):
        """Test audit query default values."""
        query = AuditQuery()

        assert query.event_types is None
        assert query.user_id is None
        assert query.tenant_id is None
        assert query.severity is None
        assert query.start_date is None
        assert query.end_date is None
        assert query.search is None
        assert query.limit == 50
        assert query.offset == 0


class TestAuditLog:
    """Test AuditLog value object."""

    def test_create_audit_log(self):
        """Test creating an audit log."""
        log = AuditLog(
            id=uuid4(),
            event_type=AuditEventType.USER_LOGIN,
            severity=AuditSeverity.INFO,
            user_id=uuid4(),
            action="login",
            description="User logged in",
            created_at=datetime.now(timezone.utc),
        )

        assert log.id is not None
        assert log.event_type == AuditEventType.USER_LOGIN
        assert log.severity == AuditSeverity.INFO
        assert log.user_id is not None
        assert log.action == "login"
        assert log.description == "User logged in"
        assert log.metadata == {}