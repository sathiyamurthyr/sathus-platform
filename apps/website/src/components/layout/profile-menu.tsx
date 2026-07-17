'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileMenu({ open, onClose }: ProfileMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="relative">
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl border bg-background shadow-2xl overflow-hidden z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Profile menu"
          >
            <div className="px-5 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-primary-foreground font-semibold text-sm">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">john.doe@sathus.technology</p>
                </div>
              </div>
            </div>
            <div className="py-2">
              <Link
                href="#"
                className="flex items-center gap-3 px-5 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors"
                onClick={onClose}
              >
                <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Settings
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" aria-hidden="true" />
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 px-5 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors"
                onClick={onClose}
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Help & Support
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" aria-hidden="true" />
              </Link>
            </div>
            <div className="border-t px-5 py-3">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/5"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
