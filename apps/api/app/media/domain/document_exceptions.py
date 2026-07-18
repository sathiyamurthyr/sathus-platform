"""Document processing domain exceptions."""

from app.core.exceptions import BaseAppException


class DocumentProcessingError(BaseAppException):
    """Base exception for document processing errors."""

    pass


class UnsupportedDocumentTypeError(DocumentProcessingError):
    """Raised when a document type is not supported."""

    def __init__(self, document_type: str):
        super().__init__(f"Unsupported document type: {document_type}")


class DocumentMetadataExtractionError(DocumentProcessingError):
    """Raised when document metadata extraction fails."""

    def __init__(self, message: str = "Failed to extract document metadata"):
        super().__init__(message)


class PreviewGenerationError(DocumentProcessingError):
    """Raised when document preview generation fails."""

    def __init__(self, message: str = "Failed to generate document preview"):
        super().__init__(message)


class VersionConflictError(DocumentProcessingError):
    """Raised when there is a version conflict."""

    def __init__(self, message: str = "Document version conflict"):
        super().__init__(message)


class DocumentTooLargeError(DocumentProcessingError):
    """Raised when document exceeds maximum size for preview."""

    def __init__(self, size: int, max_size: int):
        super().__init__(
            f"Document size ({size}MB) exceeds maximum for preview ({max_size}MB)"
        )


class OCROptionNotAvailableError(DocumentProcessingError):
    """Raised when OCR is not available or configured."""

    def __init__(self, message: str = "OCR processing is not available"):
        super().__init__(message)