# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Content editor enhancements (`apps/admin`):
  - **Editor (10.4.5):** rich text editor with formatting toolbar and keyboard
    shortcuts, debounced autosave, live preview, global keyboard shortcuts
    (`Ctrl/Cmd+S`, `Ctrl/Cmd+P`), and unsaved-changes `beforeunload` guard.
  - **Workflow (10.4.6):** content workflow state machine with approval,
    publishing, scheduling, and archiving, surfaced via a workflow panel.
  - **Version History (10.4.7):** version snapshots with compare (LCS diff),
    restore, diff view, and per-version comments.
  - **SEO (10.4.8):** OpenGraph, JSON-LD schema (validated), canonical, robots,
    and legacy-path redirects with a live social preview.
  - **Quality (10.4.9):** unit + integration tests for slug, markdown,
    diff, workflow, versioning, content store, and content client; plus
    performance and accessibility improvements, and `docs/CONTENT_EDITOR.md`.

## [0.1.0] - 2026-07-11

### Added

- Monorepo foundation using Turborepo and npm workspaces.
- `apps/web`: public Next.js 15 web application (App Router, React 19, Tailwind).
- `apps/admin`: internal admin dashboard.
  - Analytics API endpoints: Daily Patients, Revenue, Doctor Performance,
    Queue Statistics, Bed Occupancy, and Overview.
  - Optimized, parameterized PostgreSQL queries (`src/lib/queries.ts`).
  - Database schema and index migrations under `apps/admin/sql/`.
  - Zod-validated query parameters and JSON error handling.
  - Vitest test suite covering queries, validation, and the service layer.
- `packages/*`: shared `ui`, `config`, `types`, and `utils` packages.
- Documentation: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`,
  `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, and `LICENSE`.
- Repository tooling: `.gitignore`, `turbo.json`, shared TypeScript config,
  and ESLint configuration.

[Unreleased]: https://github.com/sathiyamurthyr/sathus-platform/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/sathiyamurthyr/sathus-platform/releases/tag/v0.1.0
