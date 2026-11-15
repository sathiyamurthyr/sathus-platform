'use client';

import React, { useEffect, useState } from 'react';
import { Building, Plus, CheckCircle2, Search, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { FinanceVendor } from '@/types/finance';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<FinanceVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Vendor Form
  const [legalName, setLegalName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [category, setCategory] = useState('Data Center & Bare Metal Hosting');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const v = await financeClient.getVendors();
      setVendors(v);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVend: Partial<FinanceVendor> = {
      vendor_code: `VEND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      legal_name: legalName,
      trade_name: legalName,
      gstin: gstin.toUpperCase(),
      pan: pan.toUpperCase() || (gstin ? gstin.substring(2, 12) : ''),
      vendor_category: category,
      contact_email: email,
      contact_phone: phone,
      status: 'ACTIVE',
    };

    try {
      await financeClient.createVendor(newVend);
      setStatusMsg(`Vendor ${legalName} added.`);
      setShowModal(false);
      await loadData();
    } catch {
      setStatusMsg('Failed to create vendor.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Vendor Directory & Infrastructure Suppliers
          </h1>
          <p className="text-sm text-muted-foreground">
            Upstream infrastructure, data centers, and third-party SaaS vendors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white"
          >
            <Plus className="h-4 w-4" /> Add Vendor Profile
          </Button>
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

      {/* VENDORS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <Card key={v.ref_id} className="border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    {v.legal_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{v.vendor_code}</p>
                </div>
                <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:text-blue-400">
                  {v.vendor_category || 'Hosting'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="rounded border border-border bg-muted/30 p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GSTIN:</span>
                  <span className="font-mono font-bold text-foreground">{v.gstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PAN:</span>
                  <span className="font-mono text-foreground">{v.pan}</span>
                </div>
              </div>

              <div className="space-y-1 text-muted-foreground pt-1">
                {v.contact_email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {v.contact_email}
                  </p>
                )}
                {v.contact_phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" /> {v.contact_phone}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Building className="h-5 w-5 text-[#A20A3A]" /> Add Vendor Profile
              </h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Vendor Legal Name
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. WebHostingBingo Technologies"
                  className="w-full rounded border border-border bg-background p-2 text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="33AAACW1234F1Z1"
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#A20A3A] hover:bg-[#85082e] text-white"
                >
                  Save Vendor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
