'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useMegaMenu } from './useMegaMenu';
import { MenuItem } from './MenuItem';
import { MegaMenu } from './MegaMenu';
import { navItems, megaMenuSections } from '@/constants';

export function Navbar() {
  const pathname = usePathname();
  const navRef = React.useRef<HTMLElement>(null);
  const triggerRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

  const {
    state,
    activeItem,
    handleMouseEnterTrigger,
    handleMouseLeaveTrigger,
    handleMouseEnterMenu,
    handleMouseLeaveMenu,
    handleOutsideClick,
    handleEscape,
    handleNavigation,
  } = useMegaMenu(250);

  // Close dropdown on navigation change
  React.useEffect(() => {
    handleNavigation();
  }, [pathname, handleNavigation]);

  // Click outside detection
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        (state === 'OPEN' || state === 'CLOSING') &&
        navRef.current &&
        !navRef.current.contains(e.target as Node)
      ) {
        handleOutsideClick();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeMouseDownListener?.('mousedown', handleDocumentClick);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [state, handleOutsideClick]);

  // Keyboard navigation helpers
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
      const itemsCount = navItems.length;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIdx = (index + 1) % itemsCount;
        triggerRefs.current[nextIdx]?.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIdx = (index - 1 + itemsCount) % itemsCount;
        triggerRefs.current[prevIdx]?.focus();
      } else if (e.key === 'ArrowDown' && navItems[index].hasMega) {
        e.preventDefault();
        handleMouseEnterTrigger(navItems[index].label);
        // Wait a tiny frame for render, then focus first element in mega menu
        setTimeout(() => {
          const menuId = `mega-menu-${navItems[index].label}`;
          const menuEl = document.getElementById(menuId);
          const firstFocusable = menuEl?.querySelector<HTMLElement>(
            'a, button, [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }, 50);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleEscape();
      }
    },
    [handleMouseEnterTrigger, handleEscape]
  );

  return (
    <nav
      ref={navRef}
      className="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-4 2xl:gap-6 relative"
      aria-label="Main"
    >
      {navItems.map((item, index) => {
        const isCurrentRoute =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));

        const isOpen = activeItem === item.label && (state === 'OPEN' || state === 'CLOSING');
        const controlsId = `mega-menu-${item.label}`;

        return (
          <MenuItem
            key={item.label}
            triggerRef={(el) => {
              triggerRefs.current[index] = el;
            }}
            label={item.label}
            href={item.href}
            hasMega={item.hasMega}
            isCurrentRoute={isCurrentRoute}
            isOpen={isOpen}
            isHovered={false}
            isFocused={false}
            onMouseEnter={() => item.hasMega && handleMouseEnterTrigger(item.label)}
            onMouseLeave={() => item.hasMega && handleMouseLeaveTrigger()}
            onFocus={() => item.hasMega && handleMouseEnterTrigger(item.label)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            controlsId={controlsId}
          />
        );
      })}

      {navItems.map((item) => {
        if (!item.hasMega) return null;
        const isOpen = activeItem === item.label && (state === 'OPEN' || state === 'CLOSING');
        const controlsId = `mega-menu-${item.label}`;

        return (
          <MegaMenu
            key={item.label}
            id={controlsId}
            sections={megaMenuSections[item.label] || []}
            isOpen={isOpen}
            onClose={handleEscape}
            onMouseEnter={handleMouseEnterMenu}
            onMouseLeave={handleMouseLeaveMenu}
          />
        );
      })}
    </nav>
  );
}
