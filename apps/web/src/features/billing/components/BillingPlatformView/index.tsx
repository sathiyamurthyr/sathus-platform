'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Download,
  ShieldCheck,
  Building2,
  Sparkles,
  BarChart3,
  Plus,
  Check,
  FileText,
  Tag,
  Percent,
} from 'lucide-react';
import {
  mockPlans,
  mockSubscription,
  mockUsageMeters,
  mockInvoices,
  mockPaymentMethods,
  mockBillingAccount,
} from '../../data/mock-billing-data';
import type { Plan, Subscription, PaymentMethod, Invoice } from '../../types';

export function BillingPlatformView() {
  const [activeTab, setActiveTab] = useState<'subscription' | 'usage' | 'invoices' | 'payment_methods' | 'tax_settings'>('subscription');

  // Subscription state
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription);
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [notice, setNotice] = useState<string | null>(null);

  // Invoices state
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  // Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);

  const handleSelectPlan = (plan: Plan) => {
    setSubscription((prev) => ({
      ...prev,
      planId: plan.id,
      planName: plan.name,
      tier: plan.tier,
    }));
    setNotice(`Successfully upgraded workspace plan to ${plan.name}.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SATHUS2026' || promoCode.trim().toUpperCase() === 'ODYSSEY20') {
      setAppliedDiscount(20);
      setNotice('Promo code applied successfully! 20% discount reflected on renewal.');
    } else {
      setNotice('Invalid or expired promotion code.');
    }
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-primary" />
            <span>Enterprise Billing & Subscription Platform</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            EPIC-022 Multi-tenant subscription management, usage metering, invoicing, and payment abstraction.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{subscription.planName} Plan Active</span>
          </span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'subscription', label: 'Subscription & Plans', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'usage', label: 'Usage Metering & Quotas', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'invoices', label: 'Invoices & Receipts', icon: <FileText className="w-4 h-4" /> },
          { id: 'payment_methods', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'tax_settings', label: 'Tax & Licensing', icon: <Building2 className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as 'subscription' | 'usage' | 'invoices' | 'payment_methods' | 'tax_settings')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SUBSCRIPTION & PLANS */}
      {activeTab === 'subscription' && (
        <div className="space-y-8">
          {/* Active Plan Overview */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">Current Workspace Subscription</div>
              <h3 className="text-xl font-extrabold text-foreground">{subscription.planName}</h3>
              <p className="text-xs text-muted-foreground">
                Billing Cycle: <strong className="text-foreground capitalize">{subscription.billingCycle}</strong> • Renewing on{' '}
                <strong className="text-foreground">{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-extrabold text-foreground">$799 <span className="text-xs font-normal text-muted-foreground">/ mo</span></div>
                <div className="text-[10px] text-emerald-500 font-bold">Billed Annually (20% Savings)</div>
              </div>
            </div>
          </div>

          {/* Billing Cycle Switcher */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle((prev) => (prev === 'monthly' ? 'annually' : 'monthly'))}
              className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                billingCycle === 'annually' ? 'bg-primary justify-end' : 'bg-muted justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
            <span className={`text-xs font-bold flex items-center space-x-1 ${billingCycle === 'annually' ? 'text-foreground' : 'text-muted-foreground'}`}>
              <span>Annually</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-extrabold border border-emerald-500/20">Save 20%</span>
            </span>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrent = subscription.planId === plan.id;
              const price = billingCycle === 'annually' ? plan.priceAnnuallyUsd : plan.priceMonthlyUsd;

              return (
                <div
                  key={plan.id}
                  className={`bg-card border rounded-xl p-6 space-y-6 shadow-sm flex flex-col justify-between relative ${
                    isCurrent ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-primary text-primary-foreground shadow-sm">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{plan.name}</h4>
                      <p className="text-xs text-muted-foreground pt-1 leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="text-3xl font-extrabold text-foreground">
                      ${price} <span className="text-xs font-normal text-muted-foreground">/ month</span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Included Capabilities</div>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-foreground">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-muted text-muted-foreground cursor-default'
                        : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: USAGE METERING & QUOTAS */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Real-Time Usage Metering & Plan Quotas</h3>
            <p className="text-xs text-muted-foreground">Live resource consumption tracked against your Enterprise Scale allocation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockUsageMeters.map((meter, idx) => {
              const percent = Math.round((meter.currentUsage / meter.limit) * 100);
              return (
                <div key={idx} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{meter.label}</span>
                    <span className="text-xs font-mono font-bold text-primary">{percent}%</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        percent > 85 ? 'bg-amber-500' : 'bg-primary'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                    <span>Used: {meter.currentUsage.toLocaleString()} {meter.unit}</span>
                    <span>Limit: {meter.limit.toLocaleString()} {meter.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: INVOICES & RECEIPTS */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Invoice History & Receipts</h3>
            <p className="text-xs text-muted-foreground">Download tax-ready PDF invoices for past billing cycles.</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-5 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-lg bg-muted border border-border shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{inv.number}</div>
                    <div className="text-xs text-muted-foreground">Issued: {new Date(inv.issueDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">${inv.amountUsd.toLocaleString()} USD</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </div>

                  <a
                    href={inv.pdfUrl}
                    download
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT METHODS */}
      {activeTab === 'payment_methods' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Payment Gateways & Methods</h3>
              <p className="text-xs text-muted-foreground">Manage payment providers (Stripe, Razorpay) and credit cards.</p>
            </div>
            <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90">
              <Plus className="w-4 h-4" />
              <span>Add Payment Method</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((pm) => (
              <div key={pm.id} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-lg bg-muted border border-border shrink-0">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    {pm.type === 'card' ? (
                      <div className="text-sm font-bold text-foreground">{pm.brand} ending in {pm.last4}</div>
                    ) : (
                      <div className="text-sm font-bold text-foreground">UPI: {pm.upiId}</div>
                    )}
                    <div className="text-xs text-muted-foreground capitalize">Provider: {pm.provider}</div>
                  </div>
                </div>

                {pm.isDefault && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TAX & LICENSING SETTINGS */}
      {activeTab === 'tax_settings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promo Code Panel */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
                <Tag className="w-4 h-4 text-primary" />
                <span>Promotions & Coupons</span>
              </div>

              <form onSubmit={handleApplyPromo} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code (e.g. SATHUS2026)"
                  className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-xs font-semibold uppercase text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Apply
                </button>
              </form>

              {appliedDiscount && (
                <div className="text-xs text-emerald-500 font-bold flex items-center space-x-1">
                  <Percent className="w-4 h-4" />
                  <span>{appliedDiscount}% Active Discount Applied to Account</span>
                </div>
              )}
            </div>

            {/* Corporate Tax Info */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span>Corporate Tax & License Info</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Company Name</label>
                  <div className="font-bold text-foreground">{mockBillingAccount.companyName}</div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">GSTIN / Tax ID</label>
                  <div className="font-mono font-bold text-foreground">{mockBillingAccount.taxId}</div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Billing Address</label>
                  <div className="text-muted-foreground">{mockBillingAccount.address}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
