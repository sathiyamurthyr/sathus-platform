# Knowledge Platform Foundation Architecture

**Document:** `docs/knowledge/platform.md`  
**EPIC:** EPIC-028 (Story 28.1)  
**Status:** Production Ready  

---

## Overview

The **Knowledge Platform Foundation** establishes the multi-tenant runtime infrastructure powering Project Odyssey's Knowledge Intelligence Platform (KIP). Comparable to Palantir Foundry Ontology, Microsoft Graph, and Databricks Unity Catalog, it unifies knowledge runtime, registries, connector abstractions, tags, security permissions, lifecycle management, and event streams.

---

## Core Component Matrix

| Component | Class / Service | Description |
| :--- | :--- | :--- |
| **Knowledge Source** | `KnowledgeSource` | Connectors for S3, Local storage, Web APIs, and DB stores |
| **Knowledge Document** | `KnowledgeDocument` | Unified document entity with versioning, hash checksums, & status |
| **Knowledge Collections** | `KnowledgeCollection` | Logical spaces and tenant document libraries |
| **Knowledge Permissions** | `KnowledgePermission` | Fine-grained RBAC permission matrix for tenants & spaces |
| **Knowledge Events** | `KnowledgeEvent` | Event-driven audit log for mutations, indexing, and sync |

---

## Security & Multi-Tenancy

- Row-level tenant isolation is enforced on every table via indexed `tenant_id` foreign keys.
- Integrates with the platform RBAC model supporting `Platform Owner`, `Knowledge Administrator`, `Organization Admin`, `Tenant Admin`, `Workspace Admin`, `Knowledge Editor`, and `Knowledge Viewer`.
