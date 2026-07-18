"""Search domain module."""

from app.search.domain.models import (
    SearchableType,
    SearchIndex,
    SearchQuery,
    SearchResult,
    SearchHistory,
    SavedSearch,
)

__all__ = [
    "SearchableType",
    "SearchIndex",
    "SearchQuery",
    "SearchResult",
    "SearchHistory",
    "SavedSearch",
]