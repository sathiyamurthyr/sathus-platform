'use client';

import React, { useEffect, useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient, DEFAULT_COMPANY_PROFILE } from '@/lib/finance-client';
import { CompanyProfile } from '@/types/finance';

export default function FinanceSettingsPage() {
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await financeClient.getCompanyProfile();
        setProfile(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Company Profile, Legal & Banking Configuration
        </h1>
        <p className="text-sm text-muted-foreground">
          Authoritative contact details, GSTIN registrations, bank remittance accounts, and signatories.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEGAL ENTITY & PRIMARY CONTACT */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Building2 className="h-5 w-5 text-[#A20A3A]" />
              <CardTitle className="text-base font-bold text-foreground">
                Corporate Entity & Contact Details
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Printed on every generated GST Tax Invoice and customer communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-muted-foreground">Legal Registered Name:</span>
              <p className="text-sm font-bold text-foreground">{profile.legal_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded border border-border bg-muted/30 p-3">
              <div>
                <span className="text-muted-foreground">PAN:</span>
                <p className="font-mono font-bold text-foreground">{profile.pan}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CIN:</span>
                <p className="font-mono font-bold text-foreground">{profile.cin}</p>
              </div>
            </div>

            {/* CONTACT NUMBERS & EMAIL */}
            <div className="rounded border border-primary/20 bg-primary/5 p-3 space-y-2">
              <p className="font-bold text-[#A20A3A] uppercase tracking-wider text-[11px]">
                Official Billing & Support Contacts:
              </p>
              <div className="space-y-1.5 text-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#A20A3A]" />
                  <span className="font-semibold">Phone:</span>
                  <span className="font-mono text-sm font-bold">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#A20A3A]" />
                  <span className="font-semibold">Email:</span>
                  <span className="font-mono text-sm font-bold">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#A20A3A]" />
                  <span className="font-semibold">Website:</span>
                  <span className="font-mono text-sm">{profile.website}</span>
                </div>
              </div>
            </div>

            {/* REGISTERED OFFICE LOCATIONS */}
            <div className="space-y-2">
              <span className="font-semibold text-muted-foreground">Registered Office & GSTIN:</span>
              {profile.locations.map((loc) => (
                <div key={loc.ref_id} className="rounded border border-border p-3 space-y-1 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{loc.location_name}</span>
                    <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
                      State Code: {loc.state_code}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{loc.address_line1}, {loc.address_line2}</p>
                  <p className="text-muted-foreground">{loc.city}, {loc.state} - {loc.pincode}</p>
                  <p className="font-mono font-bold text-foreground pt-1">
                    GSTIN: {loc.gstin}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* BANKING, UPI & SIGNATORIES */}
        <div className="space-y-6">
          {/* BANK ACCOUNTS */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <CreditCard className="h-5 w-5 text-[#A20A3A]" />
                <CardTitle className="text-base font-bold text-foreground">
                  Invoice Remittance Bank Accounts
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                RTGS / NEFT / IMPS beneficiary accounts shown on tax invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {profile.bank_accounts.map((b) => (
                <div key={b.ref_id} className="rounded border border-border p-3 space-y-1.5 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{b.bank_name}</span>
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono">
                      {b.currency}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
                    <div>
                      <span>Account Holder:</span>
                      <p className="font-semibold text-foreground">{b.account_holder}</p>
                    </div>
                    <div>
                      <span>Account Number:</span>
                      <p className="font-mono font-bold text-foreground">{b.account_number_masked}</p>
                    </div>
                    <div>
                      <span>IFSC Code:</span>
                      <p className="font-mono font-bold text-foreground">{b.ifsc_code}</p>
                    </div>
                    <div>
                      <span>Branch:</span>
                      <p className="text-foreground">{b.branch}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* SIGNATORIES & SEAL */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5 text-[#A20A3A]" />
                <CardTitle className="text-base font-bold text-foreground">
                  Authorized Signatories & Digital Seal
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Board-authorized signing authority for legal tax documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {profile.signatories.map((sig) => (
                <div key={sig.ref_id} className="rounded border border-border p-3 space-y-1 bg-card">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{sig.signatory_name}</span>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
                      Authorized Signatory
                    </span>
                  </div>
                  <p className="text-muted-foreground">{sig.designation}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Effective From: {sig.effective_from}
                  </p>
                </div>
              ))}

              <div className="rounded border border-dashed border-[#A20A3A]/40 bg-[#A20A3A]/5 p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">Digital Document Snapshot Rule</p>
                  <p className="text-[11px] text-muted-foreground">
                    Invoices are cryptographically frozen at issuance to preserve statutory integrity.
                  </p>
                </div>
                <Lock className="h-4 w-4 text-[#A20A3A]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
