"""Content application services."""

from uuid import UUID

from app.content.infrastructure.repositories import (
    ContentItemRepository,
    ContentTypeRepository,
    SeoMetadataRepository,
    ContentVersionRepository,
    ContentCategoryRepository,
    ContentTagRepository,
)


class ContentService:
    """Content management service."""

    def __init__(
        self,
        content_item_repo: ContentItemRepository,
        content_type_repo: ContentTypeRepository,
        seo_repo: SeoMetadataRepository,
        version_repo: ContentVersionRepository,
    ):
        """Initialize service."""
        self._content_item_repo = content_item_repo
        self._content_type_repo = content_type_repo
        self._seo_repo = seo_repo
        self._version_repo = version_repo

    async def get_content(self, item_id: UUID) -> dict | None:
        """Get content item by ID."""
        item = await self._content_item_repo.get_by_id(item_id)
        if not item:
            return None
        return {
            "id": item.id,
            "type_id": item.type_id,
            "title": item.title,
            "slug": item.slug,
            "content": item.content,
            "status": item.status,
        }

    async def get_content_by_slug(self, slug: str) -> dict | None:
        """Get content item by slug."""
        item = await self._content_item_repo.get_by_slug(slug)
        if not item:
            return None
        return {
            "id": item.id,
            "type_id": item.type_id,
            "title": item.title,
            "slug": item.slug,
            "content": item.content,
            "status": item.status,
        }

    async def list_content(
        self,
        type_id: UUID | None = None,
        status: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[dict]:
        """List content items."""
        items = await self._content_item_repo.list(
            type_id=type_id, status=status, limit=limit, offset=offset
        )
        return [
            {
                "id": i.id,
                "type_id": i.type_id,
                "title": i.title,
                "slug": i.slug,
                "status": i.status,
            }
            for i in items
        ]

    async def create_content(
        self,
        type_id: UUID,
        title: str,
        slug: str,
        content: str | None = None,
    ) -> dict:
        """Create a content item."""
        item = await self._content_item_repo.create(
            type_id=type_id, title=title, slug=slug, content=content
        )
        return {
            "id": item.id,
            "type_id": item.type_id,
            "title": item.title,
            "slug": item.slug,
            "content": item.content,
            "status": item.status,
        }

    async def update_content(
        self,
        item_id: UUID,
        title: str | None = None,
        slug: str | None = None,
        content: str | None = None,
        status: str | None = None,
    ) -> dict | None:
        """Update a content item."""
        item = await self._content_item_repo.update(
            item_id=item_id, title=title, slug=slug, content=content, status=status
        )
        if not item:
            return None
        return {
            "id": item.id,
            "type_id": item.type_id,
            "title": item.title,
            "slug": item.slug,
            "content": item.content,
            "status": item.status,
        }


class SlugService:
    """Slug management service."""

    def __init__(self, content_item_repo: ContentItemRepository):
        """Initialize service."""
        self._content_item_repo = content_item_repo

    def generate_slug(self, title: str) -> str:
        """Generate a slug from title."""
        return title.lower().replace(" ", "-").replace("_", "-")

    async def is_slug_unique(self, slug: str, exclude_id: UUID | None = None) -> bool:
        """Check if slug is unique."""
        item = await self._content_item_repo.get_by_slug(slug)
        if not item:
            return True
        if exclude_id and item.id == exclude_id:
            return True
        return False


class SeoService:
    """SEO metadata service."""

    def __init__(self, seo_repo: SeoMetadataRepository):
        """Initialize service."""
        self._seo_repo = seo_repo

    async def get_seo(self, content_item_id: UUID) -> dict | None:
        """Get SEO metadata for content item."""
        seo = await self._seo_repo.get_by_content_item_id(content_item_id)
        if not seo:
            return None
        return {
            "id": seo.id,
            "content_item_id": seo.content_item_id,
            "meta_title": seo.meta_title,
            "meta_description": seo.meta_description,
            "canonical": seo.canonical,
            "og_title": seo.og_title,
            "og_description": seo.og_description,
            "og_image": seo.og_image,
            "twitter_card": seo.twitter_card,
            "twitter_title": seo.twitter_title,
            "twitter_description": seo.twitter_description,
            "reading_time": seo.reading_time,
            "schema_type": seo.schema_type,
            "focus_keyword": seo.focus_keyword,
        }

    async def create_seo(
        self,
        content_item_id: UUID,
        meta_title: str | None = None,
        meta_description: str | None = None,
        canonical: str | None = None,
        og_title: str | None = None,
        og_description: str | None = None,
        og_image: str | None = None,
        twitter_card: str | None = None,
        twitter_title: str | None = None,
        twitter_description: str | None = None,
        reading_time: int | None = None,
        schema_type: str | None = None,
        focus_keyword: str | None = None,
    ) -> dict:
        """Create SEO metadata."""
        seo = await self._seo_repo.create(
            content_item_id=content_item_id,
            meta_title=meta_title,
            meta_description=meta_description,
            canonical=canonical,
            og_title=og_title,
            og_description=og_description,
            og_image=og_image,
            twitter_card=twitter_card,
            twitter_title=twitter_title,
            twitter_description=twitter_description,
            reading_time=reading_time,
            schema_type=schema_type,
            focus_keyword=focus_keyword,
        )
        return {
            "id": seo.id,
            "content_item_id": seo.content_item_id,
            "meta_title": seo.meta_title,
            "meta_description": seo.meta_description,
            "canonical": seo.canonical,
        }


class VersionService:
    """Content version service."""

    def __init__(self, version_repo: ContentVersionRepository):
        """Initialize service."""
        self._version_repo = version_repo

    async def get_latest_version(self, content_item_id: UUID) -> dict | None:
        """Get latest version of content item."""
        version = await self._version_repo.get_latest_version(content_item_id)
        if not version:
            return None
        return {
            "id": version.id,
            "content_item_id": version.content_item_id,
            "version_number": version.version_number,
            "title": version.title,
            "slug": version.slug,
            "content": version.content,
            "status": version.status,
            "created_by": version.created_by,
            "created_at": version.created_at,
        }

    async def create_version(
        self,
        content_item_id: UUID,
        version_number: int,
        title: str,
        slug: str,
        content: str | None,
        status: str,
        created_by: UUID,
    ) -> dict:
        """Create a content version."""
        version = await self._version_repo.create(
            content_item_id=content_item_id,
            version_number=version_number,
            title=title,
            slug=slug,
            content=content,
            status=status,
            created_by=created_by,
        )
        return {
            "id": version.id,
            "content_item_id": version.content_item_id,
            "version_number": version.version_number,
            "title": version.title,
            "slug": version.slug,
            "content": version.content,
            "status": version.status,
        }


class CategoryService:
    """Content category service."""

    def __init__(self, category_repo: ContentCategoryRepository):
        """Initialize service."""
        self._category_repo = category_repo

    async def get_category(self, category_id: UUID) -> dict | None:
        """Get category by ID."""
        category = await self._category_repo.get_by_id(category_id)
        if not category:
            return None
        return {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
            "description": category.description,
        }

    async def list_categories(self) -> list[dict]:
        """List all categories."""
        categories = await self._category_repo.list()
        return [
            {
                "id": c.id,
                "name": c.name,
                "slug": c.slug,
                "description": c.description,
            }
            for c in categories
        ]


class TagService:
    """Content tag service."""

    def __init__(self, tag_repo: ContentTagRepository):
        """Initialize service."""
        self._tag_repo = tag_repo

    async def get_tag(self, tag_id: UUID) -> dict | None:
        """Get tag by ID."""
        tag = await self._tag_repo.get_by_id(tag_id)
        if not tag:
            return None
        return {
            "id": tag.id,
            "name": tag.name,
            "slug": tag.slug,
        }

    async def list_tags(self) -> list[dict]:
        """List all tags."""
        tags = await self._tag_repo.list()
        return [
            {
                "id": t.id,
                "name": t.name,
                "slug": t.slug,
            }
            for t in tags
        ]