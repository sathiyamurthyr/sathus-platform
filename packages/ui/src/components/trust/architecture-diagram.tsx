'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

interface ArchitectureLayer {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ArchitectureDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  layers: ArchitectureLayer[];
  title?: string;
  description?: string;
}

const ArchitectureDiagram = React.forwardRef<HTMLDivElement, ArchitectureDiagramProps>(
  ({ className, layers, title, description, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {title && (
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
        )}
        <div className="relative space-y-3">
          {layers.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <div className="relative flex items-center gap-4">
                {layer.icon && (
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {layer.icon}
                  </div>
                )}
                <div
                  className={cn(
                    'flex-1 rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-primary/20',
                    index === layers.length - 1 && 'ring-2 ring-primary/10'
                  )}
                >
                  <h4 className="text-sm font-semibold text-foreground mb-1">{layer.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{layer.description}</p>
                </div>
              </div>
              {index < layers.length - 1 && (
                <div className="ml-5 flex justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-muted-foreground"
                  >
                    <path
                      d="M8 12V4M8 4L4 8M8 4L12 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);
ArchitectureDiagram.displayName = 'ArchitectureDiagram';

export { ArchitectureDiagram };
