import type { Industry } from '../types';

export const fintechIndustry: Industry = {
  slug: 'fintech',
  name: 'FinTech',
  description:
    'Engineering platforms for digital banking, payments, and financial services with security, compliance, and scale.',
  hero: {
    title: 'FinTech',
    description:
      'Engineering platforms for digital banking, payments, and financial services with security, compliance, and scale.',
    primaryCta: {
      text: 'Talk to an Expert',
      href: '/contact',
    },
    secondaryCta: {
      text: 'View Case Studies',
      href: '#case-studies',
    },
  },
  overview: {
    title: 'Industry Overview',
    description:
      'FinTech organizations face unique challenges: real-time processing, fraud detection, regulatory compliance, and customer experience. Our solutions help institutions build secure, scalable platforms.',
  },
  challenges: [
    {
      id: 'real-time-processing',
      title: 'Real-time Processing',
      description:
        'Low-latency transaction processing with high availability and fault tolerance.',
    },
    {
      id: 'fraud-detection',
      title: 'Fraud Detection',
      description:
        'Sophisticated fraud patterns require real-time detection and prevention capabilities.',
    },
    {
      id: 'regulatory-compliance',
      title: 'Regulatory Compliance',
      description:
        'Meeting PCI DSS, SOX, and financial regulations while maintaining agility.',
    },
  ],
  solutions: [
    {
      id: 'ai-engineering',
      title: 'AI Engineering',
      description:
        'Production-grade agentic systems for fraud detection and risk assessment.',
      href: '/solutions/ai-engineering',
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      description:
        'Governed lakehouses and streaming pipelines for real-time analytics.',
      href: '/solutions/data-engineering',
    },
    {
      id: 'cloud-modernization',
      title: 'Cloud Modernization',
      description:
        'Re-platform to cloud-native architectures with zero-downtime migration paths.',
      href: '/solutions/cloud-modernization',
    },
  ],
  architecture: {
    title: 'Reference Architecture',
    description:
      'Our FinTech reference architecture provides a secure, compliant foundation for digital platforms.',
    imageUrl: '/images/industries/fintech/architecture.png',
    imageAlt: 'FinTech reference architecture diagram',
  },
  technologies: [
    { id: 'dotnet', name: '.NET', category: 'framework' },
    { id: 'python', name: 'Python', category: 'framework' },
    { id: 'databricks', name: 'Databricks', category: 'data' },
    { id: 'azure', name: 'Azure', category: 'cloud' },
    { id: 'aws', name: 'AWS', category: 'cloud' },
    { id: 'kafka', name: 'Kafka', category: 'data' },
  ],
  outcomes: [
    {
      id: 'cost-reduction',
      title: 'Reduced Costs',
      description:
        'Lower infrastructure and operational costs through cloud-native architectures.',
      metric: '40% average cost reduction',
    },
    {
      id: 'faster-processing',
      title: 'Faster Processing',
      description:
        'Real-time data processing and analytics for faster decision-making.',
      metric: '10x performance improvement',
    },
    {
      id: 'improved-compliance',
      title: 'Improved Compliance',
      description:
        'Built-in compliance controls and audit trails for regulatory requirements.',
      metric: '100% audit compliance',
    },
  ],
  caseStudies: [
    {
      id: 'fintech-core-banking',
      title: 'Core Banking Modernization',
      slug: 'core-banking-modernization',
      industry: 'FinTech',
    },
  ],
  faqs: [
    {
      id: 'compliance',
      question: 'How do you ensure compliance in FinTech solutions?',
      answer:
        'We embed compliance controls into the development lifecycle, including audit trails, data governance, and policy enforcement.',
    },
    {
      id: 'security',
      question: 'What security measures do you implement for financial data?',
      answer:
        'We implement defense-in-depth security including encryption, zero-trust architecture, and continuous monitoring.',
    },
  ],
};