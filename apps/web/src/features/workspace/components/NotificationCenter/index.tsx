'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Check, ShieldAlert, Bot, Server, Info, CheckCheck } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'security' | 'ai' | 'system' | 'info';
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'SOC 2 Audit Log Generated',
    message: 'Monthly security audit log bundle exported for Sathus Production tenant.',
    timestamp: '15m ago',
    category: 'security',
    read: false,
  },
  {
    id: 'n-2',
    title: 'Sathus AI Agent Deployed',
    message: 'Multi-agent risk assessment pipeline initialized with zero data retention rules.',
    timestamp: '1h ago',
    category: 'ai',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Memomes Vault Storage Alert',
    message: 'Storage quota at 41% capacity. Automatic scaling enabled.',
    timestamp: '3h ago',
    category: 'system',
    read: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    security: <ShieldAlert className="w-4 h-4 text-emerald-500" />,
    ai: <Bot className="w-4 h-4 text-primary" />,
    system: <Server className="w-4 h-4 text-amber-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        title="Notification Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={`p-4 transition-colors cursor-pointer flex items-start space-x-3 ${
                    !n.read ? 'bg-primary/5' : 'hover:bg-muted/40'
                  }`}
                >
                  <div className="p-2 rounded-md bg-muted shrink-0 mt-0.5">
                    {categoryIcons[n.category] || <Info className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{n.message}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No notifications right now.
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border text-center bg-muted/20">
            <Link
              href="/app/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View Notification History &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
