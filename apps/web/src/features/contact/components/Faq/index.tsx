'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What is the typical response time?',
    answer: 'We typically respond within 24 hours during business days.',
  },
  {
    question: 'Do you offer custom solutions?',
    answer: 'Yes, we specialize in custom enterprise solutions tailored to your specific needs.',
  },
  {
    question: 'What industries do you serve?',
    answer: 'We serve regulated industries including financial services, healthcare, manufacturing, and more.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="border border-border rounded-lg">
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
  );
}