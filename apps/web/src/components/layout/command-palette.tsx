'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { commandActions } from '@/constants';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onAction?: (actionId: string) => void;
}

export function CommandPalette({ open, onClose, onAction }: CommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      setSelectedIndex(0);
    }
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, commandActions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (onAction) {
        onAction(commandActions[selectedIndex].id);
      } else {
        commandActions[selectedIndex].action();
      }
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-2xl border bg-background shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b">
              <Command className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
              <span className="text-sm text-foreground font-medium">Command Palette</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-lg border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Actions
              </p>
              {commandActions.map((action, i) => (
                <button
                  key={action.id}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 text-left',
                    i === selectedIndex ? 'bg-muted/80' : 'hover:bg-muted/40'
                  )}
                  onClick={() => {
                    if (onAction) {
                      onAction(action.id);
                    } else {
                      action.action();
                    }
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                    <Command className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                  {action.shortcut && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      {action.shortcut.map((key) => (
                        <kbd
                          key={key}
                          className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                  {i === selectedIndex && (
                    <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between border-t px-5 py-2.5 bg-muted/20">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">↵</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">esc</kbd> Close
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {commandActions.length} command{commandActions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
