'use client';

import React, { useRef } from 'react';
import { Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { SalesInvoice, CompanyProfile } from '@/types/finance';
import { Button } from '@/components/ui/button';

interface PrintableGSTInvoiceProps {
  invoice: SalesInvoice;
  companyProfile?: CompanyProfile;
  onClose?: () => void;
}

export function PrintableGSTInvoice({
  invoice,
  companyProfile,
  onClose,
}: PrintableGSTInvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isInterState =
    invoice.supply_type === 'INTER_STATE' || (invoice.total_igst ?? invoice.igst_amount ?? 0) > 0;
  const isPaid = invoice.status === 'PAID';
  const invoiceNumber = invoice.invoice_number || invoice.invoice_no;

  // Format currency helper
  const fmt = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Invoices
            </Button>
          )}
          <span className="text-sm font-medium text-foreground">
            Tax Invoice: <span className="font-bold text-primary">{invoiceNumber}</span>
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                : invoice.status === 'ISSUED'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
            }`}
          >
            {invoice.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handlePrint}
            className="h-8 gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Printable A4 Canvas Container */}
      <div className="flex justify-center overflow-x-auto p-1 bg-muted/20 rounded-lg">
        <div
          ref={printRef}
          id="printable-gst-invoice-area"
          className="print-container relative w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 shadow-md border border-slate-200 text-[11px] leading-tight font-sans selection:bg-rose-100"
          style={{ boxSizing: 'border-box' }}
        >
          {/* PAID WATERMARK STAMP IF PAID */}
          {isPaid && (
            <div className="pointer-events-none absolute right-24 top-48 rotate-[-15deg] select-none rounded-lg border-4 border-emerald-600/30 px-6 py-2 text-center text-4xl font-extrabold tracking-widest text-emerald-600/25 uppercase">
              PAID IN FULL
            </div>
          )}

          {/* SATHUS BRANDING HEADER */}
          <div className="flex items-start justify-between border-b-2 border-[#A20A3A] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#A20A3A] text-xl font-bold text-white shadow">
                  S
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-[#A20A3A]">
                    SATHUS TECHNOLOGY
                  </h1>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Cloud Infrastructure & Technology Services
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-600 space-y-0.5">
                <p className="font-semibold text-slate-800">Sathus Technology Private Limited</p>
                <p>Sathus Technology Tower, 45 Mount Road, Guindy Industrial Estate</p>
                <p>Chennai, Tamil Nadu - 600032, India</p>
                <p>
                  <span className="font-semibold">GSTIN:</span> 33AAECS1234F1Z5 &nbsp;|&nbsp;{' '}
                  <span className="font-semibold">PAN:</span> AAECS1234F &nbsp;|&nbsp;{' '}
                  <span className="font-semibold">State Code:</span> 33 (Tamil Nadu)
                </p>
                <p>
                  <span className="font-semibold">Email:</span> billing@sathus.in &nbsp;|&nbsp;{' '}
                  <span className="font-semibold">Phone:</span> +91 44 2828 9000 &nbsp;|&nbsp;{' '}
                  <span className="font-semibold">Web:</span> https://sathus.in
                </p>
              </div>
            </div>

            {/* INVOICE TITLE & TAX PARTICULARS */}
            <div className="text-right space-y-1">
              <span className="inline-block rounded bg-[#A20A3A] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                TAX INVOICE
              </span>
              <p className="text-[9px] font-medium text-slate-500">
                (Original for Recipient - Rule 46 of CGST Rules, 2017)
              </p>

              <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-2.5 text-left text-[10px] space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-600">Invoice No:</span>
                  <span className="font-bold text-slate-900">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-600">Invoice Date:</span>
                  <span className="font-medium text-slate-800">{invoice.invoice_date}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-600">Due Date:</span>
                  <span className="font-medium text-slate-800">{invoice.due_date}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-600">Place of Supply:</span>
                  <span className="font-bold text-slate-800">
                    {invoice.place_of_supply} ({invoice.place_of_supply_code})
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-600">Reverse Charge:</span>
                  <span className="font-medium text-slate-800">NO</span>
                </div>
              </div>
            </div>
          </div>

          {/* BILLED TO / CUSTOMER INFORMATION */}
          <div className="mt-4 grid grid-cols-2 gap-4 rounded border border-slate-200 bg-slate-50/50 p-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A20A3A]">
                Details of Receiver (Billed To):
              </p>
              <p className="mt-1 text-xs font-bold text-slate-900">{invoice.customer_name}</p>
              <div className="mt-1 text-[10px] text-slate-600 space-y-0.5">
                <p>Client Ref ID: {invoice.customer_ref_id}</p>
                {invoice.customer_gstin ? (
                  <p>
                    <span className="font-semibold text-slate-800">GSTIN:</span>{' '}
                    <span className="font-mono font-bold text-slate-900">{invoice.customer_gstin}</span>
                  </p>
                ) : (
                  <p className="italic text-slate-500">Unregistered Consumer (B2C)</p>
                )}
                <p>
                  <span className="font-semibold text-slate-800">State:</span>{' '}
                  {invoice.place_of_supply} (Code: {invoice.place_of_supply_code})
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A20A3A]">
                Supply & Service Details:
              </p>
              <div className="mt-1 text-[10px] text-slate-600 space-y-0.5">
                <p>
                  <span className="font-semibold text-slate-800">Supply Type:</span>{' '}
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold">
                    {invoice.supply_type}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Nature of Service:</span> IT & Cloud Infrastructure Hosting
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Payment Status:</span>{' '}
                  <span className="font-semibold text-slate-900">{invoice.status}</span>
                </p>
                {invoice.balance_due > 0 && (
                  <p className="font-bold text-rose-700">
                    Balance Due: {fmt(invoice.balance_due)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ITEMISED BILLING TABLE */}
          <div className="mt-4">
            <table className="w-full border-collapse border border-slate-300 text-left text-[10px]">
              <thead>
                <tr className="bg-[#A20A3A] text-white text-[9.5px] uppercase font-bold tracking-wider">
                  <th className="border border-slate-300 p-2 text-center w-8">#</th>
                  <th className="border border-slate-300 p-2">Description of Services</th>
                  <th className="border border-slate-300 p-2 text-center w-16">SAC</th>
                  <th className="border border-slate-300 p-2 text-center w-10">Qty</th>
                  <th className="border border-slate-300 p-2 text-right w-20">Rate (₹)</th>
                  <th className="border border-slate-300 p-2 text-right w-20">Taxable (₹)</th>
                  {isInterState ? (
                    <th className="border border-slate-300 p-2 text-right w-24">IGST (18%)</th>
                  ) : (
                    <>
                      <th className="border border-slate-300 p-2 text-right w-20">CGST (9%)</th>
                      <th className="border border-slate-300 p-2 text-right w-20">SGST (9%)</th>
                    </>
                  )}
                  <th className="border border-slate-300 p-2 text-right w-24">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="border border-slate-300 p-2 text-center text-slate-500 font-mono">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-300 p-2">
                      <p className="font-bold text-slate-800">{item.item_description}</p>
                      <p className="text-[9px] text-slate-500">
                        Monthly recurring dedicated hosting service with 99.9% uptime SLA.
                      </p>
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-medium">
                      {item.sac_code || '998315'}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="border border-slate-300 p-2 text-right font-mono">
                      {fmt(item.unit_price)}
                    </td>
                    <td className="border border-slate-300 p-2 text-right font-mono font-semibold">
                      {fmt(item.taxable_amount)}
                    </td>
                    {isInterState ? (
                      <td className="border border-slate-300 p-2 text-right font-mono">
                        {fmt(item.igst_amount)}
                      </td>
                    ) : (
                      <>
                        <td className="border border-slate-300 p-2 text-right font-mono">
                          {fmt(item.cgst_amount)}
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-mono">
                          {fmt(item.sgst_amount)}
                        </td>
                      </>
                    )}
                    <td className="border border-slate-300 p-2 text-right font-mono font-bold text-slate-900">
                      {fmt(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS & BREAKDOWN */}
          <div className="mt-3 flex justify-between gap-4">
            {/* AMOUNT IN WORDS & DECLARATION */}
            <div className="flex-1 space-y-3">
              <div className="rounded border border-slate-200 bg-slate-50 p-2.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  Total Amount in Words:
                </span>
                <p className="mt-0.5 text-[11px] font-bold text-[#A20A3A]">
                  {invoice.amount_in_words || 'INR Ten Thousand Thirty Only'}
                </p>
              </div>

              {/* PAYMENT REMITTANCE BANK DETAILS */}
              <div className="rounded border border-slate-200 p-2.5 text-[9.5px] space-y-1">
                <p className="font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#A20A3A]" /> Direct Bank Remittance (RTGS / NEFT / IMPS):
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-600">
                  <p><span className="font-semibold text-slate-800">Beneficiary:</span> Sathus Technology Private Limited</p>
                  <p><span className="font-semibold text-slate-800">Bank:</span> HDFC Bank</p>
                  <p><span className="font-semibold text-slate-800">A/C No:</span> **** **** 1122 (Current A/C)</p>
                  <p><span className="font-semibold text-slate-800">IFSC Code:</span> HDFC0001234</p>
                  <p><span className="font-semibold text-slate-800">Branch:</span> Guindy Industrial Estate, Chennai</p>
                  <p><span className="font-semibold text-slate-800">UPI ID:</span> sathustechnology@hdfcbank</p>
                </div>
              </div>
            </div>

            {/* FINANCIAL SUMMARY TABLE */}
            <div className="w-72 shrink-0">
              <div className="rounded border border-slate-300 bg-slate-50 overflow-hidden text-[10px]">
                <div className="flex justify-between border-b border-slate-200 p-2">
                  <span className="font-semibold text-slate-600">Total Taxable Value:</span>
                  <span className="font-mono font-bold text-slate-900">{fmt(invoice.taxable_amount)}</span>
                </div>
                {!isInterState ? (
                  <>
                    <div className="flex justify-between border-b border-slate-200 p-2 bg-white">
                      <span className="text-slate-600">Central GST (CGST @ 9%):</span>
                      <span className="font-mono font-medium text-slate-800">
                        {fmt(invoice.total_cgst ?? invoice.cgst_amount ?? 0)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 p-2">
                      <span className="text-slate-600">State GST (SGST @ 9%):</span>
                      <span className="font-mono font-medium text-slate-800">
                        {fmt(invoice.total_sgst ?? invoice.sgst_amount ?? 0)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between border-b border-slate-200 p-2 bg-white">
                    <span className="text-slate-600">Integrated GST (IGST @ 18%):</span>
                    <span className="font-mono font-medium text-slate-800">
                      {fmt(invoice.total_igst ?? invoice.igst_amount ?? 0)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-200 p-2 bg-slate-100 font-semibold">
                  <span className="text-slate-700">Total GST:</span>
                  <span className="font-mono text-slate-900">{fmt(invoice.total_gst)}</span>
                </div>
                <div className="flex justify-between bg-[#A20A3A] p-2.5 text-white font-bold text-xs">
                  <span>Grand Total:</span>
                  <span className="font-mono text-sm">{fmt(invoice.grand_total)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-300 p-2 bg-slate-50 text-[9px]">
                  <span className="text-slate-500">Paid to Date:</span>
                  <span className="font-mono font-semibold text-emerald-700">{fmt(invoice.paid_amount)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 p-2 bg-amber-50/50 text-[10px] font-bold">
                  <span className="text-amber-900">Net Balance Due:</span>
                  <span className="font-mono text-amber-900">{fmt(invoice.balance_due)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* INSTANT UPI QR CODE & SIGNATORY SECTION */}
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4">
            {/* UPI SCAN & PAY */}
            <div className="flex items-center gap-3 rounded border border-slate-200 p-2.5 bg-slate-50/70">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded border border-slate-300 bg-white p-1">
                {/* Crisp SVG QR Code visualization */}
                <svg viewBox="0 0 100 100" className="h-full w-full text-slate-800" fill="currentColor">
                  {/* Position detection squares */}
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="#A20A3A" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="#A20A3A" />

                  <rect x="65" y="5" width="30" height="30" rx="3" fill="#A20A3A" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="75" y="15" width="10" height="10" fill="#A20A3A" />

                  <rect x="5" y="65" width="30" height="30" rx="3" fill="#A20A3A" />
                  <rect x="10" y="70" width="20" height="20" fill="white" />
                  <rect x="15" y="75" width="10" height="10" fill="#A20A3A" />

                  {/* QR Data Pattern Grid */}
                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="12" width="6" height="6" />
                  <rect x="42" y="24" width="6" height="6" />
                  <rect x="12" y="44" width="6" height="6" />
                  <rect x="24" y="44" width="6" height="6" />
                  <rect x="42" y="42" width="16" height="16" fill="#A20A3A" />
                  <rect x="46" y="46" width="8" height="8" fill="white" />
                  <rect x="68" y="44" width="6" height="6" />
                  <rect x="80" y="44" width="6" height="6" />
                  <rect x="44" y="68" width="6" height="6" />
                  <rect x="56" y="68" width="6" height="6" />
                  <rect x="44" y="80" width="6" height="6" />
                  <rect x="68" y="68" width="6" height="6" />
                  <rect x="80" y="80" width="6" height="6" />
                </svg>
              </div>
              <div className="space-y-0.5 text-[9.5px]">
                <p className="font-bold text-slate-800 flex items-center gap-1">
                  <QrCode className="h-3 w-3 text-[#A20A3A]" /> Scan to Pay via UPI
                </p>
                <p className="text-slate-500">Supports GPay, PhonePe, Paytm, BHIM</p>
                <p className="font-mono font-semibold text-slate-700">sathustechnology@hdfcbank</p>
                <p className="text-[9px] text-slate-400">Merchant: Sathus Technology Pvt Ltd</p>
              </div>
            </div>

            {/* AUTHORIZED SIGNATORY */}
            <div className="flex flex-col items-end justify-between text-right">
              <p className="text-[9.5px] font-bold text-slate-800">
                For SATHUS TECHNOLOGY PRIVATE LIMITED
              </p>
              <div className="relative my-2 flex items-center justify-end pr-4">
                {/* Official Stamp graphic */}
                <div className="rounded-full border-2 border-dashed border-[#A20A3A]/40 px-3 py-1 text-center text-[8px] font-bold text-[#A20A3A]/70 uppercase tracking-widest">
                  Sathus Technology Pvt Ltd<br />CHENNAI · SEAL
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-900">Sathiya Murthy</p>
                <p className="text-[9px] text-slate-500">Managing Director & Authorized Signatory</p>
              </div>
            </div>
          </div>

          {/* TERMS & STATUTORY FOOTER */}
          <div className="mt-4 border-t border-slate-200 pt-2 text-[8.5px] text-slate-500 space-y-0.5">
            <p className="font-semibold text-slate-700">Terms & Conditions:</p>
            <p>1. Invoices are payable on or before the due date. Delayed payments accrue interest @ 18% per annum.</p>
            <p>2. Subject to Chennai Jurisdiction. This is a system-authenticated, digitally certified Tax Invoice under GST Act, 2017.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
