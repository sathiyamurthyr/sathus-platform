"""Tests for video processing service."""

import json
import pytest
from datetime import datetime
from unittest.mock import MagicMock, AsyncMock, patch
from uuid import UUID, uuid4

from app.media.application.video_processor import (
    VideoProcessor,
    VideoMetadata,
    VideoThumbnail,
    TranscodedVideo,
    StreamingManifest,
)
from app.media.domain.video_exceptions import (
    FFmpegNotAvailableError,
    UnsupportedVideoFormatError,
    VideoMetadataExtractionError,
    VideoThumbnailGenerationError,
    VideoTranscodingError,
    StreamingPackagingError,
    VideoTooLongError,
)
from app.media.domain.models import Asset, AssetStatus, AssetType, StorageProvider


class TestVideoMetadata:
    """Tests for VideoMetadata model."""

    def test_video_metadata_creation(self):
        """Test creating video metadata."""
        metadata = VideoMetadata(
            duration=120.5,
            width=1920,
            height=1080,
            frame_rate=30.0,
            bitrate=5000000,
            video_codec="h264",
            audio_codec="aac",
            container="mov,mp4",
        )
        assert metadata.duration == 120.5
        assert metadata.width == 1920
        assert metadata.height == 1080
        assert metadata.frame_rate == 30.0
        assert metadata.video_codec == "h264"
        assert metadata.aspect_ratio == 1920 / 1080

    def test_video_metadata_with_rotation(self):
        """Test video metadata with rotation."""
        metadata = VideoMetadata(
            duration=60.0,
            width=1080,
            height=1920,
            frame_rate=24.0,
            bitrate=3000000,
            video_codec="h264",
            audio_codec="aac",
            container="mov,mp4",
            rotation=90,
        )
        assert metadata.rotation == 90


class TestVideoThumbnail:
    """Tests for VideoThumbnail model."""

    def test_video_thumbnail_creation(self):
        """Test creating video thumbnail."""
        thumb = VideoThumbnail(
            path="thumbnails/123_640x360.jpg",
            width=640,
            height=360,
            timestamp=1.0,
        )
        assert thumb.path == "thumbnails/123_640x360.jpg"
        assert thumb.width == 640
        assert thumb.height == 360


class TestTranscodedVideo:
    """Tests for TranscodedVideo model."""

    def test_transcoded_video_creation(self):
        """Test creating transcoded video."""
        video = TranscodedVideo(
            path="transcoded/123_720p.mp4",
            width=1280,
            height=720,
            preset="720p",
        )
        assert video.path == "transcoded/123_720p.mp4"
        assert video.preset == "720p"


class TestStreamingManifest:
    """Tests for StreamingManifest model."""

    def test_streaming_manifest_creation(self):
        """Test creating streaming manifest."""
        manifest = StreamingManifest(
            manifest_path="streaming/123/master.m3u8",
            segment_paths=["streaming/123/segment_000.ts"],
            playlist_path="streaming/123/master.m3u8",
        )
        assert manifest.manifest_path == "streaming/123/master.m3u8"
        assert len(manifest.segment_paths) == 1


