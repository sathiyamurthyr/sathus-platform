'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import type { MegaMenuSection } from '@/types';

interface MegaMenuProps {
  sections: MegaMenuSection[];
  onClose: () => void;
}

export function MegaMenu({ sections, onClose }: MegaMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const menu = menuRef.current;
    const handleFocusOut = (e: FocusEvent) => {
      if (menu && !menu.contains(e.relatedTarget as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    menu?.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      menu?.removeEventListener('focusout', handleFocusOut);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute inset-x-0 top-full z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="menu"
        aria-label="Mega menu"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  {section.title}
                </h3>
                {section.description && (
                  <p className="mb-3 text-xs text-muted-foreground">
                    {section.description}
                  </p>
                )}
                <ul className="space-y-1" role="menu">
                  {section.items.map((item) => (
                    <li key={item.title} role="none">
                      <a
                        href={item.href}
                        className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        role="menuitem"
                        onClick={onClose}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                            <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
