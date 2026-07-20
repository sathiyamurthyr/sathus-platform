// Workspace Domain Types & Interfaces

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  plan: 'free' | 'pro' | 'enterprise';
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  workspaces: Workspace[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  tenantId: string;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: string; // Lucide icon name
  badge?: string;
  status: 'active' | 'beta' | 'coming-soon';
  shortcut?: string;
  category?: 'core' | 'platform' | 'settings';
}

export interface QuickAction {
  id: string;
  title: string;
  href: string;
  icon: string;
  description: string;
}

export interface ModuleStatusInfo {
  title: string;
  description: string;
  epicId: string;
  quarter: string;
  expectedFeatures: string[];
}
