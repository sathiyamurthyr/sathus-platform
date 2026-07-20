# 08 — Products & Microservices Matrix

**Document:** 08_PRODUCTS_AND_SERVICES.md  
**Owner:** Product Lead & Lead Architect  
**Status:** Active  

---

## Executive Summary

The Sathus Platform encompasses four core client application surfaces and eleven specialized backend microservices. This catalog documents the capabilities, technological foundations, target audiences, and API exposure of each product and microservice in the monorepo.

---

## Platform Application Catalog

| Product / App | Directory Path | Core Tech | Primary Audience | Key Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Sathus Digital HQ** | `apps/web` | Next.js 15, React 19, Tailwind CSS | Enterprise Customers, Public Visitors | Company Web, Product Marketing, Case Studies, Search, Trust Center, Contact Lead Capture |
| **Sathus Admin Portal** | `apps/admin` | Next.js 15, React 19, PostgreSQL | Content Editors, System Admins, Analysts | Content Authoring & LCS Diff Version History, Hospital Analytics Engine, Navigation Workspace |
| **FastAPI Microservices** | `apps/api` | Python 3.14, FastAPI, Async SQLAlchemy | Internal Apps, Web & Admin Frontends | Identity, Media Processing, Workflow State Machine, Notifications, Reporting, Search |
| **Sathus Core Domain** | `src/*` | .NET 9 C#, EF Core 9, Clean Architecture | High-Throughput Domain Consumers | Content Domain, Form Engine, Media Relations Graph, Chunked Upload Engine |

---

## Microservices Domain Matrix (`apps/api` & `src/*`)

```mermaid
graph LR
    subgraph Python FastAPI Suite (apps/api)
        Identity[Identity & Auth Service]
        Media[Media Processing Service]
        Workflow[Workflow State Machine]
        Notification[Notification & Webhook Service]
        Reporting[Analytics & Reporting Service]
        Search[Search Indexer & Query Engine]
        Audit[Audit Trail Logger]
        Integration[Integration Hub]
        AIGateway[AI Assistant Gateway]
    end

    subgraph .NET 9 Clean Core (src/*)
        DotnetContent[Content Domain Service]
        DotnetForms[Dynamic Form Engine]
        DotnetMediaRel[Media Relations Graph Engine]
        DotnetUpload[Multi-Part Chunked Upload Engine]
    end
```

### Microservice Specification Table

| Microservice | Location | Domain Responsibilities | Storage / Engine |
| :--- | :--- | :--- | :--- |
| **Identity Service** | `apps/api/app/identity` | Argon2 User Register/Login, JWT Token generation, MFA, Password Reset | PostgreSQL (`users`, `user_roles`) |
| **Media Service** | `apps/api/app/media` | Image/Video Asset Management, Upload Sessions, Transformations, Local/S3/MinIO/Azure providers | Local Storage, S3, MinIO, Azure Blob |
| **Workflow Service** | `apps/api/app/workflow` | Approval State Engine, Workflow Definitions (`draft`, `published`), Stage Transitions | PostgreSQL (`workflow_definitions`, `workflow_instances`) |
| **Notification Service** | `apps/api/app/notification` | Multi-channel delivery (SendGrid Email, Twilio SMS, Webhook retries), Preference management | Redis Queue, SendGrid, Twilio |
| **Reporting Service** | `apps/api/app/reporting` | Analytics Aggregation (Bed Occupancy, Doctor Performance, Queue Stats, Daily Patients, Revenue) | PostgreSQL Analytics Views |
| **Search Service** | `apps/api/app/search` | Full-text search indexing, query filtering, search history, saved searches | PostgreSQL TSVector / Algolia |
| **Audit Service** | `apps/api/app/audit` | Immutable audit trail recording for security and compliance event tracing | PostgreSQL (`audit_events`) |
| **AI Gateway** | `apps/api/app/ai` | Interface gateway for agentic AI tools, prompt optimization, context aggregation | OpenAI, Anthropic, Gemini APIs |
| **Content Engine** | `src/Sathus.Content.*` | Enterprise structured content items, versioning, localization metadata | PostgreSQL EF Core |
| **Form Engine** | `src/Sathus.Forms.*` | Dynamic form schemas, field validations, submission processing | PostgreSQL EF Core |
| **Upload Engine** | `src/Sathus.Upload.*` | Resumable multi-part chunked file ingestion pipeline | Redis Chunk Cache, Local/S3 Storage |
