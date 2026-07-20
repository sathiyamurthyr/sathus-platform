import type { Solution } from '../types';

export const digitalTransformationSolution: Solution = {
  slug: 'digital-transformation',
  title: 'Digital Transformation',
  description: 'Comprehensive digital strategy, process automation, and technology modernization for regulated enterprises.',
  icon: 'RefreshCw',
  hero: {
    title: 'Digital Transformation',
    description: 'Modernize legacy operations, automate document-heavy workflows, and implement AI-first operating models.',
    primaryCta: { text: 'Book Strategy Session', href: '/book-strategy-session' },
    secondaryCta: { text: 'Talk to Engineers', href: '/contact' },
    stats: [
      { value: '80%', valueLabel: 'Manual Task Reduction', label: 'Automation Impact' },
      { value: '3x', valueLabel: 'Operational ROI', label: 'Business Outcomes' },
    ],
  },
  challenges: [
    { id: 'paper-processes', title: 'Paper & Legacy Workflows', description: 'Manual paper approvals and legacy data silos slowing down operations.' },
  ],
  capabilities: [
    { id: 'automation', title: 'Intelligent Process Automation', description: 'Combine AI document processing with workflow orchestration.', icon: 'Zap' },
    { id: 'change-mgmt', title: 'Technical Governance', description: 'Ensure smooth organizational adoption of modern cloud and AI tools.', icon: 'ShieldCheck' },
  ],
  architecture: {
    title: 'Enterprise Digital Platform Architecture',
    description: 'API gateway, event mesh, workflow engine, and unified identity management.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Digital Transformation Platform Architecture Diagram',
  },
  technologies: [
    { id: 'memomes', name: 'Memomes Cloud', category: 'cloud' },
    { id: 'sathus-ai', name: 'Sathus AI', category: 'ai' },
    { id: 'azure', name: 'Azure Cloud', category: 'cloud' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: '3-stage transformation methodology.',
    stages: [
      { name: 'Process Mining', description: 'Identify operational bottlenecks and high-ROI automation targets.' },
      { name: 'Pilot Implementation', description: 'Deliver working MVP within 6 weeks.' },
      { name: 'Enterprise Rollout', description: 'Scale across departments with full compliance.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '80% Automation Impact', description: 'Faster document processing throughput.', metric: '80%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Digital Process Automation',
      client: 'Insurance Global',
      industry: 'Insurance',
      challenge: 'Manual claims processing delays.',
      solution: 'AI document processing pipeline.',
      outcome: '80% reduction in processing time.',
      technologies: ['Sathus AI', 'Memomes Cloud'],
      duration: '4 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'What industries do you transform?', answer: 'We specialize in financial services, healthcare, life sciences, and manufacturing.' },
  ],
};
