import { describe, expect, it } from 'vitest';
import { getUnifiedInfrastructureTelemetry } from '../infrastructure-monitor';

describe('Unified Infrastructure & Supabase Telemetry Engine', () => {
  it('collects comprehensive real-time or cached infrastructure telemetry', async () => {
    const data = await getUnifiedInfrastructureTelemetry(false);

    expect(data).toBeDefined();
    expect(data.success).toBe(true);
    expect(typeof data.timestamp).toBe('string');
    expect(['healthy', 'degraded', 'critical']).toContain(data.overallStatus);

    // Section A: Summary
    expect(data.summary).toBeDefined();
    expect(data.summary.totalServices).toBeGreaterThanOrEqual(8);
    expect(data.summary.healthyCount).toBeGreaterThanOrEqual(1);

    // Section B: Server Health
    expect(data.server).toBeDefined();
    expect(data.server.host).toBe('vps-sathus-primary');
    expect(data.server.ip).toBe('157.20.172.186');
    expect(data.server.os).toContain('Ubuntu');
    expect(data.server.cpu.cores).toBe(22);
    expect(data.server.ram.totalBytes).toBeGreaterThan(0);
    expect(data.server.disk.mount).toBe('/');
    expect(data.server.sslCertificates.length).toBeGreaterThan(0);

    // Section C: Supabase Health
    expect(data.supabase).toBeDefined();
    expect(data.supabase.projectRef).toBe('arkoolfygfqawyvwnldv');
    expect(data.supabase.host).toContain('supabase.co');
    expect(data.supabase.database.sizeBytes).toBeGreaterThan(0);
    expect(data.supabase.database.maxConnections).toBe(60);
    expect(data.supabase.database.schemaBreakdown.length).toBeGreaterThan(0);

    // Section D: Services
    expect(data.services.length).toBeGreaterThanOrEqual(8);
    const vpsService = data.services.find((s) => s.id === 'srv-vps');
    expect(vpsService).toBeDefined();
    expect(vpsService?.status).toBe('operational');

    const supabaseService = data.services.find((s) => s.id === 'srv-supabase-db');
    expect(supabaseService).toBeDefined();

    // Section E: Docker Containers
    expect(data.containers.length).toBeGreaterThanOrEqual(10);
    const ohIdBackend = data.containers.find((c) => c.name.includes('oh-id'));
    expect(ohIdBackend).toBeDefined();

    // Section F: Alerts
    expect(Array.isArray(data.alerts)).toBe(true);
  }, 15000);

  it('serves cached telemetry on immediate subsequent call', async () => {
    const first = await getUnifiedInfrastructureTelemetry(false);
    const second = await getUnifiedInfrastructureTelemetry(false);

    expect(first.timestamp).toBe(second.timestamp);
    expect(second.cached).toBe(true);
  });

  it('forces a fresh probe when forceRefresh is true', async () => {
    const cached = await getUnifiedInfrastructureTelemetry(false);
    expect(cached).toBeDefined();

    const fresh = await getUnifiedInfrastructureTelemetry(true);
    expect(fresh.cached).toBe(false);
  }, 15000);
});
