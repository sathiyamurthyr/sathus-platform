"""Storage provider exceptions."""

from app.core.exceptions import BaseAppException


class StorageProviderError(BaseAppException):
    """Base exception for storage provider errors."""

    def __init__(self, message: str = "Storage provider error", status_code: int = 500):
        super().__init__(message, status_code=status_code)


class UploadFailedError(StorageProviderError):
    """Exception raised when upload fails."""

    def __init__(self, message: str = "Failed to upload file"):
        super().__init__(message, status_code=500)


class DownloadFailedError(StorageProviderError):
    """Exception raised when download fails."""

    def __init__(self, message: str = "Failed to download file"):
        super().__init__(message, status_code=500)


class DeleteFailedError(StorageProviderError):
    """Exception raised when delete fails."""

    def __init__(self, message: str = "Failed to delete file"):
        super().__init__(message, status_code=500)


class ObjectNotFoundError(StorageProviderError):
    """Exception raised when object is not found."""

    def __init__(self, message: str = "Object not found"):
        super().__init__(message, status_code=404)


class SignedUrlGenerationError(StorageProviderError):
    """Exception raised when signed URL generation fails."""

    def __init__(self, message: str = "Failed to generate signed URL"):
        super().__init__(message, status_code=500)
