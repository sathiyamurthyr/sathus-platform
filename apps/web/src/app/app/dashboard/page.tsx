import { Metadata } from 'next';
import { DashboardWidgets } from '@/features/workspace/components/DashboardWidgets';

export const metadata: Metadata = {
  title: 'Workspace Dashboard',
  description: 'Enterprise workspace analytics, active workflows, integration monitoring, and user dashboards.',
  alternates: {
    canonical: '/app/dashboard',
  },
};

export default function AppDashboardPage() {
  return <DashboardWidgets />;
}
