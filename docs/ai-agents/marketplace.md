# Enterprise Agent Marketplace (Story 27.12)

Internal distribution hub for discovering, installing, and sharing pre-built AI agent packages across tenants.

## Features
- **Agent Discovery**: Searchable gallery categorized by Customer Support, Security & Audit, SRE, and BI.
- **1-Click Installation**: Install or remove agent templates with tenant-scoped configuration defaults.
- **Publisher & Ratings**: Ratings, review counts, and publisher verification labels.

## APIs
- `GET /api/v1/marketplace/agents` — List marketplace agent packages.
- `POST /api/v1/marketplace/install` — Install or uninstall an agent package for the current tenant workspace.
