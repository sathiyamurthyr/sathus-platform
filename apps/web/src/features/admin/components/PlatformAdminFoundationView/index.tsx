'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  Layers,
  HardDrive,
  DollarSign,
  Bot,
  Workflow,
  Activity,
  Sliders,
  Search,
  CheckCircle2,
  FileText,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';
import {
  mockAdminOverviewMetrics,
  mockPlatformSettings,
  mockAdminActivityEvents,
  mockAdminNavigationItems,
} from '../../data/mock-admin-data';
import type {
  PlatformSettingItem,
  AdminActivityEvent,
  AdminSettingCategory,
} from '../../types';

import { OrganizationTenantManagerView } from '../OrganizationTenantManagerView';
import { WorkspaceManagerView } from '../WorkspaceManagerView';
import { UserLifecycleManagerView } from '../UserLifecycleManagerView';
import { RolePermissionManagerView } from '../RolePermissionManagerView';

export function PlatformAdminFoundationView() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'organizations' | 'workspaces' | 'users' | 'roles' | 'navigation' | 'settings' | 'activity'>('dashboard');
  const [metrics] = useState(mockAdminOverviewMetrics);
  const [settingsList, setSettingsList] = useState<PlatformSettingItem[]>(mockPlatformSettings);
  const [activityFeed] = useState<AdminActivityEvent[]>(mockAdminActivityEvents);
  const [selectedSettingCategory, setSelectedSettingCategory] = useState<AdminSettingCategory>('security');

  const [notice, setNotice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveSetting = (key: string, newValue: any) => {
    setSettingsList((prev) =>
      prev.map((s) => (s.key === key ? { ...s, currentValue: newValue } : s))
    );
    setNotice(`Platform Setting "${key}" updated successfully.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const filteredActivity = activityFeed.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Platform Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span>Platform Administration & Tenant Management Center</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            EPIC-025 Foundation, Organization & Tenant Management, Workspace Lifecycle, User Governance, and Enterprise RBAC.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
            <Activity className="w-4 h-4" />
            <span>Platform Health: {metrics.platformHealthScorePercent}% Uptime</span>
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'dashboard', label: 'Administration Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'organizations', label: 'Organizations & Tenants', icon: <Building2 className="w-4 h-4 text-primary" /> },
          { id: 'workspaces', label: 'Workspaces Directory', icon: <Layers className="w-4 h-4 text-emerald-500" /> },
          { id: 'users', label: 'Users & Directory', icon: <Users className="w-4 h-4 text-blue-500" /> },
          { id: 'roles', label: 'Roles & RBAC Matrix', icon: <ShieldCheck className="w-4 h-4 text-purple-500" /> },
          { id: 'settings', label: 'Platform Settings Framework', icon: <Sliders className="w-4 h-4 text-amber-500" /> },
          { id: 'activity', label: 'Centralized Activity Stream', icon: <FileText className="w-4 h-4 text-rose-500" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: ADMINISTRATION DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Executive Metrics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
                <span>Active Tenants</span>
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold font-mono text-foreground">{metrics.activeTenantsCount}</div>
              <div className="text-[10px] text-emerald-500 font-bold">+2 new this month</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
                <span>Active Workspaces</span>
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold font-mono text-foreground">{metrics.activeWorkspacesCount}</div>
              <div className="text-[10px] text-muted-foreground font-mono">100% isolated</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
                <span>Active Users</span>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold font-mono text-foreground">{metrics.totalActiveUsersCount}</div>
              <div className="text-[10px] text-emerald-500 font-bold">License Usage: {metrics.licenseUsagePercent}%</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center justify-between">
                <span>Platform MRR</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-foreground">${metrics.monthlyRevenueMRR.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-500 font-bold">ARR: ${metrics.annualRevenueARR.toLocaleString()}</div>
            </div>
          </div>

          {/* Operational Telemetry Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Storage Utilization</span>
                <HardDrive className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span>{metrics.totalStorageUsedGB} GB Used</span>
                  <span className="text-muted-foreground">{metrics.totalStorageLimitGB} GB Limit</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(metrics.totalStorageUsedGB / metrics.totalStorageLimitGB) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>AI Gateway Requests</span>
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-foreground">{metrics.aiRequestsMonthly.toLocaleString()} calls</div>
                <p className="text-[11px] text-muted-foreground">Claude 3.5 Sonnet & GPT-4o routing active</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Workflow Automation</span>
                <Workflow className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold font-mono text-foreground">{metrics.workflowExecutionsMonthly.toLocaleString()} runs</div>
                <p className="text-[11px] text-muted-foreground">Human approval queue latency: 4.2 mins</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed Preview */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-base font-bold text-foreground">Recent Administrative Events Stream</h3>
              <button onClick={() => setActiveTab('activity')} className="text-xs font-semibold text-primary hover:underline">
                View Full Audit Stream →
              </button>
            </div>

            <div className="space-y-3">
              {activityFeed.map((act) => (
                <div key={act.id} className="p-3.5 rounded-lg bg-background border border-border flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-foreground">{act.title}</div>
                    <div className="text-muted-foreground">{act.description}</div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-muted-foreground shrink-0 pl-4">
                    <div>{act.performedBy}</div>
                    <div>{new Date(act.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ADMIN NAVIGATION DIRECTORY */}
      {activeTab === 'navigation' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Platform Administration Module Navigation Directory</h3>
            <p className="text-xs text-muted-foreground">Centralized navigation map for multi-tenant platform administration and governance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAdminNavigationItems.map((nav) => (
              <div key={nav.id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                      {nav.category}
                    </span>
                    {nav.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {nav.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{nav.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{nav.description}</p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-primary">
                  <span>Route: {nav.route}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PLATFORM SETTINGS FRAMEWORK */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Centralized Platform Settings Framework</h3>
            <p className="text-xs text-muted-foreground">System-wide configuration parameters for security, AI gateway routing, storage, and feature flags.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-2 border-b border-border pb-2">
            {[
              { id: 'security', label: 'Security & Auth' },
              { id: 'ai_gateway', label: 'AI Gateway' },
              { id: 'storage', label: 'Storage & Quotas' },
              { id: 'feature_flags', label: 'Feature Flags' },
              { id: 'general', label: 'General System' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedSettingCategory(cat.id as AdminSettingCategory)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                  selectedSettingCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Settings List */}
          <div className="space-y-4">
            {settingsList
              .filter((s) => s.category === selectedSettingCategory)
              .map((stg) => (
                <div key={stg.key} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-foreground">{stg.title}</span>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{stg.key}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{stg.description}</p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      {stg.valueType === 'boolean' && (
                        <button
                          onClick={() => handleSaveSetting(stg.key, !stg.currentValue)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                            stg.currentValue
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {stg.currentValue ? 'Enabled' : 'Disabled'}
                        </button>
                      )}

                      {stg.valueType === 'number' && (
                        <div className="flex items-center space-x-2 font-mono text-xs">
                          <input
                            type="number"
                            defaultValue={stg.currentValue}
                            onBlur={(e) => handleSaveSetting(stg.key, Number(e.target.value))}
                            className="w-20 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground"
                          />
                        </div>
                      )}

                      {stg.valueType === 'select' && (
                        <select
                          value={stg.currentValue}
                          onChange={(e) => handleSaveSetting(stg.key, e.target.value)}
                          className="bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground font-mono"
                        >
                          {stg.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CENTRALIZED ACTIVITY STREAM */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground">Centralized Platform Audit & Activity Stream</h3>
              <p className="text-xs text-muted-foreground">Immutable audit logs tracking configuration changes, security events, and tenant events.</p>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit stream..."
                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {filteredActivity.map((act) => (
              <div key={act.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-foreground">{act.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                      {act.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>
                </div>

                <div className="text-right font-mono text-[10px] text-muted-foreground shrink-0">
                  <div className="font-bold text-foreground">{act.performedBy} ({act.performedByRole})</div>
                  <div>{new Date(act.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIZATIONS & TENANTS */}
      {activeTab === 'organizations' && <OrganizationTenantManagerView />}

      {/* TAB 3: WORKSPACES DIRECTORY */}
      {activeTab === 'workspaces' && <WorkspaceManagerView />}

      {/* TAB 4: USERS & DIRECTORY */}
      {activeTab === 'users' && <UserLifecycleManagerView />}

      {/* TAB 5: ROLES & RBAC MATRIX */}
      {activeTab === 'roles' && <RolePermissionManagerView />}
    </div>
  );
}
