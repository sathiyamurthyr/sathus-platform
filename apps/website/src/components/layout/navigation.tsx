'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { MegaMenu } from '@/components/layout/mega-menu';
import { navItems, megaMenuSections } from '@/constants';

const Navigation = () => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const navRef = React.useRef<HTMLElement>(null);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!megaOpen) return;
      const items = navItems.filter((item) => item.hasMega);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setMegaOpen(false);
        setHoveredItem(null);
        setFocusedIndex(-1);
      }
    },
    [megaOpen]
  );

  return (
    <nav
      ref={navRef}
      className="hidden items-center gap-1 lg:gap-2 xl:gap-4 2xl:gap-6"
      aria-label="Main"
      onKeyDown={handleKeyDown}
    >
      {navItems.map((item, index) => {
        const hasMega = item.hasMega;
        const isActive = activeIndex === index;
        const isFocused = focusedIndex === index;

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => {
              setActiveIndex(index);
              setHoveredItem(item.label);
              if (hasMega) {
                setMegaOpen(true);
                setFocusedIndex(index);
              }
            }}
            onMouseLeave={() => {
              setActiveIndex(null);
              setHoveredItem(null);
              setMegaOpen(false);
              setFocusedIndex(-1);
            }}
          >
            <Link
              href={item.href}
              className={cn(
                'relative py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
                isActive && 'text-foreground',
                isFocused && 'text-foreground'
              )}
              onClick={(e) => {
                if (hasMega) {
                  e.preventDefault();
                }
              }}
              aria-haspopup={hasMega ? 'true' : undefined}
              aria-expanded={hasMega ? megaOpen : undefined}
              tabIndex={0}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </div>
        );
      })}
      {megaOpen && hoveredItem && (
        <MegaMenu
          sections={megaMenuSections[hoveredItem] || []}
          onClose={() => {
            setMegaOpen(false);
            setHoveredItem(null);
            setFocusedIndex(-1);
          }}
        />
      )}
    </nav>
  );
};

Navigation.displayName = 'Navigation';

export { Navigation };
