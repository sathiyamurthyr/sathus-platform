'use client';

import * as React from 'react';
import { Cpu, HardDrive, MemoryStick, Network, Clock, Server, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { ServerHealthData } from '@/types/infrastructure';

interface ServerHealthSectionProps {
  server: ServerHealthData | null;
}

export function ServerHealthSection({ server }: ServerHealthSectionProps) {
  if (!server) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Loading server telemetry...
      </div>
    );
  }

  const cpu = server.cpu;
  const ram = server.ram;
  const disk = server.disk;
  const net = server.network;

  return (
    <div className="space-y-4">
      {/* Header with Server Host Details */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">SECTION B — Server Health & Host Telemetry</h3>
            <Badge variant="outline" className="font-mono text-[10px]">
              {server.ip}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {server.os} • {server.kernel} • Intel(R) Xeon(R) E5-2680 v4 ({cpu.cores} vCPUs)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Uptime: <strong className="font-medium text-foreground">{server.uptime}</strong></span>
          </span>
          <span className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-muted-foreground font-mono">
            Load: {server.loadAverage.m1.toFixed(2)}, {server.loadAverage.m5.toFixed(2)}, {server.loadAverage.m15.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Grid of Key Host Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. CPU Card */}
        <Card className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              CPU Utilization
            </CardTitle>
            <div className="rounded-md bg-blue-500/10 p-1.5 text-blue-600 dark:text-blue-400">
              <Cpu className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold tracking-tight text-foreground">
                {cpu.formatted}
              </div>
              <Badge variant={cpu.current > cpu.criticalThreshold ? 'destructive' : cpu.current > cpu.warningThreshold ? 'warning' : 'success'} className="text-[10px]">
                {cpu.status.toUpperCase()}
              </Badge>
            </div>

            <Progress
              value={cpu.current}
              max={100}
              className={`h-2 rounded-full ${
                cpu.current > 85 ? 'bg-destructive/20 [&>div]:bg-destructive' : cpu.current > 70 ? 'bg-warning/20 [&>div]:bg-warning' : 'bg-blue-500/20 [&>div]:bg-blue-600'
              }`}
            />

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
              <span>{cpu.cores} Dedicated vCPUs</span>
              <span>Warn: &gt;75% • Crit: &gt;90%</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. RAM Card */}
        <Card className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Memory (RAM)
            </CardTitle>
            <div className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
              <MemoryStick className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold tracking-tight text-foreground">
                {ram.formatted}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {ram.usedFormatted} / {ram.totalFormatted}
              </span>
            </div>

            <Progress
              value={ram.current}
              max={100}
              className={`h-2 rounded-full ${
                ram.current > 90 ? 'bg-destructive/20 [&>div]:bg-destructive' : ram.current > 80 ? 'bg-warning/20 [&>div]:bg-warning' : 'bg-emerald-500/20 [&>div]:bg-emerald-600'
              }`}
            />

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
              <span>Avail: <strong className="text-foreground">{ram.availableFormatted}</strong></span>
              <span>Warn: &gt;80% • Crit: &gt;95%</span>
            </div>
          </CardContent>
        </Card>

        {/* 3. Disk Card */}
        <Card className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              NVMe Disk ({disk.mount})
            </CardTitle>
            <div className="rounded-md bg-purple-500/10 p-1.5 text-purple-600 dark:text-purple-400">
              <HardDrive className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold tracking-tight text-foreground">
                {disk.formatted}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {disk.usedFormatted} / {disk.totalFormatted}
              </span>
            </div>

            <Progress
              value={disk.current}
              max={100}
              className={`h-2 rounded-full ${
                disk.current > 90 ? 'bg-destructive/20 [&>div]:bg-destructive' : disk.current > 80 ? 'bg-warning/20 [&>div]:bg-warning' : 'bg-purple-500/20 [&>div]:bg-purple-600'
              }`}
            />

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
              <span>Free: <strong className="text-foreground">{disk.freeFormatted}</strong></span>
              <span>Warn: &gt;80% • Crit: &gt;90%</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Network I/O Card */}
        <Card className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Network Traffic
            </CardTitle>
            <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
              <Network className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-muted/40 p-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ArrowDownRight className="h-3 w-3 text-emerald-600" />
                  <span>Inbound (RX)</span>
                </div>
                <div className="text-base font-bold text-foreground mt-0.5 truncate">
                  {net.inboundFormatted}
                </div>
              </div>

              <div className="rounded-md bg-muted/40 p-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3 text-blue-600" />
                  <span>Outbound (TX)</span>
                </div>
                <div className="text-base font-bold text-foreground mt-0.5 truncate">
                  {net.outboundFormatted}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
              <span className="flex items-center gap-1">
                <Server className="h-3 w-3 text-muted-foreground" />
                <span>Interface: <code className="font-mono">eth0</code></span>
              </span>
              <Badge variant="success" className="text-[9px]">GIGABIT</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

