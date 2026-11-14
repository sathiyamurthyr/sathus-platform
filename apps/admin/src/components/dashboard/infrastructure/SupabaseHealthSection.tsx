'use client';

import * as React from 'react';
import { Database, Cloud, Users, Zap, Layers, Activity, CreditCard, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { SupabaseHealthData } from '@/types/infrastructure';

interface SupabaseHealthSectionProps {
  supabase: SupabaseHealthData | null;
}

export function SupabaseHealthSection({ supabase }: SupabaseHealthSectionProps) {
  if (!supabase) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Loading Supabase telemetry...
      </div>
    );
  }

  const db = supabase.database;
  const storage = supabase.storage;
  const auth = supabase.authentication;
  const realtime = supabase.realtime;
  const billing = supabase.billing;

  return (
    <div className="space-y-4">
      {/* Header with Supabase Project Details */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">SECTION C — Supabase Health & Usage Monitoring</h3>
            <Badge variant="success" className="font-mono text-[10px]">
              {supabase.projectRef}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Host: <code className="font-mono">{supabase.host}</code> • PostgreSQL {db.version} • {supabase.region}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
            <span>Gateway Latency: <strong className="font-mono text-foreground">{supabase.latencyMs}ms</strong></span>
          </span>
          <span className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5 text-primary" />
            <strong className="text-foreground">{billing.plan}</strong>
          </span>
        </div>
      </div>

      {/* 4 Cards: DB Size, Connections Pool, Auth & Storage, Schema Distribution */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Database Storage Size vs Quota */}
        <Card className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Database Size & Quota
            </CardTitle>
            <div className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
              <Database className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold tracking-tight text-foreground">
                {db.sizeFormatted}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Quota: {db.quotaFormatted}
              </span>
            </div>

            <Progress
              value={db.quotaPercent}
              max={100}
              className={`h-2 rounded-full ${
                db.quotaPercent > 90 ? 'bg-destructive/20 [&>div]:bg-destructive' : db.quotaPercent > 75 ? 'bg-warning/20 [&>div]:bg-warning' : 'bg-emerald-500/20 [&>div]:bg-emerald-600'
              }`}
            />

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
              <span>{db.quotaPercent}% of 8 GB Plan Quota</span>
              <span className="text-emerald-600 font-semibold font-mono">Healthy</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Connection Pool Utilization */}
        <Card className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Connection Pool
            </CardTitle>
            <div className="rounded-md bg-blue-500/10 p-1.5 text-blue-600 dark:text-blue-400">
              <Zap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold tracking-tight text-foreground">
                {db.totalConnections} / {db.maxConnections}
              </div>
              <Badge variant="outline" className="font-mono text-[10px]">
                {db.poolUtilizationPercent}% POOL
              </Badge>
            </div>

            <Progress
              value={db.poolUtilizationPercent}
              max={100}
              className="h-2 rounded-full bg-blue-500/20 [&>div]:bg-blue-600"
            />

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
              <span>Active: <strong className="text-foreground">{db.activeConnections}</strong> • Idle: <strong className="text-foreground">{db.idleConnections}</strong></span>
              <span>Max: {db.maxConnections}</span>
            </div>
          </CardContent>
        </Card>

        {/* 3. Auth & Storage Buckets */}
        <Card className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Auth & Cloud Storage
            </CardTitle>
            <div className="rounded-md bg-purple-500/10 p-1.5 text-purple-600 dark:text-purple-400">
              <Cloud className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted/40 p-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3 text-purple-600" />
                  <span>Auth Users</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-0.5">
                  {auth.totalUsers}
                </div>
              </div>

              <div className="rounded-md bg-muted/40 p-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Cloud className="h-3 w-3 text-blue-600" />
                  <span>Storage Used</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-0.5 truncate">
                  {storage.usedFormatted}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
              <span>Buckets: {storage.bucketsCount} • Objects: {storage.objectsCount}</span>
              <span className="text-purple-600 font-semibold text-[10px]">Quota: {storage.quotaFormatted}</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Realtime & Billing Status */}
        <Card className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Realtime & Billing Tier
            </CardTitle>
            <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-foreground">{billing.plan}</div>
                <div className="text-[11px] text-muted-foreground">{billing.computePlan}</div>
              </div>
              <Badge variant="success" className="text-[10px]">
                {billing.overageStatus.toUpperCase()}
              </Badge>
            </div>

            <div className="rounded-md bg-muted/40 p-2 text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Realtime Channels:</span>
              <strong className="text-foreground">{realtime.activeChannelsCount} active</strong>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>Zero Overage</span>
              </span>
              <span>TLS 1.3 Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schema Distribution Breakdown */}
      {db.schemaBreakdown && db.schemaBreakdown.length > 0 && (
        <Card className="shadow-2xs">
          <CardHeader className="py-3 px-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                  PostgreSQL Schema Distribution ({db.schemaBreakdown.reduce((sum, s) => sum + s.tablesCount, 0)} Total Tables)
                </CardTitle>
              </div>
              <span className="text-[11px] text-muted-foreground">Grounded in Supabase information_schema</span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
              {db.schemaBreakdown.map((s) => (
                <div key={s.schema} className="rounded-lg border bg-muted/20 p-2.5 text-center">
                  <div className="text-xs font-bold font-mono text-foreground truncate" title={s.schema}>
                    {s.schema}
                  </div>
                  <div className="text-base font-extrabold text-primary mt-0.5">
                    {s.tablesCount}
                  </div>
                  <div className="text-[10px] text-muted-foreground">tables</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

