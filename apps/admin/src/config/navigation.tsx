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
} from 'lucide-react';

import type { NavItem } from '@/types/admin';

/**
 * Primary navigation for the Sathus Admin CMS.
 *
 * Modules that are not part of this foundation sprint are flagged
 * `comingSoon` so the UI communicates intent without creating dead routes.
 */
export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/content?contentType=Product', icon: Package },
  { label: 'Services', href: '/admin/services', icon: Briefcase, comingSoon: true },
  { label: 'Sathus Labs', href: '/admin/labs', icon: FlaskConical, comingSoon: true },
  { label: 'Sathus X', href: '/admin/x', icon: Boxes, comingSoon: true },
  { label: 'Documentation', href: '/admin/content?contentType=DocPage', icon: BookOpen },
  { label: 'Learning Center', href: '/admin/learning', icon: GraduationCap, comingSoon: true },
  { label: 'Blog', href: '/admin/content?contentType=Article', icon: Newspaper },
  { label: 'Media', href: '/admin/media', icon: Image },
  { label: 'Navigation', href: '/admin/navigation', icon: Navigation },
  { label: 'Search', href: '/admin/search', icon: Search },
  { label: 'SEO', href: '/admin/seo', icon: Search, comingSoon: true },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, comingSoon: true },
  { label: 'Users', href: '/admin/users', icon: Users, comingSoon: true },
  { label: 'Settings', href: '/admin/settings', icon: Settings, comingSoon: true },
].filter(item => !item.comingSoon);

/** The dashboard home route used for redirects and active-state roots. */
export const DASHBOARD_ROUTE = '/admin/dashboard';

const labelOverrides: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
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

/** Placeholder profile for the foundation sprint (no real auth yet). */
export const currentUser = {
  name: 'Ava Mercer',
  email: 'ava.mercer@sathusplatform.com',
  role: 'Platform Administrator',
  initials: 'AM',
};
