'use client';

import * as React from 'react';
import { Container, Search, Cpu, MemoryStick, Network, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { ContainerTelemetry } from '@/types/infrastructure';

interface ContainerStatsTableProps {
  containers: ContainerTelemetry[];
}

export function ContainerStatsTable({ containers }: ContainerStatsTableProps) {
  const [filterQuery, setFilterQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!filterQuery.trim()) return containers;
    const q = filterQuery.toLowerCase();
    return containers.filter((c) => c.name.toLowerCase().includes(q));
  }, [containers, filterQuery]);

  return (
    <Card className="shadow-2xs">
      <CardHeader className="py-3 px-4 border-b">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Container className="h-4 w-4 text-primary" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
              SECTION E — Docker Container Runtime Inventory ({containers.length} Microservices)
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter container name..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
            <Badge variant="outline" className="text-[11px] shrink-0">
              Docker 28.0.1
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Container Name</th>
                <th className="py-2.5 px-4 font-semibold">Runtime Status</th>
                <th className="py-2.5 px-4 font-semibold">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" /> CPU %
                  </span>
                </th>
                <th className="py-2.5 px-4 font-semibold">
                  <span className="flex items-center gap-1">
                    <MemoryStick className="h-3 w-3" /> Memory Usage / Limit
                  </span>
                </th>
                <th className="py-2.5 px-4 font-semibold">
                  <span className="flex items-center gap-1">
                    <Network className="h-3 w-3" /> Net I/O (RX / TX)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No containers match &quot;{filterQuery}&quot;
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.name} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-foreground">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono">
                      <span className={c.cpuPercent > 10 ? 'text-amber-600 font-bold' : 'text-foreground'}>
                        {c.cpuPercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-muted-foreground">
                      <span className="font-semibold text-foreground">{c.memoryUsageFormatted}</span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-muted-foreground">
                      {c.networkIO}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
