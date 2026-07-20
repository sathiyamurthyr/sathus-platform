'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FileText,
  Bot,
  Zap,
  Bell,
  BarChart3,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { sidebarNavItems } from '../../config/nav-config';

interface WorkspaceSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  FolderKanban: <FolderKanban className="w-5 h-5" />,
  CheckSquare: <CheckSquare className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Bot: <Bot className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
};

export function WorkspaceSidebar({ isCollapsed, onToggleCollapse }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const coreItems = sidebarNavItems.filter((i) => i.category === 'core');
  const platformItems = sidebarNavItems.filter((i) => i.category === 'platform');
  const settingsItems = sidebarNavItems.filter((i) => i.category === 'settings');

  const renderNavGroup = (title: string, items: typeof sidebarNavItems) => (
    <div className="space-y-1">
      {!isCollapsed && (
        <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">
          {title}
        </div>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.id}
            href={item.href}
            title={isCollapsed ? item.title : undefined}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              isActive
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={isActive ? 'text-primary-foreground' : 'group-hover:text-primary transition-colors'}>
                {iconMap[item.icon] || <LayoutDashboard className="w-5 h-5" />}
              </span>
              {!isCollapsed && <span>{item.title}</span>}
            </div>

            {!isCollapsed && item.badge && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground border border-border group-hover:border-primary/30'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`border-r border-border bg-card flex flex-col justify-between transition-all duration-300 relative z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Logo & Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-border/50">
          <Link href="/" className="flex items-center space-x-2">
            <BrandLogo />
            {!isCollapsed && (
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                SaaS Core
              </span>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {renderNavGroup('Core Modules', coreItems)}
          {renderNavGroup('Enterprise Services', platformItems)}
          {renderNavGroup('System & Security', settingsItems)}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border/50 text-center">
        {!isCollapsed ? (
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-foreground">Project Odyssey v1.0</div>
            <div className="text-[10px] text-muted-foreground">Sprint 7 Workspace Shell</div>
          </div>
        ) : (
          <div className="text-[10px] font-bold text-muted-foreground font-mono">v1.0</div>
        )}
      </div>
    </aside>
  );
}
