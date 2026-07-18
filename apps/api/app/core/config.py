"""Application configuration using Pydantic Settings."""

from typing import Any

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    APP_NAME: str = "Sathus Platform"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/sathus",
        description="PostgreSQL database URL",
    )

    # Redis
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL",
    )

    # Security
    SECRET_KEY: str = Field(
        default="change-me-in-production",
        description="JWT secret key",
    )
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: list[str] = Field(
        default_factory=lambda: ["http://localhost:3000"],
        description="Allowed CORS origins",
    )

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

# Media Storage
    MEDIA_STORAGE_PROVIDER: str = Field(
        default="local",
        description="Storage provider: local, s3, azure, or minio",
    )
    MEDIA_ROOT: str = Field(
        default="storage/media",
        description="Local storage root path",
    )
    SIGNED_URL_EXPIRY_MINUTES: int = Field(
        default=15,
        description="Signed URL expiry time in minutes",
    )

    # Upload Configuration
    MAX_FILE_SIZE_MB: int = Field(
        default=100,
        description="Maximum file size in megabytes",
    )
    MAX_FILES_PER_UPLOAD: int = Field(
        default=10,
        description="Maximum number of files per upload request",
    )
    MAX_REQUEST_SIZE_MB: int = Field(
        default=200,
        description="Maximum request size in megabytes",
    )
    ALLOWED_IMAGE_EXTENSIONS: list[str] = Field(
        default_factory=lambda: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
        description="Allowed image file extensions",
    )
    ALLOWED_DOCUMENT_EXTENSIONS: list[str] = Field(
        default_factory=lambda: [".pdf", ".docx", ".xlsx", ".pptx", ".txt"],
        description="Allowed document file extensions",
    )
    ALLOWED_ARCHIVE_EXTENSIONS: list[str] = Field(
        default_factory=lambda: [".zip"],
        description="Allowed archive file extensions",
    )
    ALLOWED_VIDEO_EXTENSIONS: list[str] = Field(
        default_factory=lambda: [".mp4", ".mov", ".mkv", ".avi"],
        description="Allowed video file extensions",
    )
    ALLOWED_IMAGE_MIME_TYPES: list[str] = Field(
        default_factory=lambda: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml",
        ],
        description="Allowed image MIME types",
    )
    ALLOWED_DOCUMENT_MIME_TYPES: list[str] = Field(
        default_factory=lambda: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
        ],
        description="Allowed document MIME types",
    )
    ALLOWED_ARCHIVE_MIME_TYPES: list[str] = Field(
        default_factory=lambda: [
            "application/zip",
            "application/x-zip-compressed",
        ],
        description="Allowed archive MIME types",
    )
    ALLOWED_VIDEO_MIME_TYPES: list[str] = Field(
        default_factory=lambda: [
            "video/mp4",
            "video/quicktime",
            "video/x-matroska",
            "video/x-msvideo",
        ],
        description="Allowed video MIME types",
    )
    DUPLICATE_DETECTION_ENABLED: bool = Field(
        default=True,
        description="Enable duplicate file detection by checksum",
    )
    DUPLICATE_OVERWRITE: bool = Field(
        default=False,
        description="Allow overwriting duplicate files",
    )

    # Image Processing Configuration
    IMAGE_PROCESSING_ENABLED: bool = Field(
        default=True,
        description="Enable automatic image processing",
    )
    THUMBNAIL_SIZES: list[dict[str, Any]] = Field(
        default_factory=lambda: [
            {"name": "small", "width": 150, "height": 150},
            {"name": "medium", "width": 300, "height": 300},
            {"name": "large", "width": 600, "height": 600},
            {"name": "xl", "width": 1200, "height": 1200},
        ],
        description="Thumbnail size presets",
    )
    JPEG_QUALITY: int = Field(
        default=85,
        ge=1,
        le=100,
        description="JPEG compression quality (1-100)",
    )
    PNG_COMPRESSION: int = Field(
        default=6,
        ge=0,
        le=9,
        description="PNG compression level (0-9)",
    )
    WEBP_QUALITY: int = Field(
        default=85,
        ge=1,
        le=100,
        description="WebP compression quality (1-100)",
    )
    MAX_IMAGE_DIMENSION: int = Field(
        default=10000,
        description="Maximum image dimension in pixels",
    )
    WATERMARK_ENABLED: bool = Field(
        default=False,
        description="Enable watermarking",
    )
    WATERMARK_TEXT: str | None = Field(
        default=None,
        description="Watermark text",
    )
    WATERMARK_OPACITY: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="Watermark opacity (0.0-1.0)",
    )
    WATERMARK_POSITION: str = Field(
        default="bottom-right",
        description="Watermark position",
    )
    EXIF_ORIENTATION_CORRECTION: bool = Field(
        default=True,
        description="Enable EXIF orientation correction",
    )

    # Video Processing Configuration
    VIDEO_PROCESSING_ENABLED: bool = Field(
        default=True,
        description="Enable automatic video processing",
    )
    VIDEO_THUMBNAIL_SIZES: list[dict[str, Any]] = Field(
        default_factory=lambda: [
            {"width": 320, "height": 180},
            {"width": 640, "height": 360},
            {"width": 1280, "height": 720},
        ],
        description="Video thumbnail size presets",
    )
    VIDEO_TRANSCODE_PRESETS: list[dict[str, Any]] = Field(
        default_factory=lambda: [
            {"name": "360p", "width": 640, "height": 360},
            {"name": "480p", "width": 854, "height": 480},
            {"name": "720p", "width": 1280, "height": 720},
            {"name": "1080p", "width": 1920, "height": 1080},
        ],
        description="Video transcoding presets",
    )
    VIDEO_CODEC: str = Field(
        default="libx264",
        description="Video codec for transcoding",
    )
    VIDEO_CRF: int = Field(
        default=23,
        ge=18,
        le=28,
        description="Constant Rate Factor for video quality",
    )
    VIDEO_PRESET: str = Field(
        default="medium",
        description="FFmpeg encoding preset (ultrafast, superfast, veryfast, faster, fast, medium, slow, slower, veryslow)",
    )
    VIDEO_MAX_DURATION_SECONDS: int = Field(
        default=3600,
        description="Maximum video duration in seconds",
    )
    HLS_ENABLED: bool = Field(
        default=True,
        description="Enable HLS streaming",
    )
    HLS_SEGMENT_DURATION: int = Field(
        default=6,
        description="HLS segment duration in seconds",
    )

    # Document Processing Configuration
    DOCUMENT_PROCESSING_ENABLED: bool = Field(
        default=True,
        description="Enable automatic document processing",
    )
    DOCUMENT_PREVIEW_ENABLED: bool = Field(
        default=True,
        description="Enable document preview generation",
    )
    DOCUMENT_OCR_ENABLED: bool = Field(
        default=False,
        description="Enable OCR processing for documents",
    )
    DOCUMENT_MAX_PREVIEW_SIZE_MB: int = Field(
        default=10,
        description="Maximum document size for preview generation in MB",
    )
    DOCUMENT_MAX_PAGES_PREVIEW: int = Field(
        default=10,
        description="Maximum pages to process for preview",
    )
    DOCUMENT_TEXT_PREVIEW_LENGTH: int = Field(
        default=500,
        description="Maximum characters for text preview",
    )

    # AWS S3
    AWS_ACCESS_KEY_ID: str | None = Field(
        default=None,
        description="AWS access key ID",
    )
    AWS_SECRET_ACCESS_KEY: str | None = Field(
        default=None,
        description="AWS secret access key",
    )
    AWS_REGION: str = Field(
        default="ap-south-1",
        description="AWS region",
    )
    AWS_BUCKET: str | None = Field(
        default=None,
        description="S3 bucket name",
    )

    # Azure Blob Storage
    AZURE_STORAGE_ACCOUNT: str | None = Field(
        default=None,
        description="Azure storage account name",
    )
    AZURE_STORAGE_KEY: str | None = Field(
        default=None,
        description="Azure storage account key",
    )
    AZURE_CONTAINER: str | None = Field(
        default=None,
        description="Azure container name",
    )

    # MinIO
    MINIO_ENDPOINT: str | None = Field(
        default=None,
        description="MinIO endpoint URL",
    )
    MINIO_ACCESS_KEY: str | None = Field(
        default=None,
        description="MinIO access key",
    )
    MINIO_SECRET_KEY: str | None = Field(
        default=None,
        description="MinIO secret key",
    )
    MINIO_BUCKET: str | None = Field(
        default=None,
        description="MinIO bucket name",
    )

