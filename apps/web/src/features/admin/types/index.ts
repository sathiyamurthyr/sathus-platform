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
