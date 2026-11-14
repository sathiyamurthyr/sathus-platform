import { Metadata } from 'next';
import { PageHeader } from '@/components/admin/PageHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { UnifiedInfrastructureDashboard } from '@/components/dashboard/infrastructure/UnifiedInfrastructureDashboard';
import { Button } from '@/components/ui/button';
import { stats, quickActions, recentActivity, services } from '@/config/dashboard-data';

export const metadata: Metadata = {
  title: 'Admin Console Dashboard | Unified Infrastructure & Supabase Telemetry',
  description: 'Enterprise overview of System Health, VPS Telemetry, Docker Containers, Supabase Usage, and Quick Operations.',
  alternates: {
    canonical: '/admin/dashboard',
  },
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 p-4 md:p-6 lg:p-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here is an overview of the Sathus Platform and Live Infrastructure Telemetry."
        actions={
          <Button variant="outline" size="sm">
            Export
          </Button>
        }
      />

      {/* Primary Key Metrics */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      {/* Quick Actions Bar */}
      <section aria-label="Quick actions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.id} action={action} />
          ))}
        </div>
      </section>

      {/* Activity and Platform Status */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DashboardCard
          title="Recent Activity"
          description="Latest changes across the platform"
          className="lg:col-span-2"
          bodyClassName="max-h-80 overflow-y-auto admin-scrollbar"
        >
          <RecentActivity items={recentActivity} />
        </DashboardCard>

        <DashboardCard title="System Status" description="Core platform health">
          <SystemStatus services={services} />
        </DashboardCard>
      </section>

      {/* UNIFIED INFRASTRUCTURE HEALTH & SUPABASE MONITORING SUITE */}
      <section aria-label="Unified infrastructure and supabase monitoring">
        <UnifiedInfrastructureDashboard />
      </section>
    </div>
  );
}
