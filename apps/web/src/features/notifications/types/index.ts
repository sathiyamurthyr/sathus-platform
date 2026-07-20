// EPIC-018 Enterprise Notification & Communication Domain Types

export type NotificationCategory =
  | 'security'
  | 'ai'
  | 'project'
  | 'task'
  | 'billing'
  | 'system'
  | 'workspace';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'push' | 'webhook';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface NotificationItem {
  id: string;
  tenantId: string;
  userId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  channel: NotificationChannel;
  subject: string;
  body: string;
  status: NotificationStatus;
  eventType: string; // e.g., 'UserRegistered', 'AIJobCompleted', 'InvoiceGenerated'
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ChannelPreferences {
  in_app: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
  webhook: boolean;
}

export interface NotificationPreference {
  userId: string;
  tenantId: string;
  globalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  timezone: string;
  categoryPreferences: Record<NotificationCategory, ChannelPreferences>;
  priorityThreshold: NotificationPriority;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  createdAt: string;
}
