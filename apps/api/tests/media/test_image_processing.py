"""Tests for image processing service."""

import io
import pytest
from datetime import datetime
from unittest.mock import MagicMock, AsyncMock, patch
from uuid import UUID, uuid4

from PIL import Image

from app.media.application.image_processor import (
    ImageProcessor,
    ImageMetadata,
    ThumbnailInfo,
    ProcessingStatus,
)
from app.media.application.watermark import (
    WatermarkHook,
    NoOpWatermarkHook,
    TextWatermarkHook,
    WatermarkService,
)
from app.media.domain.image_exceptions import (
    InvalidImageError,
    UnsupportedImageFormatError,
    ThumbnailGenerationError,
    MetadataExtractionError,
    OptimizationError,
    ImageTooLargeError,
)
from app.media.domain.models import Asset, AssetStatus, AssetType, StorageProvider
from app.media.infrastructure.repositories import AssetRepository


class TestImageMetadata:
    """Tests for ImageMetadata model."""

    def test_image_metadata_creation(self):
        """Test creating image metadata."""
        metadata = ImageMetadata(
            width=800,
            height=600,
            aspect_ratio=1.33,
            color_mode="RGB",
        )
        assert metadata.width == 800
        assert metadata.height == 600
        assert metadata.aspect_ratio == 1.33
        assert metadata.color_mode == "RGB"

    def test_image_metadata_with_dpi(self):
        """Test image metadata with DPI."""
        metadata = ImageMetadata(
            width=800,
            height=600,
            aspect_ratio=1.33,
            dpi=(72, 72),
            color_mode="RGB",
        )
        assert metadata.dpi == (72, 72)


class TestThumbnailInfo:
    """Tests for ThumbnailInfo model."""

    def test_thumbnail_info_creation(self):
        """Test creating thumbnail info."""
        thumb = ThumbnailInfo(
            name="medium",
            width=300,
            height=225,
            path="thumbnails/123_medium.jpg",
            size=15000,
        )
        assert thumb.name == "medium"
        assert thumb.width == 300
        assert thumb.height == 225


class TestProcessingStatus:
    """Tests for ProcessingStatus model."""

    def test_processing_status_pending(self):
        """Test processing status in pending state."""
        status = ProcessingStatus(
            asset_id=uuid4(),
            status=AssetStatus.PROCESSING,
        )
        assert status.status == AssetStatus.PROCESSING
        assert len(status.thumbnails) == 0


