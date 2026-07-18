"""Tests for search service."""

import pytest
from datetime import datetime
from unittest.mock import MagicMock
from uuid import UUID, uuid4

from app.media.application.search_service import (
    SearchService,
    SearchFilter,
    SearchResult,
    Tag,
    Category,
    Collection,
)
from app.media.domain.search_exceptions import (
    CollectionNotFoundError,
    InvalidCategoryError,
    MetadataValidationError,
    SearchQueryError,
    TagConflictError,
)


class TestSearchFilter:
    """Tests for SearchFilter model."""

    def test_search_filter_creation(self):
        """Test creating search filter."""
        filter = SearchFilter(field="filename", operator="eq", value="test.pdf")
        assert filter.field == "filename"
        assert filter.operator == "eq"
        assert filter.value == "test.pdf"


class TestSearchResult:
    """Tests for SearchResult model."""

    def test_search_result_creation(self):
        """Test creating search result."""
        result = SearchResult(
            id=uuid4(),
            filename="test.pdf",
            content_type="application/pdf",
            file_size=1000000,
            created_at=datetime.now().isoformat(),
            relevance_score=0.95,
        )
        assert result.filename == "test.pdf"
        assert result.relevance_score == 0.95


class TestTag:
    """Tests for Tag model."""

    def test_tag_creation(self):
        """Test creating tag."""
        tag = Tag(
            id=uuid4(),
            name="important",
            color="#ff0000",
        )
        assert tag.name == "important"
        assert tag.color == "#ff0000"
        assert tag.usage_count == 0


class TestCategory:
    """Tests for Category model."""

    def test_category_creation(self):
        """Test creating category."""
        category = Category(
            id=uuid4(),
            name="Marketing",
            path="/Marketing",
            level=0,
        )
        assert category.name == "Marketing"
        assert category.level == 0


class TestCollection:
    """Tests for Collection model."""

    def test_collection_creation(self):
        """Test creating collection."""
        collection = Collection(
            id=uuid4(),
            name="Project Assets",
            is_public=True,
        )
        assert collection.name == "Project Assets"
        assert collection.is_public is True


class TestSearchService:
    """Tests for SearchService."""

    @pytest.fixture
    def mock_asset_repo(self):
        """Create mock asset repository."""
        return MagicMock()

    @pytest.fixture
    def search_service(self, mock_asset_repo):
        """Create search service instance."""
        return SearchService(asset_repo=mock_asset_repo)

    @pytest.mark.asyncio
    async def test_search_with_query(self, search_service):
        """Test search with query."""
        results = await search_service.search(query="test")
        assert len(results) > 0
        assert all(isinstance(r, SearchResult) for r in results)

    @pytest.mark.asyncio
    async def test_search_without_query_or_filters(self, search_service):
        """Test search without query or filters raises error."""
        with pytest.raises(SearchQueryError):
            await search_service.search(query="")

    @pytest.mark.asyncio
    async def test_filter_assets(self, search_service):
        """Test filter assets."""
        filters = [
            SearchFilter(field="content_type", operator="eq", value="application/pdf"),
        ]
        results = await search_service.filter_assets(filters=filters)
        assert isinstance(results, list)

    @pytest.mark.asyncio
    async def test_create_tag(self, search_service):
        """Test creating a tag."""
        tag = await search_service.create_tag(name="important", color="#ff0000")
        assert tag.name == "important"
        assert tag.color == "#ff0000"

    @pytest.mark.asyncio
    async def test_create_tag_duplicate(self, search_service):
        """Test creating duplicate tag raises error."""
        await search_service.create_tag(name="important")
        with pytest.raises(TagConflictError):
            await search_service.create_tag(name="important")

    @pytest.mark.asyncio
    async def test_update_tag(self, search_service):
        """Test updating a tag."""
        tag = await search_service.create_tag(name="important")
        updated = await search_service.update_tag(tag.id, name="critical")
        assert updated.name == "critical"

    @pytest.mark.asyncio
    async def test_delete_tag(self, search_service):
        """Test deleting a tag."""
        tag = await search_service.create_tag(name="important")
        result = await search_service.delete_tag(tag.id)
        assert result is True

    @pytest.mark.asyncio
    async def test_get_tags(self, search_service):
        """Test getting all tags."""
        await search_service.create_tag(name="tag1")
        await search_service.create_tag(name="tag2")
        tags = await search_service.get_tags()
        assert len(tags) == 2

    @pytest.mark.asyncio
    async def test_create_category(self, search_service):
        """Test creating a category."""
        category = await search_service.create_category(name="Marketing")
        assert category.name == "Marketing"
        assert category.level == 0

    @pytest.mark.asyncio
    async def test_get_categories(self, search_service):
        """Test getting all categories."""
        await search_service.create_category(name="Marketing")
        categories = await search_service.get_categories()
        assert len(categories) == 1

    @pytest.mark.asyncio
    async def test_create_collection(self, search_service):
        """Test creating a collection."""
        collection = await search_service.create_collection(
            name="Project Assets",
            user_id=uuid4(),
        )
        assert collection.name == "Project Assets"

    @pytest.mark.asyncio
    async def test_add_to_collection(self, search_service):
        """Test adding asset to collection."""
        collection = await search_service.create_collection(name="Project Assets")
        result = await search_service.add_to_collection(
            collection.id,
            uuid4(),
        )
        assert result is True

    @pytest.mark.asyncio
    async def test_add_to_collection_not_found(self, search_service):
        """Test adding to non-existent collection raises error."""
        with pytest.raises(CollectionNotFoundError):
            await search_service.add_to_collection(uuid4(), uuid4())

    @pytest.mark.asyncio
    async def test_favorite_asset(self, search_service):
        """Test favoriting an asset."""
        result = await search_service.favorite_asset(uuid4(), uuid4())
        assert result is True

    @pytest.mark.asyncio
    async def test_unfavorite_asset(self, search_service):
        """Test unfavoriting an asset."""
        user_id = uuid4()
        asset_id = uuid4()
        await search_service.favorite_asset(user_id, asset_id)
        result = await search_service.unfavorite_asset(user_id, asset_id)
        assert result is True

    @pytest.mark.asyncio
    async def test_get_favorites(self, search_service):
        """Test getting user favorites."""
        user_id = uuid4()
        asset_id = uuid4()
        await search_service.favorite_asset(user_id, asset_id)
        favorites = await search_service.get_favorites(user_id)
        assert len(favorites) == 1


class TestSearchExceptions:
    """Tests for search exceptions."""

    def test_metadata_validation_error(self):
        """Test MetadataValidationError message."""
        error = MetadataValidationError("Test error")
        assert "Test error" in str(error)

    def test_search_query_error(self):
        """Test SearchQueryError message."""
        error = SearchQueryError("Test error")
        assert "Test error" in str(error)

    def test_invalid_category_error(self):
        """Test InvalidCategoryError message."""
        error = InvalidCategoryError()
        assert "Invalid" in str(error)

    def test_tag_conflict_error(self):
        """Test TagConflictError message."""
        error = TagConflictError("Test error")
        assert "Test error" in str(error)

    def test_collection_not_found_error(self):
        """Test CollectionNotFoundError message."""
        error = CollectionNotFoundError()
        assert "not found" in str(error).lower()