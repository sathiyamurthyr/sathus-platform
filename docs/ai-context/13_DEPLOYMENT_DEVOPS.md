# 13 — Deployment & DevOps

**Document:** 13_DEPLOYMENT_DEVOPS.md  
**Owner:** DevOps Lead & Infrastructure Engineer  
**Status:** Active  

---

## Executive Summary

The Sathus Platform is deployed using modern **Infrastructure as Code (IaC)**, automated **CI/CD via GitHub Actions**, and containerized delivery targeting edge web networks and multi-cloud Kubernetes / serverless infrastructure.

This document details Turborepo build caching, GitHub Actions workflows, Docker containerization, target environments, and the observability stack.

---

## CI/CD Pipeline Architecture

```mermaid
flowchart TD
    Push[Git Push / PR to main] --> GHA[GitHub Actions Runner]

    subgraph CI Pipeline (.github/workflows/ci.yml)
        Install[npm clean-install & setup Python/dotnet]
        Lint[turbo run lint]
        Typecheck[turbo run typecheck]
        UnitTest[npm test & pytest]
        Build[turbo run build]
    end

    GHA --> Install
    Install --> Lint
    Install --> Typecheck
    Install --> UnitTest
    Lint --> Build
    Typecheck --> Build
    UnitTest --> Build

    Build --> DeployGate{Branch?}
    DeployGate -- main --> Staging[Deploy to Staging Environment]
    DeployGate -- tag v*.*.* --> Prod[Deploy to Production Environment]
```

---

## Docker Containerization Strategy

### 1. Python FastAPI Microservices (`apps/api/Dockerfile`)

```dockerfile
FROM python:3.14-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Next.js Standalone Build (`apps/web` and `apps/admin`)

- Configured with `output: 'standalone'` in `next.config.ts`.
- Minimal Docker runtime image (< 120MB) using Node 20 Alpine.

---

## Deployment Environments Matrix

| Environment | Purpose | URL / Target | Trigger |
| :--- | :--- | :--- | :--- |
| **Development** | Local developer testing | `localhost:3000` (web), `localhost:3001` (admin), `localhost:8000` (api) | `npm run dev` / `turbo dev` |
| **Preview** | Feature branch PR validation | `https://pr-[id].preview.sathusplatform.com` | Automated on PR creation |
| **Staging** | Pre-release regression testing | `https://staging.sathusplatform.com` | Push to `main` branch |
| **Production** | Live customer traffic | `https://sathusplatform.com` | Signed Git Tag Release |

---

## Observability & Telemetry Stack

1. **Structured Logging**: All Python services use `structlog` to output JSON formatted logs containing `timestamp`, `level`, `trace_id`, `tenant_id`, and `path`.
2. **Error Tracking**: Integrated with Sentry for real-time error capture and stack trace alerting across Next.js and FastAPI.
3. **Metrics & Tracing**: Prometheus metrics endpoints exposed at `/metrics`; OpenTelemetry tracing headers propagated across HTTP boundaries.
