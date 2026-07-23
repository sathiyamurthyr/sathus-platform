"""Knowledge domain repositories."""

from uuid import UUID
from datetime import datetime, timezone
from typing import Sequence
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.knowledge.infrastructure.models import (
    KnowledgeSource,
    KnowledgeDocument,
    KnowledgeCollection,
    KnowledgeVersion,
    KnowledgeMetadata,
    KnowledgeChunk,
    KnowledgeTag,
    KnowledgeEvent,
    KnowledgePermission,
    KnowledgeImportJob,
    KnowledgeEntity,
    KnowledgeRelationship,
    OntologyModel,
    GraphNode,
    GraphEdge,
    SemanticIndex,
    SearchEmbedding,
    ContextProfile,
    ContextWindow,
    ContextCache,
)


class KnowledgeRepository:
    """Unified repository for Knowledge Platform Foundation, Graph, Search & Context."""

    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Sources ---
    async def create_source(self, tenant_id: UUID, name: str, connector_type: str, configuration: dict | None = None) -> KnowledgeSource:
        source = KnowledgeSource(tenant_id=tenant_id, name=name, connector_type=connector_type, configuration=configuration or {})
        self.session.add(source)
        await self.session.flush()
        return source

    async def get_source(self, source_id: UUID) -> KnowledgeSource | None:
        result = await self.session.execute(select(KnowledgeSource).where(KnowledgeSource.id == source_id))
        return result.scalar_one_or_none()

    async def list_sources(self, tenant_id: UUID) -> Sequence[KnowledgeSource]:
        result = await self.session.execute(select(KnowledgeSource).where(KnowledgeSource.tenant_id == tenant_id))
        return result.scalars().all()

    # --- Documents ---
    async def create_document(
        self,
        tenant_id: UUID,
        title: str,
        file_path: str,
        file_type: str,
        source_id: UUID | None = None,
        collection_id: UUID | None = None,
        file_size_bytes: int = 0,
        hash_checksum: str | None = None,
        language: str = "en",
        created_by: UUID | None = None,
    ) -> KnowledgeDocument:
        doc = KnowledgeDocument(
            tenant_id=tenant_id,
            source_id=source_id,
            collection_id=collection_id,
            title=title,
            file_path=file_path,
            file_type=file_type,
            file_size_bytes=file_size_bytes,
            hash_checksum=hash_checksum,
            language=language,
            created_by=created_by,
        )
        self.session.add(doc)
        await self.session.flush()
        return doc

    async def get_document(self, document_id: UUID) -> KnowledgeDocument | None:
        result = await self.session.execute(select(KnowledgeDocument).where(KnowledgeDocument.id == document_id))
        return result.scalar_one_or_none()

    async def list_documents(self, tenant_id: UUID, collection_id: UUID | None = None) -> Sequence[KnowledgeDocument]:
        query = select(KnowledgeDocument).where(KnowledgeDocument.tenant_id == tenant_id)
        if collection_id:
            query = query.where(KnowledgeDocument.collection_id == collection_id)
        result = await self.session.execute(query)
        return result.scalars().all()

    # --- Collections ---
    async def create_collection(self, tenant_id: UUID, name: str, slug: str, description: str | None = None, parent_id: UUID | None = None) -> KnowledgeCollection:
        col = KnowledgeCollection(tenant_id=tenant_id, name=name, slug=slug, description=description, parent_id=parent_id)
        self.session.add(col)
        await self.session.flush()
        return col

    async def list_collections(self, tenant_id: UUID) -> Sequence[KnowledgeCollection]:
        result = await self.session.execute(select(KnowledgeCollection).where(KnowledgeCollection.tenant_id == tenant_id))
        return result.scalars().all()

    # --- Versions & Metadata ---
    async def create_version(self, document_id: UUID, version_number: int, content_hash: str, change_summary: str | None = None) -> KnowledgeVersion:
        v = KnowledgeVersion(document_id=document_id, version_number=version_number, content_hash=content_hash, change_summary=change_summary)
        self.session.add(v)
        await self.session.flush()
        return v

    async def add_metadata(self, document_id: UUID, key: str, value: str, data_type: str = "string", confidence: float = 1.0) -> KnowledgeMetadata:
        meta = KnowledgeMetadata(document_id=document_id, key=key, value=value, data_type=data_type, confidence=confidence)
        self.session.add(meta)
        await self.session.flush()
        return meta

    # --- Chunks ---
    async def create_chunk(self, document_id: UUID, chunk_index: int, content: str, token_count: int, start_char: int, end_char: int) -> KnowledgeChunk:
        chunk = KnowledgeChunk(
            document_id=document_id,
            chunk_index=chunk_index,
            content=content,
            token_count=token_count,
            start_char=start_char,
            end_char=end_char,
        )
        self.session.add(chunk)
        await self.session.flush()
        return chunk

    async def get_chunks_for_document(self, document_id: UUID) -> Sequence[KnowledgeChunk]:
        result = await self.session.execute(select(KnowledgeChunk).where(KnowledgeChunk.document_id == document_id).order_by(KnowledgeChunk.chunk_index))
        return result.scalars().all()

    # --- Events & Permissions ---
    async def log_event(self, tenant_id: UUID, event_type: str, resource_type: str, resource_id: UUID, payload: dict | None = None) -> KnowledgeEvent:
        evt = KnowledgeEvent(tenant_id=tenant_id, event_type=event_type, resource_type=resource_type, resource_id=resource_id, payload=payload or {})
        self.session.add(evt)
        await self.session.flush()
        return evt

    async def grant_permission(self, tenant_id: UUID, principal_id: UUID, principal_type: str, resource_type: str, resource_id: UUID, permission: str) -> KnowledgePermission:
        perm = KnowledgePermission(tenant_id=tenant_id, principal_id=principal_id, principal_type=principal_type, resource_type=resource_type, resource_id=resource_id, permission=permission)
        self.session.add(perm)
        await self.session.flush()
        return perm

    # --- Entities & Relationships (Knowledge Graph) ---
    async def create_entity(self, tenant_id: UUID, name: str, entity_type: str, description: str | None = None, confidence: float = 1.0, attributes: dict | None = None) -> KnowledgeEntity:
        entity = KnowledgeEntity(tenant_id=tenant_id, name=name, entity_type=entity_type, description=description, confidence=confidence, attributes=attributes or {})
        self.session.add(entity)
        await self.session.flush()
        return entity

    async def list_entities(self, tenant_id: UUID) -> Sequence[KnowledgeEntity]:
        result = await self.session.execute(select(KnowledgeEntity).where(KnowledgeEntity.tenant_id == tenant_id))
        return result.scalars().all()

    async def create_relationship(self, tenant_id: UUID, source_entity_id: UUID, target_entity_id: UUID, relation_type: str, weight: float = 1.0, confidence: float = 1.0, properties: dict | None = None) -> KnowledgeRelationship:
        rel = KnowledgeRelationship(
            tenant_id=tenant_id,
            source_entity_id=source_entity_id,
            target_entity_id=target_entity_id,
            relation_type=relation_type,
            weight=weight,
            confidence=confidence,
            properties=properties or {},
        )
        self.session.add(rel)
        await self.session.flush()
        return rel

    async def list_relationships(self, tenant_id: UUID) -> Sequence[KnowledgeRelationship]:
        result = await self.session.execute(select(KnowledgeRelationship).where(KnowledgeRelationship.tenant_id == tenant_id))
        return result.scalars().all()

    # --- Search & Embeddings ---
    async def store_embedding(self, tenant_id: UUID, embedding_vector: list[float], chunk_id: UUID | None = None, entity_id: UUID | None = None, model_name: str = "text-embedding-3-small") -> SearchEmbedding:
        emb = SearchEmbedding(tenant_id=tenant_id, chunk_id=chunk_id, entity_id=entity_id, model_name=model_name, embedding_vector=embedding_vector)
        self.session.add(emb)
        await self.session.flush()
        return emb

    # --- Context Engine ---
    async def create_context_profile(self, tenant_id: UUID, name: str, scope: str, max_tokens: int = 128000, settings: dict | None = None) -> ContextProfile:
        prof = ContextProfile(tenant_id=tenant_id, name=name, scope=scope, max_tokens=max_tokens, settings=settings or {})
        self.session.add(prof)
        await self.session.flush()
        return prof

    async def get_or_create_context_window(self, tenant_id: UUID, session_id: str, max_limit: int = 128000) -> ContextWindow:
        result = await self.session.execute(select(ContextWindow).where(ContextWindow.tenant_id == tenant_id, ContextWindow.session_id == session_id))
        win = result.scalar_one_or_none()
        if not win:
            win = ContextWindow(tenant_id=tenant_id, session_id=session_id, max_limit=max_limit)
            self.session.add(win)
            await self.session.flush()
        return win
