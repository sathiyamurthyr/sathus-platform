"""Tests for document processing service."""

import pytest
from datetime import datetime
from unittest.mock import MagicMock, AsyncMock, patch
from uuid import UUID, uuid4

from app.media.application.document_processor import (
    DocumentProcessor,
    DocumentMetadata,
    DocumentPreview,
    DocumentVersion,
)
from app.media.domain.document_exceptions import (
    DocumentProcessingError,
    UnsupportedDocumentTypeError,
    DocumentMetadataExtractionError,
    PreviewGenerationError,
    VersionConflictError,
    DocumentTooLargeError,
    OCROptionNotAvailableError,
)
from app.media.domain.models import Asset, AssetStatus, AssetType, StorageProvider


class TestDocumentMetadata:
    """Tests for DocumentMetadata model."""

    def test_document_metadata_creation(self):
        """Test creating document metadata."""
        metadata = DocumentMetadata(
            page_count=10,
            word_count=5000,
            author="Test Author",
            title="Test Document",
        )
        assert metadata.page_count == 10
        assert metadata.word_count == 5000
        assert metadata.author == "Test Author"
        assert metadata.title == "Test Document"

    def test_document_metadata_defaults(self):
        """Test document metadata defaults."""
        metadata = DocumentMetadata()
        assert metadata.page_count == 0
        assert metadata.word_count == 0
        assert metadata.sheet_count == 0
        assert metadata.slide_count == 0
        assert metadata.keywords == []


class TestDocumentPreview:
    """Tests for DocumentPreview model."""

    def test_document_preview_creation(self):
        """Test creating document preview."""
        preview = DocumentPreview(
            path="previews/123_preview.jpg",
            content_type="image/jpeg",
            width=640,
            height=480,
        )
        assert preview.path == "previews/123_preview.jpg"
        assert preview.content_type == "image/jpeg"
        assert preview.width == 640
        assert preview.height == 480


class TestDocumentVersion:
    """Tests for DocumentVersion model."""

    def test_document_version_creation(self):
        """Test creating document version."""
        version = DocumentVersion(
            version_number=1,
            storage_path="2024/01/15/doc_v1.pdf",
            created_at=datetime.now(),
            created_by="user-123",
            change_description="Initial version",
        )
        assert version.version_number == 1
        assert version.storage_path == "2024/01/15/doc_v1.pdf"
        assert version.change_description == "Initial version"


