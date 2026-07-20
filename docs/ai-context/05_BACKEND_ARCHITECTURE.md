# 05 — Backend Architecture

**Document:** 05_BACKEND_ARCHITECTURE.md  
**Owner:** Staff Backend Engineer & Systems Architect  
**Status:** Active  

---

## Executive Summary

The backend layer of the Sathus Platform utilizes a **Dual Polyglot Architecture**:
1. **Python 3.14 FastAPI Microservices (`apps/api`)**: High-concurrency async services powering Identity, Media, Notification, Reporting, Search, Workflow, Audit, Integration, and AI Gateway functions.
2. **.NET 9 C# Clean Architecture Microservices (`src/*`)**: Enterprise-grade domain services for Content, Forms, Navigation, Processing, Media Relations, and Chunked Uploads.

This document details the architectural layout, service layer patterns, repository implementations, dependency injection, and caching strategies.

---

## Python FastAPI Architecture (`apps/api`)

### Layered Microservice Structure

Each domain module inside `apps/api/app/[domain]/` follows a strict clean architecture separation:

```
apps/api/app/
├── core/                       # Shared infrastructure (database, config, middleware, security)
│   ├── config.py               # Pydantic BaseSettings environment validation
│   ├── database.py             # SQLAlchemy 2.0 Async engine & get_db dependency
│   ├── middleware.py           # Timing, CORS, Exception handling middleware
│   └── security.py             # JWT token creation & Argon2 password hashing
├── identity/                   # Identity domain microservice
│   ├── api/                    # Endpoint routers & FastAPI schemas
│   ├── application/            # User authentication & registration application services
│   ├── domain/                 # Models, password hashing, auth exceptions
│   └── infrastructure/         # SQLAlchemy user repositories
├── media/                      # Media domain microservice
│   ├── api/                    # Upload & asset endpoints
│   ├── application/            # Media processing & storage services
│   ├── domain/                 # Asset models, thumbnail rules, upload exceptions
│   └── infrastructure/         # S3, MinIO, Azure Blob & Local storage providers
├── workflow/                   # Workflow state machine domain
├── notification/               # Enterprise Notification Platform (Redis Priority Queues, Async Workers, Scheduler, Rate Limiter, DLQ)
│   ├── api/                    # Notification, Provider, Queue, Worker, Batch & DLQ admin endpoints
│   ├── application/            # NotificationService, WebhookService, RetryEngine (Exponential Backoff), RateLimiter, Scheduler, BatchProcessor, EventBusRouter
│   ├── domain/                 # Domain models, Email/SMS/Push providers, Failover engines, JobState & Queue interfaces
│   ├── workers/                # Dedicated async background workers (EmailWorker, SmsWorker, PushWorker, WebhookWorker, InAppWorker, WorkerManager)
│   └── infrastructure/         # SQLAlchemy job/history repositories & RedisNotificationQueue (Priority ZSET/LIST + DLQ + In-Memory fallback)
├── reporting/                  # Analytics & aggregated reports service
├── search/                     # Search indexing & retrieval service
├── audit/                      # Audit trail event logger
├── integration/                # External webhook & third-party hub
├── ai/                         # Agentic AI assistant gateway
└── main.py                     # Root FastAPI application instance
```

---

## .NET 9 Clean Architecture (`src/*`)

The .NET services are structured into four clean architecture projects per domain:

```
src/
├── Sathus.Content.Api/           # Controllers, Middleware, Swagger setup
├── Sathus.Content.Application/   # Use cases, Commands, Queries, DTOs
├── Sathus.Content.Domain/        # Entities, Value Objects, Domain Events
├── Sathus.Content.Infrastructure/# EF Core DbContext, Storage Adapters
└── Sathus.SharedKernel/          # Common Base Entity, Value Objects, Result Types
```

---

## Repository & Service Layer Pattern

All database interactions MUST be mediated by a repository interface to decouple persistence logic from business rules.

### Python SQLAlchemy Async Repository Pattern (`apps/api`)

```python
# app/identity/infrastructure/repositories.py
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.identity.infrastructure.models import User

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: string) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, email: str, password_hash: str) -> User:
        user = User(email=email, password_hash=password_hash)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
```

---

## Caching Strategy & Background Execution

1. **Redis Query Caching**: High-frequency queries (tenant configuration, navigation tree summaries, user roles) are cached in Redis with a configurable TTL (default: 300 seconds).
2. **Surrogate Key Invalidation**: When content or navigation trees are modified, Redis cache keys tagged with the domain surrogate key are invalidated instantly.
3. **Async Processing**: Long-running operations (media thumbnail generation, webhook retries, analytics aggregation) are offloaded to background task workers or Redis event queues.
