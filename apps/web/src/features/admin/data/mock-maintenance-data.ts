import type { MaintenanceTaskItem, EmergencyBannerConfig } from '../types';

export const mockMaintenanceTasks: MaintenanceTaskItem[] = [
  {
    id: 'maint-101',
    title: 'PostgreSQL 16 Storage Index Defragmentation & Vacuum',
    description: 'Scheduled database optimization to reclaim unused pages and tune pgvector HNSW indices.',
    scheduledStartTime: '2026-07-26T01:00:00Z',
    scheduledEndTime: '2026-07-26T02:30:00Z',
    affectedServices: ['Database Engine', 'Vector Search'],
    status: 'scheduled',
  },
  {
    id: 'maint-102',
    title: 'Redis 7.2 Cluster Memory Flush & Cache Warmup',
    description: 'Flushing transient cache keys and re-indexing active session tokens.',
    scheduledStartTime: '2026-07-21T03:00:00Z',
    scheduledEndTime: '2026-07-21T03:15:00Z',
    affectedServices: ['Redis Cache', 'Session Manager'],
    status: 'completed',
  },
];

export const mockEmergencyBanner: EmergencyBannerConfig = {
  id: 'banner-1',
  title: 'Scheduled Platform Maintenance Window',
  message: 'Sathus Cloud Platform will undergo brief maintenance on Sunday July 26 between 01:00 and 02:30 UTC.',
  severity: 'info',
  isActive: false,
  updatedAt: '2026-07-20T12:00:00Z',
};
