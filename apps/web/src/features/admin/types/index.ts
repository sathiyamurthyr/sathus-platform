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

// Story 15.6 Enterprise Security Center Types

export interface SecurityMetricOverview {
  securityHealthScore: number;
  mfaAdoptionPercent: number;
  activeSessionsCount: number;
  blockedLoginAttempts24h: number;
  trustedDevicesCount: number;
  suspiciousActivityAlertsCount: number;
}

export interface IPRuleItem {
  id: string;
  ipAddressOrCidr: string;
  ruleType: 'allow' | 'block';
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface TrustedDeviceItem {
  id: string;
  userId: string;
  userName: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  lastUsedAt: string;
  ipAddress: string;
  isTrusted: boolean;
}

// Story 15.7 API Keys & Developer Portal Types

export type APIKeyType = 'server' | 'client' | 'read_only' | 'admin' | 'temporary';

export interface DeveloperApp {
  id: string;
  name: string;
  description: string;
  environment: 'production' | 'sandbox';
  keyCount: number;
  monthlyCalls: number;
  createdAt: string;
}

export interface APIKeyItem {
  id: string;
  appId: string;
  appName: string;
  name: string;
  keyPrefix: string;
  maskedKey: string;
  keyType: APIKeyType;
  scopes: string[];
  rateLimitPerMin: number;
  lastUsedAt: string;
  expiresAt: string | null;
  status: 'active' | 'revoked';
}

export interface WebhookSubscription {
  id: string;
  targetUrl: string;
  subscribedEvents: string[];
  secretMasked: string;
  status: 'active' | 'failing';
  deliverySuccessPercent: number;
  createdAt: string;
}

// Story 15.8 License & Subscription Administration Types

export interface LicenseOverviewMetric {
  totalLicensesCount: number;
  assignedLicensesCount: number;
  availableLicensesCount: number;
  expiringSoonLicensesCount: number;
  monthlyRecurringRevenueMRR: number;
  annualRecurringRevenueARR: number;
  renewalDaysRemaining: number;
}

export interface SubscriptionPlanItem {
  id: string;
  name: 'Free' | 'Starter' | 'Professional' | 'Enterprise' | 'Custom';
  priceMonthlyDollars: number;
  includedSeats: number;
  includedStorageGB: number;
  includedAiTokensMonthly: number;
  features: string[];
  isPopular?: boolean;
}

export interface LicenseAssignmentItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  assignedAt: string;
  status: 'active' | 'unassigned' | 'expired';
}

// Story 15.9 Audit Logs & Compliance Center Types

export type AuditEventCategory =
  | 'authentication'
  | 'security'
  | 'user_activity'
  | 'config_change'
  | 'billing'
  | 'api'
  | 'workflow'
  | 'ai'
  | 'search'
  | 'admin_action';

export interface AuditLogEvent {
  id: string;
  title: string;
  description: string;
  category: AuditEventCategory;
  severity: 'info' | 'warning' | 'critical';
  performedBy: string;
  performedByRole: string;
  ipAddress: string;
  tenantName: string;
  targetResource: string;
  timestamp: string;
  hashSignature: string;
}

export interface ComplianceFrameworkItem {
  id: string;
  name: 'ISO 27001' | 'SOC 2 Type II' | 'GDPR' | 'HIPAA Ready';
  description: string;
  complianceScorePercent: number;
  passingControlsCount: number;
  totalControlsCount: number;
  lastAuditedAt: string;
  status: 'compliant' | 'review_required' | 'non_compliant';
}

// Story 15.10 Feature Flags & Configuration Management Types

export type FeatureFlagTargetingScope = 'platform' | 'organization' | 'tenant' | 'workspace' | 'user' | 'role';

export interface FeatureFlagItem {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  scope: FeatureFlagTargetingScope;
  rolloutPercentage: number;
  targetUserGroup: string;
  targetPlanTier: string;
  isKillSwitchTriggered: boolean;
  lastModifiedBy: string;
  updatedAt: string;
}

export interface EnvironmentConfigProfile {
  id: string;
  environment: 'production' | 'staging' | 'development';
  key: string;
  value: string;
  category: string;
  isEncrypted: boolean;
  version: number;
  updatedAt: string;
}



