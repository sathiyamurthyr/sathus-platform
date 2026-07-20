# 03 — Development Standards

**Document:** 03_DEVELOPMENT_STANDARDS.md  
**Owner:** Engineering Council  
**Status:** Active  

---

## Executive Summary

To maintain enterprise-grade software quality across a polyglot monorepo containing TypeScript (Next.js 15, React 19), Python (FastAPI, SQLAlchemy), and C# (.NET 9), all contributors must follow unified engineering practices.

This document codifies code design principles (SOLID, DRY, KISS), language-specific conventions, monorepo package rules, Git branch strategies, commit standards, code review protocols, and the official **Definition of Done (DoD)**.

---

## Core Engineering Principles

### 1. SOLID Principles
- **Single Responsibility Principle (SRP)**: Each component, module, or class must have exactly one reason to change.
- **Open/Closed Principle (OCP)**: Software entities should be open for extension, but closed for modification.
- **Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types.
- **Interface Segregation Principle (ISP)**: Clients should not be forced to depend upon interfaces they do not use.
- **Dependency Inversion Principle (DIP)**: Depend upon abstractions, not concretions.

### 2. DRY (Don't Repeat Yourself) & KISS (Keep It Simple, Stupid)
- Never duplicate business logic, schema validation, or UI styling across feature boundaries.
- Extract common patterns into `@sathus-platform/utils` or `@sathus-platform/ui`.
- Prefer simple, explicit implementations over complex over-engineered abstractions.

---

## Language & Framework Coding Conventions

### TypeScript & React Standards (`apps/web`, `apps/admin`, `packages/*`)

1. **Strict Type Safety**: `noImplicitAny`, `strictNullChecks`, and `noUnusedLocals` are enabled. Explicitly define return types for exported functions.
2. **Explicit React Imports**: Always include `import React from 'react';` at the top of `.tsx` files to guarantee compatibility with test environments and Vitest transformers.
3. **Named Exports**: Prefer named exports over default exports for components and utility modules to improve refactoring stability.
4. **File & Folder Naming**:
   - Components: `PascalCase.tsx` or `index.tsx` inside component directory (`components/ContactForm/index.tsx`).
   - Hooks: `useCamelCase.ts` (`hooks/useUploadQueue.ts`).
   - Utilities & Helpers: `kebab-case.ts` (`lib/content-store.ts`).

### Python & FastAPI Standards (`apps/api`)

1. **Type Annotations**: All function signatures, data attributes, and service interfaces must be fully type-hinted (`Pydantic v2` / Python type hints).
2. **Async Execution**: Use `async def` for all FastAPI router endpoints and database operations using SQLAlchemy 2.0 Async engine.
3. **PEP 8 Compliance**: Code must adhere strictly to PEP 8 styling guidelines.
4. **Error Handling**: Raise domain exceptions (`HTTPException` wrappers or custom domain errors) with structured details.

### C# & .NET 9 Standards (`src/*`)

1. **Clean Architecture Naming**:
   - Interfaces: `I` prefix (`IContentRepository`, `IAssetProcessingPipeline`).
   - Command/Query Handlers: `[Verb][Entity][Command/Query]Handler` (`UploadChunkCommandHandler`).
   - Value Objects: Immutable classes or records with static creation methods (`FileName.Create(...)`).

---

## Git Workflow & Branch Strategy

```
  main (production) ────────────────────────────────────────────────────────►
     ▲
     │ PR (squash merge + CI checks pass)
  release/v1.x.x ──────────────────────────────────────────────────────────►
     ▲
     │ PR
  feature/FEATURE-XXX ───────────────────────────┐
     ▲                                           │
     │ Commits                                   ▼
  (Developer Local Branch)                    CI Checks (lint, typecheck, test)
```

### Branch Naming Protocol

- Features: `feature/FEATURE-[ID]-[short-description]` (e.g., `feature/FEATURE-025.1-admin-domain`)
- Bug Fixes: `fix/FIX-[ID]-[short-description]` (e.g., `fix/FIX-104-react-import-error`)
- Documentation: `docs/[short-description]` (e.g., `docs/ai-context-handbook`)
- Refactoring: `refactor/[short-description]`

### Commit Messages (Conventional Commits)

All commits MUST follow the Conventional Commits specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

**Allowed Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.  
**Example**: `feat(web): add LCS diff viewer to version history panel`

---

## Code Review Checklist

Before opening or approving a Pull Request, verify:

- [ ] **Type Check**: `npm run typecheck` passes with zero errors across the monorepo.
- [ ] **Linter**: `npm run lint` completes cleanly without syntax or rule violations.
- [ ] **Tests**: `npm test` and `pytest` pass 100% without flaky test failures.
- [ ] **No Hardcoded Secrets**: Credentials, API keys, and private tokens are loaded exclusively via environment variables.
- [ ] **Clean Code**: No `console.log`, commented-out dead code, or temporary debug logic.
- [ ] **Documentation**: OpenAPI schemas, docstrings, and handbook entries updated where relevant.

---

## Official Definition of Done (DoD)

A feature or user story is considered **DONE** if and only if:

1. **Functional**: Meets 100% of defined acceptance criteria.
2. **Tested**: Unit and integration tests written and passing; coverage threshold met.
3. **Type-Safe**: Zero TypeScript or Python type errors.
4. **Accessible**: WCAG 2.1 AA compliant (verified via manual or automated audit).
5. **Secure**: Inputs validated, SQL queries parameterized, security headers maintained.
6. **Reviewed**: Approved by at least one peer engineer or technical lead.
7. **Documented**: Relevant files in `docs/` and `docs/ai-context/` updated.
