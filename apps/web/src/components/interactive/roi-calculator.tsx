'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Calculator, DollarSign, TrendingUp, Zap, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RoiCalculator() {
  const [cloudSpend, setCloudSpend] = React.useState<number>(250000);
  const [teamSize, setTeamSize] = React.useState<number>(25);
  const [servicesCount, setServicesCount] = React.useState<number>(40);

  // Dynamic ROI Formulas
  const infraSavings = Math.round(cloudSpend * 0.42); // Average 42% cloud savings
  const velocityHoursSaved = Math.round(teamSize * 15 * 52); // 15 hrs/dev/week saved
  const developerValueGained = Math.round(teamSize * 35000); // $35k engineering productivity gain/dev
  const totalAnnualSavings = infraSavings + developerValueGained;
  const paybackMonths = Math.max(2, Math.round((75000 / totalAnnualSavings) * 12 * 10) / 10);

  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-6 md:p-10 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground">Enterprise ROI & TCO Cost Calculator</h3>
            <p className="text-xs text-muted-foreground">Calculate your estimated annual savings with Sathus Cloud & AI Platform Engineering</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          Estimated 42% Cost Reduction
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-6 space-y-6 bg-background/60 p-6 rounded-xl border border-border">
          {/* Slider 1: Cloud Spend */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-foreground">Annual Cloud Infrastructure Spend</span>
              <span className="text-primary font-mono text-sm">${cloudSpend.toLocaleString()} / yr</span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="25000"
              value={cloudSpend}
              onChange={(e) => setCloudSpend(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>$50k</span>
              <span>$1M</span>
              <span>$2M+</span>
            </div>
          </div>

          {/* Slider 2: Team Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-foreground">Engineering Team Size</span>
              <span className="text-primary font-mono text-sm">{teamSize} Engineers</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>5 devs</span>
              <span>100 devs</span>
              <span>200+ devs</span>
            </div>
          </div>

          {/* Slider 3: Microservices */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-foreground">Microservices / Monolith Modules</span>
              <span className="text-primary font-mono text-sm">{servicesCount} Services</span>
            </div>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={servicesCount}
              onChange={(e) => setServicesCount(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>10 services</span>
              <span>150 services</span>
              <span>300+ services</span>
            </div>
          </div>
        </div>

        {/* Real-Time Output Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-3 shadow-lg">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Estimated Total Annual Financial Savings
            </div>
            <div className="text-4xl font-extrabold text-emerald-400 font-mono">
              ${totalAnnualSavings.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ year</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Combines ${infraSavings.toLocaleString()} direct cloud bill reduction with ${developerValueGained.toLocaleString()} in engineering productivity value.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-1">
              <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Payback Period
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">{paybackMonths} Months</div>
              <div className="text-[10px] text-muted-foreground">Full engagement payback</div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-1">
              <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                Dev Hours Saved
              </div>
              <div className="text-2xl font-bold text-foreground font-mono">{velocityHoursSaved.toLocaleString()} hrs</div>
              <div className="text-[10px] text-muted-foreground">Annual developer time freed</div>
            </div>
          </div>

          <div className="pt-2">
            <Link href={`/book-strategy-session?cloudSpend=${cloudSpend}&teamSize=${teamSize}`}>
              <Button className="w-full h-11 text-xs font-bold bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all gap-2">
                Request Custom Architecture ROI Audit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
