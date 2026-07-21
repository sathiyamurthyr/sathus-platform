'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Smartphone,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  Activity,
  Sliders,
  Check,
  X,
  Key,
} from 'lucide-react';
import { mockSecurityMetrics, mockIPRules, mockTrustedDevices } from '../../data/mock-security-data';
import type { IPRuleItem, TrustedDeviceItem } from '../../types';

export function EnterpriseSecurityCenterView() {
  const [metrics] = useState(mockSecurityMetrics);
  const [ipRules, setIpRules] = useState<IPRuleItem[]>(mockIPRules);
  const [devices, setDevices] = useState<TrustedDeviceItem[]>(mockTrustedDevices);

  // Policy state
  const [requireMFA, setRequireMFA] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [lockoutAttempts, setLockoutAttempts] = useState(5);

  // Add IP Rule Modal
  const [showIpModal, setShowIpModal] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [newIpType, setNewIpType] = useState<'allow' | 'block'>('allow');
  const [newIpDesc, setNewIpDesc] = useState('');

  const [notice, setNotice] = useState<string | null>(null);

  const handleAddIpRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpAddress.trim()) return;

    const newRule: IPRuleItem = {
      id: `ip-${Date.now()}`,
      ipAddressOrCidr: newIpAddress,
      ruleType: newIpType,
      description: newIpDesc || 'Custom IP security rule.',
      createdBy: 'Security Admin',
      createdAt: new Date().toISOString(),
    };

    setIpRules((prev) => [newRule, ...prev]);
    setShowIpModal(false);
    setNewIpAddress('');
    setNewIpDesc('');
    setNotice(`IP Rule "${newRule.ipAddressOrCidr}" added successfully.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleRevokeDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setNotice(`Device "${id}" revoked from trusted registry.`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Enterprise Security Center & Threat Defense</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.6 Monitor security health, enforce MFA & session policies, manage IP allow/block lists, and audit trusted devices.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-500 text-xs font-bold font-mono">
          <Activity className="w-4 h-4" />
          <span>Security Score: {metrics.securityHealthScore}/100</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Security Telemetry Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">MFA Adoption Rate</div>
          <div className="text-xl font-bold font-mono text-emerald-500">{metrics.mfaAdoptionPercent}%</div>
          <div className="text-[10px] text-muted-foreground">Across all active tenant users</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">Active Sessions</div>
          <div className="text-xl font-bold font-mono text-primary">{metrics.activeSessionsCount}</div>
          <div className="text-[10px] text-muted-foreground">Monitored in real-time</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">Blocked Logins (24h)</div>
          <div className="text-xl font-bold font-mono text-amber-500">{metrics.blockedLoginAttempts24h}</div>
          <div className="text-[10px] text-muted-foreground">Brute-force sentinel triggers</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">Trusted Devices</div>
          <div className="text-xl font-bold font-mono text-foreground">{metrics.trustedDevicesCount}</div>
          <div className="text-[10px] text-muted-foreground">Registered user hardware</div>
        </div>
      </div>

      {/* Authentication & Session Security Policies */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Lock className="w-4 h-4 text-primary" />
          <span>Authentication & Session Policies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MFA Enforcement Toggle */}
          <div className="space-y-2 p-4 rounded-xl bg-background border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Enforce Mandatory MFA</span>
              <button
                onClick={() => {
                  setRequireMFA(!requireMFA);
                  setNotice(`Mandatory MFA policy ${!requireMFA ? 'enabled' : 'disabled'}.`);
                  setTimeout(() => setNotice(null), 3000);
                }}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  requireMFA ? 'bg-primary justify-end' : 'bg-muted justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Require TOTP hardware key or Authenticator app for all Platform Admins and Tenant Owners.
            </p>
          </div>

          {/* Session Idle Timeout Slider */}
          <div className="space-y-2 p-4 rounded-xl bg-background border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Session Idle Timeout</span>
              <span className="text-xs font-mono font-bold text-primary">{sessionTimeoutMins} Mins</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={sessionTimeoutMins}
              onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <p className="text-[11px] text-muted-foreground">Automatically log out inactive web sessions.</p>
          </div>

          {/* Account Lockout Threshold */}
          <div className="space-y-2 p-4 rounded-xl bg-background border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Account Lockout Limit</span>
              <span className="text-xs font-mono font-bold text-amber-500">{lockoutAttempts} Attempts</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              value={lockoutAttempts}
              onChange={(e) => setLockoutAttempts(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-muted-foreground">Lock account after repeated failed login attempts.</p>
          </div>
        </div>
      </div>

      {/* IP Allow & Block Rules Manager */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>IP Allow & Block List Manager</span>
          </h3>
          <button
            onClick={() => setShowIpModal(true)}
            className="inline-flex items-center space-x-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add IP Rule</span>
          </button>
        </div>

        <div className="divide-y divide-border">
          {ipRules.map((rule) => (
            <div key={rule.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono text-foreground">{rule.ipAddressOrCidr}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${rule.ruleType === 'allow' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {rule.ruleType}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{rule.description} • By {rule.createdBy}</p>
              </div>

              <button
                onClick={() => {
                  setIpRules((prev) => prev.filter((r) => r.id !== rule.id));
                  setNotice(`IP Rule "${rule.ipAddressOrCidr}" removed.`);
                  setTimeout(() => setNotice(null), 3000);
                }}
                className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                title="Remove IP Rule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted Device Registry */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Laptop className="w-4 h-4 text-primary" />
          <span>Trusted Device Registry</span>
        </h3>

        <div className="divide-y divide-border">
          {devices.map((dev) => (
            <div key={dev.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">{dev.deviceName}</span>
                  <span className="text-xs text-muted-foreground font-mono">({dev.userName})</span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {dev.browser} • Last active IP: {dev.ipAddress} • {new Date(dev.lastUsedAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => handleRevokeDevice(dev.id)}
                className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20"
              >
                Revoke Device
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add IP Rule Modal */}
      {showIpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <Globe className="w-5 h-5 text-primary" />
                <span>Add IP Security Rule</span>
              </h3>
              <button onClick={() => setShowIpModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIpRule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">IP Address or CIDR Range</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 103.15.24.0/24 or 192.168.1.10"
                  value={newIpAddress}
                  onChange={(e) => setNewIpAddress(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Rule Action</label>
                <select
                  value={newIpType}
                  onChange={(e) => setNewIpType(e.target.value as 'allow' | 'block')}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                >
                  <option value="allow">Allow (Whitelist Subnet)</option>
                  <option value="block">Block (Blacklist Subnet / Threat IP)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Rule Description</label>
                <input
                  type="text"
                  placeholder="e.g. Corporate Office VPN Range"
                  value={newIpDesc}
                  onChange={(e) => setNewIpDesc(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowIpModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Add IP Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
