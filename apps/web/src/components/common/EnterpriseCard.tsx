import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { cn } from '@/lib/utils';

interface EnterpriseCardProps {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  problem: string;
  outcome: string;
  href: string;
  delay?: number;
}

export function EnterpriseCard({
  icon: Icon,
  number,
  title,
  problem,
  outcome,
  href,
  delay = 0,
}: EnterpriseCardProps) {
  return (
    <Reveal
      delay={delay}
      className={cn(
        "group relative w-full text-left bg-white border border-[#E5E7EB] rounded-[20px] p-8 shadow-sm transition-all duration-200 hover:-translate-y-[6px] hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]",
        "flex flex-col h-auto md:h-full lg:h-[560px]",
        "lg:grid lg:grid-cols-1 lg:grid-rows-[64px_24px_72px_20px_96px_24px_1px_24px_96px_24px_1px_24px_auto]"
      )}
    >
      {/* Icon Area (Row 1 on desktop) */}
      <div className="flex items-center justify-between lg:row-start-1 h-16 mb-6 lg:mb-0 relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] shrink-0">
          <Icon className="h-7 w-7" />
        </div>
        <span className="absolute top-0 right-0 font-display text-2xl font-bold text-muted-foreground/30 select-none">
          {number}
        </span>
      </div>

      {/* Title Area (Row 3 on desktop) */}
      <div className="lg:row-start-3 h-[72px] flex items-start mb-5 lg:mb-0">
        <h3 className="text-[32px] font-semibold leading-[36px] line-clamp-2 text-foreground tracking-tight">
          {title}
        </h3>
      </div>

      {/* Problem Section (Row 5 on desktop) */}
      <div className="lg:row-start-5 h-[96px] overflow-hidden flex flex-col justify-start mb-6 lg:mb-0">
        <h4 className="font-bold text-sm text-[#0066cc] uppercase tracking-wider">The problem.</h4>
        <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed mt-1">
          {problem}
        </p>
      </div>

      {/* Divider 1 (Row 7 on desktop) */}
      <div className="lg:row-start-7 h-px bg-[#E5E7EB] w-full mb-6 lg:mb-0" />

      {/* Outcome Section (Row 9 on desktop) */}
      <div className="lg:row-start-9 h-[96px] overflow-hidden flex flex-col justify-start mb-6 lg:mb-0">
        <h4 className="font-bold text-sm text-[#0066cc] uppercase tracking-wider">The outcome.</h4>
        <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed mt-1">
          {outcome}
        </p>
      </div>

      {/* Divider 2 (Row 11 on desktop) */}
      <div className="lg:row-start-11 h-px bg-[#E5E7EB]/70 w-full mb-6 lg:mb-0" />

      {/* CTA Button Pinned to Bottom (Row 13 on desktop) */}
      <div className="lg:row-start-13 mt-auto lg:mt-0 flex items-center pt-2">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-base font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded whitespace-nowrap"
          aria-label={`Learn more about ${title}`}
        >
          Learn more
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
        </Link>
      </div>
    </Reveal>
  );
}
