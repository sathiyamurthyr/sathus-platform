"""Video processing domain exceptions."""

from app.core.exceptions import BaseAppException


class VideoProcessingError(BaseAppException):
    """Base exception for video processing errors."""

    pass


class UnsupportedVideoFormatError(VideoProcessingError):
    """Raised when a video format is not supported."""

    def __init__(self, format: str):
        super().__init__(f"Unsupported video format: {format}")


class VideoMetadataExtractionError(VideoProcessingError):
    """Raised when video metadata extraction fails."""

    def __init__(self, message: str = "Failed to extract video metadata"):
        super().__init__(message)


class VideoThumbnailGenerationError(VideoProcessingError):
    """Raised when video thumbnail generation fails."""

    def __init__(self, message: str = "Failed to generate video thumbnail"):
        super().__init__(message)


class VideoTranscodingError(VideoProcessingError):
    """Raised when video transcoding fails."""

    def __init__(self, message: str = "Failed to transcode video"):
        super().__init__(message)


class StreamingPackagingError(VideoProcessingError):
    """Raised when streaming packaging fails."""

    def __init__(self, message: str = "Failed to package video for streaming"):
        super().__init__(message)


class VideoTooLongError(VideoProcessingError):
    """Raised when video duration exceeds maximum allowed."""

    def __init__(self, duration: int, max_duration: int):
        super().__init__(
            f"Video duration ({duration}s) exceeds maximum allowed ({max_duration}s)"
        )


class FFmpegNotAvailableError(VideoProcessingError):
    """Raised when FFmpeg is not available."""

    def __init__(self, message: str = "FFmpeg is not available on the system"):
        super().__init__(message)