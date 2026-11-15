'use client';

import React, { useEffect, useState } from 'react';
import {
  Receipt,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Printer,
  ShieldCheck,
  CreditCard,
  FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { PrintableGSTInvoice } from '@/components/finance/PrintableGSTInvoice';
import { financeClient } from '@/lib/finance-client';
import { SalesInvoice, FinanceCustomer, InvoiceStatus } from '@/types/finance';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [customers, setCustomers] = useState<FinanceCustomer[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Invoice form state
  const [customerId, setCustomerId] = useState<number>(0);
  const [serverType, setServerType] = useState<'APP' | 'DB' | 'DUAL'>('DUAL');

  const loadData = async () => {
    setLoading(true);
    try {
      const [invs, custs] = await Promise.all([
        financeClient.getInvoices(),
        financeClient.getCustomers(),
      ]);
      setInvoices(invs);
      setCustomers(custs);
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

  useEffect(() => {
    if (showCreateModal) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showCreateModal]);

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);

  const handleApproveInvoice = async (invoiceRefId: number) => {
    try {
      await financeClient.approveInvoice(invoiceRefId);
      setStatusMsg(`Invoice #${invoiceRefId} approved successfully.`);
      await loadData();
    } catch {
      setStatusMsg('Failed to approve invoice.');
    }
  };

  const handleIssueInvoice = async (invoiceRefId: number) => {
    try {
      await financeClient.issueInvoice(invoiceRefId);
      setStatusMsg(`Invoice #${invoiceRefId} issued and document snapshot locked.`);
      await loadData();
    } catch {
      setStatusMsg('Failed to issue invoice.');
    }
  };

  const handleRecordPayment = async (invoice: SalesInvoice) => {
    try {
      await financeClient.createPayment({
        payment_type: 'CLIENT_RECEIPT',
        party_type: 'CUSTOMER',
        party_ref_id: invoice.customer_ref_id,
        amount: invoice.balance_due,
        payment_mode: 'BANK_TRANSFER',
        transaction_reference: `HDFC-${Math.floor(100000 + Math.random() * 900000)}`,
        invoice_ref_ids: [invoice.ref_id],
      });
      setStatusMsg(`Full payment recorded for ${invoice.invoice_number || invoice.invoice_no}.`);
      await loadData();
    } catch {
      setStatusMsg('Failed to record payment.');
    }
  };

  const handleCreateManualInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.ref_id === customerId);
    if (!cust) return;

    let items = [];
    if (serverType === 'APP' || serverType === 'DUAL') {
      items.push({
        item_description: 'Application Server Hosting (Monthly)',
        sac_code: '998315',
        quantity: 1,
        unit_price: 5500,
      });
    }
    if (serverType === 'DB' || serverType === 'DUAL') {
      items.push({
        item_description: 'Database Server Hosting (Monthly)',
        sac_code: '998315',
        quantity: 1,
        unit_price: 3000,
      });
    }

    try {
      await financeClient.createInvoice({
        customer_ref_id: cust.ref_id,
        billing_period_start: new Date().toISOString().split('T')[0],
        billing_period_end: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        items,
      });
      setStatusMsg(`Manual Tax Invoice created for ${cust.legal_company_name || cust.customer_name}.`);
      setShowCreateModal(false);
      await loadData();
    } catch {
      setStatusMsg('Failed to create manual invoice.');
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    const invNo = inv.invoice_number || inv.invoice_no || '';
    const custName = inv.customer_name || '';
    const matchesSearch =
      invNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      custName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.customer_gstin && inv.customer_gstin.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sales & GST Tax Invoices
          </h1>
          <p className="text-sm text-muted-foreground">
            Sequential FY series (`SATH/26-27/00001`), Maker-Checker verification, and A4 PDF printing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white"
          >
            <Plus className="h-4 w-4" /> Create Manual Tax Invoice
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

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoice number, customer, or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs outline-none text-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-border bg-background p-1 text-xs text-foreground"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="ISSUED">Issued</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* INVOICES TABLE */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Invoice No & Date</th>
                  <th className="p-3">Customer & GSTIN</th>
                  <th className="p-3">Supply Type</th>
                  <th className="p-3 text-right">Taxable</th>
                  <th className="p-3 text-right">GST Total</th>
                  <th className="p-3 text-right">Grand Total</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.ref_id} className="hover:bg-muted/30">
                    <td className="p-3 font-mono">
                      <p className="font-bold text-foreground">{inv.invoice_number || inv.invoice_no}</p>
                      <p className="text-[10px] text-muted-foreground font-sans">
                        Date: {inv.invoice_date} · Due: {inv.due_date}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-foreground">{inv.customer_name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {inv.customer_gstin || 'B2C Client'}
                      </p>
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                        {inv.supply_type}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        POS: {inv.place_of_supply} ({inv.place_of_supply_code})
                      </p>
                    </td>
                    <td className="p-3 text-right font-mono font-medium text-foreground">
                      {fmt(inv.taxable_amount)}
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground">
                      {fmt(inv.total_gst)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-foreground">
                      {fmt(inv.grand_total)}
                      {inv.balance_due > 0 && (
                        <p className="text-[10px] text-rose-600 font-sans font-medium">
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
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedInvoice(inv)}
                          className="h-7 px-2 text-xs gap-1 text-primary"
                        >
                          <Eye className="h-3.5 w-3.5" /> View / Print
                        </Button>

                        {inv.status === 'PENDING_APPROVAL' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproveInvoice(inv.ref_id)}
                            className="h-7 px-2 text-xs gap-1 text-emerald-600"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" /> Approve
                          </Button>
                        )}

                        {inv.status === 'APPROVED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleIssueInvoice(inv.ref_id)}
                            className="h-7 px-2 text-xs gap-1 text-blue-600"
                          >
                            <FileCheck className="h-3.5 w-3.5" /> Issue
                          </Button>
                        )}

                        {['ISSUED', 'PARTIALLY_PAID'].includes(inv.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRecordPayment(inv)}
                            className="h-7 px-2 text-xs gap-1 text-emerald-600"
                          >
                            <CreditCard className="h-3.5 w-3.5" /> Pay
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE MANUAL INVOICE MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Separate Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
            onClick={() => setShowCreateModal(false)}
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
                  <Receipt className="h-5 w-5 text-[#A20A3A]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Create Manual Tax Invoice
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Generate sequential FY series GST tax invoice for hosted services
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 admin-scrollbar bg-white">
              <form id="create-invoice-form" onSubmit={handleCreateManualInvoice} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Select Customer <span className="text-[#A20A3A]">*</span>
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                  >
                    {customers.map((c) => (
                      <option key={c.ref_id} value={c.ref_id}>
                        {c.legal_name || c.customer_name || c.legal_company_name} ({c.state} - Code {c.state_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1.5">
                    Services to Bill <span className="text-[#A20A3A]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setServerType('APP')}
                      className={`rounded-lg border p-2.5 text-center transition-all ${
                        serverType === 'APP'
                          ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <p className="font-bold">App Server</p>
                      <p className="text-[10px] text-neutral-500">₹5,500 + GST</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServerType('DB')}
                      className={`rounded-lg border p-2.5 text-center transition-all ${
                        serverType === 'DB'
                          ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <p className="font-bold">DB Server</p>
                      <p className="text-[10px] text-neutral-500">₹3,000 + GST</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServerType('DUAL')}
                      className={`rounded-lg border p-2.5 text-center transition-all ${
                        serverType === 'DUAL'
                          ? 'border-[#A20A3A] bg-[#A20A3A]/10 font-bold text-[#A20A3A]'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <p className="font-bold">Dual Bundle</p>
                      <p className="text-[10px] text-neutral-500">₹8,500 + GST</p>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-[#FAF8F9] p-4 space-y-1.5">
                  <p className="font-semibold text-neutral-900">Tax Determination:</p>
                  <p className="text-[11px] text-neutral-600">
                    Intra-state (Tamil Nadu) incurs CGST 9% + SGST 9%. Inter-state incurs IGST 18%.
                  </p>
                </div>
              </form>
            </div>

            {/* Fixed Sticky Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-[#FAF8F9] shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateModal(false)}
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="create-invoice-form"
                size="sm"
                className="bg-[#A20A3A] hover:bg-[#85082e] text-white shadow-sm font-semibold px-5 h-9"
              >
                Create Invoice Draft
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
