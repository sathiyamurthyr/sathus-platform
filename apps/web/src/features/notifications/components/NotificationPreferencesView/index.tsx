'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, Moon, Clock, Globe, Plus, Trash2, ShieldCheck, Mail, MessageSquare, Bell, Radio, Webhook } from 'lucide-react';
import { mockDefaultPreference, mockWebhooks } from '../../data/mock-notifications';
import type { NotificationPreference, WebhookConfig, NotificationCategory } from '../../types';

export function NotificationPreferencesView() {
  const [pref, setPref] = useState<NotificationPreference>(mockDefaultPreference);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(mockWebhooks);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookName, setNewWebhookName] = useState('');

  const categories: NotificationCategory[] = [
    'security',
    'ai',
    'project',
    'task',
    'billing',
    'system',
    'workspace',
  ];

  const handleToggleChannel = (category: NotificationCategory, channel: keyof typeof pref.categoryPreferences['security']) => {
    setPref({
      ...pref,
      categoryPreferences: {
        ...pref.categoryPreferences,
        [category]: {
          ...pref.categoryPreferences[category],
          [channel]: !pref.categoryPreferences[category][channel],
        },
      },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl || !newWebhookName) return;
    const newWh: WebhookConfig = {
      id: `wh-${Date.now()}`,
      name: newWebhookName,
      url: newWebhookUrl,
      secret: `whsec_${Math.random().toString(36).slice(2)}`,
      events: ['SecurityAuditExported', 'AIJobCompleted'],
      active: true,
      createdAt: new Date().toISOString(),
    };
    setWebhooks([...webhooks, newWh]);
    setNewWebhookName('');
    setNewWebhookUrl('');
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Notification Settings & Dispatch Matrix</h1>
        <p className="text-xs text-muted-foreground">
          Configure per-channel delivery preferences, quiet hours schedules, and webhook endpoints for EPIC-018.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Notification preferences updated successfully.</span>
        </div>
      )}

      {/* Global & Schedule Controls */}
      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Global Schedule & Thresholds</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                <Moon className="w-3.5 h-3.5 text-primary" />
                <span>Quiet Hours Schedule</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  defaultValue={pref.quietHoursStart}
                  className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                  type="time"
                  defaultValue={pref.quietHoursEnd}
                  className="h-9 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>Timezone</span>
              </label>
              <select
                defaultValue={pref.timezone}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Priority Delivery Threshold</span>
              </label>
              <select
                defaultValue={pref.priorityThreshold}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="low">Low & Above (All Alerts)</option>
                <option value="normal">Normal & Above (Recommended)</option>
                <option value="high">High & Above Only</option>
                <option value="critical">Critical Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Channel Matrix Table */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Category Channel Matrix</h3>
            <p className="text-xs text-muted-foreground">Toggle delivery channels per notification category.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 text-center">
                    <span className="flex items-center justify-center space-x-1">
                      <Bell className="w-3.5 h-3.5" />
                      <span>In-App</span>
                    </span>
                  </th>
                  <th className="pb-3 text-center">
                    <span className="flex items-center justify-center space-x-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </span>
                  </th>
                  <th className="pb-3 text-center">
                    <span className="flex items-center justify-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>SMS</span>
                    </span>
                  </th>
                  <th className="pb-3 text-center">
                    <span className="flex items-center justify-center space-x-1">
                      <Radio className="w-3.5 h-3.5" />
                      <span>Push</span>
                    </span>
                  </th>
                  <th className="pb-3 text-center">
                    <span className="flex items-center justify-center space-x-1">
                      <Webhook className="w-3.5 h-3.5" />
                      <span>Webhook</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {categories.map((cat) => {
                  const channels = pref.categoryPreferences[cat];
                  return (
                    <tr key={cat} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 font-bold capitalize text-foreground">{cat}</td>
                      {(['in_app', 'email', 'sms', 'push', 'webhook'] as const).map((ch) => (
                        <td key={ch} className="py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={channels[ch]}
                            onChange={() => handleToggleChannel(cat, ch)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-background cursor-pointer"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Webhook Endpoints Management */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
              <Webhook className="w-5 h-5 text-primary" />
              <span>Registered Webhook Endpoints</span>
            </h3>
            <p className="text-xs text-muted-foreground">Stream event notifications to external SIEM or Slack webhooks.</p>
          </div>
        </div>

        {/* Existing Webhooks List */}
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-4 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-foreground flex items-center space-x-2">
                  <span>{wh.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <div className="text-xs font-mono text-muted-foreground">{wh.url}</div>
              </div>
              <button
                onClick={() => handleDeleteWebhook(wh.id)}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
                title="Remove Webhook"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Webhook Form */}
        <form onSubmit={handleAddWebhook} className="pt-4 border-t border-border space-y-4">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider">Add Webhook Endpoint</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Endpoint Name (e.g. Datadog SIEM)"
              value={newWebhookName}
              onChange={(e) => setNewWebhookName(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
            />
            <input
              type="url"
              placeholder="https://api.example.com/webhook"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              className="h-10 px-3 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-muted border border-border text-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:bg-muted/80 transition-colors"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span>Add Webhook Endpoint</span>
          </button>
        </form>
      </div>
    </div>
  );
}
