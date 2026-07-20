# 12 — API Standards & Contracts

**Document:** 12_API_STANDARDS.md  
**Owner:** Technical Architect & API Lead  
**Status:** Active  

---

## Executive Summary

The Sathus Platform enforces strict **RESTful API Design Standards** across all Python FastAPI (`apps/api`), Next.js Route Handlers (`apps/admin`, `apps/web`), and .NET 9 API controllers (`src/*`).

This document details URL structure, HTTP verb semantics, RFC 7807 error envelopes, request/response validation, OpenAPI 3.0 specification auto-generation, and rate limiting headers.

---

## Endpoint Naming & HTTP Semantics

- **URL Prefix**: All API endpoints MUST be prefixed with `/api/v1/[domain]`.
- **Resource Naming**: Plural nouns in lower-kebab-case (e.g. `/api/v1/auth/register`, `/api/v1/admin/analytics/daily-patients`, `/api/v1/media/assets`).

| Method | Path | Action / Intent | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/content/articles` | Retrieve paginated list of articles | `200 OK` |
| `GET` | `/api/v1/content/articles/:id` | Retrieve single article by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/v1/content/articles` | Create new article | `201 Created` |
| `PUT` | `/api/v1/content/articles/:id` | Replace entire article entity | `200 OK` |
| `PATCH` | `/api/v1/content/articles/:id` | Partial update of article fields | `200 OK` |
| `DELETE` | `/api/v1/content/articles/:id` | Soft-delete / archive article | `204 No Content` / `200 OK` |

---

## RFC 7807 Problem Details Error Envelope

All API failure responses MUST conform to the **RFC 7807 Problem Details** format:

```json
{
  "type": "https://api.sathusplatform.com/errors/invalid-input",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "Validation failed for field 'email': Invalid email format.",
  "instance": "/api/v1/auth/register",
  "invalid_params": [
    {
      "name": "email",
      "reason": "Value 'test@invalid' is not a valid RFC 5322 email address."
    }
  ]
}
```

---

## OpenAPI 3.0 Auto-Generation & Documentation

1. **FastAPI (`apps/api`)**: OpenAPI 3.0 documentation is generated automatically by FastAPI at `/docs` (Swagger UI) and `/redoc`. All Pydantic models MUST include `Field(..., description="...")` metadata.
2. **Next.js Route Handlers**: Schemas MUST be declared via Zod and exported to standard OpenAPI contracts.
3. **.NET 9 Controllers**: Swashbuckle / Scalar is configured on all .NET projects to produce Swagger spec JSON files.

---

## Rate Limiting & Throttling Headers

All API responses MUST return token bucket rate limiting metadata:

- `X-RateLimit-Limit`: Maximum allowed requests per window (e.g. `100`).
- `X-RateLimit-Remaining`: Remaining request count in active window (e.g. `94`).
- `X-RateLimit-Reset`: Unix timestamp when request quota resets.
