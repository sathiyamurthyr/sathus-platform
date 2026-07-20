# 02 — System Architecture

**Document:** 02_SYSTEM_ARCHITECTURE.md  
**Owner:** Chief Technology Officer & Lead Architect  
**Status:** Active  

---

## Executive Summary

The Sathus Platform is built upon a modern **Polyglot Hybrid Architecture** orchestrated inside a single monorepo repository using **Turborepo** and **npm workspaces**. The architecture combines high-performance Next.js 15 frontends, a Python FastAPI microservices gateway (`apps/api`), and enterprise-grade .NET 9 Clean Architecture services (`src/*`).

This document details the monorepo topology, high-level component interaction, data flow, Clean Architecture boundaries, and system integration patterns.

---

## High-Level System Architecture Diagram

```mermaid
graph TD
    Client[Browser / Client Applications]

    subgraph Presentation Layer
        Web[apps/web - Next.js 15 Public Portal]
        Admin[apps/admin - Next.js 15 CMS & Analytics]
        Docs[apps/docs - Next.js Documentation Site]
    end

    subgraph Shared Monorepo Packages
        PkgUI[@sathus-platform/ui]
        PkgTypes[@sathus-platform/types]
        PkgUtils[@sathus-platform/utils]
        PkgConfig[@sathus-platform/config]
    end

    subgraph API & Microservices Layer
        FastAPI[apps/api - Python FastAPI Gateway]
        IdentitySvc[app/identity - Auth & Users]
        MediaSvc[app/media - Asset Management]
        WorkflowSvc[app/workflow - Approval State Engine]
        NotificationSvc[app/notification - SMS/Email/Webhook]
        ReportingSvc[app/reporting - Analytics Aggregation]
        SearchSvc[app/search - Search Indexer & API]
        AuditSvc[app/audit - Audit Trail Logger]
        AIGateway[app/ai - AI Agent Gateway]
    end

    subgraph Core Domain Services (.NET 9 C# Clean Architecture)
        DotnetContent[Sathus.Content - Content Management]
        DotnetForms[Sathus.Forms - Dynamic Form Engine]
        DotnetIdentity[Sathus.Identity - Enterprise SSO]
        DotnetMedia[Sathus.Media - Image/Video Processing]
        DotnetNav[Sathus.Navigation - Menu & Route Tree]
        DotnetUpload[Sathus.Upload - Chunked File Ingestion]
        DotnetShared[Sathus.SharedKernel - Core Value Objects]
    end

    subgraph Infrastructure & Persistence
        PostgreSQL[(PostgreSQL 16 Database)]
        Redis[(Redis 7 Cache & Rate Limiter)]
        Storage[(Local / S3 / Azure Blob Storage)]
    end

    Client --> Web
    Client --> Admin
    Client --> Docs

    Web --> PkgUI
    Admin --> PkgUI
    Web --> PkgTypes
    Admin --> PkgTypes

    Web --> FastAPI
    Admin --> FastAPI
    Web --> DotnetContent
    Admin --> DotnetNav

    FastAPI --> IdentitySvc
    FastAPI --> MediaSvc
    FastAPI --> WorkflowSvc
    FastAPI --> NotificationSvc
    FastAPI --> ReportingSvc
    FastAPI --> SearchSvc
    FastAPI --> AuditSvc
    FastAPI --> AIGateway

    IdentitySvc --> PostgreSQL
    MediaSvc --> Storage
    WorkflowSvc --> PostgreSQL
    NotificationSvc --> Redis
    ReportingSvc --> PostgreSQL
    SearchSvc --> PostgreSQL

    DotnetContent --> PostgreSQL
    DotnetMedia --> Storage
    DotnetUpload --> Storage
    DotnetUpload --> Redis
```

---

## Monorepo Directory Topology

The repository is structured into clear functional directories:

```
sathus-platform/
├── apps/
│   ├── admin/             # Next.js 15 Admin Portal & Hospital Analytics Dashboard
│   ├── api/               # Python 3.14 FastAPI Async Microservices Suite
│   ├── docs/              # Next.js Documentation Site
│   └── web/               # Next.js 15 Public Website & Marketing Portal
├── packages/
│   ├── config/            # Shared ESLint, TypeScript, Tailwind configurations
│   ├── types/             # Shared TypeScript domain interfaces & contracts
│   ├── ui/                # Sathus Design System component primitives
│   └── utils/             # Pure utility functions (formatting, diffing, validation)
├── src/                   # .NET 9 C# Clean Architecture Core Domain Microservices
│   ├── Sathus.Content.*/  # Content Domain (Api, Application, Domain, Infra)
│   ├── Sathus.Forms.*/    # Dynamic Form Domain
│   ├── Sathus.Identity.*/ # SSO & Tenant Domain
│   ├── Sathus.Media.*/    # High-Performance Media Pipeline
│   ├── Sathus.Nav.*/      # Navigation Hierarchy Domain
│   ├── Sathus.Upload.*/   # Chunked Multi-Part Upload Engine
│   └── Sathus.SharedKernel/# Shared Domain Primitives & Value Objects
├── docs/
│   └── ai-context/        # Enterprise AI Engineering Handbook (Single Source of Truth)
├── public/                # Static public assets
├── scripts/               # Operational & database maintenance scripts
├── turbo.json             # Turborepo task pipeline configuration
├── tsconfig.json          # Root TypeScript compiler rules & path aliases
└── package.json           # Monorepo dependencies & script definitions
```

---

## Architecture Principles & Boundaries

### 1. Domain-Driven Design (DDD)

Both the Python FastAPI (`apps/api`) and .NET 9 (`src/*`) backend services strictly adhere to DDD principles:

- **Domain Layer**: Pure business logic, entities, value objects, domain exceptions, and domain events. Zero external framework dependencies.
- **Application Layer**: Use cases, command/query handlers, service interfaces, DTOs, and application validation.
- **Infrastructure Layer**: Persistence implementations (SQLAlchemy repositories, EF Core DbContext), external provider integrations (AWS S3, MinIO, Azure Blob, SendGrid, Twilio), and hardware adapters.
- **API / Interface Layer**: REST endpoints, OpenAPI routes, controllers, request parsing, and HTTP status code mappings.

### 2. Clean Architecture Layering

Dependency flow ALWAYS points inwards towards the Domain Core:

$$\text{API / Presentation} \longrightarrow \text{Application} \longrightarrow \text{Domain} \longleftarrow \text{Infrastructure}$$

```
+-------------------------------------------------------------+
| Presentation / API Layer (FastAPI endpoints, Controllers)    |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Application Layer (Services, Use Cases, DTOs)                |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Domain Layer (Entities, Value Objects, Domain Exceptions)    |
+-------------------------------------------------------------+
                              ^
                              | (implements interfaces)
+-------------------------------------------------------------+
| Infrastructure Layer (SQLAlchemy, EF Core, S3, Redis)       |
+-------------------------------------------------------------+
```

---

## Integration & Communication Patterns

1. **Synchronous HTTP/REST**:
   - Web (`apps/web`) and Admin (`apps/admin`) applications communicate with `apps/api` via RESTful JSON endpoints.
   - Standard RFC 7807 Problem Details error responses are enforced across all services.

2. **Database Integration**:
   - PostgreSQL 16 is shared across domains using dedicated schema names (`identity`, `media`, `workflow`, `notification`, `reporting`, `audit`, `search`).
   - Row-level tenant isolation is enforced via `tenant_id` foreign keys and automatic query filters.

3. **Asynchronous Processing**:
   - Redis `7+` powers caching, rate limiting, and background event distribution.
