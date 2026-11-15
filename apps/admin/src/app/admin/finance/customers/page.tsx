'use client';

import React, { useEffect, useState } from 'react';
import { Users, Plus, CheckCircle2, Search, Mail, Phone, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { FinanceCustomer } from '@/types/finance';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<FinanceCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Customer Form
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [stateCode, setStateCode] = useState('33');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const c = await financeClient.getCustomers();
      setCustomers(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Partial<FinanceCustomer> = {
      customer_code: `CUST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: legalName,
      legal_company_name: legalName,
      legal_name: legalName,
      trade_name: tradeName || legalName,
      gstin: gstin.toUpperCase(),
      pan: pan.toUpperCase() || (gstin ? gstin.substring(2, 12) : ''),
      state: state,
      state_code: stateCode,
      billing_address: address,
      billing_address_line1: address,
      contact_email: email,
      contact_phone: phone,
      email: email,
      phone: phone,
      status: 'ACTIVE',
    };

    try {
      await financeClient.createCustomer(newCust);
      setStatusMsg(`Customer ${legalName} registered successfully.`);
      setShowModal(false);
      await loadData();
    } catch {
      setStatusMsg('Failed to create customer.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Customer Accounts & CRM
          </h1>
          <p className="text-sm text-muted-foreground">
            B2B Enterprise clients, GSTIN verification, Place of Supply mappings, and billing profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white"
          >
            <Plus className="h-4 w-4" /> Add Client Account
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

      {/* CUSTOMERS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => (
          <Card key={c.ref_id} className="border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    {c.legal_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.trade_name}</p>
                </div>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
                  {c.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="rounded border border-border bg-muted/30 p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GSTIN:</span>
                  <span className="font-mono font-bold text-foreground">
                    {c.gstin || 'B2C (Unregistered)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">State:</span>
                  <span className="font-medium text-foreground">
                    {c.state} (Code {c.state_code})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PAN:</span>
                  <span className="font-mono text-foreground">{c.pan}</span>
                </div>
              </div>

              <div className="space-y-1 text-muted-foreground pt-1">
                {c.contact_email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {c.contact_email}
                  </p>
                )}
                {c.contact_phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" /> {c.contact_phone}
                  </p>
                )}
                {c.billing_address_line1 && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{c.billing_address_line1}</span>
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
                <Users className="h-5 w-5 text-[#A20A3A]" /> Register New Customer
              </h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Legal Registered Entity Name
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. Apex Technologies Private Limited"
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
                    placeholder="33AAAAA0000A1Z5"
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    PAN
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    placeholder="AAAAA0000A"
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    GST State Code
                  </label>
                  <input
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="accounts@client.com"
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Billing Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full rounded border border-border bg-background p-2 text-foreground"
                  required
                />
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
                  Save Customer Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
