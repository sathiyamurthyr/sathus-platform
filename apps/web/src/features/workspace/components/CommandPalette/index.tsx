'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, FolderKanban, CheckSquare, FileText, Bot, Zap, Bell, BarChart3, ShieldAlert, Settings, ArrowRight } from 'lucide-react';
import { sidebarNavItems, quickActions } from '../../config/nav-config';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  FolderKanban: <FolderKanban className="w-4 h-4" />,
  CheckSquare: <CheckSquare className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Bot: <Bot className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Bell: <Bell className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via key
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNav = sidebarNavItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredQuick = quickActions.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase()) ||
    act.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-border bg-muted/20">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search workspace... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-14 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm font-medium"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted border border-border rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Quick Actions */}
          {filteredQuick.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                Quick Actions
              </div>
              <div className="space-y-1">
                {filteredQuick.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleSelect(act.href)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary/10 text-left transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-md bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {iconMap[act.icon] || <Zap className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {act.title}
                        </div>
                        <div className="text-xs text-muted-foreground">{act.description}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          {filteredNav.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                Workspace Navigation
              </div>
              <div className="space-y-1">
                {filteredNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted text-left transition-colors group"
                  >
                    <div className="flex items-center space-x-3 text-sm font-medium text-foreground">
                      <span className="text-muted-foreground group-hover:text-primary transition-colors">
                        {iconMap[item.icon] || <LayoutDashboard className="w-4 h-4" />}
                      </span>
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{item.href}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredQuick.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching commands or workspace modules found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
