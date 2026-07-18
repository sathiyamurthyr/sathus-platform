"""Document processing service for enterprise document management."""

import io
import os
import tempfile
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

from app.core.config import get_settings
from app.core.logging import logger
from app.media.domain.models import Asset, AssetStatus, AssetType, StorageProvider
from app.media.domain.document_exceptions import (
    DocumentMetadataExtractionError,
    DocumentProcessingError,
    DocumentTooLargeError,
    OCROptionNotAvailableError,
    PreviewGenerationError,
    UnsupportedDocumentTypeError,
    VersionConflictError,
)
from app.media.infrastructure.providers.factory import create_storage_provider


@dataclass
class DocumentMetadata:
    """Document metadata extracted from various document types."""

    page_count: int = 0
    word_count: int = 0
    sheet_count: int = 0
    slide_count: int = 0
    author: str | None = None
    title: str | None = None
    subject: str | None = None
    keywords: list[str] = field(default_factory=list)
    creation_date: datetime | None = None
    last_modified_date: datetime | None = None
    language: str | None = None
    text_preview: str = ""


@dataclass
class DocumentPreview:
    """Document preview information."""

    path: str
    content_type: str
    width: int = 0
    height: int = 0


@dataclass
class DocumentVersion:
    """Document version information."""

    version_number: int
    storage_path: str
    created_at: datetime
    created_by: str
    change_description: str | None = None


