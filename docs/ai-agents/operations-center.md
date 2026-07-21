# AI Operations Center & Deployment Manager (Story 27.10)

Centralized administration console for tracking production agent deployments, token consumption, budget limits, response latency, and error rates.

## Features
- **Deployment Control**: Pause and resume live agent deployments across production, staging, and development environments.
- **Resource & Token Monitoring**: Tracks monthly LLM token usage and USD costs with budget threshold alerts.
- **Health Metrics**: Real-time monitoring of response latencies (P95) and SLA error rates.

## APIs
- `GET /api/v1/ai-operations/overview` — Get aggregate deployment, token, and cost metrics.
- `GET /api/v1/agent-deployments` — List production deployments and deployment statuses.
- `PATCH /api/v1/agent-deployments/:id/status` — Pause or resume agent deployment.
