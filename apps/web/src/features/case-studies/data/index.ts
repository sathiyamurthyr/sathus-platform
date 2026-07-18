import type { CaseStudy } from '../types';

export const caseStudies: CaseStudy[] = [
  {
    id: 'financial-services-risk',
    slug: 'financial-services-risk-assessment',
    title: 'AI-Powered Risk Assessment',
    industry: 'Financial Services',
    challenge:
      'Manual risk assessment processes were slow, inconsistent, and unable to scale with regulatory changes. Analysts spent 40+ hours per week on repetitive data gathering and analysis.',
    solution:
      'Implemented an agentic AI system with RAG architecture for real-time risk analysis, integrated with existing compliance workflows. The system automates data gathering, performs multi-dimensional risk scoring, and generates audit-ready reports.',
    architecture: {
      title: 'Reference Architecture',
      description:
        'Event-driven architecture with real-time data ingestion, vector database for knowledge retrieval, and LLM orchestration layer.',
      imageUrl: '/images/case-studies/financial-services/architecture.png',
      imageAlt: 'Financial services risk assessment architecture diagram',
    },
    technologies: [
      { id: 'llm', name: 'LLM Integration', category: 'ai' },
      { id: 'rag', name: 'RAG Architecture', category: 'ai' },
      { id: 'mlops', name: 'MLOps', category: 'devops' },
      { id: 'vector', name: 'Vector Databases', category: 'database' },
      { id: 'langchain', name: 'LangChain', category: 'framework' },
    ],
    metrics: [
      { id: 'speed', value: '75%', label: 'Faster Processing', description: 'Time reduction in risk assessment' },
      { id: 'accuracy', value: '99.9%', label: 'Accuracy', description: 'Model prediction accuracy' },
      { id: 'compliance', value: '100%', label: 'Audit Compliance', description: 'Regulatory compliance maintained' },
    ],
    timeline: {
      duration: '6 months',
      phases: [
        { name: 'Discovery', description: 'Analyzed current risk workflows and compliance requirements' },
        { name: 'Architecture', description: 'Designed event-driven system with RAG capabilities' },
        { name: 'Build', description: 'Developed LLM orchestration and data pipelines' },
        { name: 'Deploy', description: 'Zero-downtime rollout with monitoring' },
        { name: 'Optimize', description: 'Continuous improvement based on feedback' },
      ],
    },
    outcomes: [
      {
        id: 'efficiency',
        title: 'Operational Efficiency',
        description: 'Reduced manual work by 75% while improving accuracy',
      },
      {
        id: 'governance',
        title: 'Enterprise Governance',
        description: 'Full audit trail and compliance reporting',
      },
      {
        id: 'scalability',
        title: 'Scalable Platform',
        description: 'Handles 10x transaction volume with same resources',
      },
    ],
    testimonial: {
      quote:
        'The AI risk assessment system transformed our operations. We now process assessments in minutes instead of days, with better accuracy and full compliance.',
      author: 'Sarah Chen',
      title: 'Chief Risk Officer',
      company: 'Global Financial Services Firm',
    },
    relatedSolutions: ['ai-engineering', 'data-engineering'],
    seo: {
      title: 'AI-Powered Risk Assessment for Financial Services',
      description:
        'How we helped a global financial services firm reduce risk assessment time by 75% with AI-powered automation.',
      canonical: '/case-studies/financial-services-risk-assessment',
    },
    featured: true,
    publishedAt: '2024-01-15',
  },
  {
    id: 'healthcare-decision-support',
    slug: 'healthcare-clinical-decision-support',
    title: 'Clinical Decision Support',
    industry: 'Healthcare',
    challenge:
      'Clinicians needed real-time access to patient data insights while maintaining HIPAA compliance. Existing systems were fragmented and slow.',
    solution:
      'Built a secure, on-premise AI system with human-in-the-loop controls and comprehensive observability. The system integrates with EHR systems and provides real-time diagnostic assistance.',
    architecture: {
      title: 'Reference Architecture',
      description:
        'HIPAA-compliant on-premise deployment with encrypted data flow and human oversight controls.',
      imageUrl: '/images/case-studies/healthcare/architecture.png',
      imageAlt: 'Healthcare clinical decision support architecture diagram',
    },
    technologies: [
      { id: 'llm', name: 'LLM Integration', category: 'ai' },
      { id: 'human-in-loop', name: 'Human-in-the-Loop', category: 'other' },
      { id: 'observability', name: 'AI Observability', category: 'other' },
    ],
    metrics: [
      { id: 'accuracy', value: '30%', label: 'Improved Accuracy', description: 'Diagnostic accuracy improvement' },
      { id: 'time', value: '50%', label: 'Time Saved', description: 'Documentation time reduction' },
      { id: 'compliance', value: '100%', label: 'HIPAA Compliant', description: 'Full regulatory compliance' },
    ],
    timeline: {
      duration: '4 months',
      phases: [
        { name: 'Discovery', description: 'Analyzed clinical workflows and compliance needs' },
        { name: 'Architecture', description: 'Designed HIPAA-compliant on-premise system' },
        { name: 'Build', description: 'Developed secure AI models with oversight' },
        { name: 'Deploy', description: 'Integrated with EHR systems' },
      ],
    },
    outcomes: [
      {
        id: 'patient-care',
        title: 'Enhanced Patient Care',
        description: 'Improved diagnostic accuracy and reduced documentation burden',
      },
      {
        id: 'compliance',
        title: 'Regulatory Compliance',
        description: 'Full HIPAA compliance with audit trails',
      },
    ],
    testimonial: {
      quote:
        'The clinical decision support system has been transformative for our healthcare network. We are seeing better patient outcomes and our clinicians are more efficient.',
      author: 'Dr. Michael Rodriguez',
      title: 'Chief Medical Officer',
      company: 'Regional Healthcare Network',
    },
    relatedSolutions: ['ai-engineering'],
    seo: {
      title: 'Clinical Decision Support for Healthcare',
      description:
        'How we helped a healthcare network improve diagnostic accuracy by 30% with AI-powered clinical decision support.',
      canonical: '/case-studies/healthcare-clinical-decision-support',
    },
    featured: true,
    publishedAt: '2024-03-20',
  },
  {
    id: 'retail-data-platform',
    slug: 'retail-data-lakehouse',
    title: 'Enterprise Data Lakehouse',
    industry: 'Retail',
    challenge:
      'Customer data was siloed across 15+ systems with no unified view. Marketing campaigns were based on stale data and poor segmentation.',
    solution:
      'Built a governed lakehouse with real-time streaming pipelines and unified customer profiles. The platform provides a single source of truth for all customer data.',
    architecture: {
      title: 'Reference Architecture',
      description:
        'Cloud-native lakehouse with streaming ingestion and real-time analytics capabilities.',
      imageUrl: '/images/case-studies/retail/architecture.png',
      imageAlt: 'Retail data lakehouse architecture diagram',
    },
    technologies: [
      { id: 'lakehouse', name: 'Lakehouse', category: 'data' },
      { id: 'streaming', name: 'Streaming', category: 'data' },
      { id: 'data-quality', name: 'Data Quality', category: 'other' },
      { id: 'lineage', name: 'Lineage', category: 'other' },
    ],
    metrics: [
      { id: 'unification', value: '15+', label: 'Systems Unified', description: 'Data sources consolidated' },
      { id: 'latency', value: '60%', label: 'Reduced Latency', description: 'Real-time data access' },
      { id: 'roi', value: '40%', label: 'Cost Reduction', description: 'Infrastructure cost savings' },
    ],
    timeline: {
      duration: '8 months',
      phases: [
        { name: 'Discovery', description: 'Mapped data sources and quality requirements' },
        { name: 'Architecture', description: 'Designed lakehouse with streaming pipelines' },
        { name: 'Build', description: 'Implemented data ingestion and transformation' },
        { name: 'Deploy', description: 'Migrated data with zero downtime' },
        { name: 'Optimize', description: 'Performance tuning and governance' },
      ],
    },
    outcomes: [
      {
        id: 'insights',
        title: 'Real-time Insights',
        description: 'Unified customer view with sub-second query performance',
      },
      {
        id: 'efficiency',
        title: 'Operational Efficiency',
        description: '40% reduction in data infrastructure costs',
      },
    ],
    relatedSolutions: ['data-engineering', 'cloud-modernization'],
    seo: {
      title: 'Enterprise Data Lakehouse for Retail',
      description:
        'How we helped a retail company unify 15+ data systems into a real-time lakehouse platform.',
      canonical: '/case-studies/retail-data-lakehouse',
    },
    featured: false,
    publishedAt: '2024-02-10',
  },
];

