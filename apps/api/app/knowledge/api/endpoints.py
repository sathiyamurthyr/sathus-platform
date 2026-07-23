"""Knowledge Intelligence Platform REST API Endpoints (EPIC-028 Prompts 01 & 02)."""

from uuid import UUID
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.core.database import get_db
from app.knowledge.infrastructure.repositories import KnowledgeRepository
from app.knowledge.application.parser_service import DocumentParserEngine
from app.knowledge.application.ocr_service import OCRPipelineService
from app.knowledge.application.metadata_extractor import MetadataExtractorService
from app.knowledge.application.chunking_service import ChunkingService
from app.knowledge.application.knowledge_graph_service import KnowledgeGraphService
from app.knowledge.application.semantic_search_service import SemanticSearchEngineService
from app.knowledge.application.context_engine_service import ContextEngineService
from app.knowledge.application.repository_service import RepositoryService
from app.knowledge.application.import_export_service import ImportExportService

# Routers for each epic scope
knowledge_router = APIRouter()
documents_router = APIRouter()
repository_router = APIRouter()
collections_router = APIRouter()
import_router = APIRouter()
export_router = APIRouter()
graph_router = APIRouter()
entities_router = APIRouter()
relationships_router = APIRouter()
search_router = APIRouter()
context_router = APIRouter()


# Default mock tenant for demo/testing resilience
DEFAULT_TENANT_ID = UUID("00000000-0000-0000-0000-000000000001")


# --- Schemas ---
class CreateSourceSchema(BaseModel):
    name: str
    connector_type: str = "S3"
    configuration: Dict[str, Any] = Field(default_factory=dict)


class CreateDocumentSchema(BaseModel):
    title: str
    file_path: str
    file_type: str = "pdf"
    content_text: str = "Sample document content."
    collection_id: UUID | None = None


class SearchQuerySchema(BaseModel):
    query: str
    search_mode: str = "hybrid"
    limit: int = 10


class ContextBuildSchema(BaseModel):
    session_id: str
    prompt: str
    scopes: List[str] = Field(default_factory=lambda: ["tenant", "user", "workspace"])
    max_tokens: int = 128000


class CreateEntitySchema(BaseModel):
    name: str
    entity_type: str = "Concept"
    description: str | None = None


class CreateRelationshipSchema(BaseModel):
    source_entity_id: UUID
    target_entity_id: UUID
    relation_type: str = "RELATED_TO"
    weight: float = 1.0


# ==========================================
# 1. KNOWLEDGE FOUNDATION (/api/v1/knowledge)
# ==========================================
@knowledge_router.get("/status")
async def get_platform_status():
    return {
        "platform": "Project Odyssey Enterprise KIP",
        "status": "OPERATIONAL",
        "version": "2.0.0",
        "modules": ["Foundation", "DocumentIntelligence", "Repository", "KnowledgeGraph", "SemanticSearch", "ContextEngine"],
    }


