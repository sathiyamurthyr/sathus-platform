'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/cn';

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string;
    title: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
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
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {items.map((item) => {
          const isOpen = openItems.has(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                'border-b border-border last:border-b-0',
                item.disabled && 'opacity-50'
              )}
            >
              <button
                aria-expanded={isOpen}
                disabled={item.disabled}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  'flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded'
                )}
              >
                {item.title}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
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
                    <div className="pb-4 text-sm text-muted-foreground">
                      {item.content}
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
Accordion.displayName = 'Accordion';

export { Accordion };
