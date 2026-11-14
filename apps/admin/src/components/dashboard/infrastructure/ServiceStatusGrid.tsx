'use client';

import * as React from 'react';
import {
  Server,
  Container,
  Globe,
  Radio,
  Mail,
  ShoppingBag,
  Database,
  Lock,
  Archive,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ServiceHealthItem } from '@/types/infrastructure';

interface ServiceStatusGridProps {
  services: ServiceHealthItem[];
}

export function ServiceStatusGrid({ services }: ServiceStatusGridProps) {
  const getServiceIcon = (type: ServiceHealthItem['type']) => {
    switch (type) {
      case 'vps':
        return Server;
      case 'docker':
        return Container;
      case 'nginx':
        return Globe;
      case 'api':
        return Radio;
      case 'database':
        return Database;
      case 'auth':
        return Lock;
      case 'backup':
        return Archive;
      case 'ssl':
        return ShieldCheck;
      default:
        return Server;
    }
  };

  const getStatusBadge = (status: ServiceHealthItem['status']) => {
    switch (status) {
      case 'operational':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Operational
          </span>
        );
      case 'degraded':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Degraded
          </span>
        );
      case 'down':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
            Offline
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">SECTION D — Comprehensive Platform Service Health</h3>
          <p className="text-xs text-muted-foreground">
            Real-time ping probes and state verification across VPS, Docker, Nginx, APIs, Database & Cloud Security
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {services.filter((s) => s.status === 'operational').length} / {services.length} Services Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {services.map((service) => {
          const IconComponent = getServiceIcon(service.type);
          return (
            <Card
              key={service.id}
              className="shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
            >
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-muted/60 p-2 text-primary">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  {getStatusBadge(service.status)}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-foreground truncate" title={service.name}>
                    {service.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2" title={service.detail}>
                    {service.detail}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t">
                  <span className="font-mono">
                    {service.latencyMs ? `${service.latencyMs}ms ping` : 'local'}
                  </span>
                  {service.endpoint ? (
                    <span className="truncate max-w-[120px] font-mono" title={service.endpoint}>
                      {service.endpoint.replace('https://', '')}
                    </span>
                  ) : (
                    <span>verified</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

