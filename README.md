# Sathus Platform

> Enterprise-grade monorepo for the Sathus Platform: a hospital analytics and
> operations platform with a public web presence, an internal admin dashboard,
> and a shared component/design-system foundation.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Monorepo: Turbo](https://img.shields.io/badge/Monorepo-Turbo-ef4444.svg)](https://turbo.build)
[![Package Manager: npm](https://img.shields.io/badge/package%20manager-npm-CB3837.svg)](https://www.npmjs.com/)

---

## Overview

Sathus Platform is organized as a single, version-controlled monorepo managed
with **Turborepo** and **npm workspaces**. It ships multiple deployable
applications alongside reusable internal packages, enabling consistent tooling,
shared types, and a unified release pipeline.

| Area | Description |
| --- | --- |
| `apps/web` | Public-facing Next.js 15 marketing/web application. |
| `apps/admin` | Internal admin dashboard exposing hospital analytics APIs. |
| `apps/docs` | Documentation site. |
| `packages/ui` | Shared UI components and design-system primitives. |
| `packages/config` | Shared configuration presets. |
| `packages/types` | Cross-app TypeScript type definitions. |
| `packages/utils` | Shared utility functions. |

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, TypeScript strict)
- **Monorepo:** Turborepo + npm workspaces
- **Styling:** Tailwind CSS with design tokens
- **Validation:** Zod
- **Data:** PostgreSQL (parameterized queries via `pg`)
- **Tooling:** ESLint, TypeScript, Vitest

## Repository Structure

```
.
├── apps/                 # Deployable applications
│   ├── admin/            # Admin dashboard + analytics APIs
│   ├── docs/             # Documentation site
│   └── web/              # Public web application
├── packages/             # Shared internal packages
│   ├── config/
│   ├── types/
│   ├── ui/
│   └── utils/
├── docs/                 # Product/strategy documentation
├── scripts/              # Repo automation scripts
├── .github/              # GitHub metadata (templates, actions)
├── turbo.json            # Turborepo pipeline
└── package.json          # Workspace root
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 10

### Install

```bash
git clone https://github.com/sathiyamurthyr/sathus-platform.git
cd sathus-platform
npm install
```

### Develop

Run all workspaces in parallel:

```bash
npm run dev
```

Run a specific app (example):

```bash
cd apps/admin
npm run dev
```

### Useful Scripts (root)

| Command | Description |
| --- | --- |
| `npm run build` | Build all workspaces via Turborepo. |
| `npm run dev` | Start all dev servers in parallel. |
| `npm run lint` | Lint all workspaces. |
| `npm run typecheck` | Type-check all workspaces. |
| `npm run test` | Run all workspace test suites. |
| `npm run clean` | Remove build artifacts and `node_modules`. |

## Admin Dashboard APIs

The `apps/admin` service exposes optimized, SQL-backed hospital analytics:

| Endpoint | Purpose |
| --- | --- |
| `GET /api/admin/analytics/daily-patients` | Daily visit volume by type and unique patients. |
| `GET /api/admin/analytics/revenue` | Revenue, discounts, and outstanding by day/department. |
| `GET /api/admin/analytics/doctor-performance` | Per-doctor visits, revenue, and consult times. |
| `GET /api/admin/analytics/queue-statistics` | Queue wait/service times and ticket disposition. |
| `GET /api/admin/analytics/bed-occupancy` | Real-time bed utilization by ward. |
| `GET /api/admin/analytics/overview` | Range KPI rollup. |

See [`apps/admin/README.md`](apps/admin/README.md) for request/response details.

## Continuous Integration

This repository is structured to adopt **GitHub Actions** for CI/CD. Recommended
workflows (to be added later — none are enabled yet) are documented in
[`CONTRIBUTING.md`](CONTRIBUTING.md#continuous-integration).

## Contributing

We welcome contributions. Please read
[`CONTRIBUTING.md`](CONTRIBUTING.md) for branch strategy, commit conventions,
and the pull-request process, and [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)
for community standards.

## Security

Report vulnerabilities privately per [`SECURITY.md`](SECURITY.md). **Do not**
open public issues for security problems.

## License

Released under the [MIT License](LICENSE).
