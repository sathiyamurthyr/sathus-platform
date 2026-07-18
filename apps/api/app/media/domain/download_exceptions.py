"""Download and signed URL domain exceptions."""

from app.core.exceptions import BaseAppException


class DownloadError(BaseAppException):
    """Base exception for download errors."""

    pass


class SignedUrlGenerationError(DownloadError):
    """Raised when signed URL generation fails."""

    def __init__(self, message: str = "Failed to generate signed URL"):
        super().__init__(message)


class DownloadAuthorizationError(DownloadError):
    """Raised when download authorization fails."""

    def __init__(self, message: str = "Download not authorized"):
        super().__init__(message)


class DownloadExpiredError(DownloadError):
    """Raised when a download URL has expired."""

    def __init__(self, message: str = "Download URL has expired"):
        super().__init__(message)


class InvalidDownloadTokenError(DownloadError):
    """Raised when a download token is invalid."""

    def __init__(self, message: str = "Invalid download token"):
        super().__init__(message)


class FileUnavailableError(DownloadError):
    """Raised when a file is unavailable for download."""

    def __init__(self, message: str = "File is unavailable"):
        super().__init__(message)


class DownloadLimitExceededError(DownloadError):
    """Raised when download limit is exceeded."""

    def __init__(self, message: str = "Download limit exceeded"):
        super().__init__(message)