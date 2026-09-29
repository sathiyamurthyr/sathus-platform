import React from 'react';
import Link from 'next/link';
import { Database, Cpu, BarChart3, Cloud, HeartPulse, Dna, Network, FileText, BookOpen, ArrowRight } from 'lucide-react';
import type { HubPillar } from '../types';

const iconMap: Record<string, React.ElementType> = {
  Database,
  Cpu,
  BarChart3,
  Cloud,
  HeartPulse,
  Dna,
  Network,
  FileText,
  BookOpen,
};

interface PillarCardProps {
  pillar: HubPillar;
}

export function PillarCard({ pillar }: PillarCardProps) {
  const IconComponent = iconMap[pillar.icon] || Database;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <IconComponent className="h-6 w-6" />
          </div>
          <span className="rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
            {pillar.subclusters.reduce((acc, c) => acc + c.topicCount, 0)}+ Topics
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {pillar.name}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary/90">
            {pillar.tagline}
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {pillar.description}
        </p>

        {/* Subclusters Preview */}
        <div className="space-y-2 pt-2">
          {pillar.subclusters.slice(0, 3).map((sub, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              <span>
                <strong className="text-foreground">{sub.name}:</strong> {sub.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-border/50 pt-4">
        <Link
          href={`/engineering-hub/${pillar.slug}`}
          className="inline-flex items-center justify-between text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          <span>Explore Knowledge Hub</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href={pillar.commercialServiceHref}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View Practice: <span className="underline underline-offset-2">{pillar.commercialServiceTitle}</span>
        </Link>
      </div>
    </div>
  );
}
