"""Search and metadata domain exceptions."""

from app.core.exceptions import BaseAppException


class SearchError(BaseAppException):
    """Base exception for search errors."""

    pass


class MetadataValidationError(SearchError):
    """Raised when metadata validation fails."""

    def __init__(self, message: str = "Invalid metadata"):
        super().__init__(message)


class SearchQueryError(SearchError):
    """Raised when search query is invalid."""

    def __init__(self, message: str = "Invalid search query"):
        super().__init__(message)


class InvalidCategoryError(SearchError):
    """Raised when category is invalid."""

    def __init__(self, message: str = "Invalid category"):
        super().__init__(message)


class TagConflictError(SearchError):
    """Raised when tag conflict occurs."""

    def __init__(self, message: str = "Tag conflict"):
        super().__init__(message)


class CollectionNotFoundError(SearchError):
    """Raised when collection is not found."""

    def __init__(self, message: str = "Collection not found"):
        super().__init__(message)