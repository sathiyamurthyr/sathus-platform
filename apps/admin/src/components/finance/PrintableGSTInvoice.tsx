'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Printer, ArrowLeft, ShieldCheck, QrCode } from 'lucide-react';
import { SalesInvoice, CompanyProfile } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { financeClient, DEFAULT_COMPANY_PROFILE } from '@/lib/finance-client';

interface PrintableGSTInvoiceProps {
  invoice: SalesInvoice;
  companyProfile?: CompanyProfile;
  onClose?: () => void;
}

const printStyles = `
  @media print {
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #0f172a !important;
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    aside, header, nav, footer, .no-print {
      display: none !important;
    }
    #main-content {
      overflow: visible !important;
      height: auto !important;
      padding: 0 !important;
      margin: 0 !important;
      display: block !important;
    }
    .print-wrapper {
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
    }
    .print-container {
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      min-height: auto !important;
    }
    .avoid-page-break,
    tr,
    table {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

export function PrintableGSTInvoice({
  invoice,
  companyProfile: initialProfile,
  onClose,
}: PrintableGSTInvoiceProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<CompanyProfile>(initialProfile || DEFAULT_COMPANY_PROFILE);

  useEffect(() => {
    if (!initialProfile) {
      financeClient.getCompanyProfile().then((p) => {
        if (p) setProfile(p);
      });
    }
  }, [initialProfile]);

  const handlePrint = () => {
    window.print();
  };

  const isInterState =
    invoice.supply_type === 'INTER_STATE' || (invoice.total_igst ?? invoice.igst_amount ?? 0) > 0;
  const isPaid = invoice.status === 'PAID';
  const invoiceNumber = invoice.invoice_number || invoice.invoice_no;

  const primaryLoc = profile.locations?.find((l) => l.is_default) || profile.locations?.[0];
  const primaryBank = profile.bank_accounts?.find((b) => b.is_default) || profile.bank_accounts?.[0];
  const primaryQR = profile.payment_qrs?.find((q) => q.is_default) || profile.payment_qrs?.[0];
  const primarySignatory = profile.signatories?.find((s) => s.is_default) || profile.signatories?.[0];

  // Format currency helper
  const fmt = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);

  return (
    <div className="flex flex-col space-y-4 font-sans">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />

      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-xs">
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 gap-1 text-xs">
              <ArrowLeft className="h-4 w-4" /> Back to Invoices
            </Button>
          )}
          <span className="text-xs font-medium text-muted-foreground">
            Tax Invoice: <span className="font-bold font-mono text-foreground">{invoiceNumber}</span>
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
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
            className="h-8 gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white text-xs font-semibold shadow-xs"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Printable A4 Canvas Container */}
      <div className="print-wrapper flex justify-center overflow-x-auto p-3 sm:p-6 bg-slate-100/80 dark:bg-slate-900/40 rounded-xl border border-border/50">
        <div
          ref={printRef}
          id="printable-gst-invoice-area"
          className="print-container relative w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-10 shadow-md border border-slate-200 text-xs leading-normal font-sans selection:bg-rose-100"
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
            <div className="space-y-1.5 max-w-[62%]">
              <div className="flex items-center gap-3">
                {profile.logo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.logo_url}
                    alt={profile.display_name || 'Company Logo'}
                    className="h-12 w-12 shrink-0 object-contain rounded"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#A20A3A] text-xl font-bold text-white shadow-xs">
                    S
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-black tracking-tight text-[#A20A3A]">
                    {profile.display_name || profile.legal_name || 'SATHUS TECHNOLOGY'}
                  </h1>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Cloud Infrastructure & Technology Services
                  </p>
                </div>
              </div>

              <div className="pt-1.5 text-xs text-slate-600 space-y-1 leading-relaxed">
                <p className="font-bold text-slate-900 text-xs">{profile.legal_name || 'Sathus Technology Private Limited'}</p>
                <p className="text-slate-600">{primaryLoc?.address_line1 || 'Sathus Technology Tower, 45 Mount Road, Guindy Industrial Estate'}</p>
                <p className="text-slate-600">
                  {primaryLoc?.city || 'Chennai'}, {primaryLoc?.state || 'Tamil Nadu'} - {primaryLoc?.pincode || '600032'}, India
                </p>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-slate-700 pt-0.5 text-xs">
                  <span><span className="font-semibold text-slate-800">GSTIN:</span> <span className="font-mono font-bold text-slate-900">{primaryLoc?.gstin || '33AAECS1234F1Z5'}</span></span>
                  <span className="text-slate-300" aria-hidden="true">|</span>
                  <span><span className="font-semibold text-slate-800">PAN:</span> <span className="font-mono font-bold text-slate-900">{profile.pan || 'AAECS1234F'}</span></span>
                  <span className="text-slate-300" aria-hidden="true">|</span>
                  <span><span className="font-semibold text-slate-800">State Code:</span> <span className="font-semibold text-slate-800">{primaryLoc?.state_code || '33'} ({primaryLoc?.state || 'Tamil Nadu'})</span></span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-slate-600 text-xs">
                  <span><span className="font-semibold text-slate-700">Email:</span> {profile.email || 'billing@sathus.in'}</span>
                  <span className="text-slate-300" aria-hidden="true">|</span>
                  <span><span className="font-semibold text-slate-700">Phone:</span> {profile.phone || '+91 44 2828 9000'}</span>
                  <span className="text-slate-300" aria-hidden="true">|</span>
                  <span><span className="font-semibold text-slate-700">Web:</span> {profile.website || 'https://sathus.in'}</span>
                </div>
              </div>
            </div>

            {/* INVOICE TITLE & TAX PARTICULARS */}
            <div className="text-right space-y-1">
              <span className="inline-block rounded bg-[#A20A3A] px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-xs">
                TAX INVOICE
              </span>
              <p className="text-[10px] font-medium text-slate-500">
                (Original for Recipient - Rule 46 of CGST Rules, 2017)
              </p>

              <div className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-left text-xs space-y-1.5 w-64 shrink-0 shadow-xs">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium text-slate-600">Invoice No:</span>
                  <span className="font-mono font-bold text-slate-900">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium text-slate-600">Invoice Date:</span>
                  <span className="font-mono font-semibold text-slate-800">{invoice.invoice_date}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium text-slate-600">Due Date:</span>
                  <span className="font-mono font-semibold text-slate-800">{invoice.due_date}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium text-slate-600">Place of Supply:</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {invoice.place_of_supply} ({invoice.place_of_supply_code})
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium text-slate-600">Reverse Charge:</span>
                  <span className="font-semibold text-slate-800">NO</span>
                </div>
              </div>
            </div>
          </div>

          {/* BILLED TO / CUSTOMER INFORMATION & SERVICE DETAILS */}
          <div className="mt-3.5 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-3.5">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#A20A3A]">
                Details of Receiver (Billed To):
              </p>
              <p className="text-sm font-bold text-slate-900">{invoice.customer_name}</p>
              {invoice.customer_company && invoice.customer_company !== invoice.customer_name && (
                <p className="text-xs font-semibold text-slate-700">{invoice.customer_company}</p>
              )}
              {invoice.customer_address && (
                <p className="text-xs text-slate-600 leading-relaxed">{invoice.customer_address}</p>
              )}
              <div className="pt-0.5 text-xs text-slate-600 space-y-0.5">
                <p>
                  <span className="font-medium text-slate-500">Client Ref ID:</span>{' '}
                  <span className="font-semibold text-slate-700">{invoice.customer_ref_id}</span>
                </p>
                {invoice.customer_gstin ? (
                  <p>
                    <span className="font-semibold text-slate-700">GSTIN:</span>{' '}
                    <span className="font-mono font-bold text-slate-900">{invoice.customer_gstin}</span>
                  </p>
                ) : (
                  <p className="italic text-slate-500 text-[11px]">Unregistered Consumer (B2C)</p>
                )}
                <p>
                  <span className="font-medium text-slate-500">State of Supply:</span>{' '}
                  <span className="font-semibold text-slate-800">
                    {invoice.place_of_supply} (Code: {invoice.place_of_supply_code})
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#A20A3A]">
                Supply & Service Details:
              </p>
              <div className="text-xs text-slate-600 space-y-1 pt-0.5 leading-relaxed">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-slate-500">Supply Type:</span>{' '}
                  <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-800 tracking-wide">
                    {invoice.supply_type}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-slate-500">Nature of Service:</span>{' '}
                  <span className="font-semibold text-slate-800">IT & Cloud Infrastructure Hosting</span>
                </p>
                {invoice.billing_period_start && invoice.billing_period_end && (
                  <p>
                    <span className="font-medium text-slate-500">Billing Period:</span>{' '}
                    <span className="font-mono text-slate-700 font-medium">
                      {invoice.billing_period_start} to {invoice.billing_period_end}
                    </span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <span className="font-medium text-slate-500">Payment Status:</span>{' '}
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] tracking-wide ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800'
                        : invoice.status === 'ISSUED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </p>
                {invoice.balance_due > 0 && (
                  <p className="font-bold text-rose-700 pt-0.5">
                    Balance Due:{' '}
                    <span className="font-mono font-bold">{fmt(invoice.balance_due)}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ITEMISED BILLING TABLE */}
          <div className="mt-3.5">
            <table className="w-full border-collapse border border-slate-300 text-left text-xs">
              <thead>
                <tr className="bg-[#A20A3A] text-white text-[10.5px] uppercase font-bold tracking-wider">
                  <th className="border border-slate-300 px-2.5 py-2 text-center w-8">#</th>
                  <th className="border border-slate-300 px-2.5 py-2">Description of Services</th>
                  <th className="border border-slate-300 px-2.5 py-2 text-center w-16">SAC</th>
                  <th className="border border-slate-300 px-2.5 py-2 text-center w-12">Qty</th>
                  <th className="border border-slate-300 px-2.5 py-2 text-right w-24">Rate (₹)</th>
                  <th className="border border-slate-300 px-2.5 py-2 text-right w-24">Taxable (₹)</th>
                  {isInterState ? (
                    <th className="border border-slate-300 px-2.5 py-2 text-right w-24">IGST (18%)</th>
                  ) : (
                    <>
                      <th className="border border-slate-300 px-2.5 py-2 text-right w-20">CGST (9%)</th>
                      <th className="border border-slate-300 px-2.5 py-2 text-right w-20">SGST (9%)</th>
                    </>
                  )}
                  <th className="border border-slate-300 px-2.5 py-2 text-right w-28">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="border border-slate-300 px-2.5 py-2.5 text-center text-slate-500 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-300 px-2.5 py-2.5">
                      <p className="font-bold text-slate-900 text-xs">{item.item_description}</p>
                      <p className="text-[10.5px] text-slate-500 leading-tight mt-0.5">
                        Monthly recurring dedicated hosting service with 99.9% uptime SLA.
                      </p>
                    </td>
                    <td className="border border-slate-300 px-2.5 py-2.5 text-center font-mono font-medium text-xs text-slate-700">
                      {item.sac_code || '998315'}
                    </td>
                    <td className="border border-slate-300 px-2.5 py-2.5 text-center font-mono text-xs text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="border border-slate-300 px-2.5 py-2.5 text-right font-mono text-xs text-slate-800 tabular-nums">
                      {fmt(item.unit_price)}
                    </td>
                    <td className="border border-slate-300 px-2.5 py-2.5 text-right font-mono text-xs font-semibold text-slate-900 tabular-nums">
                      {fmt(item.taxable_amount)}
                    </td>
                    {isInterState ? (
                      <td className="border border-slate-300 px-2.5 py-2.5 text-right font-mono text-xs text-slate-800 tabular-nums">
                        {fmt(item.igst_amount)}
                      </td>
                    ) : (
                      <>
                        <td className="border border-slate-300 px-2.5 py-2.5 text-right font-mono text-xs text-slate-800 tabular-nums">
                          {fmt(item.cgst_amount)}
                        </td>
                        <td className="border border-slate-300 px-2.5 py-2.5 text-right font-mono text-xs text-slate-800 tabular-nums">
                          {fmt(item.sgst_amount)}
                        </td>
                      </>
                    )}
                    <td className="border border-slate-300 px-2.5 py-2.5 text-right font-mono text-xs font-bold text-slate-900 tabular-nums">
                      {fmt(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTALS & BREAKDOWN */}
          <div className="mt-3.5 flex justify-between gap-4 avoid-page-break">
            {/* AMOUNT IN WORDS & DECLARATION */}
            <div className="flex-1 space-y-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total Amount in Words:
                </span>
                <p className="mt-0.5 text-xs font-bold text-[#A20A3A] leading-normal">
                  {invoice.amount_in_words || 'INR Ten Thousand Thirty Only'}
                </p>
              </div>

              {/* PAYMENT REMITTANCE BANK DETAILS */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 text-xs space-y-2">
                <p className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 text-[11px]">
                  <ShieldCheck className="h-4 w-4 text-[#A20A3A]" /> Direct Bank Remittance (RTGS / NEFT / IMPS):
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-700">
                  <div>
                    <span className="font-medium text-slate-500 block text-[11px]">Beneficiary:</span>
                    <span className="font-semibold text-slate-900 block truncate">
                      {primaryBank?.account_holder || profile.legal_name || 'Sathus Technology Private Limited'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500 block text-[11px]">Bank:</span>
                    <span className="font-semibold text-slate-900 block">{primaryBank?.bank_name || 'HDFC Bank'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500 block text-[11px]">A/C No:</span>
                    <span className="font-mono font-bold text-slate-900 block">
                      {primaryBank?.account_number || primaryBank?.account_number_masked || '**** **** 1122'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500 block text-[11px]">IFSC Code:</span>
                    <span className="font-mono font-bold text-slate-900 block">{primaryBank?.ifsc_code || 'HDFC0001234'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500 block text-[11px]">Branch:</span>
                    <span className="text-slate-800 block truncate">{primaryBank?.branch || 'Guindy Industrial Estate, Chennai'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-500 block text-[11px]">UPI ID:</span>
                    <span className="font-mono font-semibold text-slate-800 block">
                      {primaryBank?.upi_id || primaryQR?.upi_id || 'sathustechnology@hdfcbank'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FINANCIAL SUMMARY TABLE */}
            <div className="w-80 shrink-0">
              <div className="rounded-lg border border-slate-300 bg-slate-50 overflow-hidden text-xs shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-200 px-3 py-2 bg-white">
                  <span className="font-medium text-slate-600">Total Taxable Value:</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">{fmt(invoice.taxable_amount)}</span>
                </div>
                {!isInterState ? (
                  <>
                    <div className="flex justify-between items-center border-b border-slate-200 px-3 py-1.5 bg-slate-50/70">
                      <span className="text-slate-600">Central GST (CGST @ 9%):</span>
                      <span className="font-mono font-medium text-slate-800 tabular-nums">
                        {fmt(invoice.total_cgst ?? invoice.cgst_amount ?? 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 px-3 py-1.5 bg-slate-50/70">
                      <span className="text-slate-600">State GST (SGST @ 9%):</span>
                      <span className="font-mono font-medium text-slate-800 tabular-nums">
                        {fmt(invoice.total_sgst ?? invoice.sgst_amount ?? 0)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center border-b border-slate-200 px-3 py-1.5 bg-slate-50/70">
                    <span className="text-slate-600">Integrated GST (IGST @ 18%):</span>
                    <span className="font-mono font-medium text-slate-800 tabular-nums">
                      {fmt(invoice.total_igst ?? invoice.igst_amount ?? 0)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center border-b border-slate-200 px-3 py-2 bg-slate-100 font-semibold text-slate-800">
                  <span>Total GST:</span>
                  <span className="font-mono text-slate-900 tabular-nums">{fmt(invoice.total_gst)}</span>
                </div>
                <div className="flex justify-between items-center bg-[#A20A3A] px-3.5 py-2.5 text-white font-bold">
                  <span className="text-xs uppercase tracking-wider">Grand Total:</span>
                  <span className="font-mono text-base tracking-tight tabular-nums">{fmt(invoice.grand_total)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-300 px-3 py-1.5 bg-slate-50 text-[11px]">
                  <span className="text-slate-500 font-medium">Paid to Date:</span>
                  <span className="font-mono font-bold text-emerald-700 tabular-nums">{fmt(invoice.paid_amount)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 px-3 py-2 bg-amber-50/70 text-xs font-bold">
                  <span className="text-amber-950">Net Balance Due:</span>
                  <span className="font-mono text-amber-950 tabular-nums">{fmt(invoice.balance_due)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* INSTANT UPI QR CODE & SIGNATORY SECTION */}
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 avoid-page-break">
            {/* UPI SCAN & PAY */}
            <div className="flex items-center gap-3.5 rounded-lg border border-slate-200 p-3 bg-slate-50/70">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded border border-slate-300 bg-white p-1">
                {primaryQR?.qr_image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={primaryQR.qr_image_url}
                    alt="Payment QR Code"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  /* Crisp SVG QR Code visualization */
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
                )}
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <QrCode className="h-3.5 w-3.5 text-[#A20A3A]" /> Scan to Pay via UPI
                </p>
                <p className="text-[10.5px] text-slate-500">Supports GPay, PhonePe, Paytm, BHIM</p>
                <p className="font-mono font-bold text-slate-800 text-xs">
                  {primaryQR?.upi_id || primaryBank?.upi_id || 'sathustechnology@hdfcbank'}
                </p>
                <p className="text-[10px] text-slate-500">
                  Merchant: {primaryQR?.merchant_name || profile.display_name || profile.legal_name || 'Sathus Technology Pvt Ltd'}
                </p>
              </div>
            </div>

            {/* AUTHORIZED SIGNATORY */}
            <div className="flex flex-col items-end justify-between text-right">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                For {(profile.legal_name || 'SATHUS TECHNOLOGY PRIVATE LIMITED').toUpperCase()}
              </p>
              <div className="relative my-2 flex items-center justify-end pr-4">
                {profile.seal_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.seal_url}
                    alt="Official Digital Seal"
                    className="h-16 w-16 object-contain"
                  />
                ) : (
                  /* Official Stamp graphic */
                  <div className="rounded-full border-2 border-dashed border-[#A20A3A]/40 px-3 py-1.5 text-center text-[9px] font-bold text-[#A20A3A]/80 uppercase tracking-widest">
                    {profile.display_name || 'Sathus Technology'}<br />{primaryLoc?.city?.toUpperCase() || 'CHENNAI'} · SEAL
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">{primarySignatory?.signatory_name || 'Sathiya Murthy'}</p>
                <p className="text-[10.5px] font-medium text-slate-500">{primarySignatory?.designation || 'Managing Director & Authorized Signatory'}</p>
              </div>
            </div>
          </div>

          {/* TERMS & STATUTORY FOOTER */}
          <div className="mt-4 border-t border-slate-200 pt-3 text-[10px] text-slate-500 space-y-1 avoid-page-break leading-relaxed">
            <p className="font-bold text-slate-700">Terms & Conditions:</p>
            <p>1. Invoices are payable on or before the due date. Delayed payments accrue interest @ 18% per annum.</p>
            <p>2. Subject to Chennai Jurisdiction. This is a system-authenticated, digitally certified Tax Invoice under GST Act, 2017.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
