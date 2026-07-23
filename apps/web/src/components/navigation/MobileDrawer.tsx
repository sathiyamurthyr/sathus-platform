'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { NavItem, MegaMenuSection } from '@/types';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  megaMenuSections: Record<string, MegaMenuSection[]>;
  onSearchClick: () => void;
}

export const MobileDrawer = React.memo(function MobileDrawer({
  open,
  onClose,
  navItems,
  megaMenuSections,
  onSearchClick,
}: MobileDrawerProps) {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const checkAuth = () => {
      const authenticated = document.cookie.split(';').some((c) => c.trim().startsWith('access_token='));
      setIsAuthenticated(authenticated);
    };
    checkAuth();
  }, [open]);

  const handleSignOut = React.useCallback(() => {
    // Clear cookies by setting past expires date
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    setIsAuthenticated(false);
    onClose();
    // Redirect to home page
    window.location.href = '/';
  }, [onClose]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setExpandedItem(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const toggleExpand = React.useCallback((label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-[85vw] max-w-sm border-l bg-background shadow-2xl z-[1100]"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <span className="text-lg font-semibold text-foreground">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>

            <nav className="px-6 py-4 overflow-y-auto max-h-[calc(100vh-140px)]" aria-label="Mobile">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.hasMega ? (
                      <div>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className="flex items-center justify-between w-full text-base font-medium text-foreground hover:text-primary transition-colors py-3 rounded-lg hover:bg-muted/50 text-left"
                          aria-expanded={expandedItem === item.label}
                        >
                          {item.label}
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 transition-transform duration-200 shrink-0',
                              expandedItem === item.label && 'rotate-90'
                            )}
                            aria-hidden="true"
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {expandedItem === item.label && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                              className="ml-4 mt-1 space-y-1 border-l pl-4 overflow-hidden"
                            >
                              {(megaMenuSections[item.label] || []).map((section) =>
                                section.columns.map((column) =>
                                  column.items.map((subItem) => (
                                    <li key={subItem.title}>
                                      <Link
                                        href={subItem.href || '#'}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 rounded-md hover:bg-muted/30"
                                        onClick={onClose}
                                      >
                                        {subItem.title}
                                      </Link>
                                    </li>
                                  ))
                                )
                              )}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors py-3 rounded-lg hover:bg-muted/50"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {isAuthenticated && (
                <ul className="mt-6 pt-6 border-t space-y-1">
                  <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Account</span>
                  <li>
                    <Link
                      href="/app/dashboard"
                      className="flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/50"
                      onClick={onClose}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/workspace"
                      className="flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/50"
                      onClick={onClose}
                    >
                      My Workspace
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/app/settings"
                      className="flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-muted/50"
                      onClick={onClose}
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-between w-full text-base font-medium text-destructive hover:text-destructive/90 transition-colors py-2 px-3 rounded-lg hover:bg-destructive/5 text-left"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              )}

              <div className="mt-8 pt-6 border-t space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    onClose();
                    onSearchClick();
                  }}
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search...
                </Button>
                <Button className="w-full" size="lg" asChild>
                  <Link href="/book-strategy-session" onClick={onClose}>
                    Request Consultation
                  </Link>
                </Button>
                {isAuthenticated && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">Appearance</span>
                    <ThemeToggle />
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
