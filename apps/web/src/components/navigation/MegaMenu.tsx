'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MegaMenuSection } from '@/types';
import { getIcon } from '../layout/icon-map';

interface MegaMenuProps {
  sections: MegaMenuSection[];
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  id: string;
}

export const MegaMenu = React.memo(function MegaMenu({
  sections,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  id,
}: MegaMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleTabTrap);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTabTrap);
    };
  }, [isOpen, onClose]);

  const variants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          id={id}
          ref={menuRef}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute inset-x-0 top-full z-[1100] border-b bg-background shadow-lg pointer-events-auto"
          style={{ willChange: 'transform, opacity' }}
          role="menu"
          aria-label="Mega menu"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="container mx-auto px-4 py-8">
            {sections.map((section) => (
              <div key={section.title}>
                {section.description && (
                  <p className="mb-6 text-sm text-muted-foreground max-w-2xl">
                    {section.description}
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.columns.map((column) => {
                    const ColumnIcon = column.icon ? getIcon(column.icon) : null;
                    return (
                      <div
                        key={column.title}
                        className="space-y-4"
                        role="group"
                        aria-labelledby={`mega-${section.title}-${column.title}`}
                      >
                        <div className="flex items-center gap-2">
                          {ColumnIcon && (
                            <ColumnIcon className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                          )}
                          <h3
                            id={`mega-${section.title}-${column.title}`}
                            className="text-sm font-semibold text-foreground"
                          >
                            {column.title}
                          </h3>
                        </div>
                        {column.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {column.description}
                          </p>
                        )}
                        <ul className="space-y-1" role="menu">
                          {column.items.map((item) => {
                            const ItemIcon = item.icon ? getIcon(item.icon) : null;
                            return (
                              <li key={item.title} role="none">
                                <Link
                                  href={item.href || '#'}
                                  className={cn(
                                    'group flex items-start gap-3 rounded-lg p-2.5 transition-all duration-200',
                                    'hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                                  )}
                                  role="menuitem"
                                  onClick={onClose}
                                >
                                  {ItemIcon && (
                                    <ItemIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-0.5 shrink-0" aria-hidden="true" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        {item.title}
                                      </span>
                                      {item.badge && (
                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
                                          {item.badge}
                                        </span>
                                      )}
                                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-primary" aria-hidden="true" />
                                    </div>
                                    {item.description && (
                                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        {column.featured && (
                          <div className="mt-4 rounded-xl border bg-gradient-to-br from-muted/50 to-muted/30 p-4 transition-colors hover:border-primary/20">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-primary mb-2">
                                  {column.featured.tag}
                                </span>
                                <h4 className="text-sm font-semibold text-foreground mb-1">
                                  {column.featured.title}
                                </h4>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                                  {column.featured.description}
                                </p>
                                <Link
                                  href={column.featured.href || '#'}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                                  onClick={onClose}
                                >
                                  Learn more
                                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
