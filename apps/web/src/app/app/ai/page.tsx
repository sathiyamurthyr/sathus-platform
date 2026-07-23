import { Metadata } from 'next';
import { AIFoundationView } from '@/features/ai/components/AIFoundationView';

export const metadata: Metadata = {
  title: 'AI Platform Console',
  description: 'Manage foundation model access, fine-tuning configurations, prompt registries, and agentic workflows.',
  alternates: {
    canonical: '/app/ai',
  },
};

export default function AppAIPage() {
  return <AIFoundationView />;
}
