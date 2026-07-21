'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  Lock,
  Mail,
  Shield,
  Clock,
  Laptop,
  Globe,
  AlertTriangle,
  UserX,
  UserCheck,
  Key,
} from 'lucide-react';
import { mockUsers, mockUserSessions } from '../../data/mock-user-lifecycle-data';
import type { UserItem, UserSession, UserStatus } from '../../types';

export function UserLifecycleManagerView() {
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [sessions, setSessions] = useState<UserSession[]>(mockUserSessions);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // New User Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleUserStatus = (id: string, currentStatus: UserStatus) => {
    const nextStatus: UserStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
    setNotice(`User account "${id}" status changed to ${nextStatus.toUpperCase()}.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    setNotice(`Session "${sessionId}" revoked successfully.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newUser: UserItem = {
      id: `usr-${Date.now()}`,
      fullName: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      tenantId: 'tnt-101',
      tenantName: 'Acme Production Main',
      department: 'Engineering',
      status: 'pending_activation',
      mfaEnabled: false,
      lastActiveAt: 'Never',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setNotice(`Invitation sent to ${inviteEmail}.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadges: Record<UserStatus, string> = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    pending_activation: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    suspended: 'bg-red-500/10 text-red-500 border-red-500/20',
    terminated: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>User Lifecycle & Identity Governance</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.4 Onboard enterprise users, dispatch email invitations, enforce MFA policies, and revoke active sessions.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite New User</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* User Directory Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-foreground">Centralized User Directory</h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredUsers.map((usr) => (
            <div key={usr.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">{usr.fullName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${statusBadges[usr.status]}`}>
                    {usr.status}
                  </span>
                  {usr.mfaEnabled && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>MFA Active</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {usr.email} • Role: <strong className="text-primary">{usr.role}</strong> • Department: {usr.department}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono">
                <span className="text-muted-foreground">Tenant: {usr.tenantName}</span>
                <button
                  onClick={() => handleToggleUserStatus(usr.id, usr.status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    usr.status === 'active'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                  }`}
                >
                  {usr.status === 'active' ? 'Suspend' : 'Reactivate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active User Sessions & Security Audit */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
          <Laptop className="w-4 h-4 text-primary" />
          <span>Active User Sessions Audit</span>
        </h3>

        <div className="divide-y divide-border">
          {sessions.map((sess) => (
            <div key={sess.sessionId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-foreground flex items-center space-x-2">
                  <span>{sess.userName}</span>
                  {sess.isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">Current Session</span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  IP: {sess.ipAddress} • {sess.deviceBrowser} • Location: {sess.location}
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(sess.sessionId)}
                  className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20"
                >
                  Revoke Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <span>Invite New Enterprise User</span>
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. David Vance"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Work Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. dvance@enterprise.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Assign Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                >
                  <option value="Tenant Admin">Tenant Admin</option>
                  <option value="Workspace Admin">Workspace Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
