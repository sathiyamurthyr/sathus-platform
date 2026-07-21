# Platform Administration Center Architecture

Clean Architecture and Domain-Driven Design (DDD) for Sathus Cloud Administration.

## Layers
1. **Domain Layer**: `types/index.ts` defining `AdminOverviewMetrics`, `PlatformSettingItem`, `AdminActivityEvent`, and `AdminNavigationItem`.
2. **Data Provider Layer**: `data/mock-admin-data.ts` aggregating metrics across tenant, workspace, billing, AI, and observability domain providers.
3. **Presentation Layer**: `components/PlatformAdminFoundationView/index.tsx` presenting executive telemetry, setting management, and searchable audit logs.
4. **RBAC & Authorization**: Restricts access to Platform Owners, Platform Administrators, System Administrators, Security Administrators, and Support Engineers.
