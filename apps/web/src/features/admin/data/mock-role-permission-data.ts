import type { RoleDefinition, PermissionItem, ABACPolicyRule } from '../types';

export const mockRoles: RoleDefinition[] = [
  {
    id: 'role-1',
    name: 'Platform Owner',
    description: 'Full super-administrative privileges across all platform organizations, tenants, and infrastructure.',
    scope: 'platform',
    isBuiltIn: true,
    assignedUserCount: 2,
    permissions: ['*'],
  },
  {
    id: 'role-2',
    name: 'Platform Admin',
    description: 'Administrative access for system settings, billing, user management, and tenant provisioning.',
    scope: 'platform',
    isBuiltIn: true,
    assignedUserCount: 5,
    permissions: ['tenants:manage', 'users:manage', 'billing:view', 'settings:update'],
  },
  {
    id: 'role-3',
    name: 'Organization Admin',
    description: 'Organization-level administrative control over child tenants, billing, and member roles.',
    scope: 'organization',
    isBuiltIn: true,
    assignedUserCount: 12,
    permissions: ['tenants:create', 'workspaces:manage', 'users:invite'],
  },
  {
    id: 'role-4',
    name: 'Tenant Admin',
    description: 'Full control over single tenant resources, workspaces, and workspace member access.',
    scope: 'tenant',
    isBuiltIn: true,
    assignedUserCount: 28,
    permissions: ['workspaces:manage', 'users:invite', 'billing:view'],
  },
  {
    id: 'role-5',
    name: 'Workspace Admin',
    description: 'Administrative control over workspace templates, AI agent models, and RAG data pipelines.',
    scope: 'workspace',
    isBuiltIn: true,
    assignedUserCount: 42,
    permissions: ['ai:execute', 'workflows:manage', 'data:read'],
  },
  {
    id: 'role-6',
    name: 'Business Analyst',
    description: 'Read-only access to executive BI dashboards, time-series metrics, and visual report builder.',
    scope: 'workspace',
    isBuiltIn: true,
    assignedUserCount: 65,
    permissions: ['analytics:view', 'reports:create'],
  },
];

export const mockPermissions: PermissionItem[] = [
  { id: 'perm-1', module: 'tenants', action: 'create', description: 'Provision new child enterprise tenants' },
  { id: 'perm-2', module: 'tenants', action: 'update', description: 'Modify tenant quotas, domains, and branding' },
  { id: 'perm-3', module: 'users', action: 'create', description: 'Invite and onboard new workspace users' },
  { id: 'perm-4', module: 'analytics', action: 'read', description: 'View executive BI dashboards and reports' },
  { id: 'perm-5', module: 'ai', action: 'execute', description: 'Invoke AI Gateway models and vector RAG agents' },
  { id: 'perm-6', module: 'workflows', action: 'admin', description: 'Deploy and trigger automated workflow pipelines' },
];

export const mockABACPolicies: ABACPolicyRule[] = [
  {
    id: 'abac-1',
    name: 'Require MFA for Platform Admin Operations',
    effect: 'deny',
    resource: 'platform:settings',
    condition: 'user.mfa_enabled == false',
    isEnabled: true,
  },
  {
    id: 'abac-2',
    name: 'Restrict High-Value Export to Business Hours',
    effect: 'allow',
    resource: 'reports:export',
    condition: 'request.time >= 08:00 && request.time <= 20:00',
    isEnabled: true,
  },
];
