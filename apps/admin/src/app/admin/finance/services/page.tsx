'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, CheckCircle2, Edit, Save, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { FinanceService } from '@/types/finance';

export default function ServicesPage() {
  const [services, setServices] = useState<FinanceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<FinanceService | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Edit Service Form State
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSac, setEditSac] = useState('998315');
  const [editGstRate, setEditGstRate] = useState<number>(18);
  const [editPrice, setEditPrice] = useState<number>(5500);

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

  useEffect(() => {
    if (editingService) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [editingService]);

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handleOpenEdit = (svc: FinanceService) => {
    setEditingService(svc);
    setEditName(svc.service_name);
    setEditDesc(svc.description);
    setEditSac(svc.sac_code || '998315');
    setEditGstRate(svc.default_gst_rate || 18);
    const p = svc.prices?.[0]?.amount ?? svc.prices?.[0]?.unit_price ?? (svc.service_code === 'APP-SERVER' ? 5500 : 3000);
    setEditPrice(p);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      await financeClient.updateService(editingService.ref_id, {
        service_name: editName,
        description: editDesc,
        sac_code: editSac,
        default_gst_rate: Number(editGstRate),
        unit_price: Number(editPrice),
      });
      setStatusMsg(`Service "${editName}" and base selling rate updated to ${fmt(editPrice)}.`);
      setEditingService(null);
      await loadData();
    } catch {
      setStatusMsg('Failed to update service details.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hosting Services Catalogue
          </h1>
          <p className="text-sm text-muted-foreground">
            Billable server hosting tiers, SAC code 998315 classifications, base rates, and GST tax rules.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)}>✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {services.map((svc) => {
          const currentPrice =
            svc.prices?.[0]?.amount ??
            svc.prices?.[0]?.unit_price ??
            (svc.service_code === 'APP-SERVER' ? 5500 : 3000);

          return (
            <Card key={svc.ref_id} className="border-border hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {svc.service_code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                      Active Catalogue
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(svc)}
                      className="h-6 px-2 text-xs gap-1 text-[#A20A3A] hover:bg-[#A20A3A]/10"
                    >
                      <Edit className="h-3 w-3" /> Edit Rate
                    </Button>
                  </div>
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
                    <div className="flex items-center justify-between rounded border border-border p-2 bg-card">
                      <span className="font-medium text-muted-foreground">
                        Standard Selling Rate:
                      </span>
                      <div className="text-right">
                        <span className="font-mono font-bold text-foreground text-sm">
                          {fmt(currentPrice)} <span className="text-xs font-normal text-muted-foreground">/ month</span>
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          + 18% GST ({fmt(Math.round(currentPrice * 0.18))}) = {fmt(Math.round(currentPrice * 1.18))} total
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(svc)}
                    className="w-full text-xs gap-1.5 border-[#A20A3A]/30 text-[#A20A3A] hover:bg-[#A20A3A]/10"
                  >
                    <Edit className="h-3.5 w-3.5" /> Modify Service Pricing & SAC Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* EDIT SERVICE MODAL */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Separate Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
            onClick={() => setEditingService(null)}
          />

          {/* Modal Container: Solid White #FFFFFF, max-w-[640px], max-h-[90vh], rounded-2xl, shadow-2xl */}
          <div
            className="relative z-10 w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-2xl bg-white border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Fixed Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A] shrink-0">
                  <Edit className="h-5 w-5 text-[#A20A3A]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Edit Service Details & Selling Rate
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Code: <span className="font-mono font-bold text-neutral-900">{editingService.service_code}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 admin-scrollbar bg-white">
              <form id="edit-service-form" onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Service Display Name <span className="text-[#A20A3A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Service Description <span className="text-[#A20A3A]">*</span>
                  </label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={2}
                    className="w-full p-3 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      SAC Code <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={editSac}
                      onChange={(e) => setEditSac(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      GST Rate (%) <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="number"
                      value={editGstRate}
                      onChange={(e) => setEditGstRate(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-[#FAF8F9] p-4 space-y-2">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Standard Monthly Taxable Selling Rate (₹) <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono font-bold text-[#A20A3A] focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div className="flex justify-between items-center text-neutral-600 pt-2 border-t border-neutral-200 text-xs">
                    <span>Gross Invoiced with 18% GST:</span>
                    <span className="font-mono font-bold text-neutral-900 text-sm">
                      {fmt(Math.round(editPrice * 1.18))} <span className="text-xs font-normal text-neutral-500">/ month</span>
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Sticky Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-[#FAF8F9] shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingService(null)}
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-service-form"
                size="sm"
                className="bg-[#A20A3A] hover:bg-[#85082e] text-white shadow-sm font-semibold px-5 h-9 gap-1.5"
              >
                <Save className="h-3.5 w-3.5" /> Save Service Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
