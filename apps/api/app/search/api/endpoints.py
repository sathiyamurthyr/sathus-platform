"""Search API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

from app.core.database import get_db
from app.search.api.schemas import (
    SearchRequest,
    SearchResponse,
    SearchResultResponse,
    IndexEntityRequest,
    SaveSearchRequest,
    SavedSearchResponse,
    SearchHistoryResponse,
    PopularSearchResponse,
)
from app.search.application.services import (
    SearchService,
    SearchHistoryService,
    SavedSearchService,
)
from app.search.infrastructure.models import SearchableType
from app.search.infrastructure.repositories import (
    SearchIndexRepository,
    SearchHistoryRepository,
    SavedSearchRepository,
)

router = APIRouter()
security = HTTPBearer()


async def get_current_user(token: str = Depends(security)) -> dict:
    """Get current user from token."""
    return {"sub": "test-user-id"}


def get_search_service(db=Depends(get_db)) -> SearchService:
    """Get search service."""
    return SearchService(
        index_repo=SearchIndexRepository(db),
        history_repo=SearchHistoryRepository(db),
    )


def get_search_history_service(db=Depends(get_db)) -> SearchHistoryService:
    """Get search history service."""
    return SearchHistoryService(
        history_repo=SearchHistoryRepository(db),
    )


def get_saved_search_service(db=Depends(get_db)) -> SavedSearchService:
    """Get saved search service."""
    return SavedSearchService(
        saved_repo=SavedSearchRepository(db),
    )


# Search endpoints
@router.post("/search", response_model=SearchResponse)
async def search(
    request: SearchRequest,
    user=Depends(get_current_user),
    service: SearchService = Depends(get_search_service),
) -> SearchResponse:
    """Perform a search."""
    entity_types = None
    if request.entity_types:
        try:
            entity_types = [SearchableType(t) for t in request.entity_types]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid entity type")

    results = await service.search(
        query=request.query,
        user_id=UUID(user["sub"]),
        entity_types=entity_types,
        limit=request.limit,
        offset=request.offset,
    )

    return SearchResponse(
        results=[
            SearchResultResponse(
                id=r.id,
                entity_id=r.entity_id,
                entity_type=r.entity_type.value,
                title=r.title,
                content=r.content,
                score=r.score,
                metadata=r.metadata,
                url=r.url,
            )
            for r in results
        ],
        total=len(results),
        limit=request.limit,
        offset=request.offset,
    )


@router.post("/index", status_code=201)
async def index_entity(
    request: IndexEntityRequest,
    service: SearchService = Depends(get_search_service),
) -> dict:
    """Index an entity for search."""
    try:
        entity_type = SearchableType(request.entity_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid entity type")

    await service.index_entity(
        entity_id=request.entity_id,
        entity_type=entity_type,
        title=request.title,
        content=request.content,
        metadata=request.metadata,
        tenant_id=request.tenant_id,
    )

    return {"success": True, "message": "Entity indexed"}


# Search history endpoints
@router.get("/history", response_model=list[SearchHistoryResponse])
async def get_search_history(
    user=Depends(get_current_user),
    service: SearchHistoryService = Depends(get_search_history_service),
) -> list[SearchHistoryResponse]:
    """Get recent search history for current user."""
    histories = await service.get_recent(UUID(user["sub"]))
    return [
        SearchHistoryResponse(
            id=h.id,
            user_id=h.user_id,
            query=h.query,
            entity_types=h.entity_types,
            results_count=h.results_count,
            created_at=h.created_at,
        )
        for h in histories
    ]


@router.get("/popular", response_model=list[PopularSearchResponse])
async def get_popular_searches(
    service: SearchHistoryService = Depends(get_search_history_service),
) -> list[PopularSearchResponse]:
    """Get popular searches."""
    popular = await service.get_popular()
    return [
        PopularSearchResponse(query=p[0], count=p[1])
        for p in popular
    ]


# Saved search endpoints
@router.post("/saved", response_model=SavedSearchResponse, status_code=201)
async def save_search(
    request: SaveSearchRequest,
    user=Depends(get_current_user),
    service: SavedSearchService = Depends(get_saved_search_service),
) -> SavedSearchResponse:
    """Save a search query."""
    entity_types = None
    if request.entity_types:
        try:
            entity_types = [SearchableType(t) for t in request.entity_types]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid entity type")

    saved = await service.create_saved_search(
        user_id=UUID(user["sub"]),
        name=request.name,
        query=request.query,
        entity_types=entity_types,
        filters=request.filters,
    )

    return SavedSearchResponse(
        id=saved.id,
        user_id=saved.user_id,
        name=saved.name,
        query=saved.query,
        entity_types=saved.entity_types,
        filters=saved.filters,
        created_at=saved.created_at,
        updated_at=saved.updated_at,
    )


@router.get("/saved", response_model=list[SavedSearchResponse])
async def get_saved_searches(
    user=Depends(get_current_user),
    service: SavedSearchService = Depends(get_saved_search_service),
) -> list[SavedSearchResponse]:
    """Get saved searches for current user."""
    saved_searches = await service.get_saved_searches(UUID(user["sub"]))
    return [
        SavedSearchResponse(
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