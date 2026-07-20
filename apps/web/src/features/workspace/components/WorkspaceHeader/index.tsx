'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  Check,
  User,
  Settings,
  Key,
  Shield,
  LogOut,
  Moon,
  Sun,
  Plus,
  Zap,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { NotificationCenter } from '../NotificationCenter';
import { mockWorkspaces, mockCurrentUser, quickActions } from '../../config/nav-config';
import type { Workspace } from '../../types';

interface WorkspaceHeaderProps {
  onOpenCommandPalette: () => void;
  activeWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
}

export function WorkspaceHeader({
  onOpenCommandPalette,
  activeWorkspace,
  onSelectWorkspace,
}: WorkspaceHeaderProps) {
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Tenant / Workspace Switcher & Search */}
      <div className="flex items-center space-x-4">
        {/* Tenant Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsTenantOpen(!isTenantOpen)}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground leading-tight">
                {activeWorkspace.name}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                {activeWorkspace.plan} tier
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
          </button>

          {isTenantOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                Switch Workspace
              </div>
              <div className="space-y-1">
                {mockWorkspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onSelectWorkspace(ws);
                      setIsTenantOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors text-xs font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-foreground">{ws.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                        {ws.role}
                      </span>
                    </div>
                    {ws.id === activeWorkspace.id && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-border">
                <Link
                  href="/workspace/settings?tab=organization"
                  onClick={() => setIsTenantOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Workspace</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center space-x-3 px-4 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground text-xs font-medium transition-colors w-64 justify-between"
        >
          <span className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search platform...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-background border border-border rounded text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions, Notifications, Theme, User Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick Actions Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setIsQuickOpen(!isQuickOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Action</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {isQuickOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl p-2 z-50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                New Action
              </div>
              {quickActions.map((act) => (
                <Link
                  key={act.id}
                  href={act.href}
                  onClick={() => setIsQuickOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-muted text-xs font-medium text-foreground transition-colors"
                >
                  <div className="font-semibold">{act.title}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">
                    {act.description}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <NotificationCenter />

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 pl-2"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs shadow-sm">
              SK
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold leading-tight text-foreground">
                {mockCurrentUser.name}
              </div>
              <div className="text-[10px] text-muted-foreground">{mockCurrentUser.role}</div>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-border mb-1">
                <div className="text-xs font-bold text-foreground">{mockCurrentUser.name}</div>
                <div className="text-[10px] text-muted-foreground">{mockCurrentUser.email}</div>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/workspace/settings?tab=profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/workspace/settings?tab=preferences"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Preferences</span>
                </Link>

                <Link
                  href="/workspace/settings?tab=apikeys"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Key className="w-4 h-4 text-muted-foreground" />
                  <span>API Keys & Credentials</span>
                </Link>

                <Link
                  href="/workspace/settings?tab=sessions"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>Active Sessions</span>
                </Link>
              </div>

              <div className="pt-1 mt-1 border-t border-border">
                <Link
                  href="/"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
