'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Settings, Key, Shield, Building2, Save, CheckCircle2, Copy, RefreshCw, Bell } from 'lucide-react';
import { mockCurrentUser, mockWorkspaces } from '../../config/nav-config';
import { NotificationPreferencesView } from '../../../notifications/components/NotificationPreferencesView';

export function WorkspaceSettingsView() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notification Preferences', icon: <Bell className="w-4 h-4" /> },
    { id: 'apikeys', label: 'API Keys', icon: <Key className="w-4 h-4" /> },
    { id: 'sessions', label: 'Active Sessions', icon: <Shield className="w-4 h-4" /> },
    { id: 'organization', label: 'Workspace & Organization', icon: <Building2 className="w-4 h-4" /> },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspace & User Settings</h1>
        <p className="text-xs text-muted-foreground">Manage user profile, API credentials, active sessions, and organization settings.</p>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
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

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Tab Contents */}
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="space-y-6 max-w-xl">
            <h3 className="text-lg font-bold text-foreground">User Profile Details</h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                defaultValue={mockCurrentUser.name}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <input
                type="email"
                defaultValue={mockCurrentUser.email}
                disabled
                className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-muted-foreground text-xs font-medium cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Platform Role</label>
              <input
                type="text"
                defaultValue={mockCurrentUser.role}
                disabled
                className="w-full h-10 px-3 rounded-lg border border-border bg-muted text-muted-foreground text-xs font-medium cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </form>
        )}

        {activeTab === 'apikeys' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">API Keys & Tokens</h3>
                <p className="text-xs text-muted-foreground">Manage platform tokens for Sathus AI and REST API integrations.</p>
              </div>
              <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate New Key</span>
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Production Agent Key', key: 'sk_live_99f...4a21', created: 'July 10, 2026', scope: 'Full Read/Write' },
                { name: 'Staging CI/CD Token', key: 'sk_test_12a...9b04', created: 'June 28, 2026', scope: 'ReadOnly' },
              ].map((k, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border border-border">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-foreground">{k.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{k.key}</div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold border border-border">
                      {k.scope}
                    </span>
                    <button className="p-1.5 text-muted-foreground hover:text-foreground">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-foreground">Active Browser Sessions</h3>

            <div className="space-y-3">
              {[
                { device: 'Chrome on Windows 11', ip: '157.48.192.10', location: 'Bengaluru, India', active: true },
                { device: 'Safari on macOS Sonoma', ip: '103.21.244.12', location: 'Mumbai, India', active: false },
              ].map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/40 border border-border">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-foreground flex items-center space-x-2">
                      <span>{s.device}</span>
                      {s.active && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{s.ip} — {s.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="space-y-6 max-w-xl">
            <h3 className="text-lg font-bold text-foreground">Active Workspaces</h3>

            <div className="space-y-3">
              {mockWorkspaces.map((ws) => (
                <div key={ws.id} className="p-4 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-foreground">{ws.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">ID: {ws.id}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                    {ws.plan}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && <NotificationPreferencesView />}

        {activeTab === 'preferences' && (
          <form onSubmit={handleSave} className="space-y-6 max-w-xl">
            <h3 className="text-lg font-bold text-foreground">System Preferences</h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Default Interface Language</label>
              <select className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none">
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
