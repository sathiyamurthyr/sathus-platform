import { describe, it, expect } from 'vitest';
import {
  mockAdminOverviewMetrics,
  mockPlatformSettings,
  mockAdminActivityEvents,
  mockAdminNavigationItems,
} from '../features/admin/data/mock-admin-data';

describe('Story 15.1 Platform Administration Center Foundation Verification', () => {
  it('validates executive administration overview metrics and health telemetry', () => {
    expect(mockAdminOverviewMetrics.platformHealthScorePercent).toBeGreaterThanOrEqual(99.9);
    expect(mockAdminOverviewMetrics.activeTenantsCount).toBe(16);
    expect(mockAdminOverviewMetrics.activeWorkspacesCount).toBe(42);
    expect(mockAdminOverviewMetrics.totalActiveUsersCount).toBe(342);
    expect(mockAdminOverviewMetrics.monthlyRevenueMRR).toBe(24850);
    expect(mockAdminOverviewMetrics.licenseUsagePercent).toBeGreaterThan(80);
  });

  it('validates centralized platform settings framework schema and categories', () => {
    expect(mockPlatformSettings.length).toBeGreaterThan(0);
    mockPlatformSettings.forEach((setting) => {
      expect(setting.key).toBeTruthy();
      expect(setting.category).toBeTruthy();
      expect(setting.title).toBeTruthy();
      expect(setting.valueType).toBeTruthy();
    });
  });

  it('validates centralized activity feed and audit event log details', () => {
    expect(mockAdminActivityEvents.length).toBeGreaterThan(0);
    mockAdminActivityEvents.forEach((act) => {
      expect(act.id).toBeTruthy();
      expect(act.title).toBeTruthy();
      expect(act.performedBy).toBeTruthy();
      expect(act.timestamp).toBeTruthy();
    });
  });

  it('validates administration navigation map and route endpoints', () => {
    expect(mockAdminNavigationItems.length).toBe(12);
    mockAdminNavigationItems.forEach((nav) => {
      expect(nav.id).toBeTruthy();
      expect(nav.title).toBeTruthy();
      expect(nav.route).toContain('/app/admin');
      expect(['core', 'governance', 'infrastructure', 'settings']).toContain(nav.category);
    });
  });
});
