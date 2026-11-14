'use client';

import * as React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { InfrastructureTelemetryResponse } from '@/types/infrastructure';

interface InfrastructureStatusBannerProps {
  telemetry: InfrastructureTelemetryResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: (val: boolean) => void;
}

export function InfrastructureStatusBanner({
  telemetry,
  isLoading,
  onRefresh,
  autoRefresh,
  onToggleAutoRefresh,
}: InfrastructureStatusBannerProps) {
  const status = telemetry?.overallStatus || 'healthy';

  const statusConfig = {
    healthy: {
      label: 'All Systems Operational',
      badgeVariant: 'success' as const,
      icon: CheckCircle2,
      textColor: 'text-emerald-700 dark:text-emerald-400',
      bgColor: 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60',
      dotColor: 'bg-emerald-500',
    },
    degraded: {
      label: 'Degraded Performance Detected',
      badgeVariant: 'warning' as const,
      icon: AlertTriangle,
      textColor: 'text-amber-700 dark:text-amber-400',
      bgColor: 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60',
      dotColor: 'bg-amber-500',
    },
    critical: {
      label: 'Critical Service Disruption',
      badgeVariant: 'destructive' as const,
      icon: XCircle,
      textColor: 'text-rose-700 dark:text-rose-400',
      bgColor: 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60',
      dotColor: 'bg-rose-500',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className={`rounded-xl border p-5 shadow-xs transition-all ${statusConfig.bgColor}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left: Overall Health & Status */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-2xs dark:bg-slate-900">
            <StatusIcon className={`h-6 w-6 ${statusConfig.textColor}`} />
            <span className={`absolute -right-0.5 -top-0.5 flex h-3 w-3`}>
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${statusConfig.dotColor}`} />
              <span className={`relative inline-flex h-3 w-3 rounded-full ${statusConfig.dotColor}`} />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Infrastructure & Supabase Health Center
              </h2>
              <Badge variant={statusConfig.badgeVariant} className="font-semibold uppercase tracking-wider text-[10px]">
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live telemetry aggregated from Ubuntu VPS (157.20.172.186), Docker Engine & Supabase Cloud (arkoolfygfqawyvwnldv)
            </p>
          </div>
        </div>

        {/* Right: Quick Stats & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-1.5 rounded-lg border bg-background/80 px-3 py-1.5 text-xs shadow-2xs">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Services:</span>
            <span className="font-bold text-foreground">
              {telemetry?.summary.healthyCount ?? 10} / {telemetry?.summary.totalServices ?? 10} Healthy
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border bg-background/80 px-3 py-1.5 text-xs shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-muted-foreground">Updated:</span>
            <span className="font-mono font-medium text-foreground">
              {telemetry?.summary.lastChecked || 'Just now'}
            </span>
          </div>

          {/* Auto-Refresh Toggle */}
          <button
            onClick={() => onToggleAutoRefresh(!autoRefresh)}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              autoRefresh
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
            }`}
            title="Auto-refresh telemetry every 20 seconds"
          >
            Auto: {autoRefresh ? '30s ON' : 'OFF'}
          </button>

          {/* Refresh Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1.5 border-border bg-background shadow-2xs hover:bg-muted/60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
            {isLoading ? 'Syncing...' : 'Refresh'}
          </Button>
        </div>
      </div>
    </div>
  );
}
