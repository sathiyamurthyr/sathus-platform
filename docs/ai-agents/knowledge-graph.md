# Enterprise Knowledge Graph & Context Engine (Story 27.8)

Knowledge unification layer mapping enterprise entities, service dependencies, tenant data scopes, and semantic relationships.

## Features
- **Entity Registry**: Categorizes services, databases, policies, and workflows.
- **Relationship Engine**: Maps directional connections (`depends_on`, `owns`, `accesses`, `monitors`).
- **Unified Context Engine**: Aggregates graph relationship metadata into agent context windows.

## APIs
- `GET /api/v1/knowledge/entities` — List knowledge entities and metadata attributes.
- `GET /api/v1/context/graph` — Fetch entity relationship subgraph for active tenant workspace.
