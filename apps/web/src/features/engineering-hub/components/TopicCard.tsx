import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, ShieldCheck, FileCode, Layers, BookOpen } from 'lucide-react';
import type { HubTopic } from '../types';

const pageTypeBadgeMap: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  'architecture-guide': { label: 'Architecture Guide', icon: Layers, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  'implementation-guide': { label: 'Implementation Code', icon: FileCode, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  'technical-reference': { label: 'Technical Reference', icon: BookOpen, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  'money-service': { label: 'Enterprise Practice', icon: ShieldCheck, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  'glossary': { label: 'Glossary Definition', icon: BookOpen, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  'case-study': { label: 'Case Study', icon: ShieldCheck, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
};

interface TopicCardProps {
  topic: HubTopic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const badge = pageTypeBadgeMap[topic.pageType] || pageTypeBadgeMap['architecture-guide'];
  const BadgeIcon = badge.icon;

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${badge.color}`}>
            <BadgeIcon className="h-3 w-3" />
            {badge.label}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {topic.readingTime} min read
          </div>
        </div>

        <h4 className="text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          <Link href={`/engineering-hub/${topic.pillarSlug}/${topic.slug}`} className="focus:outline-none">
            <span className="absolute inset-0" />
            {topic.title}
          </Link>
        </h4>

        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {topic.description}
        </p>

        {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
          <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">Key Highlight:</span> {topic.keyTakeaways[0]}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs">
        <span className="text-muted-foreground font-medium">
          By {topic.author.name}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-1">
          Read Guide <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );
}
