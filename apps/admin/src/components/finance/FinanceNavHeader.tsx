'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Server,
  Receipt,
  ShoppingCart,
  Users,
  Building,
  Briefcase,
  CreditCard,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FinanceTab {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const FINANCE_TABS: FinanceTab[] = [
  { label: 'Overview', href: '/admin/finance', icon: LayoutDashboard },
  { label: 'Server Subscriptions', href: '/admin/finance/subscriptions', icon: Server },
  { label: 'Sales Invoices', href: '/admin/finance/invoices', icon: Receipt },
  { label: 'Vendor Purchases', href: '/admin/finance/purchases', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/finance/customers', icon: Users },
  { label: 'Vendors', href: '/admin/finance/vendors', icon: Building },
  { label: 'Services Catalogue', href: '/admin/finance/services', icon: Briefcase },
  { label: 'Payments', href: '/admin/finance/payments', icon: CreditCard },
  { label: 'GST Reports', href: '/admin/finance/reports', icon: FileSpreadsheet },
  { label: 'Settings', href: '/admin/finance/settings', icon: Settings },
];

export function FinanceNavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const nav = navRef.current;
    if (!nav) return;

    window.addEventListener('resize', checkScroll);
    nav.addEventListener('scroll', checkScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', checkScroll);
      nav.removeEventListener('scroll', checkScroll);
    };
  }, []);

  // Auto-scroll active tab into view when route changes
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
      // Re-check scroll buttons after smooth scroll completes
      const timeout = setTimeout(checkScroll, 300);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  const handleScrollLeft = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (navRef.current) {
      navRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (navRef.current && e.deltaY !== 0) {
      navRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  const currentTab =
    FINANCE_TABS.find((t) =>
      t.href === '/admin/finance'
        ? pathname === '/admin/finance'
        : pathname.startsWith(t.href)
    ) || FINANCE_TABS[0];

  return (
    <div className="no-print w-full bg-white border-b border-neutral-200 mb-6 shadow-sm -mt-2 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 pt-4 pb-2">
      {/* Brand Header & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#A20A3A] text-white shadow-sm font-bold text-sm">
            ₹
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
              Finance, GST & Server Billing
            </h1>
            <p className="text-xs text-neutral-500">
              Sathus Technology Pvt Ltd · Application Server (₹5,500/mo) & Database Server (₹3,000/mo) Hosting Billing
            </p>
          </div>
        </div>

        {/* Mobile / Tablet Quick Navigation Selector (< md) */}
        <div className="md:hidden flex items-center gap-2 bg-[#FAF8F9] p-1.5 rounded-lg border border-neutral-200">
          <Layers className="h-4 w-4 text-[#A20A3A] shrink-0 ml-1" />
          <span className="text-xs font-semibold text-neutral-700 shrink-0">Section:</span>
          <select
            value={currentTab.href}
            onChange={(e) => router.push(e.target.value)}
            className="w-full text-xs font-semibold text-neutral-900 bg-white border border-neutral-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-[#A20A3A]"
          >
            {FINANCE_TABS.map((tab) => (
              <option key={tab.href} value={tab.href}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Nav Bar with Visible Scroll Controls */}
      <div className="relative flex items-center pt-2">
        {/* Left Scroll Control */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={handleScrollLeft}
            aria-label="Scroll left"
            className="absolute left-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-neutral-700 hover:text-[#A20A3A] hover:border-[#A20A3A] transition-all -ml-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Left Edge Gradient Fade */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
        )}

        {/* Scrollable Navigation Track */}
        <div
          ref={navRef}
          onWheel={handleWheel}
          className="flex space-x-1.5 overflow-x-auto py-1 scroll-smooth no-scrollbar w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="navigation"
          aria-label="Finance navigation"
        >
          {FINANCE_TABS.map((tab) => {
            const isActive =
              tab.href === '/admin/finance'
                ? pathname === '/admin/finance'
                : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                ref={isActive ? activeTabRef : undefined}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-all shrink-0',
                  isActive
                    ? 'bg-[#A20A3A] text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-[#FAF8F9]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-white' : 'text-neutral-500')} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Edge Gradient Fade */}
        {canScrollRight && (
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
        )}

        {/* Right Scroll Control */}
        {canScrollRight && (
          <button
            type="button"
            onClick={handleScrollRight}
            aria-label="Scroll right"
            className="absolute right-0 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-neutral-200 text-neutral-700 hover:text-[#A20A3A] hover:border-[#A20A3A] transition-all -mr-2"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
