import { Metadata } from 'next';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: 'Navigation & Site Builder',
  description: 'Manage navigation trees, menus, and site structure across all Sathus platforms.',
};

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
