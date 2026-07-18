"""SMS-specific exceptions for the notification domain."""

from app.notification.domain.exceptions import NotificationError


class SmsError(NotificationError):
    """Base SMS error."""

    pass


class SmsProviderError(SmsError):
    """SMS provider error."""

    pass


class InvalidPhoneNumberError(SmsError):
    """Invalid phone number error."""

    pass


class ProviderUnavailableError(SmsError):
    """SMS provider unavailable error."""

    pass


class DeliveryFailedError(SmsError):
    """SMS delivery failed error."""

    pass


class QueueError(SmsError):
    """SMS queue error."""

    pass


class TemplateRenderError(SmsError):
    """SMS template render error."""

    pass