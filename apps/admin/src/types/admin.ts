import type { LucideIcon } from 'lucide-react';

/** A single entry in the admin navigation menu. */
export interface NavItem {
  /** Human readable label. */
  label: string;
  /** Destination route. */
  href: string;
  /** Leading icon. */
  icon: LucideIcon;
  /** When true the destination is not yet implemented (placeholder). */
  comingSoon?: boolean;
  /** Optional short badge text rendered on the right. */
  badge?: string;
}

/** The signed-in administrator shown in the profile menu. */
export interface AdminUser {
  name: string;
  email: string;
  role: string;
  /** Image URL; falls back to initials when absent. */
  avatarUrl?: string;
  /** Initials shown when no avatar is provided. */
  initials: string;
}

/** A single dashboard statistic. */
export interface Stat {
  id: string;
  label: string;
  value: string;
  /** Optional contextual change, e.g. "+12.4%". */
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  /** Accessible description of the trend. */
  hint?: string;
}

/** A quick action shortcut rendered on the dashboard. */
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

/** A row in the recent-activity feed. */
export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
}

/** A monitored service rendered by the system-status widget. */
export interface ServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down';
  detail: string;
}

/** Props shared by every card primitive. */
export type WithClassName<T = unknown> = T & { className?: string };
