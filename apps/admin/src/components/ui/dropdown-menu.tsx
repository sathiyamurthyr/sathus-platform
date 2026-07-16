'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const dropdownMenuVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
  {
    variants: {
      size: {
        default: 'min-w-[8rem]',
        sm: 'min-w-[6rem]',
        lg: 'min-w-[12rem]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenu components must be used within DropdownMenu');
  return context;
}

export function DropdownMenu({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;
  const actualOnChange = onOpenChange ?? setInternalOpen;

  return (
    <DropdownMenuContext.Provider value={{ open: actualOpen, onOpenChange: actualOnChange }}>
      <div className="relative inline-flex">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild = false }: { children: React.ReactElement; asChild?: boolean }) {
  const { onOpenChange } = useDropdownMenu();
  return React.cloneElement(children, {
    onClick: (e: unknown) => {
      if (typeof e === 'object' && e !== null && 'preventDefault' in e) {
        (e as React.MouseEvent).preventDefault();
      }
      onOpenChange(true);
    },
    'aria-haspopup': 'menu',
    'aria-expanded': false,
  } as React.HTMLAttributes<HTMLElement>);
}

export function DropdownMenuContent({ children, align = 'start', className }: { children: React.ReactNode; align?: 'start' | 'end' | 'center'; className?: string }) {
  const { open, onOpenChange } = useDropdownMenu();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const alignClass = align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0';

  return (
    <div
      ref={ref}
      className={cn('absolute top-full mt-1', alignClass, dropdownMenuVariants(), className)}
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  const { onOpenChange } = useDropdownMenu();
  return (
    <button
      role="menuitem"
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}
