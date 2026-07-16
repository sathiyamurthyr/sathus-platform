import {
  BarChart3,
  FileText,
  FlaskConical,
  Newspaper,
  Package,
  Plus,
  UserPlus,
  Users,
} from 'lucide-react';

import type {
  ActivityItem,
  QuickAction,
  ServiceStatus,
  Stat,
} from '@/types/admin';

/**
 * Placeholder dashboard data for the foundation sprint.
 *
 * Centralised here so the dashboard page stays declarative and the values
 * can be swapped for live queries without touching the view layer.
 */
export const stats: Stat[] = [
  {
    id: 'products',
    label: 'Total Products',
    value: '128',
    change: '+4.2%',
    changeType: 'positive',
    icon: Package,
    hint: 'vs. last month',
  },
  {
    id: 'posts',
    label: 'Blog Posts',
    value: '342',
    change: '+12',
    changeType: 'positive',
    icon: Newspaper,
    hint: 'published this quarter',
  },
  {
    id: 'labs',
    label: 'Labs Projects',
    value: '17',
    change: '+2',
    changeType: 'neutral',
    icon: FlaskConical,
    hint: 'active experiments',
  },
  {
    id: 'visitors',
    label: 'Visitors',
    value: '24.8k',
    change: '-1.1%',
    changeType: 'negative',
    icon: BarChart3,
    hint: 'last 30 days',
  },
  {
    id: 'users',
    label: 'Users',
    value: '1,904',
    change: '+8.6%',
    changeType: 'positive',
    icon: Users,
    hint: 'registered accounts',
  },
];

export const quickActions: QuickAction[] = [
  {
    id: 'add-product',
    label: 'Add Product',
    description: 'Create a new catalogue item',
    icon: Plus,
    href: '/admin/products',
  },
  {
    id: 'new-article',
    label: 'New Article',
    description: 'Draft a blog post',
    icon: FileText,
    href: '/admin/blog',
  },
  {
    id: 'invite-user',
    label: 'Invite User',
    description: 'Send a team invitation',
    icon: UserPlus,
    href: '/admin/users',
  },
  {
    id: 'view-analytics',
    label: 'View Analytics',
    description: 'Open the insights panel',
    icon: BarChart3,
    href: '/admin/analytics',
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Product published',
    description: 'Aurora Sensor Module went live',
    timestamp: '2m ago',
    icon: Package,
  },
  {
    id: 'a2',
    title: 'New blog draft',
    description: '“Scaling Sathus X” saved as draft',
    timestamp: '1h ago',
    icon: FileText,
  },
  {
    id: 'a3',
    title: 'Labs experiment started',
    description: 'Edge inference benchmark',
    timestamp: '3h ago',
    icon: FlaskConical,
  },
  {
    id: 'a4',
    title: 'User invited',
    description: 'mira@sathusplatform.com joined',
    timestamp: 'Yesterday',
    icon: UserPlus,
  },
  {
    id: 'a5',
    title: 'Settings updated',
    description: 'SEO defaults refreshed',
    timestamp: '2d ago',
    icon: BarChart3,
  },
];

export const services: ServiceStatus[] = [
  { id: 'api', name: 'Admin API', status: 'operational', detail: 'All regions nominal' },
  { id: 'db', name: 'Database', status: 'operational', detail: 'Replication healthy' },
  { id: 'cdn', name: 'CDN', status: 'degraded', detail: 'Elevated latency in EU' },
  { id: 'auth', name: 'Auth Service', status: 'operational', detail: 'Token issuance normal' },
];
