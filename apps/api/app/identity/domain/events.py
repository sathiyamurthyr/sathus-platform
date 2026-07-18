"""Identity domain events."""

from datetime import datetime
from typing import Any, Callable
from uuid import UUID

from pydantic import BaseModel


class DomainEvent(BaseModel):
    """Base domain event."""

    timestamp: datetime
    user_id: UUID
    metadata: dict[str, Any] = {}


class UserRegistered(DomainEvent):
    """User registered event."""

    email: str


class UserLoggedIn(DomainEvent):
    """User logged in event."""

    ip_address: str | None = None
    user_agent: str | None = None


class UserLoggedOut(DomainEvent):
    """User logged out event."""

    pass


class ProfileUpdated(DomainEvent):
    """Profile updated event."""

    updated_fields: list[str]


class PasswordChanged(DomainEvent):
    """Password changed event."""

    pass


class EmailVerified(DomainEvent):
    """Email verified event."""

    pass


class EventPublisher:
    """Event publisher abstraction."""

    def __init__(self) -> None:
        """Initialize publisher."""
        self._handlers: list[Callable[[DomainEvent], None]] = []

    def publish(self, event: DomainEvent) -> None:
        """Publish an event."""
        for handler in self._handlers:
            handler(event)

    def subscribe(self, handler: Callable[[DomainEvent], None]) -> None:
        """Subscribe to events."""
        self._handlers.append(handler)


# Global event publisher
publisher = EventPublisher()
