# MANIFESTO

**Document:** Engineering & Design Manifesto  
**Owner:** Engineering Council  
**Last Updated:** 2026-07-11

---

## Purpose

The Manifesto is the moral compass of the project. It defines how we build, why we build that way, and the non-negotiables that survive every organizational change.

It is short by design. Long documents are read once and forgotten; a concise manifesto is quoted daily.

---

## Goals

- Codify non-negotiable engineering values
- Create a shared vocabulary for trade-off discussions
- Reduce friction in cross-team decision making
- Attract contributors whose values align with the platform

## Table of Contents

1. [Purpose](#purpose)
2. [Goals](#goals)
3. [Core Beliefs](#core-beliefs)
4. [Engineering Principles](#engineering-principles)
5. [Quality Standards](#quality-standards)
6. [Collaboration Model](#collaboration-model)
7. [Change Protocol](#change-protocol)

---

## Core Beliefs

### 1. Platform Over Product

We build systems, not screens. The web layer is infrastructure. Non-functional requirements — performance, accessibility, scalability — are first-class citizens.

### 2. Clarity Over Cleverness

Readability is a feature. Code is read far more often than it is written. Complexity must be justified with measurable value.

### 3. Ship Standards, Not Shortcuts

Velocity is precious, but not at the cost of structural integrity. We err on the side of discipline; technical debt is named, tracked, and repaid on a schedule.

### 4. User Sovereignty

Developers using this platform retain full control of their data, their deployments, and their workflows. Every abstraction we introduce must be leakable and replaceable.

### 5. Transparency By Default

Design decisions, architectural trade-offs, and roadblocks are documented publicly. The default state of knowledge is shared, not siloed.

---

## Engineering Principles

### Principle I: Type Safety Is Not Optional

TypeScript is the contract between production and consumption. `any` is a bug that has not shipped yet.

**Rules:**
- Strict mode is enforced at the compiler level.
- No type assertions without an inline explanation for reviewers.
- Shared types (`packages/types`) are the single source of truth.

### Principle II: The Monorepo Is Sacred

The monorepo structure is a contract. Every package boundary reflects a dependency boundary.

**Rules:**
- No app should depend on another app.
- Shared code lives in `packages/`.
- Cross-package dependencies flow in one direction: `apps/` → `packages/`.

### Principle III: Infrastructure Is Code

Environment configuration, database schemas, CI pipelines, and deployment manifests are version-controlled and peer-reviewed.

**Rules:**
- No hand-editing of production infrastructure.
- All migrations are reversible.
- Secrets never enter version control.

### Principle IV: Performance Is a Requirement

We measure and optimize for Core Web Vitals. A slow platform is a failed platform.

**Rules:**
- Bundle budgets are enforced in CI.
- Image processing, font loading, and third-party scripts are audited quarterly.
- Every framework decision is evaluated against runtime impact.

### Principle V: Accessibility Is Uncompromising

The platform is unusable if it is not usable by everyone. WCAG 2.1 AA is the baseline.

**Rules:**
- Automated and manual accessibility testing in every PR.
- Color contrast ratios verified before palette approval.
- Semantic HTML is a prerequisite, not an afterthought.

### Principle VI: Documentation Is Code

If it is not documented, it does not exist. Documentation is reviewed with the same rigor as source code.

**Rules:**
- Every public API has a doc string and a usage example.
- Architecture decisions are recorded in ADRs.
- README files are owned by the team that owns the code.

---

## Quality Standards

### Code Review

Every change requires:
- At least one approving review from a maintainer
- Passing lint, type check, and test suites
- Manual verification against the Definition of Done

### Definition of Done

A feature is not "done" until:
1. Implementation is complete and reviewed
2. Unit and integration tests pass
3. Documentation is updated
4. Accessibility audit passes
5. Performance budget is within tolerance

---

## Collaboration Model

We organize by product vertical, not technology layer.

- **Each app** owns its feature set end-to-end.
- **Each package** has a designated maintainer.
- **Cross-cutting concerns** are handled by working groups, not individuals.

Decision hierarchy (fastest to slowest):
1. Team consensus
2. Working group review
3. Engineering council ratification
4. Executive steering committee
