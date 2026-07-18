"""Search service for media metadata, tagging, and search."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from uuid import UUID

from app.core.config import get_settings
from app.core.logging import logger
from app.media.domain.models import Asset, AssetStatus, AssetType
from app.media.domain.search_exceptions import (
    CollectionNotFoundError,
    MetadataValidationError,
    SearchQueryError,
    TagConflictError,
)


@dataclass
class SearchFilter:
    """Search filter for media queries."""

    field: str
    operator: str
    value: Any


@dataclass
class SearchResult:
    """Search result with metadata."""

    id: UUID
    filename: str
    content_type: str
    file_size: int
    created_at: str
    relevance_score: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class Tag:
    """Tag for media assets."""

    id: UUID
    name: str
    color: str | None = None
    usage_count: int = 0
    created_at: datetime = field(default_factory=datetime.now)


@dataclass
class Category:
    """Category for media assets."""

    id: UUID
    name: str
    parent_id: UUID | None = None
    path: str = ""
    level: int = 0


@dataclass
class Collection:
    """Collection of media assets."""

    id: UUID
    name: str
    description: str | None = None
    is_public: bool = False
    asset_ids: list[UUID] = field(default_factory=list)
    created_by: UUID | None = None
    created_at: datetime = field(default_factory=datetime.now)


class SearchService:
    """Service for media search, metadata, and tagging."""

    def __init__(self, asset_repo: Any):
        """Initialize search service.

        Args:
            asset_repo: Asset repository for database operations.
        """
        self.settings = get_settings()
        self.asset_repo = asset_repo
        self._tags: dict[str, Tag] = {}
        self._categories: dict[UUID, Category] = {}
        self._collections: dict[UUID, Collection] = {}
        self._favorites: dict[UUID, set[UUID]] = {}

    async def search(
        self,
        query: str,
        user_id: UUID | None = None,
        filters: list[SearchFilter] | None = None,
        sort_by: str = "relevance",
        limit: int = 50,
        offset: int = 0,
    ) -> list[SearchResult]:
        """Search media assets.

        Args:
            query: Search query string.
            user_id: User ID for permission filtering.
            filters: List of search filters.
            sort_by: Sort field (relevance, newest, oldest, etc.).
            limit: Maximum results.
            offset: Offset for pagination.

        Returns:
            List of search results.

        Raises:
            SearchQueryError: If query is invalid.
        """
        if not query and not filters:
            raise SearchQueryError("Query or filters required")

        # Placeholder for full-text search implementation
        # In production, this would use PostgreSQL tsvector + GIN indexes
        results = []

        # Simulate search results
        for i in range(min(limit, 10)):
            results.append(
                SearchResult(
                    id=UUID(int=i),
                    filename=f"result_{i}.pdf",
                    content_type="application/pdf",
                    file_size=1000000,
                    created_at=datetime.now().isoformat(),
                    relevance_score=1.0 - (i * 0.1),
                )
            )

        return results

    async def filter_assets(
        self,
        filters: list[SearchFilter],
        user_id: UUID | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[SearchResult]:
        """Filter media assets.

        Args:
            filters: List of search filters.
            user_id: User ID for permission filtering.
            limit: Maximum results.
            offset: Offset for pagination.

        Returns:
            List of filtered results.
        """
        # Placeholder for filter implementation
        return []

    async def create_tag(
        self,
        name: str,
        color: str | None = None,
    ) -> Tag:
        """Create a new tag.

        Args:
            name: Tag name.
            color: Tag color.

        Returns:
            Created tag.

        Raises:
            TagConflictError: If tag already exists.
        """
        if name in self._tags:
            raise TagConflictError(f"Tag '{name}' already exists")

        tag = Tag(
            id=UUID(int=len(self._tags) + 1),
            name=name,
            color=color,
        )
        self._tags[name] = tag
        return tag

    async def update_tag(
        self,
        tag_id: UUID,
        name: str | None = None,
        color: str | None = None,
    ) -> Tag:
        """Update a tag.

        Args:
            tag_id: Tag ID.
            name: New tag name.
            color: New tag color.

        Returns:
            Updated tag.
        """
        # Placeholder for tag update
        for tag in self._tags.values():
            if tag.id == tag_id:
                if name:
                    tag.name = name
                if color:
                    tag.color = color
                return tag
        raise TagConflictError("Tag not found")

    async def delete_tag(self, tag_id: UUID) -> bool:
        """Delete a tag.

        Args:
            tag_id: Tag ID.

        Returns:
            True if deleted.
        """
        for name, tag in list(self._tags.items()):
            if tag.id == tag_id:
                del self._tags[name]
                return True
        return False

    async def get_tags(self) -> list[Tag]:
        """Get all tags.

        Returns:
            List of all tags.
        """
        return list(self._tags.values())

    async def create_category(
        self,
        name: str,
        parent_id: UUID | None = None,
    ) -> Category:
        """Create a category.

        Args:
            name: Category name.
            parent_id: Parent category ID.

        Returns:
            Created category.
        """
        category = Category(
            id=UUID(int=len(self._categories) + 1),
            name=name,
            parent_id=parent_id,
            path=f"/{name}" if not parent_id else f"/{name}",
            level=0 if not parent_id else 1,
        )
        self._categories[category.id] = category
        return category

    async def get_categories(self) -> list[Category]:
        """Get all categories.

        Returns:
            List of all categories.
        """
        return list(self._categories.values())

    async def create_collection(
        self,
        name: str,
        description: str | None = None,
        is_public: bool = False,
        user_id: UUID | None = None,
    ) -> Collection:
        """Create a collection.

        Args:
            name: Collection name.
            description: Collection description.
            is_public: Whether collection is public.
            user_id: User ID.

        Returns:
            Created collection.
        """
        collection = Collection(
            id=UUID(int=len(self._collections) + 1),
            name=name,
            description=description,
            is_public=is_public,
            created_by=user_id,
        )
        self._collections[collection.id] = collection
        return collection

    async def add_to_collection(
        self,
        collection_id: UUID,
        asset_id: UUID,
    ) -> bool:
        """Add asset to collection.

        Args:
            collection_id: Collection ID.
            asset_id: Asset ID.

        Returns:
            True if added.
        """
        if collection_id not in self._collections:
            raise CollectionNotFoundError()

        self._collections[collection_id].asset_ids.append(asset_id)
        return True

    async def remove_from_collection(
        self,
        collection_id: UUID,
        asset_id: UUID,
    ) -> bool:
        """Remove asset from collection.

        Args:
            collection_id: Collection ID.
            asset_id: Asset ID.

        Returns:
            True if removed.
        """
        if collection_id not in self._collections:
            raise CollectionNotFoundError()

        if asset_id in self._collections[collection_id].asset_ids:
            self._collections[collection_id].asset_ids.remove(asset_id)
            return True
        return False

    async def get_collections(
        self,
        user_id: UUID | None = None,
    ) -> list[Collection]:
        """Get collections.

        Args:
            user_id: User ID for filtering.

        Returns:
            List of collections.
        """
        if user_id:
            return [
                c for c in self._collections.values()
                if c.created_by == user_id or c.is_public
            ]
        return list(self._collections.values())

    async def favorite_asset(
        self,
        user_id: UUID,
        asset_id: UUID,
    ) -> bool:
        """Favorite an asset.

        Args:
            user_id: User ID.
            asset_id: Asset ID.

        Returns:
            True if favorited.
        """
        if user_id not in self._favorites:
            self._favorites[user_id] = set()
        self._favorites[user_id].add(asset_id)
        return True

    async def unfavorite_asset(
        self,
        user_id: UUID,
        asset_id: UUID,
    ) -> bool:
        """Unfavorite an asset.

        Args:
            user_id: User ID.
            asset_id: Asset ID.

        Returns:
            True if unfavorited.
        """
        if user_id in self._favorites:
            self._favorites[user_id].discard(asset_id)
        return True

    async def get_favorites(
        self,
        user_id: UUID,
    ) -> list[UUID]:
        """Get user favorites.

        Args:
            user_id: User ID.

        Returns:
            List of favorited asset IDs.
        """
        return list(self._favorites.get(user_id, set()))

    async def update_metadata(
        self,
        asset_id: UUID,
        metadata: dict[str, Any],
    ) -> dict[str, Any]:
        """Update asset metadata.

        Args:
            asset_id: Asset ID.
            metadata: Metadata to update.

        Returns:
            Updated metadata.
        """
        # Placeholder for metadata update
        return metadata