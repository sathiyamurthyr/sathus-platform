"""Unit & Integration tests for Knowledge Intelligence Platform (EPIC-028 Prompts 01 & 02)."""

import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from starlette.testclient import TestClient
from app.main import app
from app.core.database import get_db
from app.knowledge.application.parser_service import DocumentParserEngine
from app.knowledge.application.ocr_service import OCRPipelineService
from app.knowledge.application.metadata_extractor import MetadataExtractorService
from app.knowledge.application.chunking_service import ChunkingService


# Create AsyncMock Session for get_db dependency override
async def override_get_db():
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = []
    mock_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_result
    yield mock_session


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_knowledge_platform_status():
    """Test foundation status endpoint."""
    response = client.get("/api/v1/knowledge/status")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "Project Odyssey Enterprise KIP"
    assert data["status"] == "OPERATIONAL"


def test_document_parser_engine():
    """Test multi-format document parser engine."""
    parser = DocumentParserEngine()
    
    # JSON parser
    json_bytes = b'{"name": "Sathus", "epic": "028"}'
    res = parser.parse(json_bytes, "json", "test.json")
    assert res["format"] == "json"
    assert "Sathus" in res["text"]

    # CSV parser
    csv_bytes = b"header1,header2\nval1,val2"
    res_csv = parser.parse(csv_bytes, "csv", "test.csv")
    assert res_csv["format"] == "csv"
    assert len(res_csv["tables"]) == 1


def test_ocr_pipeline_service():
    """Test pluggable OCR pipeline."""
    ocr = OCRPipelineService()
    res = ocr.process_image(b"mock_image_bytes", "scanned_doc.png")
    assert res["scanned"] is True
    assert "OCR Extracted" in res["text"]


def test_metadata_extractor():
    """Test metadata & entity extraction."""
    extractor = MetadataExtractorService()
    text = "Sathus Platform Document Intelligence for Enterprise Architecture."
    intel = extractor.extract(text, "architecture.pdf")
    assert intel["language"] == "en"
    assert len(intel["checksum"]) == 64
    assert len(intel["entities"]) > 0


def test_chunking_service():
    """Test text chunker and vector embedding generation."""
    chunker = ChunkingService()
    text = "Word " * 200
    chunks = chunker.chunk_text(text, chunk_size=50, overlap=10)
    assert len(chunks) > 1
    assert "embedding" in chunks[0]


def test_semantic_search_api():
    """Test semantic search API endpoint."""
    response = client.post("/api/v1/semantic-search/query", json={"query": "architecture", "search_mode": "hybrid"})
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "architecture"
    assert "analytics" in data


def test_context_engine_api():
    """Test context engine API build endpoint."""
    response = client.post(
        "/api/v1/context/build",
        json={"session_id": "test_session_123", "prompt": "Summarize knowledge platform", "max_tokens": 128000},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == "test_session_123"
    assert data["total_tokens"] > 0


def test_knowledge_graph_summary_api():
    """Test knowledge graph summary API."""
    response = client.get("/api/v1/knowledge-graph/summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_nodes" in data
    assert "total_edges" in data


def test_repository_dashboard_api():
    """Test repository health dashboard API."""
    response = client.get("/api/v1/repository/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Healthy"
    assert "knowledge_health_score" in data
