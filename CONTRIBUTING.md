# Contributing to Sathus Platform

Thank you for your interest in contributing to Sathus Platform. This document
explains how to work in this repository so that reviews, CI, and releases stay
predictable and high quality.

## Code of Conduct

By participating in this project you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, inclusive, and
constructive.

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies from the workspace root:
   ```bash
   npm install
   ```
3. Create a feature branch from `main` (see Branching Strategy below).
4. Make your changes, keeping them focused and well-tested.
5. Run the local quality gates before pushing:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

## Branching Strategy

| Branch type | Pattern | Example |
| --- | --- | --- |
| Main | `main` | protected, always releasable |
| Feature | `feat/<short-description>` | `feat/bed-occupancy-alerts` |
| Fix | `fix/<short-description>` | `fix/revenue-rounding` |
| Chore | `chore/<short-description>` | `chore/bump-deps` |
| Docs | `docs/<short-description>` | `docs/api-reference` |

Protected branches require passing CI and at least one approving review before
merge.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body> (optional)
<footer> (optional)
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`.
Scopes map to apps/packages, e.g. `feat(admin): add bed occupancy endpoint`.

## Pull Requests

- Keep PRs small and single-purpose.
- Fill out the PR template; link the related issue.
- Ensure CI is green and `main` is merged into your branch before requesting
  review.
- Add or update tests for behavioral changes.
- Update `CHANGELOG.md` under `Unreleased` for user-facing changes.

## Coding Standards

- TypeScript in `strict` mode; avoid `any`.
- Prefer shared `packages/*` for reused logic, types, and UI.
- All SQL must be parameterized; never interpolate user input into queries.
- Validate external input (API params, env) with Zod.
- Follow existing formatting (ESLint + Prettier-compatible defaults).

## Reporting Bugs & Requesting Features

- Use GitHub Issues with a clear, reproducible description.
- For security issues, follow [SECURITY.md](SECURITY.md) — **do not** file a
  public issue.

## Continuous Integration

This repo is designed to run the following **GitHub Actions** (recommended, but
**not yet enabled** — no workflow files exist yet):

| Workflow | Purpose |
| --- | --- |
| `ci.yml` | Install, lint, typecheck, and test on push/PR (Node 18 & 20 matrix). |
| `build.yml` | Production build of all apps via Turborepo. |
| `dependency-review.yml` | Block vulnerable dependency changes in PRs. |
| `codeql.yml` | GitHub code scanning (JavaScript/TypeScript). |
| `lint-pr-title.yml` | Enforce Conventional Commit PR titles. |
| `stale.yml` | Mark and close stale issues/PRs. |
| `release.yml` | Tag and publish releases on `main` merges. |

When these are introduced, place them under `.github/workflows/` and wire the
required repository secrets (e.g. `DATABASE_URL`, `NPM_TOKEN`).

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).
