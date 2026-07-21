'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Check,
  Clock,
  DollarSign,
  Users,
  HardDrive,
  Bot,
  Layers,
  Award,
  Sparkles,
} from 'lucide-react';
import { mockLicenseMetrics, mockSubscriptionPlans, mockLicenseAssignments } from '../../data/mock-license-subscription-data';
import type { LicenseAssignmentItem } from '../../types';

export function LicenseSubscriptionManagerView() {
  const [metrics] = useState(mockLicenseMetrics);
  const [plans] = useState(mockSubscriptionPlans);
  const [assignments, setAssignments] = useState<LicenseAssignmentItem[]>(mockLicenseAssignments);

  // Seat Allocation Modal
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [assignName, setAssignName] = useState('');
  const [assignEmail, setAssignEmail] = useState('');
  const [assignPlan, setAssignPlan] = useState('Enterprise');

  const [notice, setNotice] = useState<string | null>(null);

  const handleAssignSeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignEmail.trim()) return;

    const newAssignment: LicenseAssignmentItem = {
      id: `lic-${Date.now()}`,
      userId: `usr-${Date.now()}`,
      userName: assignName || assignEmail.split('@')[0],
      userEmail: assignEmail,
      planName: assignPlan,
      assignedAt: new Date().toISOString(),
      status: 'active',
    };

    setAssignments((prev) => [newAssignment, ...prev]);
    setShowSeatModal(false);
    setAssignName('');
    setAssignEmail('');
    setNotice(`License seat assigned to ${assignEmail}.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleRevokeSeat = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setNotice(`License seat "${id}" revoked and returned to pool.`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>License & Subscription Administration</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.8 Manage enterprise seats, monitor plan tiers & recurring revenue (MRR/ARR), and track entitlement quotas.
          </p>
        </div>

        <button
          onClick={() => setShowSeatModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Allocate License Seat</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* License & Revenue Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">Assigned Seats</div>
          <div className="text-xl font-bold font-mono text-primary">
            {metrics.assignedLicensesCount} / {metrics.totalLicensesCount}
          </div>
          <div className="text-[10px] text-muted-foreground">{metrics.availableLicensesCount} available licenses remaining</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">Monthly Recurring (MRR)</div>
          <div className="text-xl font-bold font-mono text-emerald-500">${metrics.monthlyRecurringRevenueMRR.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground">ARR: ${(metrics.annualRecurringRevenueARR / 1000).toFixed(1)}k / year</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">Expiring Soon</div>
          <div className="text-xl font-bold font-mono text-amber-500">{metrics.expiringSoonLicensesCount} Seats</div>
          <div className="text-[10px] text-muted-foreground">Renewal in &lt; 30 days</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">Subscription SLA</div>
          <div className="text-xl font-bold font-mono text-foreground">{metrics.renewalDaysRemaining} Days</div>
          <div className="text-[10px] text-muted-foreground">Until next contract anniversary</div>
        </div>
      </div>

      {/* Subscription Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`bg-card border rounded-xl p-5 space-y-4 shadow-sm relative flex flex-col justify-between ${
              p.isPopular ? 'border-primary ring-1 ring-primary' : 'border-border'
            }`}
          >
            {p.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-primary text-primary-foreground shadow-sm">
                Most Popular
              </span>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">{p.name} Tier</span>
                <span className="text-lg font-bold font-mono text-emerald-500">${p.priceMonthlyDollars}/mo</span>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2"><Users className="w-3.5 h-3.5 text-primary" /><span>Up to <strong>{p.includedSeats}</strong> seats</span></div>
                <div className="flex items-center space-x-2"><HardDrive className="w-3.5 h-3.5 text-primary" /><span><strong>{p.includedStorageGB} GB</strong> Storage</span></div>
                <div className="flex items-center space-x-2"><Bot className="w-3.5 h-3.5 text-primary" /><span><strong>{(p.includedAiTokensMonthly / 1000).toFixed(0)}k</strong> AI Tokens</span></div>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                {p.features.map((f, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* License Seat Allocation Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Award className="w-4 h-4 text-primary" />
          <span>Active License Seat Allocations</span>
        </h3>

        <div className="divide-y divide-border">
          {assignments.map((asgn) => (
            <div key={asgn.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">{asgn.userName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                    {asgn.planName} Tier
                  </span>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {asgn.userEmail} • Assigned on {new Date(asgn.assignedAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => handleRevokeSeat(asgn.id)}
                className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20"
              >
                Revoke Seat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Allocate License Seat Modal */}
      {showSeatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Allocate License Seat</span>
              </h3>
              <button onClick={() => setShowSeatModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSeat} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">User Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. David Vance"
                  value={assignName}
                  onChange={(e) => setAssignName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">User Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. dvance@enterprise.com"
                  value={assignEmail}
                  onChange={(e) => setAssignEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Select Subscription Plan</label>
                <select
                  value={assignPlan}
                  onChange={(e) => setAssignPlan(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                >
                  <option value="Enterprise">Enterprise ($899/mo tier)</option>
                  <option value="Professional">Professional ($199/mo tier)</option>
                  <option value="Starter">Starter ($49/mo tier)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSeatModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Assign Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
