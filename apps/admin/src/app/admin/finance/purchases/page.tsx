'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingCart,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { PurchaseBill, FinanceVendor } from '@/types/finance';

export default function PurchasesPage() {
  const [bills, setBills] = useState<PurchaseBill[]>([]);
  const [vendors, setVendors] = useState<FinanceVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form State
  const [vendorId, setVendorId] = useState<number>(0);
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState('INV-WHB-2026-0982');
  const [description, setDescription] = useState('VPS Bare Metal Infrastructure Hosting');
  const [taxableAmount, setTaxableAmount] = useState(2500);
  const [itcEligible, setItcEligible] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [b, v] = await Promise.all([
        financeClient.getPurchaseBills(),
        financeClient.getVendors(),
      ]);
      setBills(b);
      setVendors(v);
      if (v.length > 0) setVendorId(v[0].ref_id);
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
      maximumFractionDigits: 2,
    }).format(val || 0);

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const vend = vendors.find((v) => v.ref_id === vendorId);
    if (!vend) return;

    const cgst = Math.round(taxableAmount * 0.09 * 100) / 100;
    const sgst = Math.round(taxableAmount * 0.09 * 100) / 100;
    const totalGst = cgst + sgst;
    const grandTotal = taxableAmount + totalGst;

    try {
      await financeClient.createPurchaseBill({
        vendor_ref_id: vend.ref_id,
        bill_no: vendorInvoiceNo,
        bill_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        itc_eligible: itcEligible,
        items: [
          {
            item_description: description,
            quantity: 1,
            unit_price: taxableAmount,
            gst_rate: 18,
          },
        ],
      });
      setStatusMsg(`Vendor Bill recorded for ${vend.legal_name}.`);
      setShowModal(false);
      await loadData();
    } catch {
      setStatusMsg('Failed to record purchase bill.');
    }
  };

  const handlePayBill = async (bill: PurchaseBill) => {
    try {
      await financeClient.createPayment({
        payment_type: 'VENDOR_PAYMENT',
        party_type: 'VENDOR',
        party_ref_id: bill.vendor_ref_id,
        amount: bill.balance_due,
        payment_mode: 'BANK_TRANSFER',
        transaction_reference: `NEFT-${Math.floor(100000 + Math.random() * 900000)}`,
        invoice_ref_ids: [bill.ref_id],
      });
      setStatusMsg(`Vendor payment recorded for ${bill.vendor_invoice_number || bill.bill_no}.`);
      await loadData();
    } catch {
      setStatusMsg('Failed to record vendor payment.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Vendor Purchases & ITC Tracking
          </h1>
          <p className="text-sm text-muted-foreground">
            Upstream infrastructure expenses (WebHostingBingo), Input Tax Credit (ITC), and GSTR-2B reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white"
          >
            <Plus className="h-4 w-4" /> Record Vendor Bill
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

      {/* BILLS TABLE */}
      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Vendor Bill No</th>
                  <th className="p-3">Vendor & GSTIN</th>
                  <th className="p-3 text-right">Taxable</th>
                  <th className="p-3 text-right">GST Total</th>
                  <th className="p-3 text-right">Grand Total</th>
                  <th className="p-3 text-center">ITC Status</th>
                  <th className="p-3 text-center">GSTR-2B</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bills.map((bill) => (
                  <tr key={bill.ref_id} className="hover:bg-muted/30">
                    <td className="p-3 font-mono">
                      <p className="font-bold text-foreground">{bill.vendor_invoice_number || bill.bill_no}</p>
                      <p className="text-[10px] text-muted-foreground font-sans">
                        Date: {bill.bill_date}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-foreground">{bill.vendor_name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {bill.vendor_gstin}
                      </p>
                    </td>
                    <td className="p-3 text-right font-mono font-medium text-foreground">
                      {fmt(bill.taxable_amount)}
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground">
                      {fmt(bill.total_gst)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-foreground">
                      {fmt(bill.grand_total)}
                      {bill.balance_due > 0 && (
                        <p className="text-[10px] text-rose-600 font-sans">
                          Due: {fmt(bill.balance_due)}
                        </p>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {bill.itc_eligible ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
                          <ShieldCheck className="h-3 w-3" /> Eligible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-400">
                          <ShieldAlert className="h-3 w-3" /> Ineligible
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                        {bill.gstr2b_match_status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          bill.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {bill.status !== 'PAID' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePayBill(bill)}
                          className="h-7 px-2 text-xs gap-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <CreditCard className="h-3.5 w-3.5" /> Pay Vendor
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* RECORD BILL MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#A20A3A]" /> Record Vendor Purchase Bill
              </h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Vendor
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(Number(e.target.value))}
                  className="w-full rounded border border-border bg-background p-2 text-foreground"
                >
                  {vendors.map((v) => (
                    <option key={v.ref_id} value={v.ref_id}>
                      {v.legal_name} (GSTIN: {v.gstin})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Vendor Invoice / Bill No
                </label>
                <input
                  type="text"
                  value={vendorInvoiceNo}
                  onChange={(e) => setVendorInvoiceNo(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Description of Expense
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded border border-border bg-background p-2 text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Taxable Amount (₹)
                </label>
                <input
                  type="number"
                  value={taxableAmount}
                  onChange={(e) => setTaxableAmount(Number(e.target.value))}
                  className="w-full rounded border border-border bg-background p-2 text-foreground font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="itc"
                  checked={itcEligible}
                  onChange={(e) => setItcEligible(e.target.checked)}
                />
                <label htmlFor="itc" className="font-semibold text-foreground">
                  Eligible for GST Input Tax Credit (Section 16, CGST Act)
                </label>
              </div>

              <div className="rounded border border-border bg-muted/40 p-3 space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxable Value:</span>
                  <span className="font-mono">{fmt(taxableAmount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST @ 18% (CGST 9% + SGST 9%):</span>
                  <span className="font-mono">{fmt(taxableAmount * 0.18)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground border-t border-border pt-1">
                  <span>Grand Total Bill:</span>
                  <span className="font-mono text-[#A20A3A]">
                    {fmt(taxableAmount * 1.18)}
                  </span>
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
                  Save Vendor Bill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
