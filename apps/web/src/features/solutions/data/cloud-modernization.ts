import type { Solution } from '../types';

export const cloudModernizationSolution: Solution = {
  slug: 'cloud-modernization',
  title: 'Cloud Modernization',
  description: 'Re-platform legacy applications to cloud-native architectures on Azure and AWS with zero-downtime migration paths.',
  icon: 'Cloud',
  hero: {
    title: 'Cloud Modernization',
    description: 'Re-architect monolithic applications into containerized, cloud-native microservices on Azure and AWS with zero business disruption.',
    primaryCta: { text: 'Schedule Architecture Review', href: '/book-strategy-session' },
    secondaryCta: { text: 'View Case Studies', href: '/case-studies' },
    stats: [
      { value: '0', valueLabel: 'Downtime', label: 'Zero-Downtime Migration' },
      { value: '45%', valueLabel: 'Cloud Cost Savings', label: 'FinOps Optimization' },
      { value: '5x', valueLabel: 'Deployment Frequency', label: 'CI/CD Speed' },
    ],
  },
  challenges: [
    { id: 'legacy-debt', title: 'Monolithic Technical Debt', description: 'Tightly coupled legacy systems prevent rapid feature releases and scale.' },
    { id: 'cloud-costs', title: 'Uncontrolled Cloud Spend', description: 'Lift-and-shift deployments result in bloated cloud infrastructure bills.' },
  ],
  capabilities: [
    { id: 'containerization', title: 'Kubernetes & Serverless', description: 'Orchestrate scalable microservices using Kubernetes (AKS/EKS) and serverless functions.', icon: 'Container' },
    { id: 'finops', title: 'Cloud FinOps & Governance', description: 'Implement automated cost controls and zero-trust security postures.', icon: 'Zap' },
  ],
  architecture: {
    title: 'Zero-Downtime Cloud Migration Architecture',
    description: 'Strangler fig pattern migration, dual-write database replication, and blue-green traffic routing.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Cloud Modernization Reference Architecture Diagram',
  },
  technologies: [
    { id: 'azure', name: 'Microsoft Azure', category: 'cloud' },
    { id: 'aws', name: 'Amazon Web Services', category: 'cloud' },
    { id: 'k8s', name: 'Kubernetes', category: 'devops' },
    { id: 'tf', name: 'Terraform', category: 'devops' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Cloud transformation lifecycle.',
    stages: [
      { name: 'Cloud Assessment', description: 'Evaluate application dependency graph and readiness.' },
      { name: 'Landing Zone Setup', description: 'Provision enterprise security, IAM, and networking.' },
      { name: 'Incremental Migration', description: 'Execute strangler fig migration with zero downtime.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '99.99% Availability', description: 'SLA availability achieved across cloud workloads.', metric: '99.99%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Core Banking Cloud Modernization',
      client: 'MetroBank Corp',
      industry: 'Financial Services',
      challenge: 'Mainframe transaction processing bottlenecks.',
      solution: 'Cloud-native microservices architecture on Azure.',
      outcome: '12M+ active accounts migrated with zero downtime.',
      technologies: ['.NET 9', 'Azure', 'Kubernetes'],
      duration: '12 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'How do you guarantee zero downtime during migration?', answer: 'We use strangler pattern architecture combined with dual-write database replication and blue-green routing.' },
  ],
};