class TestImageProcessor:
    """Tests for ImageProcessor service."""

    @pytest.fixture
    def mock_asset_repo(self):
        """Create mock asset repository."""
        return MagicMock(spec=AssetRepository)

    @pytest.fixture
    def image_processor(self, mock_asset_repo):
        """Create image processor instance."""
        return ImageProcessor(asset_repo=mock_asset_repo)

    @pytest.fixture
    def sample_image(self):
        """Create a sample test image."""
        image = Image.new("RGB", (800, 600), color="red")
        output = io.BytesIO()
        image.save(output, format="JPEG")
        output.seek(0)
        return output.getvalue()

    @pytest.mark.asyncio
    async def test_process_image_success(self, sample_image, mock_asset_repo):
        """Test successful image processing."""
        asset = Asset(
            id=uuid4(),
            filename="test.jpg",
            original_filename="test.jpg",
            content_type="image/jpeg",
            file_size=len(sample_image),
            asset_type=AssetType.IMAGE,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.jpg",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        mock_storage = MagicMock()
        mock_storage.download = AsyncMock(return_value=sample_image)
        mock_storage.upload = AsyncMock(return_value=MagicMock(key="test", size=100))

        with patch(
            "app.media.application.image_processor.create_storage_provider",
            return_value=mock_storage,
        ):
            processor = ImageProcessor(asset_repo=mock_asset_repo)
            status = await processor.process_image(asset)

            assert status.status == AssetStatus.READY
            assert status.optimized_path is not None
            assert len(status.thumbnails) > 0

    def test_validate_image_valid(self, image_processor, sample_image):
        """Test validating a valid image."""
        image = Image.open(io.BytesIO(sample_image))
        # Should not raise
        image_processor._validate_image(image)

    def test_validate_image_unsupported_format(self, image_processor, sample_image):
        """Test validating an unsupported format."""
        # Create a BMP image
        image = Image.new("RGB", (100, 100))
        # Change format to something unsupported
        image.format = "XYZ"

        with pytest.raises(UnsupportedImageFormatError):
            image_processor._validate_image(image)

    def test_validate_image_too_large(self, image_processor):
        """Test validating an image that's too large."""
        # Create a mock image that's too large
        image = MagicMock()
        image.format = "JPEG"
        image.width = 20000
        image.height = 20000

        with pytest.raises(ImageTooLargeError):
            image_processor._validate_image(image)

    def test_extract_metadata(self, image_processor, sample_image):
        """Test extracting image metadata."""
        image = Image.open(io.BytesIO(sample_image))
        metadata = image_processor._extract_metadata(image)

        assert metadata.width == 800
        assert metadata.height == 600
        assert metadata.color_mode == "RGB"
        assert metadata.aspect_ratio == 800 / 600

    def test_calculate_thumbnail_dimensions_landscape(self, image_processor):
        """Test calculating thumbnail dimensions for landscape image."""
        width, height = image_processor._calculate_thumbnail_dimensions(
            800, 600, 150, 150
        )
        assert width == 150
        assert height == 112  # Maintains aspect ratio

    def test_calculate_thumbnail_dimensions_portrait(self, image_processor):
        """Test calculating thumbnail dimensions for portrait image."""
        width, height = image_processor._calculate_thumbnail_dimensions(
            600, 800, 150, 150
        )
        assert width == 112  # Maintains aspect ratio
        assert height == 150

    def test_calculate_thumbnail_dimensions_no_upscale(self, image_processor):
        """Test that smaller images are not upscaled."""
        width, height = image_processor._calculate_thumbnail_dimensions(
            100, 100, 150, 150
        )
        assert width == 100
        assert height == 100

    def test_get_extension(self, image_processor):
        """Test getting file extension for format."""
        assert image_processor._get_extension("JPEG") == ".jpg"
        assert image_processor._get_extension("PNG") == ".png"
        assert image_processor._get_extension("WEBP") == ".webp"

    def test_get_mime_type(self, image_processor):
        """Test getting MIME type for format."""
        assert image_processor._get_mime_type("JPEG") == "image/jpeg"
        assert image_processor._get_mime_type("PNG") == "image/png"
        assert image_processor._get_mime_type("WEBP") == "image/webp"


class TestWatermarkHook:
    """Tests for watermark hook interface."""

    def test_noop_hook_is_disabled(self):
        """Test NoOp hook is disabled."""
        hook = NoOpWatermarkHook()
        assert hook.is_enabled() is False

    @pytest.mark.asyncio
    async def test_noop_hook_apply(self):
        """Test NoOp hook returns image unchanged."""
        hook = NoOpWatermarkHook()
        image = Image.new("RGB", (100, 100), color="red")
        result = await hook.apply(image)
        assert result.size == (100, 100)


class TestTextWatermarkHook:
    """Tests for text watermark hook."""

    def test_text_watermark_hook_disabled_by_default(self):
        """Test text watermark hook is disabled when config is off."""
        hook = TextWatermarkHook(text="Test")
        # Should be disabled because WATERMARK_ENABLED is False in test config
        assert hook.is_enabled() is False

    @pytest.mark.asyncio
    async def test_text_watermark_hook_apply(self):
        """Test text watermark hook applies watermark."""
        hook = TextWatermarkHook(text="Test", opacity=0.5, position="bottom-right")
        # Force enable for testing
        hook.settings.WATERMARK_ENABLED = True

        image = Image.new("RGB", (400, 400), color="red")
        result = await hook.apply(image)

        assert result.size == (400, 400)


class TestWatermarkService:
    """Tests for watermark service."""

    def test_watermark_service_default(self):
        """Test watermark service with default NoOp hook."""
        service = WatermarkService()
        assert isinstance(service.hook, NoOpWatermarkHook)

    @pytest.mark.asyncio
    async def test_watermark_service_apply(self):
        """Test watermark service apply method."""
        service = WatermarkService()
        image = Image.new("RGB", (100, 100), color="red")
        result = await service.apply_watermark(image)
        assert result.size == (100, 100)


class TestImageProcessingExceptions:
    """Tests for image processing exceptions."""

    def test_invalid_image_error(self):
        """Test InvalidImageError message."""
        error = InvalidImageError("Test error")
        assert "Test error" in str(error)

    def test_unsupported_image_format_error(self):
        """Test UnsupportedImageFormatError message."""
        error = UnsupportedImageFormatError("XYZ")
        assert "XYZ" in str(error)

    def test_thumbnail_generation_error(self):
        """Test ThumbnailGenerationError message."""
        error = ThumbnailGenerationError("Test error")
        assert "Test error" in str(error)

    def test_metadata_extraction_error(self):
        """Test MetadataExtractionError message."""
        error = MetadataExtractionError("Test error")
        assert "Test error" in str(error)

    def test_optimization_error(self):
        """Test OptimizationError message."""
        error = OptimizationError("Test error")
        assert "Test error" in str(error)

    def test_image_too_large_error(self):
        """Test ImageTooLargeError message."""
        error = ImageTooLargeError(20000, 20000, 10000)
        assert "20000" in str(error)
        assert "10000" in str(error)