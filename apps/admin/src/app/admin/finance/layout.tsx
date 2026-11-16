import { Metadata } from 'next';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: {
    default: 'Finance & Server Billing',
    template: '%s · Finance · Sathus Admin',
  },
  description: 'Enterprise Finance, GST Compliance & Server Billing Management for Sathus Technology.',
};

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
