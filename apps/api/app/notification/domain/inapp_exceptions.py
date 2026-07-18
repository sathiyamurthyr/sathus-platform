"""In-app notification exceptions."""

from app.notification.domain.exceptions import NotificationError


class InAppError(NotificationError):
    """Base in-app notification error."""

    pass


class NotificationNotFoundError(InAppError):
    """Notification not found error."""

    pass


class NotificationAccessDeniedError(InAppError):
    """Notification access denied error."""

    pass


class InvalidNotificationStateError(InAppError):
    """Invalid notification state error."""

    pass


class BulkOperationError(InAppError):
    """Bulk operation error."""

    pass


class SearchError(InAppError):
    """Search error."""

    pass