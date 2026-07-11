'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
  open: boolean;
  onClose: () => void;
}

const placeholderResults = [
  { title: 'Getting Started', href: '#' },
  { title: 'API Documentation', href: '#' },
  { title: 'Pricing Plans', href: '#' },
  { title: 'Release Notes', href: '#' },
];

export function Search({ open, onClose }: SearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl rounded-xl border bg-background shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <SearchIcon className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search documentation..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') onClose();
                }}
              />
              <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>
            <div className="p-2">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Quick Links
              </p>
              {placeholderResults.map((result) => (
                <a
                  key={result.title}
                  href={result.href}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-muted/50 transition-colors"
                  onClick={onClose}
                >
                  <SearchIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{result.title}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