// Get unique industries for filters
export const getIndustries = (): string[] => {
  return Array.from(new Set(caseStudies.map((cs) => cs.industry)));
};

// Get unique technologies for filters
export const getTechnologies = (): string[] => {
  const techs = new Set<string>();
  caseStudies.forEach((cs) => {
    cs.technologies.forEach((t) => techs.add(t.name));
  });
  return Array.from(techs);
};

// Get unique solutions for filters
export const getSolutions = (): string[] => {
  const solutions = new Set<string>();
  caseStudies.forEach((cs) => {
    cs.relatedSolutions.forEach((s) => solutions.add(s));
  });
  return Array.from(solutions);
};

// Get featured case studies
export const getFeaturedCaseStudies = (): CaseStudy[] => {
  return caseStudies.filter((cs) => cs.featured);
};

// Get case study by slug
export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
  return caseStudies.find((cs) => cs.slug === slug);
};

// Filter case studies
export const filterCaseStudies = (filters: {
  industry?: string;
  technology?: string;
  solution?: string;
  featured?: boolean;
}): CaseStudy[] => {
  return caseStudies.filter((cs) => {
    if (filters.industry && cs.industry !== filters.industry) return false;
    if (filters.technology && !cs.technologies.some((t) => t.name === filters.technology))
      return false;
    if (filters.solution && !cs.relatedSolutions.includes(filters.solution)) return false;
    if (filters.featured !== undefined && cs.featured !== filters.featured) return false;
    return true;
  });
};