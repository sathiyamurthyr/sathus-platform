'use client';

import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { mockOrganizations, mockTenants } from '../../data/mock-organization-tenant-data';
import type { OrganizationItem, TenantItem, TenantStatus } from '../../types';

export function OrganizationTenantManagerView() {
  const [orgs] = useState<OrganizationItem[]>(mockOrganizations);
  const [tenants, setTenants] = useState<TenantItem[]>(mockTenants);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  // New Tenant Provisioning Form State
  const [newTenantOrgId, setNewTenantOrgId] = useState('org-1');
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantDomain, setNewTenantDomain] = useState('');
  const [newTenantStorageGB, setNewTenantStorageGB] = useState(1000);
  const [newTenantSeats, setNewTenantSeats] = useState(100);

  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleTenantStatus = (id: string, currentStatus: TenantStatus) => {
    const nextStatus: TenantStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
    setNotice(`Tenant "${id}" status changed to ${nextStatus.toUpperCase()}.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleProvisionTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;

    const selectedOrg = orgs.find((o) => o.id === newTenantOrgId);
    const newTnt: TenantItem = {
      id: `tnt-${Date.now()}`,
      organizationId: newTenantOrgId,
      organizationName: selectedOrg?.name || 'Acme Global Corp',
      name: newTenantName,
      environment: 'production',
      status: 'active',
      primaryDomain: newTenantDomain || `${newTenantName.toLowerCase().replace(/\s+/g, '-')}.sathus.cloud`,
      allocatedStorageGB: Number(newTenantStorageGB),
      usedStorageGB: 10,
      activeUsersCount: 1,
      userSeatLimit: Number(newTenantSeats),
      createdAt: new Date().toISOString(),
    };

    setTenants((prev) => [newTnt, ...prev]);
    setShowProvisionModal(false);
    setNewTenantName('');
    setNewTenantDomain('');
    setNotice(`Tenant "${newTnt.name}" provisioned successfully.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.primaryDomain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadges: Record<TenantStatus, string> = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    suspended: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    archived: 'bg-red-500/10 text-red-500 border-red-500/20',
    provisioning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Organization & Tenant Management</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.2 Provision child tenants, manage environment isolation, configure storage quotas, and monitor seat allocations.
          </p>
        </div>

        <button
          onClick={() => setShowProvisionModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Tenant</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Organizations Directory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {orgs.map((org) => (
          <div key={org.id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{org.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                {org.planTier}
              </span>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div>Owner: <strong className="text-foreground">{org.ownerName}</strong> ({org.ownerEmail})</div>
              <div>Monthly Spend: <strong className="text-emerald-500 font-mono">${org.monthlySpendDollars.toLocaleString()}</strong></div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>{org.tenantCount} Child Tenants</span>
              <span>{org.totalWorkspacesCount} Workspaces</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tenants Directory Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-foreground">Provisioned Tenants Directory</h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tenants or domains..."
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredTenants.map((tnt) => (
            <div key={tnt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">{tnt.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${statusBadges[tnt.status]}`}>
                    {tnt.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-primary flex items-center space-x-2">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{tnt.primaryDomain}</span>
                  <span className="text-muted-foreground">• Org: {tnt.organizationName}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-xs font-mono">
                <div>
                  <span className="text-muted-foreground">Seats: </span>
                  <strong className="text-foreground">{tnt.activeUsersCount}/{tnt.userSeatLimit}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Storage: </span>
                  <strong className="text-foreground">{tnt.usedStorageGB}/{tnt.allocatedStorageGB} GB</strong>
                </div>
                <button
                  onClick={() => handleToggleTenantStatus(tnt.id, tnt.status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    tnt.status === 'active'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {tnt.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provision New Tenant Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-primary" />
                <span>Provision New Child Tenant</span>
              </h3>
              <button onClick={() => setShowProvisionModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleProvisionTenant} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Parent Organization</label>
                <select
                  value={newTenantOrgId}
                  onChange={(e) => setNewTenantOrgId(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                >
                  {orgs.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.planTier})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Tenant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme EMEA Production"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Primary Custom Domain Alias</label>
                <input
                  type="text"
                  placeholder="e.g. emea.acme.sathus.cloud"
                  value={newTenantDomain}
                  onChange={(e) => setNewTenantDomain(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Storage Quota (GB)</label>
                  <input
                    type="number"
                    value={newTenantStorageGB}
                    onChange={(e) => setNewTenantStorageGB(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">User Seat Limit</label>
                  <input
                    type="number"
                    value={newTenantSeats}
                    onChange={(e) => setNewTenantSeats(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
