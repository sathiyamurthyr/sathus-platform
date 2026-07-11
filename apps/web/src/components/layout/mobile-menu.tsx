'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { navItems, megaMenuSections } from '@/constants';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (expandedItem) {
          setExpandedItem(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, expandedItem]);

  const toggleExpand = (label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-3/4 max-w-sm border-l bg-background shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between p-6">
              <span className="font-bold text-lg">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-80px)]" aria-label="Mobile">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.hasMega ? (
                      <div>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className="flex items-center justify-between w-full text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                          aria-expanded={expandedItem === item.label}
                        >
                          {item.label}
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 transition-transform',
                              expandedItem === item.label && 'rotate-90'
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedItem === item.label && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-2 space-y-2 border-l pl-4"
                            >
                              {(megaMenuSections[item.label] || []).map((section) =>
                                section.items.map((subItem) => (
                                  <li key={subItem.title}>
                                    <a
                                      href={subItem.href}
                                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                                      onClick={onClose}
                                    >
                                      {subItem.title}
                                    </a>
                                  </li>
                                ))
                              )}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <a
                        href={item.href}
                        className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                        onClick={onClose}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 border-t p-6 space-y-4">
              <Button className="w-full" size="lg">
                Request Demo
              </Button>
              <ThemeToggle />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
