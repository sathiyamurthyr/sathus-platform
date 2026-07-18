'use client';

import * as React from 'react';
import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { FAQ } from '../../types';
import { ChevronDown } from 'lucide-react';

interface FaqProps {
  faqs: FAQ[];
}

export function Faq({ faqs }: FaqProps) {
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Common questions about our AI Engineering practice and approach."
        />
        <div className="mt-12 max-w-3xl space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openItems[faq.id] ?? false;
            return (
              <Reveal key={faq.id} delay={i * 0.05}>
                <div className="rounded-xl border border-border bg-background">
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-center justify-between p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${faq.id}`}
                  >
                    <h3 className="text-base font-medium text-foreground pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    id={`faq-content-${faq.id}`}
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <p className="px-6 pb-6 text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}