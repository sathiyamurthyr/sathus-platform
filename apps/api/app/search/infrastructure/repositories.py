"""Search repositories."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.search.infrastructure.models import (
    SearchIndex,
    SearchHistory,
    SavedSearch,
    SearchableType,
)


class SearchIndexRepository:
    """Search index repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        entity_id: UUID,
        entity_type: SearchableType,
        title: str,
        content: str,
        metadata: dict | None = None,
        tenant_id: UUID | None = None,
    ) -> SearchIndex:
        """Create a search index entry."""
        index = SearchIndex(
            entity_id=entity_id,
            entity_type=entity_type,
            title=title,
            content=content,
            search_metadata=metadata,
            tenant_id=tenant_id,
        )
        self.session.add(index)
        await self.session.flush()
        return index

    async def get_by_id(self, index_id: UUID) -> SearchIndex | None:
        """Get search index by ID."""
        result = await self.session.execute(
            select(SearchIndex).where(SearchIndex.id == index_id)
        )
        return result.scalar_one_or_none()

    async def get_by_entity(
        self,
        entity_id: UUID,
        entity_type: SearchableType,
    ) -> SearchIndex | None:
        """Get search index by entity."""
        result = await self.session.execute(
            select(SearchIndex).where(
                SearchIndex.entity_id == entity_id,
                SearchIndex.entity_type == entity_type,
            )
        )
        return result.scalar_one_or_none()

    async def search(
        self,
        query: str,
        entity_types: list[SearchableType] | None = None,
        tenant_id: UUID | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[SearchIndex]:
        """Search using PostgreSQL full-text search."""
        search_query = select(SearchIndex)

        # Build search conditions
        if query:
            search_query = search_query.where(
                SearchIndex.content.ilike(f"%{query}%")
            )

        if entity_types:
            search_query = search_query.where(SearchIndex.entity_type.in_(entity_types))

        if tenant_id:
            search_query = search_query.where(SearchIndex.tenant_id == tenant_id)

        search_query = (
            search_query
            .order_by(SearchIndex.created_at.desc())
            .limit(limit)
            .offset(offset)
        )

        result = await self.session.execute(search_query)
        return list(result.scalars().all())

    async def update(
        self,
        index: SearchIndex,
        title: str | None = None,
        content: str | None = None,
        metadata: dict | None = None,
    ) -> None:
        """Update search index entry."""
        if title is not None:
            index.title = title
        if content is not None:
            index.content = content
        if metadata is not None:
            index.search_metadata = metadata
        await self.session.flush()

    async def delete(self, index: SearchIndex) -> None:
        """Delete search index entry."""
        await self.session.delete(index)
        await self.session.flush()

    async def delete_by_entity(
        self,
        entity_id: UUID,
        entity_type: SearchableType,
    ) -> None:
        """Delete search index by entity."""
        result = await self.session.execute(
            select(SearchIndex).where(
                SearchIndex.entity_id == entity_id,
                SearchIndex.entity_type == entity_type,
            )
        )
        index = result.scalar_one_or_none()
        if index:
            await self.session.delete(index)
            await self.session.flush()


class SearchHistoryRepository:
    """Search history repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        user_id: UUID,
        query: str,
        entity_types: list[SearchableType] | None = None,
        results_count: int = 0,
    ) -> SearchHistory:
        """Create a search history entry."""
        history = SearchHistory(
            user_id=user_id,
            query=query,
            entity_types=entity_types,
            results_count=results_count,
        )
        self.session.add(history)
        await self.session.flush()
        return history

    async def get_recent(
        self,
        user_id: UUID,
        limit: int = 10,
    ) -> list[SearchHistory]:
        """Get recent searches for a user."""
        result = await self.session.execute(
            select(SearchHistory)
            .where(SearchHistory.user_id == user_id)
            .order_by(SearchHistory.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_popular(
        self,
        limit: int = 10,
    ) -> list[tuple[str, int]]:
        """Get popular searches across all users."""
        result = await self.session.execute(
            select(
                SearchHistory.query,
                func.count(SearchHistory.id).label("count"),
            )
            .group_by(SearchHistory.query)
            .order_by(func.count(SearchHistory.id).desc())
            .limit(limit)
        )
        return [(row.query, row.count) for row in result.all()]


class SavedSearchRepository:
    """Saved search repository."""

    def __init__(self, session: AsyncSession):
        """Initialize repository."""
        self.session = session

    async def create(
        self,
        user_id: UUID,
        name: str,
        query: str,
        entity_types: list[SearchableType] | None = None,
        filters: dict | None = None,
    ) -> SavedSearch:
        """Create a saved search."""
        saved = SavedSearch(
            user_id=user_id,
            name=name,
            query=query,
            entity_types=entity_types,
            filters=filters,
        )
        self.session.add(saved)
        await self.session.flush()
        return saved

    async def get_by_id(self, saved_id: UUID) -> SavedSearch | None:
        """Get saved search by ID."""
        result = await self.session.execute(
            select(SavedSearch).where(SavedSearch.id == saved_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user(
        self,
        user_id: UUID,
        limit: int = 50,
    ) -> list[SavedSearch]:
        """Get saved searches for a user."""
        result = await self.session.execute(
            select(SavedSearch)
            .where(SavedSearch.user_id == user_id)
            .order_by(SavedSearch.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def update(
        self,
        saved: SavedSearch,
        name: str | None = None,
        query: str | None = None,
        entity_types: list[SearchableType] | None = None,
        filters: dict | None = None,
    ) -> None:
        """Update saved search."""
        if name is not None:
            saved.name = name
        if query is not None:
            saved.query = query
        if entity_types is not None:
            saved.entity_types = entity_types
        if filters is not None:
            saved.filters = filters
        await self.session.flush()

    async def delete(self, saved: SavedSearch) -> None:
        """Delete saved search."""
        await self.session.delete(saved)
        await self.session.flush()