import * as React from 'react';
import { cn } from '../../lib/cn';

interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: 'default' | 'narrow' | 'wide';
}

const sidebarWidthClasses = {
  narrow: 'w-56',
  default: 'w-64',
  wide: 'w-72',
};

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ className, sidebar, header, children, sidebarWidth = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex min-h-screen w-full', className)}
        {...props}
      >
        {sidebar && (
          <aside
            className={cn(
              'hidden md:flex flex-col border-r bg-card h-screen sticky top-0',
              sidebarWidthClasses[sidebarWidth]
            )}
          >
            {sidebar}
          </aside>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          {header && (
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              {header}
            </header>
          )}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }
);
DashboardLayout.displayName = 'DashboardLayout';

export { DashboardLayout };
