'use client';

import React, { useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { SalesInvoice, PurchaseBill } from '@/types/finance';

export default function GSTReportsPage() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [bills, setBills] = useState<PurchaseBill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [invs, b] = await Promise.all([
          financeClient.getInvoices(),
          financeClient.getPurchaseBills(),
        ]);
        setInvoices(invs);
        setBills(b);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);

  // Compute Outward (Sales) Tax
  let totalSalesTaxable = 0;
  let totalSalesCGST = 0;
  let totalSalesSGST = 0;
  let totalSalesIGST = 0;

  invoices.forEach((inv) => {
    if (['ISSUED', 'PARTIALLY_PAID', 'PAID'].includes(inv.status)) {
      totalSalesTaxable += inv.taxable_amount;
      totalSalesCGST += inv.total_cgst ?? inv.cgst_amount ?? 0;
      totalSalesSGST += inv.total_sgst ?? inv.sgst_amount ?? 0;
      totalSalesIGST += inv.total_igst ?? inv.igst_amount ?? 0;
    }
  });

  const totalOutputTax = totalSalesCGST + totalSalesSGST + totalSalesIGST;

  // Compute Inward (Purchases / ITC)
  let totalPurchasesTaxable = 0;
  let totalEligibleITC = 0;

  bills.forEach((b) => {
    totalPurchasesTaxable += b.taxable_amount;
    if (b.itc_eligible) {
      totalEligibleITC += b.total_gst;
    }
  });

  const netPayable = Math.max(totalOutputTax - totalEligibleITC, 0);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            GST Compliance & Statutory Registers
          </h1>
          <p className="text-sm text-muted-foreground">
            GSTR-1 Outward Supplies, GSTR-2B Input Tax Credit, and GSTR-3B Computation.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => window.print()}
          className="gap-1.5 no-print"
        >
          <Download className="h-4 w-4" /> Export Report (PDF/Print)
        </Button>
      </div>

      {/* GSTR-3B MONTHLY TAX COMPUTATION */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-[#A20A3A]" />
            GSTR-3B Monthly Return Computation Summary
          </CardTitle>
          <CardDescription className="text-xs">
            Net statutory liability = (Table 3.1 Outward Taxable Supplies) minus (Table 4 Eligible Input Tax Credit)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded border border-border bg-card p-4 space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Table 3.1 — Total Output Tax Liability
              </span>
              <p className="text-2xl font-bold text-foreground">{fmt(totalOutputTax)}</p>
              <div className="text-[11px] text-muted-foreground pt-1 space-y-0.5">
                <p>Taxable Value: {fmt(totalSalesTaxable)}</p>
                <p>CGST: {fmt(totalSalesCGST)} | SGST: {fmt(totalSalesSGST)}</p>
                <p>IGST: {fmt(totalSalesIGST)}</p>
              </div>
            </div>

            <div className="rounded border border-border bg-card p-4 space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Table 4 — Eligible ITC Available
              </span>
              <p className="text-2xl font-bold text-emerald-600">{fmt(totalEligibleITC)}</p>
              <div className="text-[11px] text-muted-foreground pt-1 space-y-0.5">
                <p>Vendor Purchases: {fmt(totalPurchasesTaxable)}</p>
                <p>All other ITC (Sec 16): {fmt(totalEligibleITC)}</p>
                <p>Ineligible ITC (Sec 17(5)): ₹0.00</p>
              </div>
            </div>

            <div className="rounded border border-[#A20A3A]/40 bg-[#A20A3A]/5 p-4 space-y-1">
              <span className="text-xs font-semibold text-[#A20A3A]">
                Net GST Cash Ledger Payable
              </span>
              <p className="text-2xl font-bold text-[#A20A3A]">{fmt(netPayable)}</p>
              <p className="text-[11px] text-muted-foreground pt-1">
                To be deposited in Government electronic cash ledger before the 20th of the following month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SAC SUMMARY */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground">
            HSN / SAC Summary (GSTR-1 Table 12)
          </CardTitle>
          <CardDescription className="text-xs">
            Classification under Service Accounting Code 998315 (Hosting & IT Infrastructure)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">SAC Code</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">UQC</th>
                  <th className="p-3 text-right">Taxable Value</th>
                  <th className="p-3 text-right">CGST</th>
                  <th className="p-3 text-right">SGST</th>
                  <th className="p-3 text-right">IGST</th>
                  <th className="p-3 text-right">Total Cess & Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-mono font-bold text-foreground">998315</td>
                  <td className="p-3 text-foreground">
                    Hosting and IT Infrastructure Provisioning Services
                  </td>
                  <td className="p-3 text-muted-foreground">OTH</td>
                  <td className="p-3 text-right font-mono font-medium text-foreground">
                    {fmt(totalSalesTaxable)}
                  </td>
                  <td className="p-3 text-right font-mono text-muted-foreground">
                    {fmt(totalSalesCGST)}
                  </td>
                  <td className="p-3 text-right font-mono text-muted-foreground">
                    {fmt(totalSalesSGST)}
                  </td>
                  <td className="p-3 text-right font-mono text-muted-foreground">
                    {fmt(totalSalesIGST)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-foreground">
                    {fmt(totalOutputTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
