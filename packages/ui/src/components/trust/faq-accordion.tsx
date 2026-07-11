'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/cn';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'data' | 'encryption' | 'privacy' | 'backups' | 'support';
}

interface FAQAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FAQItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
}

const categoryColors = {
  data: 'bg-primary/10 text-primary border-primary/20',
  encryption: 'bg-success/10 text-success border-success/20',
  privacy: 'bg-secondary text-secondary-foreground border-secondary',
  backups: 'bg-warning/10 text-warning border-warning/20',
  support: 'bg-destructive/10 text-destructive border-destructive/20',
};

const FAQAccordion = React.forwardRef<HTMLDivElement, FAQAccordionProps>(
  ({ className, items, type = 'single', defaultValue, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
      if (defaultValue) {
        const initial = new Set<string>();
        if (typeof defaultValue === 'string') {
          initial.add(defaultValue);
        } else {
          defaultValue.forEach((id) => initial.add(id));
        }
        return initial;
      }
      return new Set();
    });

    const toggleItem = (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (type === 'single') {
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.clear();
            next.add(id);
          }
        } else {
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
        }
        return next;
      });
    };

    return (
      <div ref={ref} className={cn('w-full space-y-2', className)} {...props}>
        {items.map((item) => {
          const isOpen = openItems.has(item.id);
          return (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                aria-expanded={isOpen}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  'flex w-full items-center justify-between p-4 text-left text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.category && (
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shrink-0',
                        categoryColors[item.category]
                      )}
                    >
                      {item.category}
                    </span>
                  )}
                  <span className="text-left">{item.question}</span>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 shrink-0"
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }
);
FAQAccordion.displayName = 'FAQAccordion';

export { FAQAccordion };
