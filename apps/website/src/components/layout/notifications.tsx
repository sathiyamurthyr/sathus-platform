'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { notifications } from '@/constants';

interface NotificationsProps {
  open: boolean;
  onClose: () => void;
}

export function Notifications({ open, onClose }: NotificationsProps) {
  const [items, setItems] = React.useState(notifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = React.useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl border bg-background shadow-2xl overflow-hidden z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={markAllRead}
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.href}
                  className={cn(
                    'flex items-start gap-3 px-5 py-3.5 transition-colors',
                    'hover:bg-muted/40',
                    !notification.read && 'bg-primary/5'
                  )}
                  onClick={onClose}
                >
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    !notification.read ? "bg-primary/10" : "bg-muted"
                  )}>
                    <Bell className={cn("h-4 w-4", !notification.read ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium truncate", !notification.read && "text-foreground")}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.description}
                    </p>
                    <p className="text-[0.65rem] text-muted-foreground/70 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t px-5 py-3">
              <Link
                href="#insights"
                className="text-xs font-medium text-primary hover:underline underline-offset-4"
                onClick={onClose}
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
