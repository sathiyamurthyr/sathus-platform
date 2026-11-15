'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  Server,
  Database,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  Play,
  FileText,
  ShieldCheck,
  Receipt,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { PrintableGSTInvoice } from '@/components/finance/PrintableGSTInvoice';
import { financeClient } from '@/lib/finance-client';
import {
  FinanceDashboardMetrics,
  SalesInvoice,
  ServerSubscription,
} from '@/types/finance';

export default function FinanceOverviewPage() {
  const [metrics, setMetrics] = useState<FinanceDashboardMetrics | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<SalesInvoice[]>([]);
  const [activeSubs, setActiveSubs] = useState<ServerSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingBilling, setGeneratingBilling] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, invs, subs] = await Promise.all([
        financeClient.getDashboardMetrics(),
        financeClient.getInvoices(),
        financeClient.getSubscriptions(),
      ]);
      setMetrics(m);
      setRecentInvoices(invs.slice(0, 5));
      setActiveSubs(subs.slice(0, 5));
    } catch (err) {
      console.error('Error loading finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunMonthlyBilling = async () => {
    setGeneratingBilling(true);
    setStatusMessage(null);
    try {
      const result = await financeClient.generateRecurringInvoices();
      setStatusMessage(
        `Monthly billing run completed: ${result.generated_count} invoices generated, ${result.skipped_count} skipped (already billed), ${result.failed_count} errors.`
      );
      await loadData();
    } catch {
      setStatusMessage('Error executing automated recurring billing.');
    } finally {
      setGeneratingBilling(false);
    }
  };

  const fmt = (val?: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);

  if (selectedInvoice) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
        <PrintableGSTInvoice
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      {/* TOP HEADER & ACTIONS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Financial Health & Server Billing
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time MRR, Server Subscriptions, GST compliance (SAC 998315), and Invoicing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleRunMonthlyBilling}
            disabled={generatingBilling}
            className="gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white"
          >
            <Play className={`h-4 w-4 ${generatingBilling ? 'animate-pulse' : ''}`} />
            {generatingBilling ? 'Generating Invoices...' : 'Run Monthly Recurring Billing'}
          </Button>

          <Link href="/admin/finance/subscriptions">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" /> New Subscription
            </Button>
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            {statusMessage}
          </span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      {/* PRIMARY REVENUE & METRICS CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Monthly Recurring Revenue */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Revenue (MRR)
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#A20A3A]/10 text-[#A20A3A]">
              <IndianRupee className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {fmt(metrics?.total_revenue_mrr)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Taxable billings across active hosting contracts
            </p>
          </CardContent>
        </Card>

        {/* Application Server Revenue */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              App Server Hosting
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10 text-blue-600">
              <Server className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {fmt(metrics?.app_server_revenue)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Plan rate: ₹5,500/mo · SAC 998315
            </p>
          </CardContent>
        </Card>

        {/* Database Server Revenue */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              DB Server Hosting
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10 text-purple-600">
              <Database className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {fmt(metrics?.db_server_revenue)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Plan rate: ₹3,000/mo · SAC 998315
            </p>
          </CardContent>
        </Card>

        {/* Active Subscriptions Count */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Subscriptions
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics?.active_subscriptions_count ?? 0}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              100% automated monthly billing enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GST & COMPLIANCE SUMMARY ROW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Outstanding Receivables */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Outstanding Receivables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-amber-600">
              {fmt(metrics?.receivables_outstanding)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Unpaid client balances
            </p>
          </CardContent>
        </Card>

        {/* GST Output Collected */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              GST Output (Collected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">
              {fmt(metrics?.gst_collected_total)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              CGST @ 9% + SGST @ 9% / IGST @ 18%
            </p>
          </CardContent>
        </Card>

        {/* Eligible ITC Input */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Eligible Input Tax Credit (ITC)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600">
              {fmt(metrics?.eligible_itc_total)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Vendor bills (WebHostingBingo, etc.)
            </p>
          </CardContent>
        </Card>

        {/* Net GST Payable */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Net GST Payable to Govt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-[#A20A3A]">
              {fmt(metrics?.net_gst_payable)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Output GST minus Eligible ITC
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QUICK WORKFLOW LAUNCHER */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Quick Workflows
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/admin/finance/subscriptions"
            className="flex items-center gap-2.5 rounded-md border border-border p-3 hover:bg-accent transition-colors"
          >
            <Server className="h-5 w-5 text-[#A20A3A]" />
            <div>
              <p className="text-xs font-semibold text-foreground">Server Hosting</p>
              <p className="text-[11px] text-muted-foreground">App & DB servers</p>
            </div>
          </Link>

          <Link
            href="/admin/finance/invoices"
            className="flex items-center gap-2.5 rounded-md border border-border p-3 hover:bg-accent transition-colors"
          >
            <Receipt className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs font-semibold text-foreground">Tax Invoices</p>
              <p className="text-[11px] text-muted-foreground">A4 GST Invoices</p>
            </div>
          </Link>

          <Link
            href="/admin/finance/purchases"
            className="flex items-center gap-2.5 rounded-md border border-border p-3 hover:bg-accent transition-colors"
          >
            <FileText className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-xs font-semibold text-foreground">Vendor Bills</p>
              <p className="text-[11px] text-muted-foreground">WebHostingBingo & ITC</p>
            </div>
          </Link>

          <Link
            href="/admin/finance/settings"
            className="flex items-center gap-2.5 rounded-md border border-border p-3 hover:bg-accent transition-colors"
          >
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-xs font-semibold text-foreground">Company Profile</p>
              <p className="text-[11px] text-muted-foreground">Phone, Email & Bank</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ACTIVE SUBSCRIPTIONS & RECENT INVOICES TABLES */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ACTIVE HOSTING SUBSCRIPTIONS */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Active Server Subscriptions
              </CardTitle>
              <CardDescription className="text-xs">
                Recurring hosting billing instances
              </CardDescription>
            </div>
            <Link
              href="/admin/finance/subscriptions"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-y border-border bg-muted/40 font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeSubs.map((sub) => (
                    <tr key={sub.ref_id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{sub.customer_name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {sub.subscription_code || sub.subscription_number}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="text-foreground font-medium">
                          {sub.plan_name || sub.items?.[0]?.service_name || 'Server Hosting'}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {sub.server_hostname || 'Dedicated Cloud Node'}
                        </p>
                      </td>
                      <td className="p-3 text-right font-mono font-medium text-foreground">
                        {fmt(
                          sub.base_amount_monthly ??
                            sub.items?.reduce((acc, it) => acc + it.unit_price * it.quantity, 0) ??
                            8500
                        )}
                        /mo
                      </td>
                      <td className="p-3 text-center">
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activeSubs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No subscriptions configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* RECENT SALES INVOICES */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                Recent GST Tax Invoices
              </CardTitle>
              <CardDescription className="text-xs">
                Generated & Issued Invoices
              </CardDescription>
            </div>
            <Link
              href="/admin/finance/invoices"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-y border-border bg-muted/40 font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3">Invoice No</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentInvoices.map((inv) => (
                    <tr key={inv.ref_id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono font-semibold text-foreground">
                        {inv.invoice_number || inv.invoice_no}
                        <p className="text-[10px] text-muted-foreground font-sans">
                          {inv.invoice_date}
                        </p>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-foreground">{inv.customer_name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {inv.place_of_supply}
                        </p>
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-foreground">
                        {fmt(inv.grand_total)}
                        {inv.balance_due > 0 && (
                          <p className="text-[10px] text-rose-600 font-sans">
                            Due: {fmt(inv.balance_due)}
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : inv.status === 'ISSUED'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedInvoice(inv)}
                          className="h-7 px-2 text-xs gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {recentInvoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No invoices generated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
