"""Watermark service for image processing."""

from io import BytesIO
from typing import Literal

from PIL import Image, ImageDraw, ImageFont

from app.core.config import get_settings
from app.core.logging import logger


class WatermarkHook:
    """Abstract watermark hook interface."""

    def is_enabled(self) -> bool:
        """Check if watermarking is enabled."""
        raise NotImplementedError

    async def apply(
        self,
        image: Image.Image,
        text: str | None = None,
    ) -> Image.Image:
        """Apply watermark to image.

        Args:
            image: PIL Image to watermark.
            text: Optional custom text.

        Returns:
            Watermarked image.
        """
        raise NotImplementedError


class NoOpWatermarkHook(WatermarkHook):
    """No-op watermark hook - does nothing."""

    def is_enabled(self) -> bool:
        """Watermarking is disabled."""
        return False

    async def apply(
        self,
        image: Image.Image,
        text: str | None = None,
    ) -> Image.Image:
        """Return image unchanged."""
        return image


class TextWatermarkHook(WatermarkHook):
    """Text watermark hook."""

    def __init__(self, text: str, opacity: float = 0.5, position: str = "bottom-right"):
        """Initialize text watermark hook.

        Args:
            text: Watermark text.
            opacity: Watermark opacity (0.0-1.0).
            position: Watermark position.
        """
        self.text = text
        self.opacity = opacity
        self.position = position
        self.settings = get_settings()

    def is_enabled(self) -> bool:
        """Check if watermarking is enabled."""
        return self.settings.WATERMARK_ENABLED and bool(self.text)

    async def apply(
        self,
        image: Image.Image,
        text: str | None = None,
    ) -> Image.Image:
        """Apply text watermark to image.

        Args:
            image: PIL Image to watermark.
            text: Optional custom text (uses default if not provided).

        Returns:
            Watermarked image.
        """
        if not self.is_enabled():
            return image

        watermark_text = text or self.text
        if not watermark_text:
            return image

        # Create a transparent overlay
        overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        # Try to use a font, fall back to default if not available
        try:
            font = ImageFont.truetype("arial.ttf", 36)
        except (OSError, IOError):
            font = ImageFont.load_default()

        # Get text bounding box
        bbox = draw.textbbox((0, 0), watermark_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Calculate position
        x, y = self._get_position(image.width, image.height, text_width, text_height)

        # Draw watermark
        fill = (255, 255, 255, int(255 * self.opacity))
        draw.text((x, y), watermark_text, font=font, fill=fill)

        # Composite watermark onto image
        if image.mode in ("RGB", "L"):
            image = image.convert("RGBA")

        watermarked = Image.alpha_composite(image, overlay)

        logger.info(
            "watermark_applied",
            text=watermark_text,
            position=self.position,
        )

        return watermarked

    def _get_position(
        self,
        image_width: int,
        image_height: int,
        text_width: int,
        text_height: int,
    ) -> tuple[int, int]:
        """Get watermark position coordinates.

        Args:
            image_width: Image width.
            image_height: Image height.
            text_width: Text width.
            text_height: Text height.

        Returns:
            Tuple of x, y coordinates.
        """
        padding = 10

        positions = {
            "top-left": (padding, padding),
            "top-right": (image_width - text_width - padding, padding),
            "bottom-left": (padding, image_height - text_height - padding),
            "bottom-right": (image_width - text_width - padding, image_height - text_height - padding),
            "center": (
                (image_width - text_width) // 2,
                (image_height - text_height) // 2,
            ),
        }

        return positions.get(self.position, positions["bottom-right"])


class ImageWatermarkHook(WatermarkHook):
    """Image watermark hook."""

    def __init__(
        self,
        watermark_path: str,
        opacity: float = 0.5,
        position: str = "bottom-right",
    ):
        """Initialize image watermark hook.

        Args:
            watermark_path: Path to watermark image.
            opacity: Watermark opacity (0.0-1.0).
            position: Watermark position.
        """
        self.watermark_path = watermark_path
        self.opacity = opacity
        self.position = position
        self.settings = get_settings()

    def is_enabled(self) -> bool:
        """Check if watermarking is enabled."""
        return self.settings.WATERMARK_ENABLED

    async def apply(
        self,
        image: Image.Image,
        text: str | None = None,
    ) -> Image.Image:
        """Apply image watermark to image.

        Args:
            image: PIL Image to watermark.
            text: Ignored for image watermark.

        Returns:
            Watermarked image.
        """
        if not self.is_enabled():
            return image

        try:
            watermark = Image.open(self.watermark_path)
            watermark = watermark.convert("RGBA")

            # Apply opacity
            if self.opacity < 1.0:
                alpha = watermark.split()[-1]
                alpha = Image.eval(alpha, lambda x: x * self.opacity)
                watermark.putalpha(alpha)

            # Calculate position
            x, y = self._get_position(
                image.width, image.height, watermark.width, watermark.height
            )

            # Composite watermark
            if image.mode in ("RGB", "L"):
                image = image.convert("RGBA")

            image.paste(watermark, (x, y), watermark)

            logger.info(
                "image_watermark_applied",
                path=self.watermark_path,
                position=self.position,
            )

        except Exception as e:
            logger.warning("watermark_failed", error=str(e))

        return image

    def _get_position(
        self,
        image_width: int,
        image_height: int,
        watermark_width: int,
        watermark_height: int,
    ) -> tuple[int, int]:
        """Get watermark position coordinates.

        Args:
            image_width: Image width.
            image_height: Image height.
            watermark_width: Watermark width.
            watermark_height: Watermark height.

        Returns:
            Tuple of x, y coordinates.
        """
        padding = 10

        positions = {
            "top-left": (padding, padding),
            "top-right": (image_width - watermark_width - padding, padding),
            "bottom-left": (padding, image_height - watermark_height - padding),
            "bottom-right": (
                image_width - watermark_width - padding,
                image_height - watermark_height - padding,
            ),
            "center": (
                (image_width - watermark_width) // 2,
                (image_height - watermark_height) // 2,
            ),
        }

        return positions.get(self.position, positions["bottom-right"])


class WatermarkService:
    """Watermark service for managing watermark hooks."""

    def __init__(self, hook: WatermarkHook | None = None):
        """Initialize watermark service.

        Args:
            hook: Optional watermark hook (uses default from config if not provided).
        """
        self.settings = get_settings()
        self.hook = hook or self._create_default_hook()

    def _create_default_hook(self) -> WatermarkHook:
        """Create default watermark hook from configuration."""
        if self.settings.WATERMARK_ENABLED and self.settings.WATERMARK_TEXT:
            return TextWatermarkHook(
                text=self.settings.WATERMARK_TEXT,
                opacity=self.settings.WATERMARK_OPACITY,
                position=self.settings.WATERMARK_POSITION,
            )
        return NoOpWatermarkHook()

    async def apply_watermark(
        self,
        image: Image.Image,
        text: str | None = None,
    ) -> Image.Image:
        """Apply watermark to image.

        Args:
            image: PIL Image to watermark.
            text: Optional custom text.

        Returns:
            Watermarked image.
        """
        if not self.hook.is_enabled():
            return image

        return await self.hook.apply(image, text)