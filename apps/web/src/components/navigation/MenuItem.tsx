'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  label: string;
  href: string;
  hasMega?: boolean;
  isCurrentRoute: boolean;
  isOpen: boolean;
  isHovered: boolean;
  isFocused: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
  controlsId?: string;
  triggerRef?: React.RefObject<HTMLAnchorElement | null>;
}

export const MenuItem = React.memo(function MenuItem({
  label,
  href,
  hasMega = false,
  isCurrentRoute,
  isOpen,
  isHovered,
  isFocused,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onKeyDown,
  controlsId,
  triggerRef,
}: MenuItemProps) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        ref={triggerRef}
        href={href}
        className={cn(
          'relative py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm inline-block',
          isCurrentRoute ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground',
          (isHovered || isFocused || isOpen) && 'text-foreground'
        )}
        aria-haspopup={hasMega ? 'true' : undefined}
        aria-expanded={hasMega ? isOpen : undefined}
        aria-controls={isOpen ? controlsId : undefined}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        {label}
        {(isCurrentRoute || isHovered || isOpen) && (
          <motion.div
            layoutId="nav-indicator"
            className={cn(
              'absolute -bottom-1 left-0 right-0 h-0.5 rounded-full',
              isCurrentRoute ? 'bg-primary' : 'bg-primary/50'
            )}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </div>
  );
});
