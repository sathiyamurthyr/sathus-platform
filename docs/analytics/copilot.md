# Executive AI Copilot Architecture & Natural Language Q&A

Sathus Cloud Executive AI Copilot Assistant.

## 1. Overview
Enables natural language conversational analytics for C-suite executives and business analysts ("What caused revenue to drop last month?", "Which tenants are growing fastest?").

## 2. Query Pipeline
1. **Natural Language Understanding**: Parses user intent and identifies targeted metrics.
2. **Telemetry Aggregation**: Fetches aggregated time-series data from PostgreSQL 16 and Redis 7.2.
3. **Narrative & Visual Generation**: Generates narrative explanations, supporting charts (Bar, Line, Pie), and drill-down links.
4. **Tenant Isolation & RBAC**: Enforces strict RBAC and multi-tenant scoping.
