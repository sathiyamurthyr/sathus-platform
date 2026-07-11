'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '../lib/cn';

const themes: { value: 'light' | 'dark' | 'high-contrast' | 'system'; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'high-contrast', label: 'High Contrast', icon: Monitor },
  { value: 'system', label: 'System', icon: Monitor },
];

export function ThemeToggle({
  className,
  variant = 'default',
  ...props
}: {
  className?: string;
  variant?: 'default' | 'icon' | 'ghost';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const CurrentIcon = themes.find((t) => t.value === theme)?.icon || Monitor;

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          variant === 'default' && 'h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90',
          variant === 'icon' && 'h-9 w-9',
          open && 'bg-accent text-accent-foreground'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        {...props}
      >
        <CurrentIcon className="h-4 w-4" />
        {variant === 'default' && (
          <span className="ml-2">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            role="listbox"
          >
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                  theme === t.value && 'bg-accent text-accent-foreground'
                )}
                role="option"
                aria-selected={theme === t.value}
              >
                <t.icon className="mr-2 h-4 w-4" />
                {t.label}
                {resolvedTheme === t.value && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
