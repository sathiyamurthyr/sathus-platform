'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { MegaMenu } from '@/components/layout/mega-menu';
import { navItems, megaMenuSections } from '@/constants';

export function Navigation() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

  return (
    <>
      <nav className="hidden items-center gap-1 lg:gap-2 xl:gap-4 2xl:gap-6" aria-label="Main">
        {navItems.map((item, index) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => {
              setActiveIndex(index);
              setHoveredItem(item.label);
              if (item.hasMega) setMegaOpen(true);
            }}
            onMouseLeave={() => {
              setActiveIndex(null);
              setHoveredItem(null);
              setMegaOpen(false);
            }}
          >
            <a
              href={item.href}
              className={cn(
                'relative py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
                activeIndex === index && 'text-foreground'
              )}
              onClick={(e) => {
                if (item.hasMega) {
                  e.preventDefault();
                }
              }}
              aria-haspopup={item.hasMega ? 'true' : undefined}
              aria-expanded={item.hasMega ? megaOpen : undefined}
            >
              {item.label}
              {activeIndex === index && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          </div>
        ))}
      </nav>
      {megaOpen && (
        <MegaMenu
          sections={megaMenuSections[hoveredItem || 'Products'] || []}
          onClose={() => {
            setMegaOpen(false);
            setHoveredItem(null);
          }}
        />
      )}
    </>
  );
}
