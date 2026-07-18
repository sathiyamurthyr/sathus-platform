"""Upload-specific exceptions."""

from app.core.exceptions import BaseAppException


class UploadValidationError(BaseAppException):
    """Exception raised when upload validation fails."""

    def __init__(self, message: str = "Upload validation failed"):
        super().__init__(message, status_code=400)


class FileTooLargeError(UploadValidationError):
    """Exception raised when file exceeds maximum size."""

    def __init__(self, size: int, max_size: int):
        super().__init__(f"File size {size} bytes exceeds maximum allowed {max_size} bytes")


class UnsupportedMediaTypeError(UploadValidationError):
    """Exception raised when file type is not supported."""

    def __init__(self, content_type: str):
        super().__init__(f"Unsupported media type: {content_type}")


class DuplicateFileError(UploadValidationError):
    """Exception raised when duplicate file is detected."""

    def __init__(self, checksum: str):
        super().__init__(f"Duplicate file detected with checksum: {checksum}")


class StorageFailureError(BaseAppException):
    """Exception raised when storage operation fails."""

    def __init__(self, message: str = "Storage operation failed"):
        super().__init__(message, status_code=500)


class ChecksumMismatchError(UploadValidationError):
    """Exception raised when checksum doesn't match."""

    def __init__(self, expected: str, actual: str):
        super().__init__(f"Checksum mismatch: expected {expected}, got {actual}")