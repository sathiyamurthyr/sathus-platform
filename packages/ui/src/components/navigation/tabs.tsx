'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
  }[];
  defaultValue?: string;
  onValueChange?: (id: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, items, defaultValue, onValueChange, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState<string>(
      defaultValue || items[0]?.id || ''
    );

    const handleTabChange = (id: string) => {
      setActiveTab(id);
      onValueChange?.(id);
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          role="tablist"
          className="flex items-center gap-1 border-b border-border"
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={activeTab === item.id}
              aria-controls={`panel-${item.id}`}
              disabled={item.disabled}
              onClick={() => handleTabChange(item.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-t-md',
                activeTab === item.id
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`panel-${item.id}`}
            aria-labelledby={item.id}
            hidden={activeTab !== item.id}
            className={cn(
              'mt-4',
              activeTab === item.id ? 'animate-in fade-in-0 slide-in-from-bottom-2' : ''
            )}
          >
            {activeTab === item.id && item.content}
          </div>
        ))}
      </div>
    );
  }
);
Tabs.displayName = 'Tabs';

export { Tabs };
