'use client';

import React, { useState, useMemo } from 'react';
import { FileText, DollarSign, TrendingDown, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function DocumentAiCostEstimator() {
  const [pagesPerMonth, setPagesPerMonth] = useState<number>(100000);
  const [digitalPct, setDigitalPct] = useState<number>(60);
  const [formPct, setFormPct] = useState<number>(30);

  // Remaining percentage is degraded/complex
  const degradedPct = Math.max(0, 100 - digitalPct - formPct);

  const calc = useMemo(() => {
    const totalThousandPages = pagesPerMonth / 1000;

    // Monolithic Vision LLM Cost ($25 per 1,000 pages for all pages)
    const monolithicCost = Math.round(totalThousandPages * 25.0);

    // Cascading Architecture Cost
    // Tier 1: Digital ($0.01 / 1K pages)
    const digitalCost = (totalThousandPages * (digitalPct / 100)) * 0.01;
    // Tier 2: LayoutLMv3 ($1.50 / 1K pages)
    const formCost = (totalThousandPages * (formPct / 100)) * 1.50;
    // Tier 3: Vision LLM ($25.00 / 1K pages)
    const degradedCost = (totalThousandPages * (degradedPct / 100)) * 25.0;

    const cascadingCost = Math.round(digitalCost + formCost + degradedCost);
    const monthlySavings = Math.max(0, monolithicCost - cascadingCost);
    const savingsPercent = Math.round((monthlySavings / Math.max(1, monolithicCost)) * 100);
    const annualSavings = monthlySavings * 12;

    // Average latency per page
    // Monolithic: 2400ms
    // Cascade: digital (10ms), form (280ms), degraded (2400ms)
    const avgLatencyMs = Math.round(
      (digitalPct / 100) * 10 + (formPct / 100) * 280 + (degradedPct / 100) * 2400
    );

    return {
      monolithicCost,
      cascadingCost,
      monthlySavings,
      savingsPercent,
      annualSavings,
      avgLatencyMs,
    };
  }, [pagesPerMonth, digitalPct, formPct, degradedPct]);

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card/95 p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider mb-2">
            <FileText className="h-3.5 w-3.5" />
            Interactive Engineering Asset
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground">
            Document Extraction &amp; Vision LLM TCO Cost Estimator
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Compare monthly operational spend: Monolithic Vision LLMs vs. Sathus 3-Tier Cascading Router.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-400">
          <TrendingDown className="h-4 w-4 shrink-0" />
          <span>{calc.savingsPercent}% Modeled Cost Reduction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders Column */}
        <div className="space-y-5">
          {/* Input 1: Monthly Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Monthly Ingestion Volume:</span>
              <span className="font-mono text-primary font-bold">{pagesPerMonth.toLocaleString()} Pages / Month</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={pagesPerMonth}
              onChange={(e) => setPagesPerMonth(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>10K Pages</span>
              <span>250K Pages</span>
              <span>500K Pages</span>
              <span>1M Pages</span>
            </div>
          </div>

          {/* Input 2: Digital PDF % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Born-Digital PDFs (Searchable Text):</span>
              <span className="font-mono text-emerald-400 font-bold">{digitalPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={digitalPct}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDigitalPct(val);
                if (val + formPct > 95) setFormPct(95 - val);
              }}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="text-[10px] text-muted-foreground">Routed to Tier 1: PyMuPDF ($0.01 / 1K pages)</div>
          </div>

          {/* Input 3: Structured Forms % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Standard Scanned Forms (Clinical / Invoices):</span>
              <span className="font-mono text-cyan-400 font-bold">{formPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max={95 - digitalPct}
              step="5"
              value={formPct}
              onChange={(e) => setFormPct(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-[10px] text-muted-foreground">Routed to Tier 2: LayoutLMv3 ($1.50 / 1K pages)</div>
          </div>

          {/* Input 4: Degraded Scans / Complex Tables */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Degraded Faxes, Handwriting &amp; Complex Tables:</span>
              <span className="font-mono text-amber-400 font-bold">{degradedPct}%</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              Selectively escalated to Tier 3: Multimodal Vision LLM ($25.00 / 1K pages)
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-5 rounded-xl border border-border/80 bg-neutral-950 p-6 font-mono text-xs">
          <div className="border-b border-border/40 pb-3">
            <span className="text-primary font-bold uppercase tracking-wider text-[11px]">
              TCO Financial Comparison &amp; Impact
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-neutral-900 p-4 border border-red-500/20 space-y-1">
              <div className="text-[10px] text-muted-foreground uppercase">Monolithic Vision LLM</div>
              <div className="text-2xl font-bold text-red-400">${calc.monolithicCost.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">per month ($25/1K pages flat)</div>
            </div>
            <div className="rounded-lg bg-neutral-900 p-4 border border-emerald-500/30 space-y-1">
              <div className="text-[10px] text-emerald-400 uppercase font-bold">Sathus Cascading Router</div>
              <div className="text-2xl font-bold text-emerald-400">${calc.cascadingCost.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">per month (multi-tier triage)</div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
              <span>Estimated Annual Net Savings:</span>
              <span className="text-lg text-emerald-300 font-black">+${calc.annualSavings.toLocaleString()} / Year</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              By filtering born-digital PDFs and structured forms prior to LLM escalation, enterprises avoid overpaying for raw token processing.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-neutral-900/60 p-3 border border-border/40 text-[11px]">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Average Latency Per Page:
            </span>
            <span className="font-bold text-foreground">
              {calc.avgLatencyMs} ms <span className="text-muted-foreground font-normal">(vs. 2,400 ms flat)</span>
            </span>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
            >
              <span>Request Production Document AI Benchmark</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
