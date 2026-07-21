import type { BackupJobItem, RestoreJobItem, DisasterRecoveryPlan } from '../types';

export const mockBackupJobs: BackupJobItem[] = [
  {
    id: 'bk-1001',
    name: 'Nightly Automated PostgreSQL Full Backup',
    backupType: 'full',
    scope: 'Platform Global Cluster',
    sizeGB: 142.8,
    durationSeconds: 420,
    status: 'completed',
    location: 's3://sathus-backups-ap-south-1/nightly-full-20260721.bak',
    createdAt: '2026-07-21T02:00:00Z',
  },
  {
    id: 'bk-1002',
    name: 'Hourly Incremental CDC Event Stream Backup',
    backupType: 'incremental',
    scope: 'Tenant DB Shards',
    sizeGB: 12.4,
    durationSeconds: 45,
    status: 'completed',
    location: 's3://sathus-backups-ap-south-1/inc-20260721-1800.bak',
    createdAt: '2026-07-21T18:00:00Z',
  },
  {
    id: 'bk-1003',
    name: 'Acme Global Tenant Isolated Storage Snapshot',
    backupType: 'tenant_selective',
    scope: 'Tenant tnt-101 (Acme Production Main)',
    sizeGB: 48.5,
    durationSeconds: 180,
    status: 'completed',
    location: 's3://sathus-backups-ap-south-1/acme-tnt-101-snapshot.bak',
    createdAt: '2026-07-20T12:00:00Z',
  },
];

export const mockRestoreJobs: RestoreJobItem[] = [
  {
    id: 'rst-401',
    backupId: 'bk-1002',
    targetEnvironment: 'staging',
    pointInTime: '2026-07-21T16:00:00Z',
    status: 'completed',
    requestedBy: 'Sarah Jenkins',
    startedAt: '2026-07-21T16:15:00Z',
  },
];

export const mockDRPlan: DisasterRecoveryPlan = {
  id: 'dr-plan-alpha',
  primaryRegion: 'ap-south-1 (Chennai, India)',
  drSecondaryRegion: 'ap-southeast-1 (Singapore)',
  rpoMinutes: 5,
  rtoMinutes: 15,
  failoverStatus: 'standby',
  lastValidatedAt: '2026-07-15T00:00:00Z',
};
