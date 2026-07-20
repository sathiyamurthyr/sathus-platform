'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  ShieldCheck,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  FileText,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  UserPlus,
  UserCheck,
  Bot,
  Workflow,
  Search,
  Sliders,
  Layers,
  Crown,
} from 'lucide-react';
import { mockExecutiveDashboardMetrics } from '../../data/mock-executive-dashboard-data';

export function ExecutiveAnalyticsDashboardView() {
  const [selectedRange, setSelectedRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [notice, setNotice] = useState<string | null>(null);

  const handleExportReport = (type: 'PDF' | 'CSV') => {
    setNotice(`Generated Executive ${type} Report for period (${selectedRange.toUpperCase()}).`);
    setTimeout(() => setNotice(null), 3500);
  };

  const filteredRevenueByPlan = mockExecutiveDashboardMetrics.revenueByPlan.filter((p) => {
    if (selectedPlanFilter !== 'all' && p.planTier !== selectedPlanFilter) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <span>C-Suite Executive Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Story 14.2 Real-time platform revenue (MRR/ARR), customer retention, product adoption, and operational KPIs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-card border border-border rounded-lg p-1 text-xs">
            {[
              { label: '7 Days', val: '7d' },
              { label: '30 Days', val: '30d' },
              { label: '90 Days', val: '90d' },
              { label: '1 Year', val: '1y' },
            ].map((opt) => (
              <button
                key={opt.val}
                onClick={() => setSelectedRange(opt.val as '7d' | '30d' | '90d' | '1y')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  selectedRange === opt.val
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExportReport('CSV')}
            className="p-2 rounded-lg bg-card border border-border hover:bg-muted/40 text-foreground transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleExportReport('PDF')}
            className="inline-flex items-center space-x-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Executive PDF</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* PART 1: PRIMARY EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Monthly Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            ${mockExecutiveDashboardMetrics.mrrDollars.toLocaleString()}
          </div>
          <div className="flex items-center space-x-1 text-xs font-bold text-emerald-500">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.2% vs previous period</span>
          </div>
        </div>

        {/* ARR */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Annual Run-Rate (ARR)</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            ${mockExecutiveDashboardMetrics.arrDollars.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">
            Projected 12-month ARR baseline
          </div>
        </div>

        {/* Customer Retention */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Customer Retention Rate</span>
            <UserCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-500">
            {mockExecutiveDashboardMetrics.retentionRatePercent}%
          </div>
          <div className="text-xs text-muted-foreground">
            Churn rate: <strong className="text-foreground">0.8%</strong>
          </div>
        </div>

        {/* SLA Availability */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Platform SLA Uptime</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">
            {mockExecutiveDashboardMetrics.platformUptimePercent}%
          </div>
          <div className="text-xs text-emerald-500 font-bold">
            SLA Target 99.9% Exceeded
          </div>
        </div>
      </div>

      {/* PART 2: REVENUE ANALYTICS & SUBSCRIPTION TIER BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Revenue Contribution by Subscription Plan Tier</h3>
              <p className="text-xs text-muted-foreground">Distribution across Enterprise Scale ($999), Pro ($199), and Starter ($49).</p>
            </div>

            <select
              value={selectedPlanFilter}
              onChange={(e) => setSelectedPlanFilter(e.target.value)}
              className="h-8 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="Enterprise Scale">Enterprise Scale</option>
              <option value="Pro">Pro Tier</option>
              <option value="Starter">Starter Tier</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            {filteredRevenueByPlan.map((tier, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-foreground">{tier.planTier}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{tier.subscriberCount} Active Organizations</div>
                </div>

                <div className="flex items-center space-x-6 font-mono text-xs">
                  <span>MRR: <strong className="text-emerald-500">${tier.mrrContributionDollars.toLocaleString()}</strong></span>
                  <span className="text-emerald-500 font-bold">+{tier.growthPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Paying Enterprise Accounts */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-foreground">Top Enterprise Accounts</h3>
          <div className="space-y-3 divide-y divide-border">
            {mockExecutiveDashboardMetrics.topPayingCustomers.map((cust) => (
              <div key={cust.tenantId} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>{cust.name}</span>
                  <span className="text-emerald-500 font-mono">${cust.mrrDollars}/mo</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {cust.userCount} users • Joined {cust.joinedDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PART 4: PRODUCT USAGE & FEATURE ADOPTION */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Usage & Microservices Adoption</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockExecutiveDashboardMetrics.productUsage.map((item, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
              <div className="text-xs font-semibold text-muted-foreground truncate">{item.feature}</div>
              <div className="text-xl font-extrabold text-foreground">
                {item.monthlyCount.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{item.unit}</span>
              </div>
              <div className="text-xs font-bold text-emerald-500 flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{item.growthPercent}% MoM</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
