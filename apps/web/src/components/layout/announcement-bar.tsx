'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'sathus-announcement-dismissed';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-10 items-center justify-center px-4 text-sm">
        <p>
          🚀 Introducing Sathus Platform 2.0 —{' '}
          <a
            href="#pricing"
            className="font-medium underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground rounded"
          >
            Explore new features
          </a>
        </p>
        <button
          onClick={dismiss}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
