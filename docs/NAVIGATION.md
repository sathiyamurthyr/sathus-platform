# Navigation — Tree, Menu, Node & Versioning

This document covers the Navigation feature (`apps/admin/src/features/navigation` and `src/Sathus.Navigation.*`) delivered as **FEATURE 10.6**.

## 10.6.1 — Domain Model

- **`NavigationTree`** (Aggregate Root): platform-scoped tree with default locale, description, status, and child menus.
- **`NavigationMenu`** (Aggregate Root): typed menu (Header, Footer, Sidebar, Mobile, Legal) belonging to a tree.
- **`NavigationNode`** (Entity): tree nodes with types (Link, Heading, Separator, Group), route path, target, reference kind, visibility rules, permissions, localizations, and sort order.
- **`NavigationVersion`** (Entity): immutable version snapshots with status (Draft, InReview, Approved, Scheduled, Published, Archived), created-by metadata, and scheduling support.

Value objects and enums enforce invariants (platform codes, menu types, node item types, target types, reference kinds, visibility rule types, menu status).

## 10.6.2 — Application Layer

CQRS via MediatR:

- **Commands**: `CreateTree`, `ArchiveTree`, `CreateMenu`, `UpdateMenu`, `AddNavigationNode`, `UpdateNavigationNode`, `RemoveNavigationNode`, `CreateVersion`, `PublishMenu`, `SchedulePublish`, `RollbackMenu`.
- **Queries**: `GetTree`, `GetTrees`, `GetMenu`, `GetVersions`, `GetPublishedMenu`, `PreviewMenu`.
- **Validators**: FluentValidation for every command/query input.
- **Specifications**: reusable domain filters for active menus, current versions, scheduled publishes, visibility rules.

## 10.6.3 — Infrastructure & API

- **EF Core** repositories with `NavigationDbContext` and `ValueConverters` for enums/value objects.
- **REST API** under `/api/v1/navigation/admin/...` with `NavigationAdminController`, `SchedulePublishController`, and `PreviewController`.
- **Health checks**: `NavigationHealthCheck` validates database reachability.

## 10.6.4 — Admin Frontend Workspace

`apps/admin/src/features/navigation/workspace` provides:

- **Tree Editor** (`TreeEditor.tsx`): platform-based tree selection, create/archive actions.
- **Node Editor** (`NodeEditor.tsx`): add/edit/remove nodes, sort order, visibility, permissions, localizations, and references.
- **Version History** (`VersionHistory.tsx`): list versions, compare, restore.
- **Publish Dialog** (`PublishDialog.tsx`): publish current version or schedule with datetime picker.
- **Preview Panel** (`PreviewPanel.tsx`): live preview of the rendered menu tree.
- **API Client** (`navigation-api.ts`): typed methods with `fetch`, auth headers, and 401 handling.
- **Workspace Hooks** (`use-navigation-workspace.ts`): React Query hooks for trees, menus, nodes, versions, publish, schedule, rollback, and preview.

## 10.6.5 — Quality

- **Backend tests**: 31 passing tests covering commands, queries, validators, specifications, and repository behavior.
- **Frontend tests**: DTO shape tests, API request-building and serialization tests (mocked `fetch`).
- **Build**: TypeScript typecheck and Next.js build pass cleanly.
- **Patterns**: Clean Architecture, DDD, CQRS, repository pattern, value objects, domain events.

## 10.6.6 — Outstanding Items

- Register `Sathus.Navigation.*` projects in `Sathus.sln`.
- Add end-to-end integration tests for the API.
- Expand frontend workspace with drag-and-drop node ordering.
