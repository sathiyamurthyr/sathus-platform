import { Metadata } from 'next';
import { WorkspaceLayout } from '@/features/workspace/components/WorkspaceLayout';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: {
    default: 'Workspace Dashboard | Sathus Platform',
    template: '%s | Sathus Workspace',
  },
  description: 'Enterprise authenticated workspace platform for Sathus Technology.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/workspace',
  },
  openGraph: {
    title: 'Enterprise Workspace — Sathus Technology',
    description: 'Enterprise workspace application shell for Project Odyssey.',
    url: `${siteConfig.url}/workspace`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
