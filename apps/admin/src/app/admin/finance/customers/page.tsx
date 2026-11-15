'use client';

import React, { useEffect, useState } from 'react';
import { Users, Plus, CheckCircle2, Search, Mail, Phone, MapPin, Building, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { FinanceCustomer } from '@/types/finance';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<FinanceCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<FinanceCustomer | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form State
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

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setLegalName('');
    setTradeName('');
    setGstin('');
    setPan('');
    setState('Tamil Nadu');
    setStateCode('33');
    setEmail('');
    setPhone('');
    setAddress('');
    setShowModal(true);
  };

  const handleOpenEdit = (c: FinanceCustomer) => {
    setEditingCustomer(c);
    setLegalName(c.legal_name || c.customer_name || c.legal_company_name || '');
    setTradeName(c.trade_name || c.legal_name || c.customer_name || '');
    setGstin(c.gstin || '');
    setPan(c.pan || '');
    setState(c.state || 'Tamil Nadu');
    setStateCode(c.state_code || '33');
    setEmail(c.contact_email || c.email || '');
    setPhone(c.contact_phone || c.phone || '');
    setAddress(c.billing_address_line1 || c.billing_address || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCustomer) {
      // Update existing customer
      try {
        await financeClient.updateCustomer(editingCustomer.ref_id, {
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
        });
        setStatusMsg(`Customer "${legalName}" details updated successfully.`);
        setShowModal(false);
        setEditingCustomer(null);
        await loadData();
      } catch {
        setStatusMsg('Failed to update customer details.');
      }
    } else {
      // Create new customer
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
        setStatusMsg(`Customer "${legalName}" registered successfully.`);
        setShowModal(false);
        await loadData();
      } catch {
        setStatusMsg('Failed to create customer.');
      }
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
            onClick={handleOpenAdd}
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

      {/* SEARCH BAR */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by legal name, trade name, GSTIN, PAN or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs outline-none text-foreground"
        />
      </div>

      {/* CUSTOMERS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers
          .filter((c) => {
            const q = searchQuery.toLowerCase();
            const name = (c.legal_name || c.customer_name || c.legal_company_name || '').toLowerCase();
            const trade = (c.trade_name || '').toLowerCase();
            const gstin = (c.gstin || '').toLowerCase();
            const pan = (c.pan || '').toLowerCase();
            const email = (c.contact_email || c.email || '').toLowerCase();
            return name.includes(q) || trade.includes(q) || gstin.includes(q) || pan.includes(q) || email.includes(q);
          })
          .map((c) => (
          <Card key={c.ref_id} className="border-border hover:border-primary/50 transition-colors flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-foreground">
                    {c.legal_name || c.customer_name || c.legal_company_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.trade_name}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
                    {c.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(c)}
                    className="h-6 px-2 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs flex-1">
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
                {(c.contact_email || c.email) && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" /> {c.contact_email || c.email}
                  </p>
                )}
                {(c.contact_phone || c.phone) && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" /> {c.contact_phone || c.phone}
                  </p>
                )}
                {(c.billing_address_line1 || c.billing_address) && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{c.billing_address_line1 || c.billing_address}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CREATE / EDIT CUSTOMER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-[#A20A3A]" />
                {editingCustomer ? 'Edit Customer Details' : 'Register New Customer'}
              </h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
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

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Trade / Brand Name
                </label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="e.g. Apex Cloud Solutions"
                  className="w-full rounded border border-border bg-background p-2 text-foreground"
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
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setGstin(val);
                      if (val.length >= 12 && !pan) {
                        setPan(val.substring(2, 12));
                      }
                    }}
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
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="AAAAA0000A"
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    State (Place of Supply)
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
                    placeholder="e.g. 33 for TN, 29 for KA"
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Contact Email ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="billing@client.com"
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Contact Phone Number
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
                  {editingCustomer ? 'Save Customer Changes' : 'Register Customer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
