"""Search module tests."""

import pytest
from datetime import datetime
from uuid import UUID, uuid4

from app.search.domain.models import (
    SearchableType,
    SearchIndex,
    SearchQuery,
    SearchResult,
    SearchHistory,
    SavedSearch,
)


# Domain Model Tests
class TestSearchableType:
    """Test SearchableType enum."""

    def test_searchable_type_values(self):
        """Test searchable type enum values."""
        assert SearchableType.USER == "user"
        assert SearchableType.ROLE == "role"
        assert SearchableType.PERMISSION == "permission"
        assert SearchableType.CONTENT == "content"
        assert SearchableType.MEDIA == "media"
        assert SearchableType.NOTIFICATION == "notification"
        assert SearchableType.WORKFLOW == "workflow"


class TestSearchIndex:
    """Test SearchIndex model."""

    def test_create_search_index(self):
        """Test creating a search index."""
        index_id = uuid4()
        entity_id = uuid4()

        index = SearchIndex(
            id=index_id,
            entity_id=entity_id,
            entity_type=SearchableType.USER,
            title="Test User",
            content="This is test user content",
            created_at=datetime.utcnow(),
        )

        assert index.id == index_id
        assert index.entity_id == entity_id
        assert index.entity_type == SearchableType.USER
        assert index.title == "Test User"
        assert index.content == "This is test user content"
        assert index.metadata == {}

    def test_search_index_frozen(self):
        """Test that search index is frozen (immutable)."""
        index_id = uuid4()
        entity_id = uuid4()

        index = SearchIndex(
            id=index_id,
            entity_id=entity_id,
            entity_type=SearchableType.USER,
            title="Test User",
            content="This is test user content",
            created_at=datetime.utcnow(),
        )

        with pytest.raises(Exception):
            index.title = "Modified Title"


class TestSearchQuery:
    """Test SearchQuery value object."""

    def test_create_search_query(self):
        """Test creating a search query."""
        query = SearchQuery(
            query="test search",
            entity_types=[SearchableType.USER, SearchableType.CONTENT],
            limit=10,
            offset=0,
        )

        assert query.query == "test search"
        assert query.entity_types == [SearchableType.USER, SearchableType.CONTENT]
        assert query.limit == 10
        assert query.offset == 0

    def test_search_query_defaults(self):
        """Test search query default values."""
        query = SearchQuery(query="test")

        assert query.entity_types is None
        assert query.filters == {}
        assert query.limit == 20
        assert query.offset == 0


class TestSearchResult:
    """Test SearchResult value object."""

    def test_create_search_result(self):
        """Test creating a search result."""
        result_id = uuid4()
        entity_id = uuid4()

        result = SearchResult(
            id=result_id,
            entity_id=entity_id,
            entity_type=SearchableType.USER,
            title="Test User",
            content="This is test user content",
            score=0.95,
        )

        assert result.id == result_id
        assert result.entity_id == entity_id
        assert result.entity_type == SearchableType.USER
        assert result.title == "Test User"
        assert result.score == 0.95


class TestSearchHistory:
    """Test SearchHistory value object."""

    def test_create_search_history(self):
        """Test creating a search history entry."""
        history_id = uuid4()
        user_id = uuid4()

        history = SearchHistory(
            id=history_id,
            user_id=user_id,
            query="test search",
            results_count=5,
            created_at=datetime.utcnow(),
        )

        assert history.id == history_id
        assert history.user_id == user_id
        assert history.query == "test search"
        assert history.results_count == 5


class TestSavedSearch:
    """Test SavedSearch value object."""

    def test_create_saved_search(self):
        """Test creating a saved search."""
        saved_id = uuid4()
        user_id = uuid4()

        saved = SavedSearch(
            id=saved_id,
            user_id=user_id,
            name="My Saved Search",
            query="important documents",
            created_at=datetime.utcnow(),
        )

        assert saved.id == saved_id
        assert saved.user_id == user_id
        assert saved.name == "My Saved Search"
        assert saved.query == "important documents"
        assert saved.filters == {}