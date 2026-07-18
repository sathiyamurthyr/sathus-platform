"""Content API endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.content.api.schemas import (
    CategoryResponse,
    ContentItemCreateRequest,
    ContentItemResponse,
    ContentItemUpdateRequest,
    ContentTypeResponse,
    ContentVersionResponse,
    SeoMetadataCreateRequest,
    SeoMetadataResponse,
    TagResponse,
)
from app.content.application.services import (
    CategoryService,
    ContentService,
    SeoService,
    SlugService,
    TagService,
    VersionService,
)
from app.content.infrastructure.repositories import (
    ContentCategoryRepository,
    ContentItemRepository,
    ContentTagRepository,
    ContentTypeRepository,
    ContentVersionRepository,
    SeoMetadataRepository,
)
from app.core.database import get_db

router = APIRouter()


def get_content_service(db=Depends(get_db)) -> ContentService:
    """Get content service."""
    return ContentService(
        content_item_repo=ContentItemRepository(db),
        content_type_repo=ContentTypeRepository(db),
        seo_repo=SeoMetadataRepository(db),
        version_repo=ContentVersionRepository(db),
    )


def get_slug_service(db=Depends(get_db)) -> SlugService:
    """Get slug service."""
    return SlugService(ContentItemRepository(db))


def get_seo_service(db=Depends(get_db)) -> SeoService:
    """Get SEO service."""
    return SeoService(SeoMetadataRepository(db))


def get_version_service(db=Depends(get_db)) -> VersionService:
    """Get version service."""
    return VersionService(ContentVersionRepository(db))


def get_category_service(db=Depends(get_db)) -> CategoryService:
    """Get category service."""
    return CategoryService(ContentCategoryRepository(db))


def get_tag_service(db=Depends(get_db)) -> TagService:
    """Get tag service."""
    return TagService(ContentTagRepository(db))


@router.get("/content", response_model=list[ContentItemResponse])
async def list_content(
    type_id: UUID | None = None,
    status: str | None = None,
    limit: int = 100,
    offset: int = 0,
    content_service: ContentService = Depends(get_content_service),
) -> list[dict]:
    """List content items."""
    return await content_service.list_content(
        type_id=type_id, status=status, limit=limit, offset=offset
    )


@router.post("/content", response_model=ContentItemResponse, status_code=201)
async def create_content(
    request: ContentItemCreateRequest,
    content_service: ContentService = Depends(get_content_service),
) -> dict:
    """Create a content item."""
    return await content_service.create_content(
        type_id=request.type_id,
        title=request.title,
        slug=request.slug,
        content=request.content,
    )


@router.get("/content/{item_id}", response_model=ContentItemResponse)
async def get_content(
    item_id: UUID,
    content_service: ContentService = Depends(get_content_service),
) -> dict:
    """Get content item by ID."""
    result = await content_service.get_content(item_id)
    if not result:
        raise HTTPException(status_code=404, detail="Content not found")
    return result


@router.patch("/content/{item_id}", response_model=ContentItemResponse)
async def update_content(
    item_id: UUID,
    request: ContentItemUpdateRequest,
    content_service: ContentService = Depends(get_content_service),
) -> dict:
    """Update a content item."""
    result = await content_service.update_content(
        item_id=item_id,
        title=request.title,
        slug=request.slug,
        content=request.content,
        status=request.status,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Content not found")
    return result


@router.get("/content/slug/{slug}", response_model=ContentItemResponse)
async def get_content_by_slug(
    slug: str,
    content_service: ContentService = Depends(get_content_service),
) -> dict:
    """Get content item by slug."""
    result = await content_service.get_content_by_slug(slug)
    if not result:
        raise HTTPException(status_code=404, detail="Content not found")
    return result


@router.get("/content/{item_id}/seo", response_model=SeoMetadataResponse)
async def get_seo(
    item_id: UUID,
    seo_service: SeoService = Depends(get_seo_service),
) -> dict:
    """Get SEO metadata for content item."""
    result = await seo_service.get_seo(item_id)
    if not result:
        raise HTTPException(status_code=404, detail="SEO metadata not found")
    return result


@router.post("/content/{item_id}/seo", response_model=SeoMetadataResponse, status_code=201)
async def create_seo(
    item_id: UUID,
    request: SeoMetadataCreateRequest,
    seo_service: SeoService = Depends(get_seo_service),
) -> dict:
    """Create SEO metadata for content item."""
    return await seo_service.create_seo(
        content_item_id=item_id,
        meta_title=request.meta_title,
        meta_description=request.meta_description,
        canonical=request.canonical,
        og_title=request.og_title,
        og_description=request.og_description,
        og_image=request.og_image,
        twitter_card=request.twitter_card,
        twitter_title=request.twitter_title,
        twitter_description=request.twitter_description,
        reading_time=request.reading_time,
        schema_type=request.schema_type,
        focus_keyword=request.focus_keyword,
    )


@router.get("/content-types", response_model=list[ContentTypeResponse])
async def list_content_types(
    db=Depends(get_db),
) -> list[dict]:
    """List content types."""
    repo = ContentTypeRepository(db)
    types = await repo.list()
    return [{"id": t.id, "name": t.name, "description": t.description} for t in types]


@router.get("/categories", response_model=list[CategoryResponse])
async def list_categories(
    category_service: CategoryService = Depends(get_category_service),
) -> list[dict]:
    """List categories."""
    return await category_service.list_categories()


@router.get("/tags", response_model=list[TagResponse])
async def list_tags(
    tag_service: TagService = Depends(get_tag_service),
) -> list[dict]:
    """List tags."""
    return await tag_service.list_tags()


@router.get("/content/{item_id}/versions", response_model=list[ContentVersionResponse])
async def get_content_versions(
    item_id: UUID,
    version_service: VersionService = Depends(get_version_service),
) -> list[dict]:
    """Get versions for content item."""
    return [await version_service.get_latest_version(item_id)] if await version_service.get_latest_version(item_id) else []