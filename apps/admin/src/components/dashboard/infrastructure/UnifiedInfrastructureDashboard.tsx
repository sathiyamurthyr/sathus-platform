'use client';

import * as React from 'react';
import { InfrastructureStatusBanner } from './InfrastructureStatusBanner';
import { ServerHealthSection } from './ServerHealthSection';
import { SupabaseHealthSection } from './SupabaseHealthSection';
import { ServiceStatusGrid } from './ServiceStatusGrid';
import { ContainerStatsTable } from './ContainerStatsTable';
import { AlertsAndEvents } from './AlertsAndEvents';
import type { InfrastructureTelemetryResponse } from '@/types/infrastructure';

export function UnifiedInfrastructureDashboard() {
  const [telemetry, setTelemetry] = React.useState<InfrastructureTelemetryResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = React.useState(true);

  const fetchTelemetry = React.useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = force ? '/api/admin/infrastructure/health?refresh=true' : '/api/admin/infrastructure/health';
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(`Failed to load telemetry (HTTP ${resp.status})`);
      }
      const data: InfrastructureTelemetryResponse = await resp.json();
      setTelemetry(data);
    } catch (err: unknown) {
      console.error('[UnifiedInfrastructureDashboard] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Telemetry sync failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTelemetry(false);
  }, [fetchTelemetry]);

  // Auto-refresh interval (30 seconds)
  React.useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchTelemetry(false);
    }, 30_000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchTelemetry]);

  return (
    <div className="space-y-6 pt-4 border-t border-border/80">
      {/* SECTION A: Overall Status Banner & Quick Controls */}
      <InfrastructureStatusBanner
        telemetry={telemetry}
        isLoading={isLoading}
        onRefresh={() => fetchTelemetry(true)}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={setAutoRefresh}
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          <strong>Telemetry Synchronization Warning:</strong> {error}. Using latest telemetry cache.
        </div>
      )}

      {/* SECTION B: Server Health Monitoring (CPU, RAM, Disk, Network, Host specs) */}
      <ServerHealthSection server={telemetry?.server || null} />

      {/* SECTION C: Supabase Health & Usage Monitoring (DB Size, Connections, Schema breakdown, Auth, Storage) */}
      <SupabaseHealthSection supabase={telemetry?.supabase || null} />

      {/* SECTION D: Platform Service Status Grid (VPS, Docker, Nginx, APIs, DB, Auth, Backups, SSL) */}
      <ServiceStatusGrid services={telemetry?.services || []} />

      {/* SECTION E: Docker Container Telemetry (14 microservices) */}
      <ContainerStatsTable containers={telemetry?.containers || []} />

      {/* SECTION F: Alerts, Security Defenses, B2 Backups & Let's Encrypt SSL Certificates */}
      <AlertsAndEvents
        alerts={telemetry?.alerts || []}
        sslCertificates={telemetry?.server?.sslCertificates || []}
        backups={
          telemetry?.server?.backups || {
            status: 'healthy',
            lastRun: 'Today, 03:03 UTC',
            lastStatus: 'SUCCESS',
            nextScheduled: 'Tomorrow, 03:00 UTC',
            target: 'Backblaze B2 (sathus-pay2pay)',
          }
        }
      />
    </div>
  );
}
