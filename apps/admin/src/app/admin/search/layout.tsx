import { Metadata } from 'next';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: 'Search & Global Index',
  description: 'Manage the global search index and run queries across all Sathus Platform content.',
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
