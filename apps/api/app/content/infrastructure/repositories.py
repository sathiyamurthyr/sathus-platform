"""Content repositories."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.content.infrastructure.models import (
    ContentCategory,
    ContentItem,
    ContentTag,
    ContentType,
    ContentVersion,
    SeoMetadata,
)


class ContentTypeRepository:
    """Content type repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_by_id(self, type_id: UUID) -> ContentType | None:
        """Get content type by ID."""
        result = await self._db.execute(select(ContentType).where(ContentType.id == type_id))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> ContentType | None:
        """Get content type by name."""
        result = await self._db.execute(select(ContentType).where(ContentType.name == name))
        return result.scalar_one_or_none()

    async def list(self) -> list[ContentType]:
        """List all content types."""
        result = await self._db.execute(select(ContentType))
        return list(result.scalars().all())

    async def create(self, name: str, description: str | None = None) -> ContentType:
        """Create a content type."""
        content_type = ContentType(name=name, description=description)
        self._db.add(content_type)
        await self._db.commit()
        await self._db.refresh(content_type)
        return content_type


class ContentItemRepository:
    """Content item repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_by_id(self, item_id: UUID) -> ContentItem | None:
        """Get content item by ID."""
        result = await self._db.execute(select(ContentItem).where(ContentItem.id == item_id))
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> ContentItem | None:
        """Get content item by slug."""
        result = await self._db.execute(select(ContentItem).where(ContentItem.slug == slug))
        return result.scalar_one_or_none()

    async def list(
        self,
        type_id: UUID | None = None,
        status: str | None = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[ContentItem]:
        """List content items with filters."""
        query = select(ContentItem)
        if type_id:
            query = query.where(ContentItem.type_id == type_id)
        if status:
            query = query.where(ContentItem.status == status)
        query = query.offset(offset).limit(limit)
        result = await self._db.execute(query)
        return list(result.scalars().all())

    async def create(
        self,
        type_id: UUID,
        title: str,
        slug: str,
        content: str | None = None,
    ) -> ContentItem:
        """Create a content item."""
        item = ContentItem(type_id=type_id, title=title, slug=slug, content=content)
        self._db.add(item)
        await self._db.commit()
        await self._db.refresh(item)
        return item

    async def update(
        self,
        item_id: UUID,
        title: str | None = None,
        slug: str | None = None,
        content: str | None = None,
        status: str | None = None,
    ) -> ContentItem | None:
        """Update a content item."""
        item = await self.get_by_id(item_id)
        if not item:
            return None

        if title is not None:
            item.title = title
        if slug is not None:
            item.slug = slug
        if content is not None:
            item.content = content
        if status is not None:
            item.status = status

        await self._db.commit()
        await self._db.refresh(item)
        return item


class SeoMetadataRepository:
    """SEO metadata repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_by_content_item_id(self, content_item_id: UUID) -> SeoMetadata | None:
        """Get SEO metadata by content item ID."""
        result = await self._db.execute(
            select(SeoMetadata).where(SeoMetadata.content_item_id == content_item_id)
        )
        return result.scalar_one_or_none()

    async def create(
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
    ) -> SeoMetadata:
        """Create SEO metadata."""
        seo = SeoMetadata(
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
        self._db.add(seo)
        await self._db.commit()
        await self._db.refresh(seo)
        return seo


class ContentVersionRepository:
    """Content version repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_latest_version(self, content_item_id: UUID) -> ContentVersion | None:
        """Get latest version of a content item."""
        result = await self._db.execute(
            select(ContentVersion)
            .where(ContentVersion.content_item_id == content_item_id)
            .order_by(ContentVersion.version_number.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        content_item_id: UUID,
        version_number: int,
        title: str,
        slug: str,
        content: str | None,
        status: str,
        created_by: UUID,
    ) -> ContentVersion:
        """Create a content version."""
        version = ContentVersion(
            content_item_id=content_item_id,
            version_number=version_number,
            title=title,
            slug=slug,
            content=content,
            status=status,
            created_by=created_by,
        )
        self._db.add(version)
        await self._db.commit()
        await self._db.refresh(version)
        return version


class ContentCategoryRepository:
    """Content category repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_by_id(self, category_id: UUID) -> ContentCategory | None:
        """Get category by ID."""
        result = await self._db.execute(
            select(ContentCategory).where(ContentCategory.id == category_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> ContentCategory | None:
        """Get category by slug."""
        result = await self._db.execute(
            select(ContentCategory).where(ContentCategory.slug == slug)
        )
        return result.scalar_one_or_none()

    async def list(self) -> list[ContentCategory]:
        """List all categories."""
        result = await self._db.execute(select(ContentCategory))
        return list(result.scalars().all())


class ContentTagRepository:
    """Content tag repository."""

    def __init__(self, db: AsyncSession):
        """Initialize repository."""
        self._db = db

    async def get_by_id(self, tag_id: UUID) -> ContentTag | None:
        """Get tag by ID."""
        result = await self._db.execute(select(ContentTag).where(ContentTag.id == tag_id))
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> ContentTag | None:
        """Get tag by slug."""
        result = await self._db.execute(select(ContentTag).where(ContentTag.slug == slug))
        return result.scalar_one_or_none()

    async def list(self) -> list[ContentTag]:
        """List all tags."""
        result = await self._db.execute(select(ContentTag))
        return list(result.scalars().all())