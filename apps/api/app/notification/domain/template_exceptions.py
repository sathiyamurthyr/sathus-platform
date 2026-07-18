"""Template exceptions."""

from app.notification.domain.exceptions import NotificationError


class TemplateError(NotificationError):
    """Base template error."""

    pass


class TemplateNotFoundError(TemplateError):
    """Template not found error."""

    pass


class TemplateValidationError(TemplateError):
    """Template validation error."""

    pass


class TemplateRenderError(TemplateError):
    """Template render error."""

    pass


class TemplateVersionError(TemplateError):
    """Template version error."""

    pass