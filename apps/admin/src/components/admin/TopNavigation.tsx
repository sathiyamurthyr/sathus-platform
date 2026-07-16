'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Menu } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getBreadcrumb } from '@/config/navigation';
import { GlobalSearch } from './GlobalSearch';
import { NotificationMenu } from './NotificationMenu';
import { ProfileMenu } from './ProfileMenu';
import { ThemeToggle } from './theme-toggle';

export interface TopNavigationProps {
  onMenuClick: () => void;
  className?: string;
}

/**
 * Sticky top bar: mobile menu trigger, breadcrumb, global search,
 * notifications, theme toggle and the profile menu.
 */
export function TopNavigation({ onMenuClick, className }: TopNavigationProps) {
  const pathname = usePathname();
  const items = React.useMemo(() => getBreadcrumb(pathname), [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6',
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
                {index > 0 && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="rounded outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'truncate font-medium',
                      isLast ? 'text-foreground' : 'hover:text-foreground'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <GlobalSearch className="hidden sm:flex" />
        <NotificationMenu />
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  );
}
