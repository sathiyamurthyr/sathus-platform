"""Image processing service for generating thumbnails and extracting metadata."""

import io
from datetime import datetime
from typing import Any
from uuid import UUID

from PIL import Image, ExifTags
from pydantic import BaseModel, ConfigDict

from app.core.config import get_settings
from app.core.logging import logger
from app.media.domain.image_exceptions import (
    InvalidImageError,
    UnsupportedImageFormatError,
    ThumbnailGenerationError,
    MetadataExtractionError,
    OptimizationError,
    ImageTooLargeError,
)
from app.media.domain.models import Asset, AssetStatus, AssetType
from app.media.infrastructure.repositories import AssetRepository
from app.media.infrastructure.providers.factory import create_storage_provider


class ImageMetadata(BaseModel):
    """Image metadata extracted from the file."""

    model_config = ConfigDict(arbitrary_types_allowed=True)

    width: int
    height: int
    aspect_ratio: float
    dpi: tuple[float, float] | None = None
    color_mode: str
    color_profile: str | None = None
    exif_data: dict[str, Any] = {}
    camera_model: str | None = None
    creation_date: datetime | None = None


class ThumbnailInfo(BaseModel):
    """Information about a generated thumbnail."""

    name: str
    width: int
    height: int
    path: str
    size: int


class ProcessingStatus(BaseModel):
    """Image processing status."""

    asset_id: UUID
    status: AssetStatus
    started_at: datetime | None = None
    completed_at: datetime | None = None
    error_message: str | None = None
    thumbnails: list[ThumbnailInfo] = []
    optimized_path: str | None = None


