# 01 — Project Overview

**Document:** 01_PROJECT_OVERVIEW.md  
**Owner:** Product Lead & Lead Architect  
**Status:** Active  

---

## Executive Summary

**Project Odyssey** is the core foundational initiative of **Sathus Technology Pvt. Ltd.** to establish the **Sathus Platform** — an enterprise-grade, multi-tenant digital headquarters. The platform serves as the central digital operating system powering the company's public web presence, product ecosystem, administrative content management, customer portal, developer portal, documentation hubs, and AI assistant interfaces.

---

## Company Vision & Business Goals

### Vision Statement
To deliver an authoritative, highly performant, and secure enterprise digital platform that enables Sathus Technology to launch products, manage multi-tenant digital assets, publish high-velocity content, and deliver seamless digital experiences with complete operational control and sub-second performance.

### Core Business Objectives

1. **Digital Sovereignty**: Complete ownership over content, media, analytics, and customer data workflows without vendor lock-in.
2. **High-Velocity Content Delivery**: Empower editorial, marketing, and engineering teams to publish structured content with automated validation, versioning, and social pre-rendering.
3. **Sub-Second Global Performance**: Achieve P95 page load speeds under 1 second globally using Next.js static optimization, edge caching, and AVIF/WebP image processing pipelines.
4. **Enterprise Multi-Tenancy & Security**: Support multi-organization data isolation, role-based access control (RBAC), multi-factor authentication (MFA), and zero-trust API security.
5. **AI Assistant Integration**: Expose structured APIs, search indices, and domain interfaces for agentic AI automation (Antigravity, Cline, Sathus AI Assistant).

---

## Digital Ecosystem Architecture

The Sathus Platform is designed to support 12 strategic digital surfaces:

```
                          ┌─────────────────────────────────────────┐
                          │    Sathus Digital Headquarters (DHQ)     │
                          └────────────────────┬────────────────────┘
                                               │
       ┌───────────────────────┬───────────────┴───────────────┬───────────────────────┐
       ▼                       ▼                               ▼                       ▼
┌──────────────┐       ┌──────────────┐                ┌──────────────┐       ┌──────────────┐
│  Public Web  │       │  Admin CMS   │                │   API Core   │       │  Docs Portal │
│ (apps/web)   │       │ (apps/admin) │                │  (apps/api)  │       │ (apps/docs)  │
└──────┬───────┘       └──────┬───────┘                └──────┬───────┘       └──────┬───────┘
       │                      │                               │                      │
       ├─ Company Web         ├─ Content Workflow Engine      ├─ Identity Microservice├─ Product Manuals
       ├─ Product Marketing    ├─ Hospital & Business Analytics├─ Media Processing    ├─ API Reference
       ├─ Trust Center        ├─ Media Asset Manager          ├─ Workflow Engine     ├─ Developer Guides
       └─ Customer Portal     └─ Tenant Configuration         └─ AI Gateway Gateway   └─ Learning Center
```

---

## Scope Boundaries (CHARTER Enforcement)

### In-Scope

- **Public Marketing & Product Web Applications**: Next.js 15 App Router (`apps/web`).
- **Admin CMS & Analytics Dashboard**: Next.js 15 Admin App (`apps/admin`).
- **Python FastAPI Backend Microservices**: Identity, Media, Notification, Reporting, Search, Workflow, Audit, Integration, AI Gateway (`apps/api`).
- **.NET 9 Clean Architecture Domain Services**: High-performance core domain logic (`src/*`).
- **Shared Monorepo Packages**: Config, Types, UI Design System, Pure Utilities (`packages/*`).
- **DevOps & CI/CD Pipelines**: Automated lint, typecheck, unit, integration, and security checks (`.github/workflows`).

### Out-of-Scope

- **General-Purpose WYSIWYG CMS**: The platform is engineering-led and uses structured, type-safe schema definitions.
- **Standalone E-Commerce Engine**: Commerce integrations exist as modular plugins, not core platform code.
- **Native Mobile Applications**: Mobile web responsiveness is enforced; native iOS/Android apps require separate ESC board approval.

---

## Technology Stack Matrix

| Layer | Technology | Version / Tooling | Purpose |
| :--- | :--- | :--- | :--- |
| **Monorepo Engine** | Turborepo | `^2.10.4` | Build orchestration & task caching |
| **Package Manager** | npm Workspaces | Node `^20` | Monorepo dependency management |
| **Frontend Framework** | Next.js | `^15.0.0` (App Router) | Server Components, SSR, Static Site Gen |
| **UI Library** | React | `^19.0.0` | User Interface rendering |
| **Styling** | Tailwind CSS | `^3.4.0` | Design token based styling |
| **Design System** | shadcn/ui + Radix | Custom | Accessible, customizable UI primitives |
| **Animations** | Framer Motion | `^11.0.0` | Subtle UX micro-interactions |
| **Forms & Validation** | React Hook Form + Zod | `^7.0.0` / `^3.23.0` | Type-safe client & server validation |
| **Python API** | FastAPI + Uvicorn | Python `3.14` | High-concurrency microservices |
| **Python ORM** | SQLAlchemy | `2.0` (Async) | Async PostgreSQL ORM |
| **.NET API** | .NET 9 C# | C# 13 | High-performance Clean Architecture |
| **.NET ORM** | Entity Framework Core | `9.0` | Relational database ORM |
| **Database** | PostgreSQL | `16+` | Primary relational store |
| **Caching / Queues** | Redis | `7+` | Query cache, rate limiting, session store |
| **Testing** | Vitest, RTL, Pytest, xUnit | Latest | Polyglot unit & integration testing |

---

## Outstanding Governance & Project Decisions

> [!NOTE]
> **[Project Decision Required: `apps/docs` Implementation]**  
> `apps/docs` currently contains a placeholder `README.md`. A formal Engineering Council decision is required on whether to build `apps/docs` using Nextra/Docusaurus or consolidate developer documentation into `docs/ai-context/`.

> [!NOTE]
> **[Project Decision Required: Shared Package Export Strategy]**  
> `packages/ui`, `packages/types`, `packages/utils`, and `packages/config` are scaffolded. Export structures should be populated and consumed consistently across `apps/web` and `apps/admin`.
