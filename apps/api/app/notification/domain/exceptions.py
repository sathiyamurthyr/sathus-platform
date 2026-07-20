"""Notification domain exceptions and structured error hierarchy."""

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


class ProviderError(NotificationError):
    """Base exception for notification provider errors."""

    def __init__(self, message: str = "Notification provider error", provider_name: str | None = None):
        self.provider_name = provider_name
        super().__init__(f"[{provider_name}] {message}" if provider_name else message)


class ProviderUnavailableError(ProviderError):
    """Raised when a notification provider is unreachable or offline."""

    def __init__(self, message: str = "Provider is unavailable", provider_name: str | None = None):
        super().__init__(message, provider_name)


class ProviderTimeoutError(ProviderError):
    """Raised when provider delivery request times out."""

    def __init__(self, message: str = "Provider operation timed out", provider_name: str | None = None):
        super().__init__(message, provider_name)


class ProviderAuthError(ProviderError):
    """Raised when provider authentication/API key validation fails."""

    def __init__(self, message: str = "Provider authentication failed", provider_name: str | None = None):
        super().__init__(message, provider_name)


class RateLimitError(ProviderError):
    """Raised when provider rate limit is exceeded."""

    def __init__(self, message: str = "Provider rate limit exceeded", provider_name: str | None = None):
        super().__init__(message, provider_name)


class QuotaExceededError(ProviderError):
    """Raised when provider quota or credit limit is exhausted."""

    def __init__(self, message: str = "Provider message quota exceeded", provider_name: str | None = None):
        super().__init__(message, provider_name)