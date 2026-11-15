import {
  BarChart3,
  BookOpen,
  Boxes,
  FlaskConical,
  GraduationCap,
  Image,
  LayoutDashboard,
  Newspaper,
  Package,
  Search,
  Settings,
  Users,
  Briefcase,
  Navigation,
  IndianRupee,
  Server,
  Receipt,
  ShoppingCart,
  Building,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

import type { NavItem } from '@/types/admin';

/**
 * Primary navigation for the Sathus Admin CMS.
 */
export const platformNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/content?contentType=Product', icon: Package },
  { label: 'Documentation', href: '/admin/content?contentType=DocPage', icon: BookOpen },
  { label: 'Blog', href: '/admin/content?contentType=Article', icon: Newspaper },
  { label: 'Media', href: '/admin/media', icon: Image },
  { label: 'Navigation', href: '/admin/navigation', icon: Navigation },
  { label: 'Search', href: '/admin/search', icon: Search },
];

export const financeNavItems: NavItem[] = [
  { label: 'Finance Overview', href: '/admin/finance', icon: IndianRupee },
  { label: 'Server Subscriptions', href: '/admin/finance/subscriptions', icon: Server },
  { label: 'Sales Invoices', href: '/admin/finance/invoices', icon: Receipt },
  { label: 'Vendor Purchases', href: '/admin/finance/purchases', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/finance/customers', icon: Users },
  { label: 'Vendors', href: '/admin/finance/vendors', icon: Building },
  { label: 'Services Catalogue', href: '/admin/finance/services', icon: Briefcase },
  { label: 'Payments', href: '/admin/finance/payments', icon: CreditCard },
  { label: 'GST Reports', href: '/admin/finance/reports', icon: FileSpreadsheet },
  { label: 'Settings', href: '/admin/finance/settings', icon: Settings },
];

export const navItems: NavItem[] = [
  ...platformNavItems,
  ...financeNavItems,
];

/** The dashboard home route used for redirects and active-state roots. */
export const DASHBOARD_ROUTE = '/admin/dashboard';

const labelOverrides: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  finance: 'Finance & Billing',
  subscriptions: 'Server Subscriptions',
  invoices: 'Sales Invoices',
  purchases: 'Vendor Purchases',
  customers: 'Customers',
  vendors: 'Vendors',
  services: 'Services Catalogue',
  payments: 'Payments',
  reports: 'GST Reports',
  settings: 'Settings',
};

/**
 * Builds an accessible breadcrumb trail from a pathname.
 * Segments are title-cased (unless overridden) and the final segment is
 * marked active.
 */
export function getBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return [{ label: 'Home' }];
  }

  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const label =
      labelOverrides[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);

    return isLast ? { label } : { label, href };
  });
}

/** Administrator profile for the session. */
export const currentUser = {
  name: 'Ava Mercer',
  email: 'ava.mercer@sathusplatform.com',
  role: 'Platform Administrator',
  initials: 'AM',
};
