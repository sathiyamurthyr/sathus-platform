'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Archive,
  Trash2,
  Filter,
  ShieldAlert,
  Bot,
  FolderKanban,
  CreditCard,
  Server,
  X,
  ExternalLink,
  Settings,
  Sparkles,
} from 'lucide-react';
import { mockNotifications } from '../../data/mock-notifications';
import type { NotificationItem, NotificationCategory } from '../../types';

export function NotificationCenterView() {
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived' | 'critical'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const unreadCount = items.filter((i) => i.status === 'unread').length;

  const handleMarkAllRead = () => {
    setItems(items.map((i) => (i.status === 'unread' ? { ...i, status: 'read' } : i)));
  };

  const handleMarkRead = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status: 'read' } : i)));
  };

  const handleArchive = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, status: 'archived' } : i)));
    if (selectedNotification?.id === id) setSelectedNotification(null);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    if (selectedNotification?.id === id) setSelectedNotification(null);
  };

  // Filter items
  const filteredItems = items.filter((i) => {
    if (activeTab === 'unread' && i.status !== 'unread') return false;
    if (activeTab === 'archived' && i.status !== 'archived') return false;
    if (activeTab === 'critical' && i.priority !== 'critical') return false;
    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
    return true;
  });

  const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
    security: <ShieldAlert className="w-4 h-4 text-emerald-500" />,
    ai: <Bot className="w-4 h-4 text-primary" />,
    project: <FolderKanban className="w-4 h-4 text-cyan-500" />,
    task: <FolderKanban className="w-4 h-4 text-blue-500" />,
    billing: <CreditCard className="w-4 h-4 text-purple-500" />,
    system: <Server className="w-4 h-4 text-amber-500" />,
    workspace: <Sparkles className="w-4 h-4 text-primary" />,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Bell className="w-6 h-6 text-primary" />
            <span>Enterprise Notification Center</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground">
            EPIC-018 Centralized multi-channel alert dispatch & notification stream.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-muted border border-border text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors"
            >
              <CheckCheck className="w-4 h-4 text-primary" />
              <span>Mark All Read</span>
            </button>
          )}

          <Link
            href="/app/settings?tab=notifications"
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </Link>
        </div>
      </div>

      {/* Main Filter & Content Area */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Tabs & Category Selector */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'critical', label: 'Critical' },
              { id: 'archived', label: 'Archived' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as 'all' | 'unread' | 'archived' | 'critical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  activeTab === t.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-background text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="security">Security</option>
              <option value="ai">AI Engine</option>
              <option value="project">Projects</option>
              <option value="billing">Billing</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="divide-y divide-border">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                  item.status === 'unread' ? 'bg-primary/5' : 'hover:bg-muted/30'
                }`}
              >
                <div
                  className="flex items-start space-x-4 cursor-pointer flex-1"
                  onClick={() => {
                    handleMarkRead(item.id);
                    setSelectedNotification(item);
                  }}
                >
                  <div className="p-2.5 rounded-lg bg-muted border border-border shrink-0 mt-0.5">
                    {categoryIcons[item.category] || <Sparkles className="w-4 h-4 text-primary" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                        {item.subject}
                      </span>
                      {item.priority === 'critical' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                          Critical
                        </span>
                      )}
                      {item.priority === 'high' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          High
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.body}
                    </p>

                    <div className="flex items-center space-x-3 text-[10px] text-muted-foreground pt-1">
                      <span className="font-mono">{new Date(item.createdAt).toLocaleString()}</span>
                      <span>• Event: {item.eventType}</span>
                      <span>• Channel: {item.channel}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-1 shrink-0">
                  {item.actionUrl && (
                    <Link
                      href={item.actionUrl}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      title="Open Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                  {item.status !== 'archived' && (
                    <button
                      onClick={() => handleArchive(item.id)}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Bell className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-foreground">No Notifications Found</div>
              <div className="text-xs text-muted-foreground max-w-sm mx-auto">
                You have no notifications matching the selected tab or category filter.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail View */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150 relative">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-muted border border-border">
                {categoryIcons[selectedNotification.category]}
              </div>
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-wider">
                  {selectedNotification.category} Notification
                </div>
                <h3 className="text-lg font-bold text-foreground">{selectedNotification.subject}</h3>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/40 border border-border text-xs text-foreground leading-relaxed">
              {selectedNotification.body}
            </div>

            {selectedNotification.metadata && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Payload Metadata
                </div>
                <pre className="p-3 rounded-lg bg-background border border-border text-[11px] font-mono text-muted-foreground overflow-x-auto">
                  {JSON.stringify(selectedNotification.metadata, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="text-[10px] text-muted-foreground font-mono">
                ID: {selectedNotification.id}
              </div>
              {selectedNotification.actionUrl && (
                <Link
                  href={selectedNotification.actionUrl}
                  onClick={() => setSelectedNotification(null)}
                  className="inline-flex items-center space-x-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
