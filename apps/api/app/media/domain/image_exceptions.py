"""Image processing domain exceptions."""

from app.core.exceptions import BaseAppException


class ImageProcessingError(BaseAppException):
    """Base exception for image processing errors."""

    pass


class InvalidImageError(ImageProcessingError):
    """Raised when an image is corrupted or invalid."""

    def __init__(self, message: str = "Invalid or corrupted image file"):
        super().__init__(message)


class UnsupportedImageFormatError(ImageProcessingError):
    """Raised when an image format is not supported."""

    def __init__(self, format: str):
        super().__init__(f"Unsupported image format: {format}")


class ThumbnailGenerationError(ImageProcessingError):
    """Raised when thumbnail generation fails."""

    def __init__(self, message: str = "Failed to generate thumbnail"):
        super().__init__(message)


class MetadataExtractionError(ImageProcessingError):
    """Raised when metadata extraction fails."""

    def __init__(self, message: str = "Failed to extract image metadata"):
        super().__init__(message)


class OptimizationError(ImageProcessingError):
    """Raised when image optimization fails."""

    def __init__(self, message: str = "Failed to optimize image"):
        super().__init__(message)


class ImageTooLargeError(ImageProcessingError):
    """Raised when image dimensions exceed maximum allowed."""

    def __init__(self, width: int, height: int, max_dimension: int):
        super().__init__(
            f"Image dimensions ({width}x{height}) exceed maximum allowed ({max_dimension})"
        )