'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FINANCE_TABS = [
  { label: 'Overview', href: '/admin/finance', icon: LayoutDashboard },
  { label: 'Server Subscriptions', href: '/admin/finance/subscriptions', icon: Server },
  { label: 'Sales Invoices', href: '/admin/finance/invoices', icon: Receipt },
  { label: 'Vendor Purchases', href: '/admin/finance/purchases', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/finance/customers', icon: Users },
  { label: 'Vendors', href: '/admin/finance/vendors', icon: Building },
  { label: 'Services Catalogue', href: '/admin/finance/services', icon: Briefcase },
  { label: 'Payments', href: '/admin/finance/payments', icon: CreditCard },
  { label: 'GST Reports', href: '/admin/finance/reports', icon: FileSpreadsheet },
  { label: 'Settings & Profile', href: '/admin/finance/settings', icon: Settings },
];

export function FinanceNavHeader() {
  const pathname = usePathname();

  return (
    <div className="no-print border-b border-border bg-card/60 backdrop-blur-sm -mt-2 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 mb-6">
      <div className="flex items-center justify-between py-3 border-b border-border/50">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#A20A3A] text-xs font-bold text-white shadow-sm">
              ₹
            </span>
            Finance, GST & Server Billing
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sathus Technology Pvt Ltd · Application Server (₹5,500/mo) & Database Server (₹3,000/mo) Hosting Billing
          </p>
        </div>
      </div>

      <nav className="flex space-x-1 overflow-x-auto py-2 admin-scrollbar">
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
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-[#A20A3A] text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
