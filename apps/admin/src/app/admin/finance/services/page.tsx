'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, CheckCircle2, Server, Database, Layers, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { FinanceService } from '@/types/finance';

export default function ServicesPage() {
  const [services, setServices] = useState<FinanceService[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const s = await financeClient.getServices();
      setServices(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hosting Services Catalogue
          </h1>
          <p className="text-sm text-muted-foreground">
            Billable server hosting tiers, SAC code 998315 classifications, and GST tax rules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((svc) => (
          <Card key={svc.ref_id} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="font-mono rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {svc.service_code}
                </span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                  Active Catalogue
                </span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground mt-2">
                {svc.service_name}
              </CardTitle>
              <CardDescription className="text-xs">
                {svc.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded border border-border bg-muted/30 p-3">
                <div>
                  <span className="text-muted-foreground">SAC Code:</span>
                  <p className="font-mono font-bold text-foreground mt-0.5">{svc.sac_code}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">GST Rate:</span>
                  <p className="font-mono font-bold text-foreground mt-0.5">{svc.default_gst_rate}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Billing Cycle:</span>
                  <p className="font-medium text-foreground mt-0.5">{svc.billing_frequency}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-medium text-foreground mt-0.5">{svc.category}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-2">Configured Pricing Tiers:</p>
                <div className="space-y-1.5">
                  {svc.prices.map((p) => (
                    <div
                      key={p.ref_id}
                      className="flex items-center justify-between rounded border border-border p-2 bg-card"
                    >
                      <span className="font-medium text-muted-foreground">
                        Standard Selling Rate:
                      </span>
                      <span className="font-mono font-bold text-foreground text-sm">
                        {fmt(p.amount ?? p.unit_price ?? 0)} <span className="text-xs font-normal text-muted-foreground">/ month</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
