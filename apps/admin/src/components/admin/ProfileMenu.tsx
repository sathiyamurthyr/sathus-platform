'use client';

import * as React from 'react';
import { CreditCard, LogOut, Settings, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useClickOutside } from '@/hooks/use-click-outside';
import { currentUser } from '@/config/navigation';

const menuItems = [
  { label: 'Profile', icon: User, href: '/admin/settings' },
  { label: 'Account', icon: CreditCard, href: '/admin/settings' },
  { label: 'Preferences', icon: Settings, href: '/admin/settings' },
] as const;

/**
 * User profile menu (placeholder actions).
 *
 * The trigger shows the signed-in user; the panel lists profile, account,
 * preferences and sign-out. Actions are placeholders — real authentication
 * and routing land in a later sprint.
 */
export function ProfileMenu({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => setMounted(true), []);
  useClickOutside(ref, () => setOpen(false), open);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        className="h-9 gap-2 px-1.5 pr-2"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar fallback={currentUser.initials} size="sm" />
        <span className="hidden text-left text-sm font-medium leading-tight sm:block">
          {mounted ? currentUser.name : ''}
        </span>
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <div className="border-b border-border px-3 py-3">
            <p className="truncate text-sm font-semibold">{currentUser.name}</p>
            <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
            <p className="mt-1 text-xs font-medium text-primary">{currentUser.role}</p>
          </div>

          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
              onClick={close}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 focus-visible:bg-destructive/10"
            onClick={close}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
