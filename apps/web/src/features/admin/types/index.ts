// Story 15.1 Platform Administration Center Foundation Types

export interface AdminOverviewMetrics {
  platformHealthScorePercent: number;
  activeTenantsCount: number;
  activeWorkspacesCount: number;
  totalActiveUsersCount: number;
  totalStorageUsedGB: number;
  totalStorageLimitGB: number;
  monthlyRevenueMRR: number;
  annualRevenueARR: number;
  activeSubscriptionsCount: number;
  aiRequestsMonthly: number;
  workflowExecutionsMonthly: number;
  activeAlertsCount: number;
  pendingInvitationsCount: number;
  licenseUsagePercent: number;
}

export type AdminSettingCategory =
  | 'general'
  | 'branding'
  | 'localization'
  | 'email'
  | 'security'
  | 'storage'
  | 'ai_gateway'
  | 'billing'
  | 'notifications'
  | 'search'
  | 'analytics'
  | 'feature_flags';

export interface PlatformSettingItem {
  key: string;
  category: AdminSettingCategory;
  title: string;
  description: string;
  valueType: 'boolean' | 'string' | 'number' | 'select';
  currentValue: any;
  options?: string[];
  isReadOnly?: boolean;
}

export type AdminActivityCategory =
  | 'config_change'
  | 'user_action'
  | 'tenant_event'
  | 'security_event'
  | 'billing_event'
  | 'workflow_event'
  | 'system_alert';

export interface AdminActivityEvent {
  id: string;
  title: string;
  description: string;
  category: AdminActivityCategory;
  severity: 'info' | 'warning' | 'critical';
  performedBy: string;
  performedByRole: string;
  targetResource: string;
  timestamp: string;
}

export interface AdminNavigationItem {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'governance' | 'infrastructure' | 'settings';
  icon: string;
  route: string;
  badge?: string;
}

// Story 15.2 Organization & Tenant Management Types

export type TenantStatus = 'active' | 'suspended' | 'archived' | 'provisioning';

export interface OrganizationItem {
  id: string;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  tenantCount: number;
  totalWorkspacesCount: number;
  planTier: 'Starter' | 'Pro' | 'Enterprise Scale';
  monthlySpendDollars: number;
  createdAt: string;
}

export interface TenantItem {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  environment: 'production' | 'staging' | 'development';
  status: TenantStatus;
  primaryDomain: string;
  allocatedStorageGB: number;
  usedStorageGB: number;
  activeUsersCount: number;
  userSeatLimit: number;
  createdAt: string;
}

// Story 15.3 Workspace Management Types

export interface WorkspaceItem {
  id: string;
  tenantId: string;
  tenantName: string;
  name: string;
  description: string;
  template: 'ai_rag_agent' | 'data_lakehouse' | 'cloud_microservices' | 'custom';
  memberCount: number;
  storageUsedGB: number;
  storageQuotaGB: number;
  aiRequestsMonthly: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Story 15.4 User Lifecycle Management Types

export type UserStatus = 'active' | 'pending_activation' | 'suspended' | 'terminated';

export interface UserItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  tenantId: string;
  tenantName: string;
  department: string;
  status: UserStatus;
  mfaEnabled: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  userName: string;
  ipAddress: string;
  deviceBrowser: string;
  location: string;
  loginAt: string;
  isCurrent: boolean;
}

// Story 15.5 Role & Permission Management (RBAC) Types

export type PermissionScope = 'platform' | 'organization' | 'tenant' | 'workspace';

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  scope: PermissionScope;
  isBuiltIn: boolean;
  assignedUserCount: number;
  permissions: string[];
}

export interface PermissionItem {
  id: string;
  module: 'analytics' | 'ai' | 'billing' | 'workflows' | 'observability' | 'settings' | 'users' | 'tenants';
  action: 'create' | 'read' | 'update' | 'delete' | 'execute' | 'admin';
  description: string;
}

export interface ABACPolicyRule {
  id: string;
  name: string;
  effect: 'allow' | 'deny';
  resource: string;
  condition: string;
  isEnabled: boolean;
}