class TestVideoProcessor:
    """Tests for VideoProcessor service."""

    @pytest.fixture
    def mock_asset_repo(self):
        """Create mock asset repository."""
        return MagicMock()

    @pytest.fixture
    def video_processor(self, mock_asset_repo):
        """Create video processor instance."""
        return VideoProcessor(asset_repo=mock_asset_repo)

    def test_supported_formats(self, video_processor):
        """Test supported video formats."""
        assert "mp4" in video_processor.SUPPORTED_FORMATS
        assert "mov" in video_processor.SUPPORTED_FORMATS
        assert "avi" in video_processor.SUPPORTED_FORMATS
        assert "mkv" in video_processor.SUPPORTED_FORMATS
        assert "webm" in video_processor.SUPPORTED_FORMATS

    def test_validate_format_valid(self, video_processor):
        """Test validating a valid format."""
        # Should not raise
        video_processor._validate_format("mp4")

    def test_validate_format_invalid(self, video_processor):
        """Test validating an invalid format."""
        with pytest.raises(UnsupportedVideoFormatError):
            video_processor._validate_format("xyz")

    def test_parse_metadata(self, video_processor):
        """Test parsing ffprobe metadata."""
        data = {
            "format": {
                "duration": "120.5",
                "bit_rate": "5000000",
                "format_name": "mov,mp4",
            },
            "streams": [
                {
                    "codec_type": "video",
                    "width": 1920,
                    "height": 1080,
                    "r_frame_rate": "30/1",
                    "codec_name": "h264",
                },
                {
                    "codec_type": "audio",
                    "codec_name": "aac",
                },
            ],
        }

        metadata = video_processor._parse_metadata(data)

        assert metadata.duration == 120.5
        assert metadata.width == 1920
        assert metadata.height == 1080
        assert metadata.frame_rate == 30.0
        assert metadata.video_codec == "h264"
        assert metadata.audio_codec == "aac"

    def test_parse_metadata_with_rotation(self, video_processor):
        """Test parsing metadata with rotation."""
        data = {
            "format": {
                "duration": "60.0",
                "bit_rate": "3000000",
                "format_name": "mov,mp4",
            },
            "streams": [
                {
                    "codec_type": "video",
                    "width": 1080,
                    "height": 1920,
                    "r_frame_rate": "24/1",
                    "codec_name": "h264",
                    "tags": {"rotate": "90"},
                },
                {
                    "codec_type": "audio",
                    "codec_name": "aac",
                },
            ],
        }

        metadata = video_processor._parse_metadata(data)

        assert metadata.rotation == 90

    @pytest.mark.asyncio
    async def test_check_ffmpeg_available(self, video_processor):
        """Test checking FFmpeg availability."""
        mock_proc = MagicMock()
        mock_proc.wait = AsyncMock(return_value=MagicMock(returncode=0))
        with patch(
            "asyncio.create_subprocess_exec",
            return_value=mock_proc,
        ):
            result = await video_processor._check_ffmpeg()
            assert result is True

    @pytest.mark.asyncio
    async def test_check_ffmpeg_not_available(self, video_processor):
        """Test checking FFmpeg when not available."""
        with patch(
            "asyncio.create_subprocess_exec",
            side_effect=FileNotFoundError(),
        ):
            with pytest.raises(FFmpegNotAvailableError):
                await video_processor._check_ffmpeg()

    @pytest.mark.asyncio
    async def test_extract_metadata_success(self, video_processor):
        """Test successful metadata extraction."""
        ffprobe_output = json.dumps(
            {
                "format": {
                    "duration": "120.5",
                    "bit_rate": "5000000",
                    "format_name": "mov,mp4",
                },
                "streams": [
                    {
                        "codec_type": "video",
                        "width": 1920,
                        "height": 1080,
                        "r_frame_rate": "30/1",
                        "codec_name": "h264",
                    },
                    {
                        "codec_type": "audio",
                        "codec_name": "aac",
                    },
                ],
            }
        ).encode()

        mock_proc = MagicMock()
        mock_proc.communicate = AsyncMock(return_value=(ffprobe_output, b""))
        mock_proc.returncode = 0
        mock_proc.wait = AsyncMock(return_value=MagicMock(returncode=0))

        with patch(
            "asyncio.create_subprocess_exec",
            return_value=mock_proc,
        ):
            metadata = await video_processor.extract_metadata("/path/to/video.mp4")
            assert metadata.duration == 120.5
            assert metadata.width == 1920

    @pytest.mark.asyncio
    async def test_extract_metadata_failure(self, video_processor):
        """Test metadata extraction failure."""
        mock_proc = MagicMock()
        mock_proc.communicate = AsyncMock(return_value=(b"", b"error"))
        mock_proc.returncode = 1
        mock_proc.wait = AsyncMock(return_value=MagicMock(returncode=0))

        with patch(
            "asyncio.create_subprocess_exec",
            return_value=mock_proc,
        ):
            with pytest.raises(VideoMetadataExtractionError):
                await video_processor.extract_metadata("/path/to/video.mp4")

    @pytest.mark.asyncio
    async def test_generate_thumbnails_success(self, video_processor):
        """Test successful thumbnail generation."""
        mock_storage = MagicMock()
        mock_storage.upload = AsyncMock(return_value=MagicMock(key="test", size=100))
        video_processor.storage = mock_storage

        mock_proc = MagicMock()
        mock_proc.communicate = AsyncMock(return_value=(b"fake_image_data", b""))
        mock_proc.returncode = 0
        mock_proc.wait = AsyncMock(return_value=MagicMock(returncode=0))

        with patch(
            "asyncio.create_subprocess_exec",
            return_value=mock_proc,
        ):
            thumbnails = await video_processor.generate_thumbnails(
                "/path/to/video.mp4",
                "test-asset-id",
                [{"width": 320, "height": 180}],
            )
            assert len(thumbnails) == 1
            assert thumbnails[0].width == 320

    @pytest.mark.asyncio
    async def test_transcode_success(self, video_processor):
        """Test successful transcoding."""
        mock_storage = MagicMock()
        mock_storage.upload = AsyncMock(return_value=MagicMock(key="test", size=100))
        video_processor.storage = mock_storage

        mock_proc = MagicMock()
        mock_proc.communicate = AsyncMock(return_value=(b"fake_video_data", b""))
        mock_proc.returncode = 0
        mock_proc.wait = AsyncMock(return_value=MagicMock(returncode=0))

        with patch(
            "asyncio.create_subprocess_exec",
            return_value=mock_proc,
        ):
            transcoded = await video_processor.transcode(
                "/path/to/video.mp4",
                "test-asset-id",
                [{"name": "360p", "width": 640, "height": 360}],
            )
            assert len(transcoded) == 1
            assert transcoded[0].preset == "360p"

    @pytest.mark.asyncio
    async def test_generate_hls_success(self, video_processor):
        """Test successful HLS generation."""
        mock_storage = MagicMock()
        mock_storage.upload = AsyncMock(return_value=MagicMock(key="test", size=100))
        video_processor.storage = mock_storage

        mock_proc = MagicMock()
        mock_proc.communicate = AsyncMock(return_value=(b"fake_manifest", b""))
        mock_proc.returncode = 0
        mock_proc.wait = AsyncMock(return_value=MagicMock(returncode=0))

        with patch(
            "asyncio.create_subprocess_exec",
            return_value=mock_proc,
        ):
            manifest = await video_processor.generate_hls(
                "/path/to/video.mp4",
                "test-asset-id",
            )
            assert manifest.manifest_path == "streaming/test-asset-id/master.m3u8"

    @pytest.mark.asyncio
    async def test_process_video_success(self, video_processor):
        """Test successful video processing."""
        asset = Asset(
            id=uuid4(),
            filename="test.mp4",
            original_filename="test.mp4",
            content_type="video/mp4",
            file_size=1000000,
            asset_type=AssetType.VIDEO,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.mp4",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        mock_storage = MagicMock()
        mock_storage.download = AsyncMock(return_value=b"fake_video_data")
        mock_storage.upload = AsyncMock(return_value=MagicMock(key="test", size=100))
        video_processor.storage = mock_storage

        ffprobe_output = json.dumps(
            {
                "format": {
                    "duration": "120.5",
                    "bit_rate": "5000000",
                    "format_name": "mov,mp4",
                },
                "streams": [
                    {
                        "codec_type": "video",
                        "width": 1920,
                        "height": 1080,
                        "r_frame_rate": "30/1",
                        "codec_name": "h264",
                    },
                    {
                        "codec_type": "audio",
                        "codec_name": "aac",
                    },
                ],
            }
        ).encode()

        mock_proc = MagicMock()
        mock_proc.communicate = AsyncMock(return_value=(ffprobe_output, b""))
        mock_proc.returncode = 0
        mock_proc.wait = AsyncMock(return_value=MagicMock(returncode=0))

        with patch(
            "asyncio.create_subprocess_exec",
            return_value=mock_proc,
        ):
            result = await video_processor.process_video(asset)
            assert result["status"] == "completed"
            assert "metadata" in result
            assert "thumbnails" in result
            assert "transcoded" in result
            assert "streaming" in result


class TestVideoProcessingExceptions:
    """Tests for video processing exceptions."""

    def test_unsupported_video_format_error(self):
        """Test UnsupportedVideoFormatError message."""
        error = UnsupportedVideoFormatError("xyz")
        assert "xyz" in str(error)

    def test_video_metadata_extraction_error(self):
        """Test VideoMetadataExtractionError message."""
        error = VideoMetadataExtractionError("Test error")
        assert "Test error" in str(error)

    def test_video_thumbnail_generation_error(self):
        """Test VideoThumbnailGenerationError message."""
        error = VideoThumbnailGenerationError("Test error")
        assert "Test error" in str(error)

    def test_video_transcoding_error(self):
        """Test VideoTranscodingError message."""
        error = VideoTranscodingError("Test error")
        assert "Test error" in str(error)

    def test_streaming_packaging_error(self):
        """Test StreamingPackagingError message."""
        error = StreamingPackagingError("Test error")
        assert "Test error" in str(error)

    def test_video_too_long_error(self):
        """Test VideoTooLongError message."""
        error = VideoTooLongError(5000, 3600)
        assert "5000" in str(error)
        assert "3600" in str(error)

    def test_ffmpeg_not_available_error(self):
        """Test FFmpegNotAvailableError message."""
        error = FFmpegNotAvailableError()
        assert "FFmpeg" in str(error)