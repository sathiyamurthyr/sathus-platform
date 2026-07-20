import type { NavItem, Workspace, UserProfile, QuickAction, ModuleStatusInfo } from '../types';

export const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-prod',
    name: 'Sathus Production',
    slug: 'sathus-prod',
    organizationId: 'org-sathus',
    plan: 'enterprise',
    role: 'owner',
  },
  {
    id: 'ws-staging',
    name: 'Sathus Staging',
    slug: 'sathus-staging',
    organizationId: 'org-sathus',
    plan: 'enterprise',
    role: 'admin',
  },
  {
    id: 'ws-demo',
    name: 'Global AI Sandbox',
    slug: 'global-ai-sandbox',
    organizationId: 'org-demo',
    plan: 'pro',
    role: 'member',
  },
];

export const mockCurrentUser: UserProfile = {
  id: 'user-1',
  name: 'Sathish Kumar',
  email: 'sathish@sathus.in',
  role: 'Chief Architect & Admin',
  tenantId: 'sathus-prod',
};

export const sidebarNavItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/workspace',
    icon: 'LayoutDashboard',
    status: 'active',
    category: 'core',
  },
  {
    id: 'projects',
    title: 'Projects',
    href: '/workspace/projects',
    icon: 'FolderKanban',
    badge: 'v1.1',
    status: 'coming-soon',
    category: 'core',
  },
  {
    id: 'tasks',
    title: 'Tasks & Workflows',
    href: '/workspace/tasks',
    icon: 'CheckSquare',
    status: 'coming-soon',
    category: 'core',
  },
  {
    id: 'files',
    title: 'File Manager',
    href: '/workspace/files',
    icon: 'FileText',
    badge: 'Memomes',
    status: 'coming-soon',
    category: 'core',
  },
  {
    id: 'ai',
    title: 'AI Platform',
    href: '/workspace/ai',
    icon: 'Bot',
    badge: 'EPIC-020',
    status: 'coming-soon',
    category: 'platform',
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    href: '/workspace/automation',
    icon: 'Zap',
    badge: 'EPIC-021',
    status: 'coming-soon',
    category: 'platform',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    href: '/workspace/notifications',
    icon: 'Bell',
    badge: 'EPIC-018',
    status: 'coming-soon',
    category: 'platform',
  },
  {
    id: 'analytics',
    title: 'Analytics & Usage',
    href: '/workspace/analytics',
    icon: 'BarChart3',
    badge: 'EPIC-024',
    status: 'coming-soon',
    category: 'platform',
  },
  {
    id: 'administration',
    title: 'Administration',
    href: '/workspace/administration',
    icon: 'ShieldAlert',
    badge: 'EPIC-025',
    status: 'coming-soon',
    category: 'settings',
  },
  {
    id: 'settings',
    title: 'Settings',
    href: '/workspace/settings',
    icon: 'Settings',
    status: 'active',
    category: 'settings',
  },
];

export const quickActions: QuickAction[] = [
  {
    id: 'new-ai-agent',
    title: 'Deploy AI Agent',
    href: '/workspace/ai',
    icon: 'Bot',
    description: 'Launch autonomous agent workflow with guardrails',
  },
  {
    id: 'new-project',
    title: 'Create Project',
    href: '/workspace/projects',
    icon: 'Plus',
    description: 'Initialize engineering workspace repository',
  },
  {
    id: 'upload-file',
    title: 'Upload to Memomes Cloud',
    href: '/workspace/files',
    icon: 'Upload',
    description: 'Encrypted client-side zero-knowledge storage',
  },
];

export const moduleStatusRegistry: Record<string, ModuleStatusInfo> = {
  projects: {
    title: 'Projects & Workspaces',
    description: 'Centralized engineering project tracking, task boards, and repository integrations.',
    epicId: 'EPIC-016',
    quarter: 'Q3 2026',
    expectedFeatures: [
      'Multi-repo workspace synchronization',
      'Agile sprint boards & backlog management',
      'Git provider webhooks & commit links',
      'Role-based project permission access',
    ],
  },
  tasks: {
    title: 'Tasks & Enterprise Workflows',
    description: 'Asynchronous task orchestration with human-in-the-loop approvals.',
    epicId: 'EPIC-017',
    quarter: 'Q3 2026',
    expectedFeatures: [
      'Kanban & List views',
      'Automated SLA tracking & escalation rules',
      'Interactive dependency graphs',
    ],
  },
  files: {
    title: 'Memomes File Manager',
    description: 'Zero-knowledge end-to-end encrypted object store for enterprise assets.',
    epicId: 'EPIC-015',
    quarter: 'Q3 2026',
    expectedFeatures: [
      'AES-256 client-side encryption keys',
      'Expiring download links with password vaults',
      'SIEM audit log streaming',
    ],
  },
  ai: {
    title: 'Sathus AI Platform Engine',
    description: 'Multi-agent orchestration, real-time evaluation harnesses, and MCP gateways.',
    epicId: 'EPIC-020',
    quarter: 'Q4 2026',
    expectedFeatures: [
      'Agentic workflow designer',
      'Real-time PII & prompt injection guardrails',
      'OpenTelemetry token tracing & cost tracking',
    ],
  },
  automation: {
    title: 'Workflow Automation Hub',
    description: 'Event-driven triggers, webhook listener pipelines, and automated integrations.',
    epicId: 'EPIC-021',
    quarter: 'Q4 2026',
    expectedFeatures: [
      'Visual drag-and-drop workflow canvas',
      'Custom Python & Node execution sandboxes',
      'Standardized MCP tool binding',
    ],
  },
  notifications: {
    title: 'Enterprise Notification Center',
    description: 'Unified multi-channel alert dispatch (Email, Slack, Webhooks, SMS).',
    epicId: 'EPIC-018',
    quarter: 'Q3 2026',
    expectedFeatures: [
      'Real-time WebSocket event streaming',
      'User preference routing matrix',
      'Emergency alert broadcast mode',
    ],
  },
  analytics: {
    title: 'Platform Analytics & Usage',
    description: 'Telemetry, API latency metrics, and compute cost allocation reporting.',
    epicId: 'EPIC-024',
    quarter: 'Q4 2026',
    expectedFeatures: [
      'Real-time Prometheus & Grafana dashboard integration',
      'Cost per tenant breakdown',
      'Exportable compliance audit reports',
    ],
  },
  administration: {
    title: 'Platform Administration & Security Portal',
    description: 'Multi-tenant organization management, SSO configuration, and security controls.',
    epicId: 'EPIC-025',
    quarter: 'Q4 2026',
    expectedFeatures: [
      'SAML 2.0 / OIDC Identity Provider setup',
      'Granular RBAC permission matrix',
      'Global security policy enforcement',
    ],
  },
};