class ImageProcessor:
    """Service for processing images - generating thumbnails, optimizing, and extracting metadata."""

    SUPPORTED_FORMATS = {"JPEG", "PNG", "WEBP", "GIF", "BMP", "TIFF"}

    def __init__(self, asset_repo: AssetRepository):
        """Initialize image processor."""
        self.asset_repo = asset_repo
        self.settings = get_settings()
        self.storage = create_storage_provider()

    async def process_image(self, asset: Asset) -> ProcessingStatus:
        """Process an image asset - generate thumbnails, optimize, and extract metadata.

        Args:
            asset: The asset to process.

        Returns:
            Processing status with results.
        """
        status = ProcessingStatus(
            asset_id=asset.id,
            status=AssetStatus.PROCESSING,
            started_at=datetime.now(),
        )

        try:
            # Download the image
            image_data = await self.storage.download(asset.storage_path)
            if not image_data:
                raise InvalidImageError("Could not download image from storage")

            # Open image with Pillow
            image = Image.open(io.BytesIO(image_data))

            # Validate image
            self._validate_image(image)

            # Extract metadata
            metadata = self._extract_metadata(image)
            logger.info(
                "metadata_extracted",
                asset_id=str(asset.id),
                width=metadata.width,
                height=metadata.height,
            )

            # Optimize image
            optimized_data, optimized_path = await self._optimize_image(
                image, asset, metadata
            )
            status.optimized_path = optimized_path

            # Generate thumbnails
            thumbnails = await self._generate_thumbnails(
                image, asset, optimized_path
            )
            status.thumbnails = thumbnails

            # Update asset with processing results
            await self._update_asset_metadata(asset, metadata, optimized_path, thumbnails)

            status.status = AssetStatus.READY
            status.completed_at = datetime.now()

            logger.info(
                "image_processing_completed",
                asset_id=str(asset.id),
                thumbnails_count=len(thumbnails),
            )

        except Exception as e:
            status.status = AssetStatus.FAILED
            status.error_message = str(e)
            status.completed_at = datetime.now()
            logger.error(
                "image_processing_failed",
                asset_id=str(asset.id),
                error=str(e),
            )
            raise

        return status

    def _validate_image(self, image: Image.Image) -> None:
        """Validate image format and dimensions.

        Args:
            image: PIL Image to validate.

        Raises:
            UnsupportedImageFormatError: If format is not supported.
            ImageTooLargeError: If dimensions exceed maximum.
        """
        if image.format not in self.SUPPORTED_FORMATS:
            raise UnsupportedImageFormatError(image.format or "unknown")

        max_dim = self.settings.MAX_IMAGE_DIMENSION
        if image.width > max_dim or image.height > max_dim:
            raise ImageTooLargeError(image.width, image.height, max_dim)

    def _extract_metadata(self, image: Image.Image) -> ImageMetadata:
        """Extract metadata from an image.

        Args:
            image: PIL Image to extract metadata from.

        Returns:
            Extracted image metadata.
        """
        exif_data = {}
        camera_model = None
        creation_date = None

        if hasattr(image, "_getexif"):
            try:
                exif = image._getexif()
                if exif:
                    for tag_id, value in exif.items():
                        tag = ExifTags.TAGS.get(tag_id, tag_id)
                        exif_data[str(tag)] = str(value)

                        if tag == "Model":
                            camera_model = str(value)
                        elif tag == "DateTimeOriginal":
                            try:
                                creation_date = datetime.strptime(
                                    str(value), "%Y:%m:%d %H:%M:%S"
                                )
                            except (ValueError, TypeError):
                                pass
            except Exception:
                pass

        return ImageMetadata(
            width=image.width,
            height=image.height,
            aspect_ratio=image.width / image.height if image.height > 0 else 0,
            dpi=image.info.get("dpi"),
            color_mode=image.mode,
            color_profile=image.info.get("icc_profile"),
            exif_data=exif_data,
            camera_model=camera_model,
            creation_date=creation_date,
        )

    async def _optimize_image(
        self,
        image: Image.Image,
        asset: Asset,
        metadata: ImageMetadata,
    ) -> tuple[bytes, str]:
        """Optimize an image.

        Args:
            image: PIL Image to optimize.
            asset: The asset being processed.
            metadata: Extracted metadata.

        Returns:
            Tuple of optimized image data and storage path.
        """
        # Apply EXIF orientation correction
        if self.settings.EXIF_ORIENTATION_CORRECTION:
            image = self._apply_orientation(image)

        # Determine output format
        output_format = "JPEG"
        if image.format == "PNG":
            output_format = "PNG"
        elif image.format == "WEBP":
            output_format = "WEBP"

        # Optimize based on format
        output = io.BytesIO()

        if output_format == "JPEG":
            image = image.convert("RGB")
            image.save(
                output,
                format="JPEG",
                quality=self.settings.JPEG_QUALITY,
                optimize=True,
            )
        elif output_format == "PNG":
            image.save(
                output,
                format="PNG",
                compress_level=self.settings.PNG_COMPRESSION,
            )
        elif output_format == "WEBP":
            image.save(
                output,
                format="WEBP",
                quality=self.settings.WEBP_QUALITY,
            )

        output_data = output.getvalue()

        # Store optimized image
        optimized_path = f"optimized/{asset.id}{self._get_extension(output_format)}"
        await self.storage.upload(
            key=optimized_path,
            data=output_data,
            mime_type=self._get_mime_type(output_format),
            metadata={"processed": "true", "original_asset_id": str(asset.id)},
        )

        logger.info(
            "image_optimized",
            asset_id=str(asset.id),
            original_size=asset.file_size,
            optimized_size=len(output_data),
        )

        return output_data, optimized_path

    async def _generate_thumbnails(
        self,
        image: Image.Image,
        asset: Asset,
        optimized_path: str,
    ) -> list[ThumbnailInfo]:
        """Generate thumbnails for an image.

        Args:
            image: PIL Image to generate thumbnails from.
            asset: The asset being processed.
            optimized_path: Path to the optimized image.

        Returns:
            List of generated thumbnail information.
        """
        thumbnails = []

        for size_preset in self.settings.THUMBNAIL_SIZES:
            name = size_preset["name"]
            target_width = size_preset["width"]
            target_height = size_preset["height"]

            # Calculate dimensions maintaining aspect ratio
            thumb_width, thumb_height = self._calculate_thumbnail_dimensions(
                image.width, image.height, target_width, target_height
            )

            # Create thumbnail
            thumbnail = image.copy()
            thumbnail.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)

            # Convert to RGB for JPEG
            if thumbnail.mode in ("RGBA", "P"):
                thumbnail = thumbnail.convert("RGB")

            # Save thumbnail
            output = io.BytesIO()
            thumbnail.save(
                output,
                format="JPEG",
                quality=self.settings.JPEG_QUALITY,
            )
            output_data = output.getvalue()

            # Store thumbnail
            thumb_path = f"thumbnails/{asset.id}_{name}.jpg"
            await self.storage.upload(
                key=thumb_path,
                data=output_data,
                mime_type="image/jpeg",
                metadata={"thumbnail": "true", "size": name, "asset_id": str(asset.id)},
            )

            thumbnails.append(
                ThumbnailInfo(
                    name=name,
                    width=thumb_width,
                    height=thumb_height,
                    path=thumb_path,
                    size=len(output_data),
                )
            )

            logger.info(
                "thumbnail_generated",
                asset_id=str(asset.id),
                size=name,
                width=thumb_width,
                height=thumb_height,
            )

        return thumbnails

    def _apply_orientation(self, image: Image.Image) -> Image.Image:
        """Apply EXIF orientation to image.

        Args:
            image: PIL Image to process.

        Returns:
            Oriented image.
        """
        if not hasattr(image, "_getexif"):
            return image

        try:
            exif = image._getexif()
            if not exif:
                return image

            orientation_key = None
            for key in ExifTags.TAGS.keys():
                if ExifTags.TAGS[key] == "Orientation":
                    orientation_key = key
                    break

            if orientation_key is None:
                return image

            orientation = exif.get(orientation_key, 1)

            method = {
                2: Image.Transpose.FLIP_LEFT_RIGHT,
                3: Image.Transpose.ROTATE_180,
                4: Image.Transpose.FLIP_TOP_BOTTOM,
                5: Image.Transpose.TRANSPOSE,
                6: Image.Transpose.ROTATE_270,
                7: Image.Transpose.TRANSVERSE,
                8: Image.Transpose.ROTATE_90,
            }.get(orientation, None)

            if method is not None:
                image = image.transpose(method)

        except Exception:
            pass

        return image

    def _calculate_thumbnail_dimensions(
        self,
        original_width: int,
        original_height: int,
        target_width: int,
        target_height: int,
    ) -> tuple[int, int]:
        """Calculate thumbnail dimensions maintaining aspect ratio.

        Args:
            original_width: Original image width.
            original_height: Original image height.
            target_width: Target width.
            target_height: Target height.

        Returns:
            Tuple of calculated width and height.
        """
        # Don't upscale smaller images
        if original_width <= target_width and original_height <= target_height:
            return original_width, original_height

        # Calculate aspect ratio
        aspect_ratio = original_width / original_height

        if aspect_ratio > 1:
            # Landscape
            return target_width, int(target_width / aspect_ratio)
        else:
            # Portrait or square
            return int(target_height * aspect_ratio), target_height

    def _get_extension(self, format: str) -> str:
        """Get file extension for image format.

        Args:
            format: Image format.

        Returns:
            File extension.
        """
        extensions = {
            "JPEG": ".jpg",
            "PNG": ".png",
            "WEBP": ".webp",
            "GIF": ".gif",
            "BMP": ".bmp",
            "TIFF": ".tiff",
        }
        return extensions.get(format, ".jpg")

    def _get_mime_type(self, format: str) -> str:
        """Get MIME type for image format.

        Args:
            format: Image format.

        Returns:
            MIME type.
        """
        mime_types = {
            "JPEG": "image/jpeg",
            "PNG": "image/png",
            "WEBP": "image/webp",
            "GIF": "image/gif",
            "BMP": "image/bmp",
            "TIFF": "image/tiff",
        }
        return mime_types.get(format, "image/jpeg")

    async def _update_asset_metadata(
        self,
        asset: Asset,
        metadata: ImageMetadata,
        optimized_path: str,
        thumbnails: list[ThumbnailInfo],
    ) -> None:
        """Update asset with processing metadata.

        Args:
            asset: The asset to update.
            metadata: Extracted image metadata.
            optimized_path: Path to optimized image.
            thumbnails: Generated thumbnails.
        """
        # In a real implementation, this would update the asset in the database
        # with the extracted metadata and paths
        pass

    async def get_processing_status(self, asset_id: UUID) -> ProcessingStatus | None:
        """Get processing status for an asset.

        Args:
            asset_id: The asset ID.

        Returns:
            Processing status or None if not found.
        """
        # In a real implementation, this would query the database
        return None

    async def reprocess_image(self, asset_id: UUID) -> ProcessingStatus:
        """Reprocess an image.

        Args:
            asset_id: The asset ID.

        Returns:
            Processing status.
        """
        asset = await self.asset_repo.get_by_id(asset_id)
        if not asset:
            raise InvalidImageError("Asset not found")

        if asset.asset_type != AssetType.IMAGE:
            raise UnsupportedImageFormatError(asset.content_type)

        return await self.process_image(asset)