class TestDocumentProcessor:
    """Tests for DocumentProcessor service."""

    @pytest.fixture
    def mock_asset_repo(self):
        """Create mock asset repository."""
        return MagicMock()

    @pytest.fixture
    def document_processor(self, mock_asset_repo):
        """Create document processor instance."""
        return DocumentProcessor(asset_repo=mock_asset_repo)

    def test_supported_formats(self, document_processor):
        """Test supported document formats."""
        assert "pdf" in document_processor.SUPPORTED_FORMATS
        assert "docx" in document_processor.SUPPORTED_FORMATS
        assert "xlsx" in document_processor.SUPPORTED_FORMATS
        assert "pptx" in document_processor.SUPPORTED_FORMATS
        assert "txt" in document_processor.SUPPORTED_FORMATS

    def test_validate_format_valid(self, document_processor):
        """Test validating a valid format."""
        # Should not raise
        document_processor._validate_format("pdf")

    def test_validate_format_invalid(self, document_processor):
        """Test validating an invalid format."""
        with pytest.raises(UnsupportedDocumentTypeError):
            document_processor._validate_format("xyz")

    @pytest.mark.asyncio
    async def test_extract_metadata_pdf(self, document_processor):
        """Test PDF metadata extraction."""
        document_data = b"test pdf content"
        metadata = await document_processor.extract_metadata(
            document_data, "test.pdf"
        )
        assert metadata.page_count == 1

    @pytest.mark.asyncio
    async def test_extract_metadata_word(self, document_processor):
        """Test Word metadata extraction."""
        document_data = b"test word content"
        metadata = await document_processor.extract_metadata(
            document_data, "test.docx"
        )
        assert metadata.word_count == 100

    @pytest.mark.asyncio
    async def test_extract_metadata_excel(self, document_processor):
        """Test Excel metadata extraction."""
        document_data = b"test excel content"
        metadata = await document_processor.extract_metadata(
            document_data, "test.xlsx"
        )
        assert metadata.sheet_count == 1

    @pytest.mark.asyncio
    async def test_extract_metadata_powerpoint(self, document_processor):
        """Test PowerPoint metadata extraction."""
        document_data = b"test powerpoint content"
        metadata = await document_processor.extract_metadata(
            document_data, "test.pptx"
        )
        assert metadata.slide_count == 1

    @pytest.mark.asyncio
    async def test_extract_metadata_text(self, document_processor):
        """Test text metadata extraction."""
        document_data = b"test text content"
        metadata = await document_processor.extract_metadata(
            document_data, "test.txt"
        )
        assert "test text content" in metadata.text_preview

    @pytest.mark.asyncio
    async def test_generate_preview_pdf(self, document_processor):
        """Test PDF preview generation."""
        document_data = b"test pdf content"
        preview = await document_processor.generate_preview(
            document_data, "test.pdf", "test-asset-id"
        )
        assert preview.path == "previews/test-asset-id_preview.jpg"
        assert preview.content_type == "image/jpeg"

    @pytest.mark.asyncio
    async def test_generate_preview_text(self, document_processor):
        """Test text preview generation."""
        document_data = b"test text content"
        preview = await document_processor.generate_preview(
            document_data, "test.txt", "test-asset-id"
        )
        assert preview.path == "previews/test-asset-id_preview.txt"
        assert preview.content_type == "text/plain"

    @pytest.mark.asyncio
    async def test_generate_preview_too_large(self, document_processor):
        """Test preview generation with large document."""
        # Create large document data (> 10MB)
        document_data = b"x" * (11 * 1024 * 1024)
        with pytest.raises(DocumentTooLargeError):
            await document_processor.generate_preview(
                document_data, "test.pdf", "test-asset-id"
            )

    @pytest.mark.asyncio
    async def test_process_document_success(self, document_processor):
        """Test successful document processing."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        mock_storage = MagicMock()
        mock_storage.download = AsyncMock(return_value=b"test document data")
        document_processor.storage = mock_storage

        result = await document_processor.process_document(asset)
        assert result["status"] == "completed"
        assert "metadata" in result
        assert "preview" in result

    @pytest.mark.asyncio
    async def test_create_version(self, document_processor):
        """Test version creation."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        version = await document_processor.create_version(asset)
        assert version.version_number == 1

    @pytest.mark.asyncio
    async def test_get_versions(self, document_processor):
        """Test getting document versions."""
        versions = await document_processor.get_versions("test-asset-id")
        assert isinstance(versions, list)

    @pytest.mark.asyncio
    async def test_restore_version_not_found(self, document_processor):
        """Test restoring non-existent version."""
        asset = Asset(
            id=uuid4(),
            filename="test.pdf",
            original_filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            asset_type=AssetType.DOCUMENT,
            status=AssetStatus.READY,
            storage_provider=StorageProvider.LOCAL,
            storage_path="2024/01/15/test.pdf",
            created_by=uuid4(),
            created_at=datetime.now().isoformat(),
        )

        with pytest.raises(VersionConflictError):
            await document_processor.restore_version(asset, 999)

    @pytest.mark.asyncio
    async def test_get_ocr_text_not_available(self, document_processor):
        """Test OCR when not available."""
        with pytest.raises(OCROptionNotAvailableError):
            await document_processor.get_ocr_text(
                b"test content", "test.pdf"
            )


class TestDocumentProcessingExceptions:
    """Tests for document processing exceptions."""

    def test_unsupported_document_type_error(self):
        """Test UnsupportedDocumentTypeError message."""
        error = UnsupportedDocumentTypeError("xyz")
        assert "xyz" in str(error)

    def test_document_metadata_extraction_error(self):
        """Test DocumentMetadataExtractionError message."""
        error = DocumentMetadataExtractionError("Test error")
        assert "Test error" in str(error)

    def test_preview_generation_error(self):
        """Test PreviewGenerationError message."""
        error = PreviewGenerationError("Test error")
        assert "Test error" in str(error)

    def test_version_conflict_error(self):
        """Test VersionConflictError message."""
        error = VersionConflictError("Test error")
        assert "Test error" in str(error)

    def test_document_too_large_error(self):
        """Test DocumentTooLargeError message."""
        error = DocumentTooLargeError(15, 10)
        assert "15" in str(error)
        assert "10" in str(error)

    def test_ocr_option_not_available_error(self):
        """Test OCROptionNotAvailableError message."""
        error = OCROptionNotAvailableError()
        assert "OCR" in str(error)