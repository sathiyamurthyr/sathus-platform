# Agent Security Framework (Story 27.13)

Zero-trust security policy enforcement, prompt injection detection, PII credential masking, and DLP hooks.

## Features
- **Prompt Injection Defense**: Evaluates incoming prompts against threat signatures.
- **PII & Data Redaction**: Automatic regex & entity extraction masking sensitive credentials before LLM dispatch.
- **Data Scoping**: Tenant-scoped RLS policies.

## APIs
- `GET /api/v1/agent-security/policies` — List active security policies and blocked attempt metrics.
- `POST /api/v1/agent-security/evaluate` — Evaluate policy compliance for an execution request.
