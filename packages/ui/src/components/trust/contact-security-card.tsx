'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

interface ContactSecurityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  securityEmail?: string;
  responsibleDisclosure?: {
    url?: string;
    description: string;
  };
  bugReporting?: {
    url?: string;
    description: string;
  };
  bugBounty?: {
    active?: boolean;
    description?: string;
  };
}

const ContactSecurityCard = React.forwardRef<HTMLDivElement, ContactSecurityCardProps>(
  ({ className, securityEmail, responsibleDisclosure, bugReporting, bugBounty, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative rounded-xl border border-border bg-card p-8 shadow-sm', className)}
        {...props}
      >
        <h3 className="text-xl font-semibold text-foreground mb-6">Contact Security Team</h3>
        <div className="space-y-6">
          {securityEmail && (
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Security Email</p>
              <a
                href={`mailto:${securityEmail}`}
                className="text-sm text-primary hover:underline"
              >
                {securityEmail}
              </a>
            </div>
          )}
          {responsibleDisclosure && (
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Responsible Disclosure</p>
              <p className="text-sm text-muted-foreground mb-2">{responsibleDisclosure.description}</p>
              {responsibleDisclosure.url && (
                <a
                  href={responsibleDisclosure.url}
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Learn more
                </a>
              )}
            </div>
          )}
          {bugReporting && (
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Bug Reporting</p>
              <p className="text-sm text-muted-foreground mb-2">{bugReporting.description}</p>
              {bugReporting.url && (
                <a
                  href={bugReporting.url}
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Report a bug
                </a>
              )}
            </div>
          )}
          {bugBounty && (
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="sathus-badge bg-warning/10 text-warning text-xs font-medium">
                  {bugBounty.active ? 'Active' : 'Planned'}
                </span>
              </div>
              {bugBounty.description && (
                <p className="text-sm text-muted-foreground">{bugBounty.description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
ContactSecurityCard.displayName = 'ContactSecurityCard';

export { ContactSecurityCard };
