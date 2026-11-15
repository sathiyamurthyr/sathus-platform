'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { PaymentTransaction } from '@/types/finance';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await financeClient.getPayments();
      setPayments(p);
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

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payment Transactions & Settlements
        </h1>
        <p className="text-sm text-muted-foreground">
          Audit ledger of client remittances received and vendor payments disbursed.
        </p>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Payment Ref</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Transaction Reference</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => {
                  const isInward = p.payment_type === 'CLIENT_RECEIPT';
                  return (
                    <tr key={p.ref_id} className="hover:bg-muted/30">
                      <td className="p-3 font-mono font-semibold text-foreground">
                        {p.payment_number}
                      </td>
                      <td className="p-3">
                        {isInward ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
                            <ArrowDownLeft className="h-3 w-3" /> Client Receipt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:text-blue-400">
                            <ArrowUpRight className="h-3 w-3" /> Vendor Payout
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-foreground font-medium">
                        {p.payment_mode}
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">
                        {p.transaction_reference}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {p.payment_date}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground">
                        <span className={isInward ? 'text-emerald-600' : 'text-slate-800 dark:text-slate-200'}>
                          {isInward ? '+' : '-'}{fmt(p.amount)}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
