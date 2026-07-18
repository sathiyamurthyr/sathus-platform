"""Search application services."""

from datetime import datetime
from uuid import UUID

from app.core.logging import logger
from app.search.domain.models import (
    SearchIndex,
    SearchQuery,
    SearchResult,
    SearchHistory,
    SavedSearch,
    SearchableType,
)
from app.search.infrastructure.models import (
    SearchIndex as SearchIndexModel,
    SearchHistory as SearchHistoryModel,
    SavedSearch as SavedSearchModel,
)
from app.search.infrastructure.repositories import (
    SearchIndexRepository,
    SearchHistoryRepository,
    SavedSearchRepository,
)


class SearchService:
    """Search service."""

    def __init__(
        self,
        index_repo: SearchIndexRepository,
        history_repo: SearchHistoryRepository,
    ):
        """Initialize service."""
        self.index_repo = index_repo
        self.history_repo = history_repo

    async def index_entity(
        self,
        entity_id: UUID,
        entity_type: SearchableType,
        title: str,
        content: str,
        metadata: dict | None = None,
        tenant_id: UUID | None = None,
    ) -> SearchIndex:
        """Index an entity for search."""
        # Check if already indexed
        existing = await self.index_repo.get_by_entity(entity_id, entity_type)
        if existing:
            await self.index_repo.update(
                existing,
                title=title,
                content=content,
                metadata=metadata,
            )
            return SearchIndex(
                id=existing.id,
                entity_id=existing.entity_id,
                entity_type=entity_type,
                title=title,
                content=content,
                metadata=metadata,
                tenant_id=tenant_id,
                created_at=existing.created_at,
                updated_at=existing.updated_at,
            )

        index = await self.index_repo.create(
            entity_id=entity_id,
            entity_type=entity_type,
            title=title,
            content=content,
            metadata=metadata,
            tenant_id=tenant_id,
        )

        return SearchIndex(
            id=index.id,
            entity_id=index.entity_id,
            entity_type=entity_type,
            title=index.title,
            content=index.content,
            metadata=metadata,
            tenant_id=tenant_id,
            created_at=index.created_at,
            updated_at=index.updated_at,
        )

    async def search(
        self,
        query: str,
        user_id: UUID,
        entity_types: list[SearchableType] | None = None,
        tenant_id: UUID | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[SearchResult]:
        """Perform a search."""
        # Execute search
        indexes = await self.index_repo.search(
            query=query,
            entity_types=entity_types,
            tenant_id=tenant_id,
            limit=limit,
            offset=offset,
        )

        # Record search history
        await self.history_repo.create(
            user_id=user_id,
            query=query,
            entity_types=entity_types,
            results_count=len(indexes),
        )

        # Convert to search results
        results = [
            SearchResult(
                id=idx.id,
                entity_id=idx.entity_id,
                entity_type=idx.entity_type,
                title=idx.title,
                content=idx.content,
                score=1.0,  # Default score, can be enhanced with ranking
                metadata=idx.search_metadata,
            )
            for idx in indexes
        ]

        logger.info(
            f"Search performed: query='{query}', results={len(results)}, "
            f"user_id={user_id}"
        )

        return results

    async def remove_from_index(
        self,
        entity_id: UUID,
        entity_type: SearchableType,
    ) -> bool:
        """Remove an entity from the search index."""
        await self.index_repo.delete_by_entity(entity_id, entity_type)
        return True


class SearchHistoryService:
    """Search history service."""

    def __init__(self, history_repo: SearchHistoryRepository):
        """Initialize service."""
        self.history_repo = history_repo

    async def get_recent(
        self,
        user_id: UUID,
        limit: int = 10,
    ) -> list[SearchHistory]:
        """Get recent searches for a user."""
        histories = await self.history_repo.get_recent(user_id, limit)
        return [
            SearchHistory(
                id=h.id,
                user_id=h.user_id,
                query=h.query,
                entity_types=h.entity_types,
                results_count=h.results_count,
                created_at=h.created_at,
            )
            for h in histories
        ]

    async def get_popular(
        self,
        limit: int = 10,
    ) -> list[tuple[str, int]]:
        """Get popular searches."""
        return await self.history_repo.get_popular(limit)


class SavedSearchService:
    """Saved search service."""

    def __init__(self, saved_repo: SavedSearchRepository):
        """Initialize service."""
        self.saved_repo = saved_repo

    async def create_saved_search(
        self,
        user_id: UUID,
        name: str,
        query: str,
        entity_types: list[SearchableType] | None = None,
        filters: dict | None = None,
    ) -> SavedSearch:
        """Create a saved search."""
        saved = await self.saved_repo.create(
            user_id=user_id,
            name=name,
            query=query,
            entity_types=entity_types,
            filters=filters,
        )

        return SavedSearch(
            id=saved.id,
            user_id=saved.user_id,
            name=saved.name,
            query=saved.query,
            entity_types=saved.entity_types,
            filters=saved.filters,
            created_at=saved.created_at,
            updated_at=saved.updated_at,
        )

    async def get_saved_searches(
        self,
        user_id: UUID,
        limit: int = 50,
    ) -> list[SavedSearch]:
        """Get saved searches for a user."""
        saved_searches = await self.saved_repo.get_by_user(user_id, limit)
        return [
            SavedSearch(
                id=s.id,
                user_id=s.user_id,
                name=s.name,
                query=s.query,
                entity_types=s.entity_types,
                filters=s.filters,
                created_at=s.created_at,
                updated_at=s.updated_at,
            )
            for s in saved_searches
        ]

    async def delete_saved_search(
        self,
        saved_id: UUID,
    ) -> bool:
        """Delete a saved search."""
        saved = await self.saved_repo.get_by_id(saved_id)
        if not saved:
            return False
        await self.saved_repo.delete(saved)
        return True