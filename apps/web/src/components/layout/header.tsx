'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Command, Menu, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Navigation } from '@/components/layout/navigation';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { Search as SearchModal } from '@/components/layout/search';
import { CommandPalette } from '@/components/layout/command-palette';
import { useScroll } from '@/hooks/use-scroll';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const { isScrolled } = useScroll();

  useKeyboardShortcut('k', () => setCommandOpen((open) => !open), {
    meta: true,
  });

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center space-x-2"
              aria-label="Sathus Platform home"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                Sathus
              </span>
            </Link>
            <Navigation />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex h-8 gap-1.5 px-2 text-xs"
              onClick={() => setCommandOpen(true)}
            >
              <Command className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex h-8 gap-2 px-3 text-sm"
              asChild
            >
              <Link href="/contact">
                <Mail className="h-4 w-4" />
                Contact
              </Link>
            </Button>
            <Button
              size="sm"
              className="hidden lg:flex h-8 px-4 text-sm"
              asChild
            >
              <Link href="/demo">Request Demo</Link>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
