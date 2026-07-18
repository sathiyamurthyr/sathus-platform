"""Notification domain exceptions."""

from app.core.exceptions import BaseAppException


class NotificationError(BaseAppException):
    """Base exception for notification errors."""

    pass


class NotificationValidationError(NotificationError):
    """Raised when notification validation fails."""

    def __init__(self, message: str = "Invalid notification data"):
        super().__init__(message)


class NotificationNotFoundError(NotificationError):
    """Raised when notification is not found."""

    def __init__(self, message: str = "Notification not found"):
        super().__init__(message)


class InvalidNotificationStatusError(NotificationError):
    """Raised when notification status transition is invalid."""

    def __init__(self, message: str = "Invalid notification status transition"):
        super().__init__(message)


class SchedulingError(NotificationError):
    """Raised when notification scheduling fails."""

    def __init__(self, message: str = "Failed to schedule notification"):
        super().__init__(message)


class NotificationRepositoryError(NotificationError):
    """Raised when repository operation fails."""

    def __init__(self, message: str = "Repository operation failed"):
        super().__init__(message)