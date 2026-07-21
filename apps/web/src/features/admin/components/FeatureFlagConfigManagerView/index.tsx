'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Search,
  CheckCircle2,
  AlertOctagon,
  Percent,
  Layers,
  Globe,
  Lock,
  RefreshCw,
  Zap,
  RotateCcw,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { mockFeatureFlags, mockEnvironmentConfigs } from '../../data/mock-feature-config-data';
import type { FeatureFlagItem, EnvironmentConfigProfile } from '../../types';

export function FeatureFlagConfigManagerView() {
  const [flags, setFlags] = useState<FeatureFlagItem[]>(mockFeatureFlags);
  const [configs] = useState<EnvironmentConfigProfile[]>(mockEnvironmentConfigs);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);

  // New Flag Form State
  const [newFlagKey, setNewFlagKey] = useState('');
  const [newFlagName, setNewFlagName] = useState('');
  const [newFlagDesc, setNewFlagDesc] = useState('');
  const [newFlagRollout, setNewFlagRollout] = useState(25);

  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleFlag = (key: string, currentEnabled: boolean) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, isEnabled: !currentEnabled } : f))
    );
    setNotice(`Feature Flag "${key}" ${!currentEnabled ? 'enabled' : 'disabled'}.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleKillSwitch = (key: string) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.key === key
          ? {
              ...f,
              isEnabled: false,
              isKillSwitchTriggered: true,
              rolloutPercentage: 0,
              lastModifiedBy: 'Emergency Sentinel',
              updatedAt: new Date().toISOString(),
            }
          : f
      )
    );
    setNotice(`EMERGENCY KILL SWITCH TRIGGERED FOR FLAG "${key}". Rollout reset to 0%.`);
    setTimeout(() => setNotice(null), 4500);
  };

  const handleUpdateRollout = (key: string, newPct: number) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, rolloutPercentage: newPct } : f))
    );
  };

  const handleCreateFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlagKey.trim()) return;

    const newFlag: FeatureFlagItem = {
      key: newFlagKey,
      name: newFlagName || newFlagKey,
      description: newFlagDesc || 'Canary feature flag toggle.',
      isEnabled: true,
      scope: 'tenant',
      rolloutPercentage: Number(newFlagRollout),
      targetUserGroup: 'Beta Testers',
      targetPlanTier: 'Enterprise',
      isKillSwitchTriggered: false,
      lastModifiedBy: 'Platform Admin',
      updatedAt: new Date().toISOString(),
    };

    setFlags((prev) => [newFlag, ...prev]);
    setShowFlagModal(false);
    setNewFlagKey('');
    setNewFlagName('');
    setNotice(`Feature Flag "${newFlag.name}" created.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const filteredFlags = flags.filter(
    (f) =>
      f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-primary" />
            <span>Feature Flags & Configuration Management</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.10 LaunchDarkly-grade feature toggles, canary percentage rollouts, group targeting, and 1-click emergency kill switches.
          </p>
        </div>

        <button
          onClick={() => setShowFlagModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Feature Flag</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Feature Flags Directory */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>Active Feature Flags & Canary Rollout Matrix</span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feature flags..."
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredFlags.map((flg) => (
            <div key={flg.key} className="py-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-foreground">{flg.name}</span>
                    <span className="text-xs font-mono text-primary">({flg.key})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${flg.isEnabled ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                      {flg.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                    {flg.isKillSwitchTriggered && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                        Kill Switch Triggered
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{flg.description}</p>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  {/* Enable toggle */}
                  <button
                    onClick={() => handleToggleFlag(flg.key, flg.isEnabled)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      flg.isEnabled ? 'bg-primary justify-end' : 'bg-muted justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </button>

                  {/* Kill switch trigger */}
                  <button
                    onClick={() => handleKillSwitch(flg.key)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 flex items-center space-x-1.5 transition-colors"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Kill Switch</span>
                  </button>
                </div>
              </div>

              {/* Canary percentage rollout slider & targeting rules */}
              <div className="p-3 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center space-x-4 w-full sm:w-1/2">
                  <span className="text-muted-foreground shrink-0">Canary Rollout:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={flg.rolloutPercentage}
                    onChange={(e) => handleUpdateRollout(flg.key, Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <strong className="text-foreground shrink-0">{flg.rolloutPercentage}%</strong>
                </div>

                <div className="text-[11px] text-muted-foreground">
                  Target: <strong className="text-foreground">{flg.targetUserGroup}</strong> ({flg.targetPlanTier})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environment Configuration Center Profiles */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Globe className="w-4 h-4 text-primary" />
          <span>Environment Configuration Profiles</span>
        </h3>

        <div className="divide-y divide-border font-mono text-xs">
          {configs.map((cfg) => (
            <div key={cfg.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-foreground">{cfg.key}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500">
                    {cfg.environment}
                  </span>
                </div>
                <div className="text-[11px] text-primary font-bold">Value: {cfg.value}</div>
              </div>

              <div className="text-right text-[10px] text-muted-foreground">
                Category: {cfg.category} • Version: v{cfg.version}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Feature Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-primary" />
                <span>Create Feature Flag</span>
              </h3>
              <button onClick={() => setShowFlagModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFlag} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Flag Key Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. enable_vector_rag_v2"
                  value={newFlagKey}
                  onChange={(e) => setNewFlagKey(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vector RAG Search Engine v2"
                  value={newFlagName}
                  onChange={(e) => setNewFlagName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Description</label>
                <input
                  type="text"
                  placeholder="e.g. High-throughput HNSW index vector similarity search."
                  value={newFlagDesc}
                  onChange={(e) => setNewFlagDesc(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Initial Canary Rollout %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newFlagRollout}
                  onChange={(e) => setNewFlagRollout(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFlagModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Deploy Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
