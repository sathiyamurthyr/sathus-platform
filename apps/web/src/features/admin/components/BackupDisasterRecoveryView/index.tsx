'use client';

import React, { useState } from 'react';
import {
  HardDrive,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Globe,
  Clock,
  Shield,
  Database,
  Activity,
  Layers,
  Play,
  RefreshCw,
} from 'lucide-react';
import { mockBackupJobs, mockRestoreJobs, mockDRPlan } from '../../data/mock-backup-dr-data';
import type { BackupJobItem, RestoreJobItem, DisasterRecoveryPlan, BackupType } from '../../types';

export function BackupDisasterRecoveryView() {
  const [backups, setBackups] = useState<BackupJobItem[]>(mockBackupJobs);
  const [restores, setRestores] = useState<RestoreJobItem[]>(mockRestoreJobs);
  const [drPlan, setDrPlan] = useState<DisasterRecoveryPlan>(mockDRPlan);

  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // New Backup Form State
  const [newBackupName, setNewBackupName] = useState('');
  const [newBackupType, setNewBackupType] = useState<BackupType>('full');
  const [newBackupScope, setNewBackupScope] = useState('Platform Global Cluster');

  const [notice, setNotice] = useState<string | null>(null);

  const handleTriggerBackup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBackupName.trim()) return;

    const newBk: BackupJobItem = {
      id: `bk-${Date.now()}`,
      name: newBackupName,
      backupType: newBackupType,
      scope: newBackupScope,
      sizeGB: Math.floor(Math.random() * 50) + 10,
      durationSeconds: 120,
      status: 'completed',
      location: `s3://sathus-backups-ap-south-1/${newBackupName.toLowerCase().replace(/\s+/g, '-')}.bak`,
      createdAt: new Date().toISOString(),
    };

    setBackups((prev) => [newBk, ...prev]);
    setShowBackupModal(false);
    setNewBackupName('');
    setNotice(`Backup Job "${newBk.name}" completed successfully.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleRunDRValidation = () => {
    setNotice('Disaster Recovery Failover Test completed. Secondary Region (Singapore) synced. RPO: 4.2 mins, RTO: 11.5 mins.');
    setTimeout(() => setNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-primary" />
            <span>Backup, Restore & Disaster Recovery Platform</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.11 Automated database backups, Point-in-Time Restore (PITR), RPO/RTO SLA telemetry, and cross-region failover.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowBackupModal(true)}
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Trigger Manual Backup</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* DR Region Failover Status Card */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>Cross-Region Disaster Recovery Standby Panel</span>
            </h3>
            <p className="text-xs text-muted-foreground">Primary: {drPlan.primaryRegion} → DR Secondary: {drPlan.drSecondaryRegion}</p>
          </div>

          <button
            onClick={handleRunDRValidation}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Validate DR Failover</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3 rounded-lg bg-background border border-border space-y-1">
            <span className="text-muted-foreground">Recovery Point Objective (RPO)</span>
            <div className="text-lg font-bold text-emerald-500">&lt; {drPlan.rpoMinutes} Minutes</div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border space-y-1">
            <span className="text-muted-foreground">Recovery Time Objective (RTO)</span>
            <div className="text-lg font-bold text-primary">&lt; {drPlan.rtoMinutes} Minutes</div>
          </div>

          <div className="p-3 rounded-lg bg-background border border-border space-y-1">
            <span className="text-muted-foreground">Failover Health</span>
            <div className="text-lg font-bold text-foreground uppercase">{drPlan.failoverStatus} Ready</div>
          </div>
        </div>
      </div>

      {/* Backup Jobs Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Database className="w-4 h-4 text-primary" />
          <span>Active Backup Snapshots Directory</span>
        </h3>

        <div className="divide-y divide-border">
          {backups.map((bk) => (
            <div key={bk.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">{bk.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                    {bk.backupType}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-sans">{bk.scope} • Location: <code className="text-primary">{bk.location}</code></div>
              </div>

              <div className="text-right text-xs shrink-0">
                <div className="font-bold text-foreground">{bk.sizeGB} GB</div>
                <div className="text-[10px] text-muted-foreground">{new Date(bk.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trigger Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-primary" />
                <span>Trigger Manual Backup Job</span>
              </h3>
              <button onClick={() => setShowBackupModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleTriggerBackup} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Backup Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ad-hoc Pre-Migration Database Snapshot"
                  value={newBackupName}
                  onChange={(e) => setNewBackupName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Backup Type</label>
                  <select
                    value={newBackupType}
                    onChange={(e) => setNewBackupType(e.target.value as BackupType)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                  >
                    <option value="full">Full Database Backup</option>
                    <option value="incremental">Incremental Stream</option>
                    <option value="tenant_selective">Tenant Selective</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Scope</label>
                  <input
                    type="text"
                    value={newBackupScope}
                    onChange={(e) => setNewBackupScope(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBackupModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Trigger Backup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