class DocumentProcessor:
    """Document processing service for enterprise document management."""

    SUPPORTED_FORMATS = {
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "txt",
        "csv",
        "rtf",
        "odt",
        "ods",
        "odp",
    }

    def __init__(self, asset_repo: Any):
        """Initialize document processor.

        Args:
            asset_repo: Asset repository for database operations.
        """
        self.settings = get_settings()
        self.asset_repo = asset_repo
        self.storage = create_storage_provider()

    def _get_document_format(self, filename: str) -> str:
        """Get document format from filename.

        Args:
            filename: Document filename.

        Returns:
            Format string.
        """
        ext = Path(filename).suffix.lower().lstrip(".")
        return ext

    def _validate_format(self, format: str) -> None:
        """Validate document format.

        Args:
            format: Document format.

        Raises:
            UnsupportedDocumentTypeError: If format is not supported.
        """
        if format not in self.SUPPORTED_FORMATS:
            raise UnsupportedDocumentTypeError(format)

    async def extract_metadata(
        self,
        document_data: bytes,
        filename: str,
    ) -> DocumentMetadata:
        """Extract metadata from a document.

        Args:
            document_data: Raw document bytes.
            filename: Document filename.

        Returns:
            DocumentMetadata with extracted information.

        Raises:
            DocumentMetadataExtractionError: If extraction fails.
        """
        format = self._get_document_format(filename)
        self._validate_format(format)

        try:
            if format == "pdf":
                return await self._extract_pdf_metadata(document_data)
            elif format in {"doc", "docx"}:
                return await self._extract_word_metadata(document_data, format)
            elif format in {"xls", "xlsx"}:
                return await self._extract_excel_metadata(document_data, format)
            elif format in {"ppt", "pptx"}:
                return await self._extract_powerpoint_metadata(document_data, format)
            elif format in {"txt", "csv", "rtf"}:
                return await self._extract_text_metadata(document_data, format)
            else:
                return DocumentMetadata()
        except Exception as e:
            raise DocumentMetadataExtractionError(str(e))

    async def _extract_pdf_metadata(self, document_data: bytes) -> DocumentMetadata:
        """Extract metadata from PDF document.

        Args:
            document_data: Raw PDF bytes.

        Returns:
            DocumentMetadata with PDF information.
        """
        # Placeholder for pypdf integration
        # In production, this would use pypdf to extract metadata
        return DocumentMetadata(
            page_count=1,
            text_preview=document_data[: self.settings.DOCUMENT_TEXT_PREVIEW_LENGTH].decode(
                "utf-8", errors="ignore"
            ),
        )

    async def _extract_word_metadata(
        self,
        document_data: bytes,
        format: str,
    ) -> DocumentMetadata:
        """Extract metadata from Word document.

        Args:
            document_data: Raw document bytes.
            format: Document format (doc or docx).

        Returns:
            DocumentMetadata with Word information.
        """
        # Placeholder for python-docx integration
        return DocumentMetadata(
            page_count=1,
            word_count=100,
            text_preview=document_data[: self.settings.DOCUMENT_TEXT_PREVIEW_LENGTH].decode(
                "utf-8", errors="ignore"
            ),
        )

    async def _extract_excel_metadata(
        self,
        document_data: bytes,
        format: str,
    ) -> DocumentMetadata:
        """Extract metadata from Excel document.

        Args:
            document_data: Raw document bytes.
            format: Document format (xls or xlsx).

        Returns:
            DocumentMetadata with Excel information.
        """
        # Placeholder for openpyxl integration
        return DocumentMetadata(
            sheet_count=1,
            text_preview=document_data[: self.settings.DOCUMENT_TEXT_PREVIEW_LENGTH].decode(
                "utf-8", errors="ignore"
            ),
        )

    async def _extract_powerpoint_metadata(
        self,
        document_data: bytes,
        format: str,
    ) -> DocumentMetadata:
        """Extract metadata from PowerPoint document.

        Args:
            document_data: Raw document bytes.
            format: Document format (ppt or pptx).

        Returns:
            DocumentMetadata with PowerPoint information.
        """
        # Placeholder for python-pptx integration
        return DocumentMetadata(
            slide_count=1,
            text_preview=document_data[: self.settings.DOCUMENT_TEXT_PREVIEW_LENGTH].decode(
                "utf-8", errors="ignore"
            ),
        )

    async def _extract_text_metadata(
        self,
        document_data: bytes,
        format: str,
    ) -> DocumentMetadata:
        """Extract metadata from text document.

        Args:
            document_data: Raw document bytes.
            format: Document format (txt, csv, or rtf).

        Returns:
            DocumentMetadata with text information.
        """
        text = document_data.decode("utf-8", errors="ignore")
        return DocumentMetadata(
            text_preview=text[: self.settings.DOCUMENT_TEXT_PREVIEW_LENGTH],
        )

    async def generate_preview(
        self,
        document_data: bytes,
        filename: str,
        asset_id: str,
    ) -> DocumentPreview:
        """Generate preview for a document.

        Args:
            document_data: Raw document bytes.
            filename: Document filename.
            asset_id: Asset ID for path generation.

        Returns:
            DocumentPreview with preview information.

        Raises:
            PreviewGenerationError: If preview generation fails.
        """
        if not self.settings.DOCUMENT_PREVIEW_ENABLED:
            raise PreviewGenerationError("Document preview generation is disabled")

        format = self._get_document_format(filename)
        self._validate_format(format)

        # Check document size
        size_mb = len(document_data) / (1024 * 1024)
        if size_mb > self.settings.DOCUMENT_MAX_PREVIEW_SIZE_MB:
            raise DocumentTooLargeError(
                int(size_mb),
                self.settings.DOCUMENT_MAX_PREVIEW_SIZE_MB,
            )

        try:
            if format == "pdf":
                return await self._generate_pdf_preview(document_data, asset_id)
            elif format in {"doc", "docx"}:
                return await self._generate_word_preview(document_data, asset_id)
            elif format in {"xls", "xlsx"}:
                return await self._generate_excel_preview(document_data, asset_id)
            elif format in {"ppt", "pptx"}:
                return await self._generate_powerpoint_preview(document_data, asset_id)
            elif format in {"txt", "csv", "rtf"}:
                return await self._generate_text_preview(document_data, asset_id)
            else:
                raise PreviewGenerationError(f"Preview not supported for {format}")
        except PreviewGenerationError:
            raise
        except Exception as e:
            raise PreviewGenerationError(str(e))

    async def _generate_pdf_preview(
        self,
        document_data: bytes,
        asset_id: str,
    ) -> DocumentPreview:
        """Generate preview for PDF document.

        Args:
            document_data: Raw PDF bytes.
            asset_id: Asset ID for path generation.

        Returns:
            DocumentPreview with PDF preview information.
        """
        # Placeholder for PDF preview generation
        # In production, this would use pypdf to render first page
        preview_path = f"previews/{asset_id}_preview.jpg"
        return DocumentPreview(
            path=preview_path,
            content_type="image/jpeg",
            width=640,
            height=480,
        )

    async def _generate_word_preview(
        self,
        document_data: bytes,
        asset_id: str,
    ) -> DocumentPreview:
        """Generate preview for Word document.

        Args:
            document_data: Raw document bytes.
            asset_id: Asset ID for path generation.

        Returns:
            DocumentPreview with Word preview information.
        """
        # Placeholder for Word preview generation
        preview_path = f"previews/{asset_id}_preview.jpg"
        return DocumentPreview(
            path=preview_path,
            content_type="image/jpeg",
            width=640,
            height=480,
        )

    async def _generate_excel_preview(
        self,
        document_data: bytes,
        asset_id: str,
    ) -> DocumentPreview:
        """Generate preview for Excel document.

        Args:
            document_data: Raw document bytes.
            asset_id: Asset ID for path generation.

        Returns:
            DocumentPreview with Excel preview information.
        """
        # Placeholder for Excel preview generation
        preview_path = f"previews/{asset_id}_preview.jpg"
        return DocumentPreview(
            path=preview_path,
            content_type="image/jpeg",
            width=640,
            height=480,
        )

    async def _generate_powerpoint_preview(
        self,
        document_data: bytes,
        asset_id: str,
    ) -> DocumentPreview:
        """Generate preview for PowerPoint document.

        Args:
            document_data: Raw document bytes.
            asset_id: Asset ID for path generation.

        Returns:
            DocumentPreview with PowerPoint preview information.
        """
        # Placeholder for PowerPoint preview generation
        preview_path = f"previews/{asset_id}_preview.jpg"
        return DocumentPreview(
            path=preview_path,
            content_type="image/jpeg",
            width=640,
            height=480,
        )

    async def _generate_text_preview(
        self,
        document_data: bytes,
        asset_id: str,
    ) -> DocumentPreview:
        """Generate preview for text document.

        Args:
            document_data: Raw document bytes.
            asset_id: Asset ID for path generation.

        Returns:
            DocumentPreview with text preview information.
        """
        text = document_data.decode("utf-8", errors="ignore")
        preview_path = f"previews/{asset_id}_preview.txt"
        return DocumentPreview(
            path=preview_path,
            content_type="text/plain",
        )

    async def process_document(
        self,
        asset: Asset,
    ) -> dict[str, Any]:
        """Process a document asset through the complete pipeline.

        Args:
            asset: Asset to process.

        Returns:
            Processing result with metadata and preview.

        Raises:
            DocumentProcessingError: If processing fails.
        """
        if not self.settings.DOCUMENT_PROCESSING_ENABLED:
            return {"status": "skipped", "reason": "Document processing disabled"}

        # Download document
        document_data = await self.storage.download(asset.storage_path)

        # Extract metadata
        metadata = await self.extract_metadata(document_data, asset.filename)

        # Generate preview
        preview = await self.generate_preview(
            document_data,
            asset.filename,
            str(asset.id),
        )

        return {
            "status": "completed",
            "metadata": {
                "page_count": metadata.page_count,
                "word_count": metadata.word_count,
                "sheet_count": metadata.sheet_count,
                "slide_count": metadata.slide_count,
                "author": metadata.author,
                "title": metadata.title,
                "subject": metadata.subject,
                "keywords": metadata.keywords,
                "text_preview": metadata.text_preview,
            },
            "preview": {
                "path": preview.path,
                "content_type": preview.content_type,
            },
        }

    async def get_ocr_text(
        self,
        document_data: bytes,
        filename: str,
    ) -> str:
        """Extract text using OCR (hook for future implementation).

        Args:
            document_data: Raw document bytes.
            filename: Document filename.

        Returns:
            Extracted text from OCR.

        Raises:
            OCROptionNotAvailableError: If OCR is not available.
        """
        if not self.settings.DOCUMENT_OCR_ENABLED:
            raise OCROptionNotAvailableError()

        # Placeholder for OCR integration
        # Future: Azure Document Intelligence, Amazon Textract, Google Vision, Tesseract
        return ""

    async def create_version(
        self,
        asset: Asset,
        change_description: str | None = None,
    ) -> DocumentVersion:
        """Create a new document version.

        Args:
            asset: Asset to version.
            change_description: Description of changes.

        Returns:
            DocumentVersion with version information.
        """
        # Get current version number
        current_version = getattr(asset, "document_version", 0)
        new_version = current_version + 1

        return DocumentVersion(
            version_number=new_version,
            storage_path=asset.storage_path,
            created_at=datetime.now(),
            created_by=str(asset.created_by),
            change_description=change_description,
        )

    async def get_versions(
        self,
        asset_id: str,
    ) -> list[DocumentVersion]:
        """Get all versions for a document.

        Args:
            asset_id: Asset ID.

        Returns:
            List of DocumentVersion objects.
        """
        # Placeholder - would query version history from database
        return []

    async def restore_version(
        self,
        asset: Asset,
        version_number: int,
    ) -> Asset:
        """Restore a document to a previous version.

        Args:
            asset: Asset to restore.
            version_number: Version number to restore.

        Returns:
            Updated Asset with restored version.

        Raises:
            VersionConflictError: If version not found.
        """
        versions = await self.get_versions(str(asset.id))
        version = next(
            (v for v in versions if v.version_number == version_number),
            None,
        )

        if not version:
            raise VersionConflictError(f"Version {version_number} not found")

        # In production, this would restore the document from storage
        return asset