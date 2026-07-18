"""Video processing service with FFmpeg integration."""

import asyncio
import json
import os
import tempfile
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from app.core.config import get_settings
from app.core.logging import logger
from app.media.domain.models import Asset, AssetStatus, AssetType, StorageProvider
from app.media.domain.video_exceptions import (
    FFmpegNotAvailableError,
    StreamingPackagingError,
    UnsupportedVideoFormatError,
    VideoMetadataExtractionError,
    VideoThumbnailGenerationError,
    VideoTooLongError,
    VideoTranscodingError,
)
from app.media.infrastructure.providers.factory import create_storage_provider


@dataclass
class VideoMetadata:
    """Video metadata extracted from ffprobe."""

    duration: float
    width: int
    height: int
    frame_rate: float
    bitrate: int
    video_codec: str
    audio_codec: str
    container: str
    rotation: int = 0
    aspect_ratio: float = 0.0

    def __post_init__(self):
        """Calculate aspect ratio after initialization."""
        if self.height > 0:
            self.aspect_ratio = self.width / self.height


@dataclass
class VideoThumbnail:
    """Video thumbnail information."""

    path: str
    width: int
    height: int
    timestamp: float


@dataclass
class TranscodedVideo:
    """Transcoded video information."""

    path: str
    width: int
    height: int
    preset: str


@dataclass
class StreamingManifest:
    """Streaming manifest information."""

    manifest_path: str
    segment_paths: list[str]
    playlist_path: str