@knowledge_router.get("/sources")
async def list_sources(db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    sources = await repo.list_sources(DEFAULT_TENANT_ID)
    return {"total": len(sources), "sources": [s.name for s in sources]}


@knowledge_router.post("/sources", status_code=status.HTTP_201_CREATED)
async def create_source(data: CreateSourceSchema, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    source = await repo.create_source(DEFAULT_TENANT_ID, data.name, data.connector_type, data.configuration)
    return {"id": str(source.id), "name": source.name, "status": source.status}


# ==========================================
# 2. DOCUMENT INTELLIGENCE (/api/v1/documents)
# ==========================================
@documents_router.post("/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_document(data: CreateDocumentSchema, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    parser = DocumentParserEngine()
    ocr = OCRPipelineService()
    extractor = MetadataExtractorService()
    chunker = ChunkingService()

    # 1. Create document record
    doc = await repo.create_document(
        tenant_id=DEFAULT_TENANT_ID,
        title=data.title,
        file_path=data.file_path,
        file_type=data.file_type,
        collection_id=data.collection_id,
    )

    # 2. Parse & OCR
    parsed_res = parser.parse(data.content_text.encode("utf-8"), data.file_type, data.title)
    
    # 3. Extract metadata & entities
    intel = extractor.extract(parsed_res["text"], data.title)
    for m in intel["metadata"]:
        await repo.add_metadata(doc.id, m["key"], str(m["value"]), m["type"])

    # 4. Chunk & Vector Embeddings
    chunks = chunker.chunk_text(parsed_res["text"])
    for idx, c in enumerate(chunks):
        ch_rec = await repo.create_chunk(doc.id, idx, c["content"], c["token_count"], c["start_char"], c["end_char"])
        await repo.store_embedding(DEFAULT_TENANT_ID, c["embedding"], chunk_id=ch_rec.id)

    doc.status = "indexed"
    await db.commit()

    return {
        "document_id": str(doc.id),
        "title": doc.title,
        "status": doc.status,
        "chunks_count": len(chunks),
        "entities_extracted": len(intel["entities"]),
    }


@documents_router.get("/{document_id}")
async def get_document_details(document_id: UUID, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    doc = await repo.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    chunks = await repo.get_chunks_for_document(document_id)
    return {
        "id": str(doc.id),
        "title": doc.title,
        "file_type": doc.file_type,
        "status": doc.status,
        "chunks_count": len(chunks),
    }


# ==========================================
# 3. KNOWLEDGE REPOSITORY (/api/v1/repository)
# ==========================================
@repository_router.get("/dashboard")
async def get_repository_dashboard(db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = RepositoryService(repo)
    return await svc.get_repository_dashboard(DEFAULT_TENANT_ID)


@repository_router.post("/snapshots")
async def create_snapshot(name: str = "Manual Snapshot", db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = RepositoryService(repo)
    return await svc.create_snapshot(DEFAULT_TENANT_ID, name)


@repository_router.get("/timeline")
async def get_timeline(db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = RepositoryService(repo)
    return await svc.get_timeline(DEFAULT_TENANT_ID)


# ==========================================
# 4. KNOWLEDGE COLLECTIONS (/api/v1/collections)
# ==========================================
@collections_router.get("/")
async def list_collections(db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    cols = await repo.list_collections(DEFAULT_TENANT_ID)
    return {"total": len(cols), "collections": [{"id": str(c.id), "name": c.name, "slug": c.slug} for c in cols]}


@collections_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_collection(name: str, slug: str, description: str | None = None, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    col = await repo.create_collection(DEFAULT_TENANT_ID, name, slug, description)
    await db.commit()
    return {"id": str(col.id), "name": col.name, "slug": col.slug}


# ==========================================
# 5. IMPORT & EXPORT (/api/v1/import & /api/v1/export)
# ==========================================
@import_router.post("/jobs")
async def start_import(file_count: int = 1, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = ImportExportService(repo)
    return await svc.create_import_job(DEFAULT_TENANT_ID, file_count)


@export_router.post("/jobs")
async def start_export(db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = ImportExportService(repo)
    return await svc.create_export_job(DEFAULT_TENANT_ID)


# ==========================================
# 6. KNOWLEDGE GRAPH (/api/v1/knowledge-graph)
# ==========================================
@graph_router.get("/summary")
async def get_graph_summary(db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = KnowledgeGraphService(repo)
    return await svc.get_graph_summary(DEFAULT_TENANT_ID)


@graph_router.get("/traverse/{start_entity_id}")
async def traverse_graph(start_entity_id: UUID, depth: int = 2, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = KnowledgeGraphService(repo)
    return await svc.traverse_graph(DEFAULT_TENANT_ID, start_entity_id, depth)


# ==========================================
# 7. ENTITIES & RELATIONSHIPS (/api/v1/entities & /api/v1/relationships)
# ==========================================
@entities_router.get("/")
async def list_entities(db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    entities = await repo.list_entities(DEFAULT_TENANT_ID)
    return {"total": len(entities), "entities": [{"id": str(e.id), "name": e.name, "type": e.entity_type} for e in entities]}


@entities_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_entity(data: CreateEntitySchema, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    e = await repo.create_entity(DEFAULT_TENANT_ID, data.name, data.entity_type, data.description)
    await db.commit()
    return {"id": str(e.id), "name": e.name, "type": e.entity_type}


@relationships_router.get("/")
async def list_relationships(db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    rels = await repo.list_relationships(DEFAULT_TENANT_ID)
    return {"total": len(rels), "relationships": [{"id": str(r.id), "relation_type": r.relation_type} for r in rels]}


@relationships_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_relationship(data: CreateRelationshipSchema, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    r = await repo.create_relationship(DEFAULT_TENANT_ID, data.source_entity_id, data.target_entity_id, data.relation_type, data.weight)
    await db.commit()
    return {"id": str(r.id), "relation_type": r.relation_type}


# ==========================================
# 8. SEMANTIC SEARCH (/api/v1/semantic-search)
# ==========================================
@search_router.post("/query")
async def search_query(data: SearchQuerySchema, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = SemanticSearchEngineService(repo)
    return await svc.search(DEFAULT_TENANT_ID, data.query, data.search_mode, limit=data.limit)


@search_router.get("/autocomplete")
async def search_autocomplete(prefix: str = "", db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = SemanticSearchEngineService(repo)
    suggestions = await svc.get_autocomplete(DEFAULT_TENANT_ID, prefix)
    return {"prefix": prefix, "suggestions": suggestions}


# ==========================================
# 9. CONTEXT ENGINE (/api/v1/context)
# ==========================================
@context_router.post("/build")
async def build_context(data: ContextBuildSchema, db=Depends(get_db)):
    repo = KnowledgeRepository(db)
    svc = ContextEngineService(repo)
    return await svc.build_context(DEFAULT_TENANT_ID, data.session_id, data.prompt, data.scopes, data.max_tokens)


@context_router.post("/compress")
async def compress_context(text: str, ratio: float = 0.5):
    svc = ContextEngineService(None)
    return await svc.compress_context(text, ratio)
