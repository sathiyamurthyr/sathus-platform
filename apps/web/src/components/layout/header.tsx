'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Command, Menu, Bell, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileDrawer } from '@/components/navigation/MobileDrawer';
import { navItems, megaMenuSections } from '@/constants';
import { SearchDialog } from '@/components/layout/search';
import { CommandPalette } from '@/components/layout/command-palette';
import { Notifications } from '@/components/layout/notifications';
import { ProfileMenu } from '@/components/layout/profile-menu';
import { useScroll } from '@/hooks/use-scroll';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = () => {
      const authenticated = document.cookie.split(';').some((c) => c.trim().startsWith('access_token='));
      setIsAuthenticated(authenticated);
    };
    checkAuth();
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  const { isScrolled } = useScroll();

  useKeyboardShortcut('k', () => setCommandOpen((open) => !open), {
    meta: true,
  });

  useKeyboardShortcut('k', () => setCommandOpen((open) => !open), {
    ctrl: true,
  });

  const handleSearchClick = () => {
    setSearchOpen(true);
    setCommandOpen(false);
  };

  const handleCommandClick = () => {
    setCommandOpen(true);
    setSearchOpen(false);
  };

  return (
    <>
      <motion.header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-background border-b shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <motion.div
              animate={{
                scale: isScrolled ? 0.9 : 1,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Logo size="md" showWordmark={true} href="/" className="flex items-center" />
            </motion.div>
            <Navbar />
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-muted-foreground hover:text-foreground"
              onClick={handleSearchClick}
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'hidden md:flex h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground',
                isScrolled ? 'border border-border/50' : ''
              )}
              onClick={handleCommandClick}
            >
              <Command className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-md border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            <div className="hidden lg:block h-4 w-px bg-border mx-1" aria-hidden="true" />

            <Button
              size="sm"
              className={cn(
                'hidden lg:inline-flex h-8 gap-1.5 px-4 text-sm font-medium',
                'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow transition-all duration-200'
              )}
              asChild
            >
              <Link href="/book-strategy-session">
                Request Consultation
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>

            {isAuthenticated && (
              <>
                <div className="hidden lg:block h-4 w-px bg-border mx-1" aria-hidden="true" />

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'text-muted-foreground hover:text-foreground relative',
                      notificationsOpen && 'text-foreground bg-muted/50'
                    )}
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileOpen(false);
                    }}
                    aria-label="Open notifications"
                    aria-expanded={notificationsOpen}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" aria-label="Unread notifications" />
                  </Button>
                  <Notifications
                    open={notificationsOpen}
                    onClose={() => setNotificationsOpen(false)}
                  />
                </div>

                <ThemeToggle />

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'hidden sm:flex text-muted-foreground hover:text-foreground',
                      profileOpen && 'text-foreground bg-muted/50'
                    )}
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                      setNotificationsOpen(false);
                    }}
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-primary-foreground text-[10px] font-semibold">
                      JD
                    </div>
                  </Button>
                  <ProfileMenu
                    open={profileOpen}
                    onClose={() => setProfileOpen(false)}
                  />
                </div>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.header>
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        megaMenuSections={megaMenuSections}
        onSearchClick={handleSearchClick}
      />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}