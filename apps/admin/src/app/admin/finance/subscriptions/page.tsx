'use client';

import React, { useEffect, useState } from 'react';
import {
  Server,
  Database,
  Plus,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Search,
  Filter,
  Edit,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { ServerSubscription, FinanceCustomer, FinanceService } from '@/types/finance';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<ServerSubscription[]>([]);
  const [customers, setCustomers] = useState<FinanceCustomer[]>([]);
  const [services, setServices] = useState<FinanceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSub, setEditingSub] = useState<ServerSubscription | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Subscription Form State
  const [customerId, setCustomerId] = useState<number>(0);
  const [planType, setPlanType] = useState<'APP_ONLY' | 'DB_ONLY' | 'DUAL_BUNDLE'>('DUAL_BUNDLE');
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'ANNUAL'>('MONTHLY');
  const [hostname, setHostname] = useState('app01.clientnode.sathus.cloud');
  const [serverIp, setServerIp] = useState('185.199.108.153');

  // Edit Subscription Form State (Server & Amount)
  const [editCustomerId, setEditCustomerId] = useState<number>(0);
  const [editHostname, setEditHostname] = useState('');
  const [editServerIp, setEditServerIp] = useState('');
  const [editServerSpecs, setEditServerSpecs] = useState('');
  const [editPlanName, setEditPlanName] = useState('');
  const [editBaseAmount, setEditBaseAmount] = useState<number>(8500);
  const [editBillingFreq, setEditBillingFreq] = useState('MONTHLY');
  const [editNextBillingDate, setEditNextBillingDate] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, custs, servs] = await Promise.all([
        financeClient.getSubscriptions(),
        financeClient.getCustomers(),
        financeClient.getServices(),
      ]);
      setSubscriptions(subs);
      setCustomers(custs);
      setServices(servs);
      if (custs.length > 0) setCustomerId(custs[0].ref_id);
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

  // Calculate pricing preview for selected plan
  const getSelectedPlanPricing = () => {
    let monthlyTaxable = 0;
    let description = '';

    if (planType === 'APP_ONLY') {
      monthlyTaxable = 5500;
      description = 'Application Server Hosting (₹5,500/mo)';
    } else if (planType === 'DB_ONLY') {
      monthlyTaxable = 3000;
      description = 'Database Server Hosting (₹3,000/mo)';
    } else {
      monthlyTaxable = 8500; // 5500 + 3000
      description = 'Dual Server Bundle: App Server (₹5,500) + DB Server (₹3,000)';
    }

    const multiplier = billingCycle === 'ANNUAL' ? 12 : 1;
    const taxableTotal = monthlyTaxable * multiplier;
    const gstTotal = Math.round(taxableTotal * 0.18);
    const grandTotal = taxableTotal + gstTotal;

    return { monthlyTaxable, taxableTotal, gstTotal, grandTotal, description };
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.ref_id === customerId);
    if (!cust) return;

    const items = [];
    if (planType === 'APP_ONLY' || planType === 'DUAL_BUNDLE') {
      items.push({
        service_ref_id: 1,
        quantity: 1,
        unit_price: 5500,
        server_identifier: hostname,
      });
    }
    if (planType === 'DB_ONLY' || planType === 'DUAL_BUNDLE') {
      items.push({
        service_ref_id: 2,
        quantity: 1,
        unit_price: 3000,
        server_identifier: `db-${hostname}`,
      });
    }

    try {
      await financeClient.createSubscription({
        customer_ref_id: cust.ref_id,
        items,
        billing_day: 1,
      });
      setStatusMsg(`Subscription successfully provisioned for ${cust.legal_company_name || cust.customer_name}.`);
      setShowModal(false);
      await loadData();
    } catch {
      setStatusMsg('Failed to create subscription.');
    }
  };

  const handleOpenEdit = (sub: ServerSubscription) => {
    setEditingSub(sub);
    const baseAmt =
      sub.base_amount_monthly ??
      sub.items?.reduce((acc, it) => acc + it.unit_price * it.quantity, 0) ??
      8500;

    setEditCustomerId(sub.customer_ref_id || (customers[0]?.ref_id ?? 0));
    setEditHostname(sub.server_hostname || sub.items?.[0]?.server_hostname || 'app01.clientnode.sathus.cloud');
    setEditServerIp(sub.server_ip || sub.items?.[0]?.server_ip || '185.199.108.153');
    setEditServerSpecs(sub.server_specs || sub.items?.[0]?.server_specs || '8 vCPU, 32GB RAM, 100GB NVMe SSD, Ubuntu 24.04 LTS');
    setEditPlanName(sub.plan_name || sub.items?.[0]?.service_name || 'Server Hosting Contract');
    setEditBaseAmount(baseAmt);
    setEditBillingFreq(sub.billing_frequency || 'MONTHLY');
    setEditNextBillingDate(sub.next_billing_date || new Date().toISOString().split('T')[0]);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    const matchedCust = customers.find((c) => c.ref_id === editCustomerId);

    try {
      await financeClient.updateSubscription(editingSub.ref_id, {
        customer_ref_id: editCustomerId,
        customer_name: matchedCust
          ? matchedCust.legal_name || matchedCust.customer_name || matchedCust.legal_company_name
          : editingSub.customer_name,
        server_hostname: editHostname,
        server_ip: editServerIp,
        server_identifier: editHostname,
        server_specs: editServerSpecs,
        base_amount_monthly: Number(editBaseAmount),
        plan_name: editPlanName,
        billing_frequency: editBillingFreq,
        next_billing_date: editNextBillingDate,
      });
      setStatusMsg(`Subscription ${editingSub.subscription_code || editingSub.subscription_number} details and amounts updated successfully.`);
      setShowEditModal(false);
      setEditingSub(null);
      await loadData();
    } catch {
      setStatusMsg('Failed to update subscription details.');
    }
  };

  const handleToggleStatus = async (sub: ServerSubscription, newStatus: ServerSubscription['status']) => {
    try {
      await financeClient.updateSubscriptionStatus(sub.ref_id, newStatus);
      setStatusMsg(`Subscription ${sub.subscription_code || sub.subscription_number} status updated to ${newStatus}.`);
      await loadData();
    } catch {
      setStatusMsg('Failed to update subscription status.');
    }
  };

  const pricingPreview = getSelectedPlanPricing();

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Server Hosting Subscriptions
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage customer hosting subscriptions: Application Servers (₹5,500), Database Servers (₹3,000), and custom billing amounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white"
          >
            <Plus className="h-4 w-4" /> Provision New Hosting Contract
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

      {/* PLAN HIGHLIGHT TILES */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="rounded bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-300">
                APP-SERVER
              </span>
              <span className="text-xs text-muted-foreground">SAC 998315</span>
            </div>
            <CardTitle className="text-lg font-bold text-foreground mt-2">
              Application Server
            </CardTitle>
            <CardDescription className="text-xs">
              FastAPI, Next.js, Docker & Workload Compute
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-extrabold text-foreground">
              ₹5,500 <span className="text-xs font-normal text-muted-foreground">/ month + GST</span>
            </div>
            <p className="text-xs text-muted-foreground">
              ₹66,000 / year + 18% GST (₹11,880) = ₹77,880 / year total.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="rounded bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 text-xs font-semibold text-purple-800 dark:text-purple-300">
                DB-SERVER
              </span>
              <span className="text-xs text-muted-foreground">SAC 998315</span>
            </div>
            <CardTitle className="text-lg font-bold text-foreground mt-2">
              Database Server
            </CardTitle>
            <CardDescription className="text-xs">
              Dedicated PostgreSQL, Backups & High IOPS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-extrabold text-foreground">
              ₹3,000 <span className="text-xs font-normal text-muted-foreground">/ month + GST</span>
            </div>
            <p className="text-xs text-muted-foreground">
              ₹36,000 / year + 18% GST (₹6,480) = ₹42,480 / year total.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#A20A3A]/40 bg-gradient-to-br from-[#A20A3A]/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="rounded bg-[#A20A3A] px-2 py-0.5 text-xs font-semibold text-white">
                DUAL BUNDLE
              </span>
              <span className="text-xs font-bold text-[#A20A3A]">POPULAR</span>
            </div>
            <CardTitle className="text-lg font-bold text-foreground mt-2">
              Full Stack Enterprise
            </CardTitle>
            <CardDescription className="text-xs">
              Application Server + Database Server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-extrabold text-foreground">
              ₹8,500 <span className="text-xs font-normal text-muted-foreground">/ mo + 18% GST</span>
            </div>
            <p className="text-xs font-bold text-[#A20A3A]">
              Monthly Total: ₹10,030 &nbsp;|&nbsp; Annual Total: ₹1,20,360
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SUBSCRIPTIONS TABLE */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Active Customer Server Subscriptions
            </CardTitle>
            <CardDescription className="text-xs">
              Recurring contracts billed automatically on their scheduled billing cycle
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Subscription</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Server Node</th>
                  <th className="p-3 text-right">Taxable / Mo</th>
                  <th className="p-3 text-right">Total with GST</th>
                  <th className="p-3 text-center">Next Billing</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subscriptions.map((sub) => {
                  const monthlyTaxable =
                    sub.base_amount_monthly ??
                    sub.items?.reduce((acc, it) => acc + it.unit_price * it.quantity, 0) ??
                    8500;
                  const monthlyTotalWithGST = Math.round(monthlyTaxable * 1.18);

                  return (
                    <tr key={sub.ref_id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono">
                        <p className="font-bold text-foreground">
                          {sub.subscription_code || sub.subscription_number}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-sans">
                          {sub.plan_name || (sub.items?.[0]?.service_name ?? 'Server Hosting')}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{sub.customer_name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          ID: #{sub.customer_ref_id}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="font-mono text-foreground font-medium">
                          {sub.server_hostname || 'node.sathus.cloud'}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground">
                          IP: {sub.server_ip || '185.199.108.153'}
                        </p>
                        {sub.server_specs && (
                          <p className="text-[10px] text-muted-foreground font-sans truncate max-w-[220px]" title={sub.server_specs}>
                            ⚙ {sub.server_specs}
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-right font-mono font-medium text-foreground">
                        {fmt(monthlyTaxable)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {fmt(monthlyTotalWithGST)}
                      </td>
                      <td className="p-3 text-center text-muted-foreground">
                        {sub.next_billing_date}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            sub.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(sub)}
                            className="h-7 px-2 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Edit className="h-3 w-3" /> Edit Server & Amount
                          </Button>

                          {sub.status === 'ACTIVE' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(sub, 'PAUSED')}
                              className="h-7 text-xs text-amber-600 hover:text-amber-700"
                            >
                              <Pause className="h-3 w-3 mr-1" /> Pause
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(sub, 'ACTIVE')}
                              className="h-7 text-xs text-emerald-600 hover:text-emerald-700"
                            >
                              <Play className="h-3 w-3 mr-1" /> Resume
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* EDIT SERVER & AMOUNT DETAILS MODAL */}
      {showEditModal && editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Edit className="h-5 w-5 text-[#A20A3A]" /> Edit Server & Amount Details
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Subscription: <span className="font-mono font-bold text-foreground">{editingSub.subscription_code || editingSub.subscription_number}</span> ({editingSub.customer_name})
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingSub(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* SECTION 1: SERVER & CUSTOMER DETAILS */}
              <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/20">
                <p className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-primary" /> Server Node & Customer Configuration
                </p>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Customer Account
                  </label>
                  <select
                    value={editCustomerId}
                    onChange={(e) => setEditCustomerId(Number(e.target.value))}
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                  >
                    {customers.map((c) => (
                      <option key={c.ref_id} value={c.ref_id}>
                        {c.legal_name || c.customer_name || c.legal_company_name} ({c.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Server Hostname
                    </label>
                    <input
                      type="text"
                      value={editHostname}
                      onChange={(e) => setEditHostname(e.target.value)}
                      placeholder="app01.clientnode.sathus.cloud"
                      className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Server IP Address
                    </label>
                    <input
                      type="text"
                      value={editServerIp}
                      onChange={(e) => setEditServerIp(e.target.value)}
                      placeholder="185.199.108.153"
                      className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Server Hardware Specs & Environment
                  </label>
                  <input
                    type="text"
                    value={editServerSpecs}
                    onChange={(e) => setEditServerSpecs(e.target.value)}
                    placeholder="e.g. 8 vCPU, 32GB RAM, 100GB NVMe SSD, Ubuntu 24.04 LTS"
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Plan / Service Description
                  </label>
                  <input
                    type="text"
                    value={editPlanName}
                    onChange={(e) => setEditPlanName(e.target.value)}
                    placeholder="e.g. Dual Server Bundle (App + DB)"
                    className="w-full rounded border border-border bg-background p-2 text-foreground"
                    required
                  />
                </div>
              </div>

              {/* SECTION 2: AMOUNT & PRICING DETAILS */}
              <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/20">
                <p className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-[#A20A3A]" /> Billing & Amount Details
                </p>

                {/* Quick amount presets */}
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Standard Presets or Custom:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditBaseAmount(5500);
                        setEditPlanName('Application Server Hosting (₹5,500/mo)');
                      }}
                      className={`rounded border p-1.5 text-center transition-colors ${
                        editBaseAmount === 5500
                          ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                          : 'border-border'
                      }`}
                    >
                      <p>App Server</p>
                      <p className="text-[10px] text-muted-foreground">₹5,500</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditBaseAmount(3000);
                        setEditPlanName('Database Server Hosting (₹3,000/mo)');
                      }}
                      className={`rounded border p-1.5 text-center transition-colors ${
                        editBaseAmount === 3000
                          ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                          : 'border-border'
                      }`}
                    >
                      <p>DB Server</p>
                      <p className="text-[10px] text-muted-foreground">₹3,000</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditBaseAmount(8500);
                        setEditPlanName('Dual Server Bundle: App Server + DB Server');
                      }}
                      className={`rounded border p-1.5 text-center transition-colors ${
                        editBaseAmount === 8500
                          ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                          : 'border-border'
                      }`}
                    >
                      <p>Dual Bundle</p>
                      <p className="text-[10px] text-muted-foreground">₹8,500</p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Monthly Taxable Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={editBaseAmount}
                      onChange={(e) => setEditBaseAmount(Number(e.target.value))}
                      className="w-full rounded border border-border bg-background p-2 text-foreground font-mono font-bold text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={editBillingFreq}
                      onChange={(e) => setEditBillingFreq(e.target.value)}
                      className="w-full rounded border border-border bg-background p-2 text-foreground"
                    >
                      <option value="MONTHLY">Monthly Recurring</option>
                      <option value="ANNUAL">Annual Prepaid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Next Billing Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={editNextBillingDate}
                    onChange={(e) => setEditNextBillingDate(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                    required
                  />
                </div>

                {/* Real-time Dynamic Calculation */}
                <div className="rounded border border-border bg-card p-3 space-y-1.5">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxable Base Value:</span>
                    <span className="font-mono font-medium">{fmt(editBaseAmount)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (18% SAC 998315):</span>
                    <span className="font-mono font-medium">{fmt(Math.round(editBaseAmount * 0.18))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground border-t border-border pt-1">
                    <span>Total Invoiced per Cycle:</span>
                    <span className="font-mono text-[#A20A3A] text-sm">
                      {fmt(Math.round(editBaseAmount * 1.18))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSub(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#A20A3A] hover:bg-[#85082e] text-white"
                >
                  Save Server & Amount Details
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROVISION SUBSCRIPTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Server className="h-5 w-5 text-[#A20A3A]" /> Provision Server Hosting
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="space-y-4 text-xs">
              {/* Customer Selector */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Select Customer
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(Number(e.target.value))}
                  className="w-full rounded border border-border bg-background p-2 text-foreground"
                >
                  {customers.map((c) => (
                    <option key={c.ref_id} value={c.ref_id}>
                      {c.legal_name || c.customer_name || c.legal_company_name} (GSTIN: {c.gstin || 'B2C'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hosting Plan Selector */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Hosting Plan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlanType('APP_ONLY')}
                    className={`rounded border p-2 text-center transition-colors ${
                      planType === 'APP_ONLY'
                        ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                        : 'border-border'
                    }`}
                  >
                    <p className="font-semibold">App Server</p>
                    <p className="text-[11px] text-muted-foreground">₹5,500/mo</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('DB_ONLY')}
                    className={`rounded border p-2 text-center transition-colors ${
                      planType === 'DB_ONLY'
                        ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                        : 'border-border'
                    }`}
                  >
                    <p className="font-semibold">DB Server</p>
                    <p className="text-[11px] text-muted-foreground">₹3,000/mo</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('DUAL_BUNDLE')}
                    className={`rounded border p-2 text-center transition-colors ${
                      planType === 'DUAL_BUNDLE'
                        ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                        : 'border-border'
                    }`}
                  >
                    <p className="font-semibold">Dual Bundle</p>
                    <p className="text-[11px] text-muted-foreground">₹8,500/mo</p>
                  </button>
                </div>
              </div>

              {/* Billing Cycle */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Billing Cycle
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="cycle"
                      checked={billingCycle === 'MONTHLY'}
                      onChange={() => setBillingCycle('MONTHLY')}
                    />
                    <span>Monthly (₹{pricingPreview.monthlyTaxable.toLocaleString()}/mo)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="cycle"
                      checked={billingCycle === 'ANNUAL'}
                      onChange={() => setBillingCycle('ANNUAL')}
                    />
                    <span>Annual (₹{(pricingPreview.monthlyTaxable * 12).toLocaleString()}/yr)</span>
                  </label>
                </div>
              </div>

              {/* Server Details */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Hostname
                  </label>
                  <input
                    type="text"
                    value={hostname}
                    onChange={(e) => setHostname(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={serverIp}
                    onChange={(e) => setServerIp(e.target.value)}
                    className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                    required
                  />
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="rounded border border-border bg-muted/40 p-3 space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxable Base Value:</span>
                  <span className="font-mono">{fmt(pricingPreview.taxableTotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Applicable GST (18% SAC 998315):</span>
                  <span className="font-mono">{fmt(pricingPreview.gstTotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground border-t border-border pt-1">
                  <span>Total Recurring Invoice Value:</span>
                  <span className="font-mono text-[#A20A3A]">{fmt(pricingPreview.grandTotal)}</span>
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
                  Confirm & Provision Contract
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
