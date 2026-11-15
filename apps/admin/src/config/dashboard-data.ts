import {
  BarChart3,
  FileText,
  FlaskConical,
  Newspaper,
  Package,
  Plus,
  UserPlus,
  Users,
  IndianRupee,
  Server,
  Receipt,
  ShieldCheck,
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
    id: 'mrr',
    label: 'Hosting MRR',
    value: '₹8,500',
    change: '+18% GST',
    changeType: 'positive',
    icon: IndianRupee,
    hint: 'App & DB Server billing',
  },
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
    id: 'server-billing',
    label: 'Server Subscriptions',
    description: 'App Server (₹5,500) & DB (₹3,000)',
    icon: Server,
    href: '/admin/finance/subscriptions',
  },
  {
    id: 'tax-invoices',
    label: 'GST Tax Invoices',
    description: 'Printable A4 GST Tax Invoices',
    icon: Receipt,
    href: '/admin/finance/invoices',
  },
  {
    id: 'company-contact',
    label: 'Company & Contact Info',
    description: 'Phone, Email, Bank & GSTIN',
    icon: ShieldCheck,
    href: '/admin/finance/settings',
  },
  {
    id: 'finance-overview',
    label: 'Finance & GST Hub',
    description: 'MRR, ITC & GSTR compliance',
    icon: IndianRupee,
    href: '/admin/finance',
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
