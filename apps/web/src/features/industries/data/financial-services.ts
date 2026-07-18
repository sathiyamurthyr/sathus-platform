import type { Industry } from '../types';

export const financialServicesIndustry: Industry = {
  slug: 'financial-services',
  name: 'Financial Services',
  description:
    'Enterprise-grade solutions for banks, insurance companies, and financial institutions navigating digital transformation while maintaining regulatory compliance.',
  hero: {
    title: 'Financial Services',
    description:
      'Enterprise-grade solutions for banks, insurance companies, and financial institutions navigating digital transformation while maintaining regulatory compliance.',
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
      'Financial services organizations face unique challenges: legacy systems, evolving regulations, fraud detection, and the need for real-time processing. Our solutions help institutions modernize while maintaining security and compliance.',
  },
  challenges: [
    {
      id: 'legacy-systems',
      title: 'Legacy Systems',
      description:
        'Outdated core banking systems that are expensive to maintain and difficult to integrate with modern technologies.',
    },
    {
      id: 'regulatory-compliance',
      title: 'Regulatory Compliance',
      description:
        'Evolving regulations like GDPR, SOX, and industry-specific requirements demand robust compliance frameworks.',
    },
    {
      id: 'fraud-detection',
      title: 'Fraud Detection',
      description:
        'Sophisticated fraud patterns require real-time detection and prevention capabilities.',
    },
    {
      id: 'customer-experience',
      title: 'Customer Experience',
      description:
        'Customers expect seamless digital experiences with personalized services and real-time insights.',
    },
    {
      id: 'operational-efficiency',
      title: 'Operational Efficiency',
      description:
        'Manual processes and siloed data lead to inefficiencies and increased operational costs.',
    },
    {
      id: 'data-silos',
      title: 'Data Silos',
      description:
        'Fragmented data across systems prevents holistic risk assessment and customer understanding.',
    },
    {
      id: 'security',
      title: 'Security',
      description:
        'Cyber threats and data breaches require comprehensive security across all layers of the architecture.',
    },
  ],
  solutions: [
    {
      id: 'ai-engineering',
      title: 'AI Engineering',
      description:
        'Production-grade agentic systems for fraud detection, risk assessment, and customer service automation.',
      href: '/solutions/ai-engineering',
    },
    {
      id: 'data-engineering',
      title: 'Data Engineering',
      description:
        'Governed lakehouses and streaming pipelines for real-time analytics and regulatory reporting.',
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
      'Our financial services reference architecture provides a secure, compliant foundation for digital transformation.',
    imageUrl: '/images/industries/financial-services/architecture.png',
    imageAlt: 'Financial services reference architecture diagram',
  },
  technologies: [
    { id: 'dotnet', name: '.NET', category: 'framework' },
    { id: 'python', name: 'Python', category: 'framework' },
    { id: 'databricks', name: 'Databricks', category: 'data' },
    { id: 'azure', name: 'Azure', category: 'cloud' },
    { id: 'aws', name: 'AWS', category: 'cloud' },
    { id: 'kafka', name: 'Kafka', category: 'data' },
    { id: 'spark', name: 'Spark', category: 'data' },
    { id: 'react', name: 'React', category: 'framework' },
    { id: 'postgresql', name: 'PostgreSQL', category: 'database' },
    { id: 'docker', name: 'Docker', category: 'devops' },
    { id: 'kubernetes', name: 'Kubernetes', category: 'devops' },
  ],
  outcomes: [
    {
      id: 'cost-reduction',
      title: 'Reduced Costs',
      description:
        'Lower infrastructure and operational costs through cloud-native architectures and automation.',
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
    {
      id: 'better-customer-experience',
      title: 'Better Customer Experience',
      description:
        'Personalized services and real-time insights for improved customer satisfaction.',
      metric: '60% improvement in NPS',
    },
    {
      id: 'higher-productivity',
      title: 'Higher Productivity',
      description:
        'Automated workflows and streamlined processes for operational efficiency.',
      metric: '50% reduction in manual work',
    },
  ],
  caseStudies: [
    {
      id: 'financial-services-risk',
      title: 'AI-Powered Risk Assessment',
      slug: 'financial-services-risk-assessment',
      industry: 'Financial Services',
    },
  ],
  faqs: [
    {
      id: 'compliance',
      question: 'How do you ensure compliance in financial services solutions?',
      answer:
        'We embed compliance controls into the development lifecycle, including audit trails, data governance, and policy enforcement. Our reference architectures are designed to meet ISO 27001, SOC 2, and financial industry-specific requirements.',
    },
    {
      id: 'security',
      question: 'What security measures do you implement for financial data?',
      answer:
        'We implement defense-in-depth security including encryption at rest and in transit, zero-trust architecture, continuous monitoring, and compliance-by-design for regulated environments.',
    },
    {
      id: 'migration',
      question: 'How do you handle legacy system migration?',
      answer:
        'Our zero-downtime migration approach includes parallel run capabilities, data validation, and rollback strategies to ensure business continuity during transformation.',
    },
  ],
};