# Enterprise Memory System (Story 27.6)

Multi-tiered memory architecture supporting Short-Term, Long-Term, Semantic, Episodic, and Working Memory with provider-agnostic vector search abstractions and tenant isolation.

## Memory Architecture
- **Memory Types**: `short_term`, `long_term`, `semantic`, `episodic`, `working`.
- **Memory Scopes**: `tenant`, `workspace`, `team`, `agent`, `conversation`.
- **Vector Search Abstraction**: Vector database interface compatible with pgvector, Pinecone, Qdrant, and Milvus.
- **Tenant Isolation**: Row-level security & metadata filter scoping ensuring zero cross-tenant data leaks.

## APIs
- `GET /api/v1/memory` — Query memories by scope and importance score.
- `POST /api/v1/memory/search` — Perform vector similarity search over enterprise memory index.
- `POST /api/v1/memory/context` — Retrieve contextual working memory for active agent execution.
