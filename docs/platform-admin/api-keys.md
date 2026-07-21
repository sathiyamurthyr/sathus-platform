# API Keys & Secret Governance (Story 15.7)

API key lifecycle management, scope isolation, and rotation engine.

## Supported Key Types
- **Server Secret (`sk_live_`)**: Confidential backend-to-backend integrations.
- **Client Public (`pk_test_`)**: Frontend client sandbox applications.
- **Read Only (`ro_live_`)**: Scoped reporting and analytics access.
- **Admin Privilege (`admin_live_`)**: Full administrative API key.

## Secret Rotation Engine
1-click secret key rotation with zero downtime transition period.