# Email Configuration
    EMAIL_PROVIDER: str = Field(
        default="smtp",
        description="Email provider: smtp, ses, or sendgrid",
    )
    SMTP_HOST: str | None = Field(
        default=None,
        description="SMTP server host",
    )
    SMTP_PORT: int = Field(
        default=587,
        description="SMTP server port",
    )
    SMTP_USERNAME: str | None = Field(
        default=None,
        description="SMTP username",
    )
    SMTP_PASSWORD: str | None = Field(
        default=None,
        description="SMTP password",
    )
    SMTP_TLS: bool = Field(
        default=True,
        description="Use TLS for SMTP",
    )
    SMTP_SSL: bool = Field(
        default=False,
        description="Use SSL for SMTP",
    )
    SES_ACCESS_KEY: str | None = Field(
        default=None,
        description="SES access key",
    )
    SES_SECRET_KEY: str | None = Field(
        default=None,
        description="SES secret key",
    )
    SENDGRID_API_KEY: str | None = Field(
        default=None,
        description="SendGrid API key",
    )

# SMS Configuration
    SMS_PROVIDER: str = Field(
        default="twilio",
        description="SMS provider: twilio, aws_sns, or messagebird",
    )
    TWILIO_ACCOUNT_SID: str | None = Field(
        default=None,
        description="Twilio account SID",
    )
    TWILIO_AUTH_TOKEN: str | None = Field(
        default=None,
        description="Twilio auth token",
    )
    TWILIO_FROM_NUMBER: str | None = Field(
        default=None,
        description="Twilio sender phone number",
    )
    SNS_TOPIC_ARN: str | None = Field(
        default=None,
        description="AWS SNS topic ARN",
    )
    MESSAGEBIRD_API_KEY: str | None = Field(
        default=None,
        description="MessageBird API key",
    )

# OpenTelemetry
    OTEL_EXPORTER_OTLP_ENDPOINT: str | None = None
    OTEL_EXPORTER_OTLP_HEADERS: str | None = None

    @field_validator("SMS_PROVIDER")
    @classmethod
    def validate_sms_provider(cls, v: str) -> str:
        """Validate SMS provider value."""
        allowed = {"twilio", "aws_sns", "messagebird"}
        if v not in allowed:
            raise ValueError(f"SMS provider must be one of {allowed}")
        return v

    @field_validator("MEDIA_STORAGE_PROVIDER")
    @classmethod
    def validate_media_storage_provider(cls, v: str) -> str:
        """Validate media storage provider value."""
        allowed = {"local", "s3", "azure", "minio"}
        if v not in allowed:
            raise ValueError(f"Media storage provider must be one of {allowed}")
        return v

    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        """Validate environment value."""
        allowed = {"development", "testing", "staging", "production"}
        if v not in allowed:
            raise ValueError(f"Environment must be one of {allowed}")
        return v


settings = Settings()


def get_settings() -> Settings:
    """Get application settings instance."""
    return settings