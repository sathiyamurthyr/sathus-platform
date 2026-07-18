"""Email notification domain exceptions."""

from app.core.exceptions import BaseAppException


class EmailError(BaseAppException):
    """Base exception for email errors."""

    pass


class EmailProviderError(EmailError):
    """Raised when email provider fails."""

    def __init__(self, message: str = "Email provider error"):
        super().__init__(message)


class TemplateRenderError(EmailError):
    """Raised when template rendering fails."""

    def __init__(self, message: str = "Template rendering failed"):
        super().__init__(message)


class DeliveryFailedError(EmailError):
    """Raised when email delivery fails."""

    def __init__(self, message: str = "Email delivery failed"):
        super().__init__(message)


class ProviderUnavailableError(EmailError):
    """Raised when email provider is unavailable."""

    def __init__(self, message: str = "Email provider unavailable"):
        super().__init__(message)


class AttachmentError(EmailError):
    """Raised when attachment handling fails."""

    def __init__(self, message: str = "Attachment error"):
        super().__init__(message)


class QueueError(EmailError):
    """Raised when queue operation fails."""

    def __init__(self, message: str = "Queue operation failed"):
        super().__init__(message)