'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { mainNavigation } from '../../config/navigation.config';
import { Button } from '@/components/ui/button';

export function NavigationBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Sathus
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {mainNavigation.map((item) => (
            <div key={item.id} className="relative group">
              <Link
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="absolute top-full left-0 hidden group-hover:block pt-2">
                  <div className="w-64 rounded-md border border-border bg-background p-4 shadow-lg">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        className="block text-sm py-2 hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto py-4">
            {mainNavigation.map((item) => (
              <div key={item.id} className="py-2">
                <Link href={item.href} className="text-sm font-medium">
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link key={child.id} href={child.href} className="block text-sm text-muted-foreground">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}