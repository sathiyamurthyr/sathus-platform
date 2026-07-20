# 14 — Testing Strategy

**Document:** 14_TESTING_STRATEGY.md  
**Owner:** QA Lead & Staff Software Engineer  
**Status:** Active  

---

## Executive Summary

Quality assurance across the Sathus Platform is enforced through a **Polyglot Multi-Tier Testing Pyramid**. Automated test suites run in local development hooks and CI/CD pipelines to guarantee regression-free execution across TypeScript, Python, and .NET components.

This document details test runners, setup environments, browser DOM mocking, test execution commands, and zero-flakiness policies.

---

## Polyglot Testing Pyramid Architecture

```
                  ┌────────────────────────┐
                  │    E2E Tests (5%)      │  Playwright / Cypress
                  ├────────────────────────┤
                  │ Integration Tests (25%)│  RTL, Async TestClient, xUnit
                  ├────────────────────────┤
                  │   Unit Tests (70%)     │  Vitest, Pytest, xUnit
                  └────────────────────────┘
```

---

## Testing Tools & Framework Matrix

| Subsystem / Workspace | Test Runner | Assertion Library | DOM / Execution Environment | Setup File Location |
| :--- | :--- | :--- | :--- | :--- |
| **`apps/web`** | Vitest (`v2.1.9`) | `@testing-library/react` | `jsdom` | `apps/web/src/__tests__/setup.ts` |
| **`apps/admin`** | Vitest (`v2.1.9`) | `@testing-library/react` | `jsdom` | `apps/admin/src/test/setup.ts` |
| **`apps/api`** | Pytest (`^8.0`) | Built-in / AsyncIO | Async HTTP TestClient | `apps/api/tests/conftest.py` |
| **`src/*` (.NET)** | xUnit | FluentAssertions | .NET 9 Test SDK | `src/*.Tests` |

---

## Critical Test Setup Configurations

### React Global & Browser Mocks Setup (`apps/web/src/__tests__/setup.ts`)

To prevent common Vitest/JSDOM runtime errors, `setup.ts` MUST configure global `React`, `matchMedia`, and `IntersectionObserver` mocks:

```ts
import React from 'react';
import '@testing-library/jest-dom';

// 1. Ensure global React availability for JSX transform in test scope
(globalThis as unknown as { React: typeof React }).React = React;

// 2. Mock Window matchMedia API
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// 3. Mock IntersectionObserver for Framer Motion & Scroll Animations
class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});
```

---

## Test Execution Commands

### Run All Monorepo JS/TS Tests
```bash
npm test
# Orchestrated by Turborepo across web, admin, and shared packages
```

### Run Python Backend Pytest Suite (`apps/api`)
```bash
python -m pytest
```

### Run .NET C# Test Suite (`src/*`)
```bash
dotnet test src/Sathus.sln
```

---

## Zero Flakiness & Quality Policy

1. **No Flaky Tests**: Any test that exhibits intermittent failure in CI will be quarantined and fixed immediately.
2. **Isolation**: Tests MUST NOT depend on external live network services; use mocks, stubs, or in-memory fixtures.
3. **Async Clean-Up**: Database fixtures and async loops MUST clean up state after execution.
