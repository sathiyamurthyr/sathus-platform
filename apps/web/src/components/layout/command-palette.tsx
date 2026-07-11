'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-xl border bg-background shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <Command className="h-5 w-5 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">Command Palette</span>
              <span className="ml-auto text-xs text-muted-foreground">Placeholder</span>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Command palette will be implemented here.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Use{' '}
                <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px]">
                  ⌘K
                </kbd>{' '}
                to toggle.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
