# Enterprise AI Engineering Handbook — Project Odyssey

**Platform:** Sathus Platform (Sathus Technology Digital HQ)  
**Version:** 1.0.0  
**Last Updated:** 2026-07-20  
**Scope:** Monorepo (`apps/web`, `apps/admin`, `apps/api`, `packages/*`, `src/*`)  

---

## Executive Summary

Welcome to the **Enterprise AI Engineering Handbook for Project Odyssey**. This handbook serves as the foundational engineering DNA and single source of truth for all human engineers, technical architects, AI coding assistants (including Antigravity, Cline, Copilot, and custom agentic workflows), and future contributors to the Sathus Platform.

Designed to meet the rigorous standards of engineering documentation found at Microsoft, AWS, Stripe, Databricks, and Snowflake, this suite codifies the strategic vision, monorepo architecture, polyglot backend design, design system, API standards, security guardrails, and non-negotiable development rules governing Project Odyssey.

---

## Handbook Architecture & Master Index

The documentation suite is organized systematically into 15 specialized domain documents in addition to this master index:

| Document | File Name | Domain / Primary Concern |
| :--- | :--- | :--- |
| **01** | [`01_PROJECT_OVERVIEW.md`](./01_PROJECT_OVERVIEW.md) | Vision, Business Goals, Product Ecosystem, Scope & Stack Matrix |
| **02** | [`02_SYSTEM_ARCHITECTURE.md`](./02_SYSTEM_ARCHITECTURE.md) | Monorepo Topology, High-Level Architecture Diagram, Clean Architecture Boundaries |
| **03** | [`03_DEVELOPMENT_STANDARDS.md`](./03_DEVELOPMENT_STANDARDS.md) | Polyglot Coding Standards (TS, Python, C#), Git Workflow, PR Guidelines, Definition of Done |
| **04** | [`04_FRONTEND_ARCHITECTURE.md`](./04_FRONTEND_ARCHITECTURE.md) | Next.js 15 App Router, React 19, Feature Modularity, Performance & State Management |
| **05** | [`05_BACKEND_ARCHITECTURE.md`](./05_BACKEND_ARCHITECTURE.md) | Dual Backend System: Python FastAPI (`apps/api`) & .NET 9 Clean Architecture (`src/*`) |
| **06** | [`06_SECURITY_COMPLIANCE.md`](./06_SECURITY_COMPLIANCE.md) | Authentication (Argon2/JWT), RBAC, Security Headers, Audit Logging & OWASP Guardrails |
| **07** | [`07_AI_DEVELOPMENT_RULES.md`](./07_AI_DEVELOPMENT_RULES.md) | Mandatory Directives for AI Assistants: Code Reuse, Architecture Protection, Zero Duplication |
| **08** | [`08_PRODUCTS_AND_SERVICES.md`](./08_PRODUCTS_AND_SERVICES.md) | Platform Product Catalog & Microservices Matrix (Identity, Media, Content, Search, Workflow, etc.) |
| **09** | [`09_ROADMAP_AND_EPICS.md`](./09_ROADMAP_AND_EPICS.md) | Multi-Phase Delivery Calendar, Completed EPICs (Analytics API, Content Editor), Future Horizons |
| **10** | [`10_UI_UX_DESIGN_SYSTEM.md`](./10_UI_UX_DESIGN_SYSTEM.md) | Sathus Design Language (SDL), Tailwind CSS Tokens, HSL Palette, Motion & WCAG 2.1 AA |
| **11** | [`11_DATABASE_ARCHITECTURE.md`](./11_DATABASE_ARCHITECTURE.md) | Dual ORM Strategy (SQLAlchemy 2.0 Async & EF Core 9), Migrations, Multi-Tenancy, Pooling |
| **12** | [`12_API_STANDARDS.md`](./12_API_STANDARDS.md) | RESTful API Conventions, RFC 7807 Error Envelopes, OpenAPI 3.0 Specs & Rate Limiting |
| **13** | [`13_DEPLOYMENT_DEVOPS.md`](./13_DEPLOYMENT_DEVOPS.md) | Turborepo Orchestration, GitHub Actions CI/CD, Docker Containerization & Observability |
| **14** | [`14_TESTING_STRATEGY.md`](./14_TESTING_STRATEGY.md) | Polyglot Testing Pyramid: Vitest + RTL (TS), Pytest (Python), xUnit (.NET) & E2E Strategy |
| **15** | [`15_SEO_AND_DISCOVERABILITY.md`](./15_SEO_AND_DISCOVERABILITY.md) | Next.js Metadata API, Dynamic Sitemaps, Robots, JSON-LD Schema & Social Previews |

---

## How AI Coding Assistants Must Use This Handbook

AI models (Antigravity, Cline, GitHub Copilot, Cursor, etc.) MUST adhere to the following protocol when performing any task:

1. **Mandatory Pre-Execution Context Loading**:
   - Before executing code edits, read [`07_AI_DEVELOPMENT_RULES.md`](./07_AI_DEVELOPMENT_RULES.md) to understand non-negotiable guardrails.
   - Read the relevant domain document (e.g., [`04_FRONTEND_ARCHITECTURE.md`](./04_FRONTEND_ARCHITECTURE.md) for UI work, [`05_BACKEND_ARCHITECTURE.md`](./05_BACKEND_ARCHITECTURE.md) for API work).

2. **Strict Code Reuse Enforcement**:
   - Do NOT reinvent existing utilities, UI components, or types. Always search `packages/ui`, `packages/utils`, `packages/types`, `packages/config`, and established feature directories first.

3. **Clean Architecture Compliance**:
   - Do NOT bypass layering boundaries. Data entities, domain models, application services, and presentation components must remain strictly separated.

4. **Zero Structural Regression**:
   - Never remove or alter working test configurations, security headers, or existing database migration scripts.

5. **Self-Verification Protocol**:
   - Every code modification MUST be accompanied by updated tests, docstrings, and OpenAPI / schema updates where relevant.

---

## How Human Engineers & Architects Must Use This Handbook

- **New Developer Onboarding**: Read documents 01 through 04 to understand company vision, monorepo layout, and coding expectations.
- **Architectural Decision Reviews (ADRs)**: Consult documents 02, 05, 11, and 12 before introducing new microservices, database schemas, or API endpoints.
- **UI & Experience Crafting**: Refer to document 10 for design tokens, typography, motion rules, and accessibility standards.
- **Security Audits & Compliance**: Refer to document 06 for security headers, authentication flows, and data sanitization guidelines.

---

## Handbook Maintenance & Governance

This handbook is governed by the **Sathus Engineering Council**. Any modifications or additions require:
1. An Architecture Decision Record (ADR) or RFC proposal.
2. Review and approval by the Lead Systems Architect and Product Lead.
3. Automated verification in CI to ensure markdown syntax integrity and clickable relative file links.

> [!IMPORTANT]
> When encountering underspecified requirements during implementation, check for **`[Project Decision Required]`** markers in the relevant documentation file. If no marker exists, file an RFC with the Engineering Council.
