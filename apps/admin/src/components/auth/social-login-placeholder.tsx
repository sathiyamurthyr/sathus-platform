'use client';

import * as React from 'react';
import { Globe, Monitor, GitBranch } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialLoginPlaceholderProps {
  className?: string;
  providers?: { name: string; icon: React.ComponentType<{ className?: string }> }[];
}

const SocialLoginPlaceholder = ({
  className,
  providers = [
    { name: 'Google', icon: Globe },
    { name: 'Microsoft', icon: Monitor },
    { name: 'GitHub', icon: GitBranch },
  ],
}: SocialLoginPlaceholderProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <Button
              key={provider.name}
              variant="outline"
              className="w-full"
              disabled
              aria-disabled="true"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{provider.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export { SocialLoginPlaceholder, type SocialLoginPlaceholderProps };
