'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  Sliders,
  Check,
  X,
  Sparkles,
  Shield,
  Layers,
  Building2,
  Users,
} from 'lucide-react';
import { mockRoles, mockPermissions, mockABACPolicies } from '../../data/mock-role-permission-data';
import type { RoleDefinition, PermissionItem, ABACPolicyRule } from '../../types';

export function RolePermissionManagerView() {
  const [roles, setRoles] = useState<RoleDefinition[]>(mockRoles);
  const [permissions] = useState<PermissionItem[]>(mockPermissions);
  const [abacPolicies, setAbacPolicies] = useState<ABACPolicyRule[]>(mockABACPolicies);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleScope, setNewRoleScope] = useState<'platform' | 'organization' | 'tenant' | 'workspace'>('tenant');

  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleABACPolicy = (id: string, isEnabled: boolean) => {
    setAbacPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isEnabled: !isEnabled } : p))
    );
    setNotice(`ABAC Policy "${id}" ${isEnabled ? 'disabled' : 'enabled'}.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole: RoleDefinition = {
      id: `role-${Date.now()}`,
      name: newRoleName,
      description: newRoleDesc || 'Custom enterprise role definition.',
      scope: newRoleScope,
      isBuiltIn: false,
      assignedUserCount: 0,
      permissions: ['read'],
    };

    setRoles((prev) => [...prev, newRole]);
    setShowRoleModal(false);
    setNewRoleName('');
    setNewRoleDesc('');
    setNotice(`Custom Role "${newRole.name}" created successfully.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const scopeBadges: Record<string, string> = {
    platform: 'bg-red-500/10 text-red-500 border-red-500/20',
    organization: 'bg-primary/10 text-primary border-primary/20',
    tenant: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    workspace: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Enterprise Role & Permission Matrix (RBAC / ABAC)</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.5 Build custom enterprise roles, configure granular permission matrices, and enforce ABAC security policies.
          </p>
        </div>

        <button
          onClick={() => setShowRoleModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Build Custom Role</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Roles Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{role.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${scopeBadges[role.scope]}`}>
                  {role.scope}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>Assigned Users: <strong className="text-foreground">{role.assignedUserCount}</strong></span>
              <span>{role.isBuiltIn ? 'System Built-In' : 'Custom Role'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Permission Matrix Grid */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground">Granular Module Permission Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2.5 px-3 font-semibold">Permission Action</th>
                <th className="py-2.5 px-3 font-semibold">Module</th>
                {roles.slice(0, 5).map((r) => (
                  <th key={r.id} className="py-2.5 px-3 font-semibold text-center">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {permissions.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20">
                  <td className="py-3 px-3 font-bold text-foreground">{p.description}</td>
                  <td className="py-3 px-3 uppercase text-[10px] text-primary">{p.module}</td>
                  {roles.slice(0, 5).map((r) => {
                    const hasPerm = r.permissions.includes('*') || r.permissions.some((rp) => rp.includes(p.module));
                    return (
                      <td key={r.id} className="py-3 px-3 text-center">
                        {hasPerm ? (
                          <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ABAC Policy Rules Inspector */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
          <Lock className="w-4 h-4 text-primary" />
          <span>Attribute-Based Access Control (ABAC) Policies</span>
        </h3>

        <div className="space-y-3">
          {abacPolicies.map((abac) => (
            <div key={abac.id} className="p-4 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">{abac.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${abac.effect === 'allow' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {abac.effect}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  Resource: {abac.resource} • Condition: <code className="text-primary">{abac.condition}</code>
                </div>
              </div>

              <button
                onClick={() => handleToggleABACPolicy(abac.id, abac.isEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  abac.isEnabled
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {abac.isEnabled ? 'Active' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Build Custom Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Build Custom Enterprise Role</span>
              </h3>
              <button onClick={() => setShowRoleModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compliance Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Read-only access to audit logs and compliance policy matrices."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Permission Scope</label>
                <select
                  value={newRoleScope}
                  onChange={(e) => setNewRoleScope(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                >
                  <option value="platform">Platform Level (Cross-Organization)</option>
                  <option value="organization">Organization Level</option>
                  <option value="tenant">Tenant Level</option>
                  <option value="workspace">Workspace Level</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Create Custom Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