class VideoProcessor:
    """Video processing service using FFmpeg."""

    SUPPORTED_FORMATS = {"mp4", "mov", "avi", "mkv", "webm", "mpeg", "m4v"}

    def __init__(self, asset_repo: Any):
        """Initialize video processor.

        Args:
            asset_repo: Asset repository for database operations.
        """
        self.settings = get_settings()
        self.asset_repo = asset_repo
        self.storage = create_storage_provider()
        self._ffmpeg_available: bool | None = None

    async def _check_ffmpeg(self) -> bool:
        """Check if FFmpeg and ffprobe are available.

        Returns:
            True if both are available.

        Raises:
            FFmpegNotAvailableError: If FFmpeg is not available.
        """
        if self._ffmpeg_available is not None:
            return self._ffmpeg_available

        try:
            proc = await asyncio.create_subprocess_exec(
                "ffmpeg",
                "-version",
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.DEVNULL,
            )
            await proc.wait()

            proc = await asyncio.create_subprocess_exec(
                "ffprobe",
                "-version",
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.DEVNULL,
            )
            await proc.wait()

            self._ffmpeg_available = True
            return True
        except FileNotFoundError:
            self._ffmpeg_available = False
            raise FFmpegNotAvailableError()

    def _get_video_format(self, filename: str) -> str:
        """Get video format from filename.

        Args:
            filename: Video filename.

        Returns:
            Format string.
        """
        ext = Path(filename).suffix.lower().lstrip(".")
        return ext

    def _validate_format(self, format: str) -> None:
        """Validate video format.

        Args:
            format: Video format.

        Raises:
            UnsupportedVideoFormatError: If format is not supported.
        """
        if format not in self.SUPPORTED_FORMATS:
            raise UnsupportedVideoFormatError(format)

    async def extract_metadata(self, video_path: str) -> VideoMetadata:
        """Extract video metadata using ffprobe.

        Args:
            video_path: Path to video file.

        Returns:
            VideoMetadata with extracted information.

        Raises:
            VideoMetadataExtractionError: If extraction fails.
        """
        await self._check_ffmpeg()

        cmd = [
            "ffprobe",
            "-v",
            "quiet",
            "-print_format",
            "json",
            "-show_format",
            "-show_streams",
            video_path,
        ]

        try:
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await proc.communicate()

            if proc.returncode != 0:
                raise VideoMetadataExtractionError(
                    f"ffprobe failed with code {proc.returncode}"
                )

            data = json.loads(stdout)
            return self._parse_metadata(data)
        except Exception as e:
            raise VideoMetadataExtractionError(str(e))

    def _parse_metadata(self, data: dict) -> VideoMetadata:
        """Parse ffprobe output into VideoMetadata.

        Args:
            data: ffprobe JSON output.

        Returns:
            Parsed VideoMetadata.
        """
        format_info = data.get("format", {})
        streams = data.get("streams", [])

        video_stream = next(
            (s for s in streams if s.get("codec_type") == "video"), {}
        )
        audio_stream = next(
            (s for s in streams if s.get("codec_type") == "audio"), {}
        )

        width = int(video_stream.get("width", 0))
        height = int(video_stream.get("height", 0))
        duration = float(format_info.get("duration", 0))
        bitrate = int(format_info.get("bit_rate", 0))

        # Parse frame rate
        fps_str = video_stream.get("r_frame_rate", "0/1")
        if "/" in fps_str:
            num, den = fps_str.split("/")
            frame_rate = float(num) / float(den) if float(den) > 0 else 0.0
        else:
            frame_rate = float(fps_str)

        # Get rotation from metadata
        rotation = 0
        if "tags" in video_stream:
            rotation = int(video_stream["tags"].get("rotate", 0))

        return VideoMetadata(
            duration=duration,
            width=width,
            height=height,
            frame_rate=frame_rate,
            bitrate=bitrate,
            video_codec=video_stream.get("codec_name", "unknown"),
            audio_codec=audio_stream.get("codec_name", "unknown"),
            container=format_info.get("format_name", "unknown"),
            rotation=rotation,
            aspect_ratio=width / height if height > 0 else 0.0,
        )

    async def generate_thumbnails(
        self,
        video_path: str,
        asset_id: str,
        sizes: list[dict[str, int]] | None = None,
    ) -> list[VideoThumbnail]:
        """Generate video thumbnails.

        Args:
            video_path: Path to video file.
            asset_id: Asset ID for path generation.
            sizes: Thumbnail sizes (uses config defaults if not provided).

        Returns:
            List of VideoThumbnail objects.

        Raises:
            VideoThumbnailGenerationError: If generation fails.
        """
        await self._check_ffmpeg()

        if sizes is None:
            sizes = self.settings.VIDEO_THUMBNAIL_SIZES

        thumbnails = []

        for size in sizes:
            width = size["width"]
            height = size["height"]

            # Generate thumbnail at middle of video
            cmd = [
                "ffmpeg",
                "-y",
                "-i",
                video_path,
                "-ss",
                "00:00:01",
                "-vframes",
                "1",
                "-vf",
                f"scale={width}:{height}:force_original_aspect_ratio=decrease",
                "-f",
                "image2",
                "pipe:",
            ]

            try:
                proc = await asyncio.create_subprocess_exec(
                    *cmd,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                stdout, stderr = await proc.communicate()

                if proc.returncode != 0:
                    raise VideoThumbnailGenerationError(
                        f"FFmpeg failed with code {proc.returncode}"
                    )

                # Upload thumbnail
                thumb_path = f"thumbnails/{asset_id}_{width}x{height}.jpg"
                await self.storage.upload(
                    key=thumb_path,
                    data=stdout,
                    content_type="image/jpeg",
                )

                thumbnails.append(
                    VideoThumbnail(
                        path=thumb_path,
                        width=width,
                        height=height,
                        timestamp=1.0,
                    )
                )
            except Exception as e:
                raise VideoThumbnailGenerationError(str(e))

        return thumbnails

    async def transcode(
        self,
        video_path: str,
        asset_id: str,
        presets: list[dict[str, Any]] | None = None,
    ) -> list[TranscodedVideo]:
        """Transcode video to multiple resolutions.

        Args:
            video_path: Path to video file.
            asset_id: Asset ID for path generation.
            presets: Transcoding presets (uses config defaults if not provided).

        Returns:
            List of TranscodedVideo objects.

        Raises:
            VideoTranscodingError: If transcoding fails.
        """
        await self._check_ffmpeg()

        if presets is None:
            presets = self.settings.VIDEO_TRANSCODE_PRESETS

        transcoded = []

        for preset in presets:
            name = preset["name"]
            width = preset["width"]
            height = preset["height"]

            output_path = f"transcoded/{asset_id}_{name}.mp4"

            cmd = [
                "ffmpeg",
                "-y",
                "-i",
                video_path,
                "-vf",
                f"scale={width}:{height}:force_original_aspect_ratio=decrease",
                "-c:v",
                self.settings.VIDEO_CODEC,
                "-crf",
                str(self.settings.VIDEO_CRF),
                "-preset",
                self.settings.VIDEO_PRESET,
                "-c:a",
                "aac",
                "-b:a",
                "128k",
                "-f",
                "mp4",
                "pipe:",
            ]

            try:
                proc = await asyncio.create_subprocess_exec(
                    *cmd,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                )
                stdout, stderr = await proc.communicate()

                if proc.returncode != 0:
                    raise VideoTranscodingError(
                        f"FFmpeg failed with code {proc.returncode}"
                    )

                # Upload transcoded video
                await self.storage.upload(
                    key=output_path,
                    data=stdout,
                    content_type="video/mp4",
                )

                transcoded.append(
                    TranscodedVideo(
                        path=output_path,
                        width=width,
                        height=height,
                        preset=name,
                    )
                )
            except Exception as e:
                raise VideoTranscodingError(str(e))

        return transcoded

    async def generate_hls(
        self,
        video_path: str,
        asset_id: str,
    ) -> StreamingManifest:
        """Generate HLS streaming manifest.

        Args:
            video_path: Path to video file.
            asset_id: Asset ID for path generation.

        Returns:
            StreamingManifest with manifest and segment paths.

        Raises:
            StreamingPackagingError: If packaging fails.
        """
        if not self.settings.HLS_ENABLED:
            raise StreamingPackagingError("HLS streaming is disabled")

        await self._check_ffmpeg()

        manifest_path = f"streaming/{asset_id}/master.m3u8"
        segment_prefix = f"streaming/{asset_id}/segment_%03d.ts"

        cmd = [
            "ffmpeg",
            "-y",
            "-i",
            video_path,
            "-profile:v",
            "baseline",
            "-level",
            "3.0",
            "-start_number",
            "0",
            "-hls_time",
            str(self.settings.HLS_SEGMENT_DURATION),
            "-hls_list_size",
            "0",
            "-f",
            "hls",
            "pipe:",
        ]

        try:
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await proc.communicate()

            if proc.returncode != 0:
                raise StreamingPackagingError(
                    f"FFmpeg failed with code {proc.returncode}"
                )

            # Upload manifest
            await self.storage.upload(
                key=manifest_path,
                data=stdout,
                content_type="application/vnd.apple.mpegurl",
            )

            return StreamingManifest(
                manifest_path=manifest_path,
                segment_paths=[segment_prefix],
                playlist_path=manifest_path,
            )
        except Exception as e:
            raise StreamingPackagingError(str(e))

    async def process_video(
        self,
        asset: Asset,
    ) -> dict[str, Any]:
        """Process a video asset through the complete pipeline.

        Args:
            asset: Asset to process.

        Returns:
            Processing result with metadata, thumbnails, and transcoded videos.

        Raises:
            VideoProcessingError: If processing fails.
        """
        if not self.settings.VIDEO_PROCESSING_ENABLED:
            return {"status": "skipped", "reason": "Video processing disabled"}

        # Download video
        video_data = await self.storage.download(asset.storage_path)

        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
            tmp.write(video_data)
            tmp_path = tmp.name

        try:
            # Extract metadata
            metadata = await self.extract_metadata(tmp_path)

            # Validate duration
            if metadata.duration > self.settings.VIDEO_MAX_DURATION_SECONDS:
                raise VideoTooLongError(
                    int(metadata.duration),
                    self.settings.VIDEO_MAX_DURATION_SECONDS,
                )

            # Generate thumbnails
            thumbnails = await self.generate_thumbnails(
                tmp_path, str(asset.id)
            )

            # Transcode
            transcoded = await self.transcode(tmp_path, str(asset.id))

            # Generate HLS
            hls = await self.generate_hls(tmp_path, str(asset.id))

            return {
                "status": "completed",
                "metadata": {
                    "duration": metadata.duration,
                    "width": metadata.width,
                    "height": metadata.height,
                    "frame_rate": metadata.frame_rate,
                    "bitrate": metadata.bitrate,
                    "video_codec": metadata.video_codec,
                    "audio_codec": metadata.audio_codec,
                    "container": metadata.container,
                    "rotation": metadata.rotation,
                    "aspect_ratio": metadata.aspect_ratio,
                },
                "thumbnails": [t.path for t in thumbnails],
                "transcoded": [t.path for t in transcoded],
                "streaming": hls.manifest_path,
            }
        finally:
            os.unlink(tmp_path)