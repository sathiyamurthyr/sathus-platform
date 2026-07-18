'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQ } from '../../types';

interface FaqProps {
  faq: FAQ[];
}

export function Faq({ faq }: FaqProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faq.map((item, index) => (
            <div key={item.id} className="border border-border rounded-lg">
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}