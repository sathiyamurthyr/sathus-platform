# 09 — Roadmap & EPICs

**Document:** 09_ROADMAP_AND_EPICS.md  
**Owner:** Product Lead & Engineering Council  
**Status:** Active  

---

## Executive Summary

The Project Odyssey Delivery Roadmap translates strategic business goals into phased, milestone-bound execution phases. It balances infrastructure stabilization, new feature development, technical debt repayment, and scale readiness.

This document tracks completed EPICs, active milestones, and the master execution strategy for **EPIC-018 through EPIC-025**.

---

## Multi-Phase Roadmap Overview

```
Phase 0: Foundation (Weeks 1–4) ────────► [COMPLETED] Monorepo, Turborepo, Core Docs, Base UI
Phase 1: Operational Core (Months 1–2) ──► [ACTIVE] EPIC-023 (Audit) + EPIC-025 (Tenant Admin)
Phase 2: Communication & Search (M 3–4) ─► EPIC-018 (Notif) + EPIC-019 (Search)
Phase 3: Workflow & Analytics (M 5–6) ──► EPIC-021 (Workflow) + EPIC-024 (Analytics)
Phase 4: AI & Monetization (M 7–8) ────► EPIC-020 (AI Platform) + EPIC-022 (Billing)
```

---

## Completed EPICs & Features

### EPIC-013: Platform Foundation — `[COMPLETED]`
- Turborepo orchestration and npm workspaces established (`turbo.json`).
- Root TypeScript compiler configuration and path aliases configured (`tsconfig.json`).
- Base shared package structure created (`@sathus-platform/config`, `@sathus-platform/types`, `@sathus-platform/ui`, `@sathus-platform/utils`).

### EPIC-014: Identity Service — `[COMPLETED]`
- User registration and authentication endpoints (`/api/v1/auth/register`, `/api/v1/auth/login`).
- Argon2id password hashing and JWT access/refresh token issuing (`apps/api/app/identity`).

### EPIC-015: Authorization Service — `[COMPLETED]`
- Role-Based Access Control (RBAC) permission schemas and user role bindings.

### EPIC-016: Content Service — `[COMPLETED]`
- Rich text content editor with debounced autosave (300ms), live preview, and unsaved changes guard.
- Version history snapshot system with Longest Common Subsequence (LCS) line-by-line diff viewer.
- SEO social card preview, JSON-LD Schema validation, canonical URLs, and legacy path redirects.

### EPIC-017: Enterprise Media Service — `[COMPLETED]`
- Asset upload and ingestion microservice (`apps/api/app/media`).
- Local, AWS S3, MinIO, and Azure Blob storage providers; thumbnail generation primitives.

---

## Master Execution Strategy for Remaining EPICs

Execution playbooks, dependency graphs, file impact matrices, risk mitigations, and quality gate checklists for remaining EPICs are codified in the master blueprint:

| EPIC | Title | Execution Phase | Core Deliverables |
| :--- | :--- | :---: | :--- |
| **EPIC-023** | Audit, Monitoring & Observability | **Phase 1** | Immutable audit log, Sentry integration, Prometheus metrics exporter |
| **EPIC-025** | Platform Admin & Tenant Governance | **Phase 1** | Subdomain routing, PostgreSQL RLS tenant isolation, Feature flag manager |
| **EPIC-018** | Notification & Communication Service| **Phase 2** | SendGrid email, Twilio SMS, In-app alerts, HMAC signed retryable Webhooks |
| **EPIC-019** | Search & Knowledge Service | **Phase 2** | Full-text & vector search indexer, typo-tolerant search, `Cmd+K` SearchDialog |
| **EPIC-021** | Workflow & Automation Service | **Phase 3** | Visual stage editor, multi-stage approval engine, SLA escalation timers |
| **EPIC-024** | Analytics & Reporting Service | **Phase 3** | Parameterized analytics views, hospital bed occupancy dashboard, CSV exports |
| **EPIC-020** | AI Platform Service | **Phase 4** | Agentic AI Gateway, SSE streaming LLM completions, prompt injection filters |
| **EPIC-022** | Billing & Subscription Service | **Phase 4** | Stripe Checkout integration, metered usage billing, subscription lifecycle |

---

## Quality Checklist & Definition of Done

Every remaining EPIC MUST satisfy the 11 universal quality gates:
1. **Clean Architecture Layering**: Strict domain isolation.
2. **Security Verification**: Input validation via Zod/Pydantic, zero secrets, Argon2id/JWT.
3. **Performance Targets**: Response P95 `< 150ms`, LCP `< 1.2s`, CLS `0.00`.
4. **Accessibility (A11y)**: WCAG 2.1 AA compliant, visible focus rings, ARIA landmarks.
5. **100% Passing Test Suites**: Vitest (`npm test`) and Pytest (`pytest`) 100% passing.
6. **Synchronous Documentation**: Handbook files updated alongside code changes.
