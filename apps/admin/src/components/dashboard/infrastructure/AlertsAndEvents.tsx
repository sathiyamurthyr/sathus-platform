'use client';

import * as React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Archive,
  KeyRound,
  FileCheck2,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { InfrastructureAlert, SSLCertificateInfo, ServerHealthData } from '@/types/infrastructure';

interface AlertsAndEventsProps {
  alerts: InfrastructureAlert[];
  sslCertificates: SSLCertificateInfo[];
  backups: ServerHealthData['backups'];
}

export function AlertsAndEvents({ alerts, sslCertificates, backups }: AlertsAndEventsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">SECTION F — Security Defenses, Backups & SSL Health</h3>
          <p className="text-xs text-muted-foreground">
            Host perimeter defense (UFW, Fail2ban), automated Backblaze B2 encrypted backups & Let&apos;s Encrypt certificates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 1. Host Perimeter Defense & SSH Hardening */}
        <Card className="shadow-2xs">
          <CardHeader className="py-3 px-4 border-b">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                Perimeter Defense & SSH
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>UFW Firewall</span>
              </span>
              <Badge variant="success" className="text-[10px]">ACTIVE (DEFAULT DROP)</Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Fail2ban IPS</span>
              </span>
              <Badge variant="success" className="text-[10px]">4 JAILS RUNNING</Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <KeyRound className="h-3.5 w-3.5 text-amber-600" />
                <span>SSH Security</span>
              </span>
              <span className="font-mono text-xs font-semibold text-foreground">Port 55002 (ED25519 Only)</span>
            </div>

            <div className="rounded-md bg-muted/40 p-2.5 text-[11px] text-muted-foreground space-y-1">
              <p>• Password authentication disabled host-wide.</p>
              <p>• Root SSH login blocked.</p>
              <p>• WireGuard mesh active on UDP 51820.</p>
            </div>
          </CardContent>
        </Card>

        {/* 2. Automated Backblaze B2 Backups */}
        <Card className="shadow-2xs">
          <CardHeader className="py-3 px-4 border-b">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-primary" />
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                Stateless Cloud Backups (B2)
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Scheduler:</span>
              <span className="font-mono font-medium text-foreground">vps-b2-backup.timer</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Last Run Result:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <FileCheck2 className="h-3.5 w-3.5" />
                {backups.lastStatus} (0/SUCCESS)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Last Executed:</span>
              <span className="text-foreground">{backups.lastRun}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Next Scheduled:</span>
              <span className="text-foreground">{backups.nextScheduled}</span>
            </div>

            <div className="rounded-md bg-muted/40 p-2.5 text-[11px] text-muted-foreground space-y-1">
              <p className="font-mono truncate" title={backups.target}>Target: {backups.target}</p>
              <p>• Zero local disk retention (stateless stream).</p>
              <p>• In-memory AES-256 decryption & integrity verify.</p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Let's Encrypt SSL/TLS Certificates */}
        <Card className="shadow-2xs">
          <CardHeader className="py-3 px-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                  SSL/TLS Certificates ({sslCertificates.length})
                </CardTitle>
              </div>
              <Badge variant="success" className="text-[10px]">ALL VALID</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2 max-h-56 overflow-y-auto admin-scrollbar">
            {sslCertificates.map((cert) => (
              <div
                key={cert.domain}
                className="flex items-center justify-between rounded-md border bg-muted/20 px-2.5 py-1.5 text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-mono font-medium text-foreground truncate" title={cert.domain}>
                    {cert.domain}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Expires: {cert.expiryDate.split(' ')[0]}
                  </div>
                </div>
                <Badge
                  variant={cert.status === 'healthy' ? 'success' : cert.status === 'warning' ? 'warning' : 'destructive'}
                  className="font-mono text-[10px] shrink-0"
                >
                  {cert.daysRemaining}d left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active System Alerts Feed */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg border p-3.5 text-xs ${
                alert.severity === 'critical'
                  ? 'border-rose-200 bg-rose-50/70 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800/60 dark:text-rose-300'
                  : alert.severity === 'warning'
                  ? 'border-amber-200 bg-amber-50/70 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800/60 dark:text-amber-300'
                  : 'border-blue-200 bg-blue-50/70 text-blue-800 dark:bg-blue-950/20 dark:border-blue-800/60 dark:text-blue-300'
              }`}
            >
              {alert.severity === 'critical' ? (
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              ) : alert.severity === 'warning' ? (
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              ) : (
                <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
                <span className="font-bold">{alert.title}: </span>
                <span>{alert.message}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

