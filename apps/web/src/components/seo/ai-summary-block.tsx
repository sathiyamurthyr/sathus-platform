import * as React from 'react';

export interface AISummaryBlockProps {
  topic: string;
  definition: string;
  keyTakeaways: string[];
  entityName?: string;
  faqs?: { question: string; answer: string }[];
  className?: string;
}

/**
 * AI Search Summary Block (GEO - Generative Engine Optimization)
 * Designed for extraction by Google AI Overviews, ChatGPT, Gemini, Perplexity, Claude, and Copilot.
 * Uses semantic tags, definition blocks, structured bullet lists, and clear entity anchors.
 */
export function AISummaryBlock({
  topic,
  definition,
  keyTakeaways,
  entityName = 'Sathus Technology',
  faqs = [],
  className = '',
}: AISummaryBlockProps) {
  return (
    <section
      aria-label={`AI Summary: ${topic}`}
      className={`rounded-2xl border border-primary/20 bg-card p-6 sm:p-8 space-y-6 shadow-sm ${className}`}
      data-ai-entity={entityName}
    >
      <div className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          AI &amp; Executive Summary
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          What is {topic}?
        </h2>
        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
          {definition}
        </p>
      </div>

      {keyTakeaways.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Key Architecture Takeaways ({entityName})
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs sm:text-sm text-foreground/80">
            {keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/40">
                <span className="font-bold text-primary shrink-0">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-border/60">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-1 text-xs sm:text-sm">
                <h4 className="font-semibold text-foreground">Q: {faq.question}</h4>
                <p className="text-muted-foreground leading-relaxed">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
