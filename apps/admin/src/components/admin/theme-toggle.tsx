'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Check, Computer, Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useClickOutside } from '@/hooks/use-click-outside';

const options = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Computer },
] as const;

/**
 * Theme switcher.
 *
 * Renders a button that opens a small listbox of themes. Guards against
 * hydration mismatches by waiting for mount before showing the active icon.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);
  useClickOutside(ref, () => setOpen(false), open);

  const active = options.find((o) => o.value === theme) ?? options[2];
  const ActiveIcon = active.icon;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change theme"
        onClick={() => setOpen((v) => !v)}
      >
        {mounted ? (
          <ActiveIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Sun className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>

      {open && (
        <div
          role="listbox"
          aria-label="Theme"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {options.map((option) => {
            const selected = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                  selected && 'bg-accent text-accent-foreground'
                )}
              >
                <option.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                {option.label}
                {selected && <Check className="ml-auto h-4 w-4" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
