# Organization & Tenant Management (Story 15.2)

Multi-tenant hierarchy and lifecycle provisioning engine for Sathus Cloud.

## Domain Model & Hierarchy
Platform → Organization → Tenant → Workspace → Projects.

## Features
- **Organization Management**: Create, update, archive, and transfer ownership of organizations (Acme Global, FinTech Labs, BioHealth AI).
- **Tenant Provisioning**: 1-click provisioning wizard with environment scoping (Production, Staging, Development), custom domain alias (`acme.sathus.cloud`), user seat limits, and storage quotas.
- **Tenant Lifecycle**: Suspend, Activate, Archive, and Restore tenant instances with operational isolation.
