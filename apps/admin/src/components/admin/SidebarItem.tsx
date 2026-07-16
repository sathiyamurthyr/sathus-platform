'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { NavItem } from '@/types/admin';

export interface SidebarItemProps {
  item: NavItem;
  onNavigate?: () => void;
}

/**
 * A single navigation row inside the sidebar.
 *
 * - Highlights when its route is active (or a child route is active).
 * - `comingSoon` items are rendered as disabled, non-navigating controls
 *   so the menu communicates future modules without dead links.
 */
export const SidebarItem = React.forwardRef<HTMLLIElement, SidebarItemProps>(
  ({ item, onNavigate }, ref) => {
    const pathname = usePathname();
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + '/');
    const Icon = item.icon;

    const base = cn(
      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
    );

    const content = (
      <>
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{item.label}</span>
        {item.comingSoon && (
          <Badge variant="muted" className="ml-auto">
            Soon
          </Badge>
        )}
        {item.badge && !item.comingSoon && (
          <Badge variant="secondary" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </>
    );

    if (item.comingSoon) {
      return (
        <li ref={ref}>
          <span
            className={cn(base, 'cursor-not-allowed opacity-60')}
            aria-disabled="true"
            title={`${item.label} (coming soon)`}
          >
            {content}
          </span>
        </li>
      );
    }

    return (
      <li ref={ref}>
        <Link
          href={item.href}
          className={base}
          aria-current={isActive ? 'page' : undefined}
          onClick={onNavigate}
        >
          {content}
        </Link>
      </li>
    );
  }
);
SidebarItem.displayName = 'SidebarItem';
