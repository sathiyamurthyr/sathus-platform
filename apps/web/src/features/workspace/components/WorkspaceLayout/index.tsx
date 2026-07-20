'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { WorkspaceHeader } from '../WorkspaceHeader';
import { WorkspaceSidebar } from '../WorkspaceSidebar';
import { CommandPalette } from '../CommandPalette';
import { StatusBar } from '../StatusBar';
import { mockWorkspaces } from '../../config/nav-config';
import type { Workspace } from '../../types';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(mockWorkspaces[0]);
  const pathname = usePathname();

  // Generate dynamic breadcrumbs based on pathname
  const pathSegments = pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-inter">
      <div className="flex flex-1">
        {/* Sidebar */}
        <WorkspaceSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <WorkspaceHeader
            onOpenCommandPalette={() => setIsCommandOpen(true)}
            activeWorkspace={activeWorkspace}
            onSelectWorkspace={(ws) => setActiveWorkspace(ws)}
          />

          {/* Breadcrumb Strip */}
          <div className="px-8 pt-4 pb-2 border-b border-border/40 bg-muted/20 flex items-center text-xs text-muted-foreground space-x-2">
            <Link href="/workspace" className="hover:text-primary transition-colors flex items-center space-x-1">
              <Home className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </Link>
            {pathSegments.slice(1).map((segment, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                <span className="capitalize font-medium text-foreground">
                  {segment.replace(/-/g, ' ')}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Page Body */}
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>

          {/* Workspace Footer */}
          <footer className="px-8 py-4 border-t border-border bg-card/30 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              &copy; {new Date().getFullYear()} Sathus Technology Pvt. Ltd. — Project Odyssey Enterprise SaaS Platform.
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/trust/security" className="hover:text-primary transition-colors">
                Security Controls
              </Link>
              <Link href="/legal/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Enterprise Support
              </Link>
            </div>
          </footer>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  );
}
