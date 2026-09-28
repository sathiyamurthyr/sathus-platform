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
  {
    id: 'core-banking-modernization',
    slug: 'core-banking-modernization',
    title: 'Core Banking Platform Modernization',
    industry: 'Financial Services',
    challenge:
      'Legacy mainframe banking core struggled with high transaction latency, rigid batch processing windows, and inability to support open banking APIs for 12M+ active accounts.',
    solution:
      'Architected and executed a zero-downtime event-driven microservices core migration to cloud-native Kubernetes, implementing CQRS and dual-write data reconciliation.',
    architecture: {
      title: 'Event-Driven Core Banking Architecture',
      description:
        'Distributed Kafka event bus, immutable ledger microservices, and multi-region active-active database failover.',
      imageUrl: '/images/case-studies/financial-services/architecture.png',
      imageAlt: 'Core banking modernization architecture diagram',
    },
    technologies: [
      { id: 'kubernetes', name: 'Kubernetes', category: 'cloud' },
      { id: 'kafka', name: 'Apache Kafka', category: 'data' },
      { id: 'cockroachdb', name: 'Distributed SQL', category: 'database' },
      { id: 'go', name: 'Go Microservices', category: 'framework' },
      { id: 'istio', name: 'Istio Service Mesh', category: 'devops' },
    ],
    metrics: [
      { id: 'users', value: '12M+', label: 'Accounts Migrated', description: 'Migrated with zero business interruption' },
      { id: 'latency', value: '<50ms', label: 'P99 Latency', description: 'Transaction response time at peak loads' },
      { id: 'availability', value: '99.999%', label: 'Uptime SLA', description: 'Continuous multi-region operations' },
    ],
    timeline: {
      duration: '12 months',
      phases: [
        { name: 'Domain Decomposition', description: 'Decomposed monolithic ledger into bounded contexts' },
        { name: 'Dual-Write Streaming', description: 'Implemented real-time CDC sync between mainframe and new core' },
        { name: 'Pilot Migration', description: 'Gradual cutover of internal and digital accounts' },
        { name: 'Full Modernization', description: 'Migrated all 12M+ customer ledgers and decommissioned legacy batches' },
      ],
    },
    outcomes: [
      {
        id: 'real-time',
        title: 'Real-Time Clearing',
        description: 'Instant account settlements and open-banking API enablement',
      },
      {
        id: 'tco',
        title: '65% TCO Savings',
        description: 'Massive reduction in mainframe licensing and maintenance overhead',
      },
      {
        id: 'reliability',
        title: 'Zero Downtime',
        description: '100% continuous ledger availability throughout transition',
      },
    ],
    testimonial: {
      quote:
        'Sathus engineered our core banking platform migration with surgical precision. Migrating 12 million active accounts with zero downtime exceeded our highest expectations.',
      author: 'Marcus Vance',
      title: 'Head of Core Engineering',
      company: 'Apex Tier-1 Bank',
    },
    relatedSolutions: ['cloud-modernization', 'enterprise-architecture'],
    seo: {
      title: 'Core Banking Modernization Case Study',
      description:
        'How Sathus migrated 12M+ accounts to a cloud-native, event-driven core banking platform with zero downtime and sub-50ms latency.',
      canonical: '/case-studies/core-banking-modernization',
    },
    featured: true,
    publishedAt: '2024-04-12',
  },
  {
    id: 'fhir-clinical-data-platform',
    slug: 'fhir-clinical-data-platform',
    title: 'FHIR-Native Clinical Data Lakehouse',
    industry: 'Healthcare',
    challenge:
      'Fragmented electronic health records (EHR) across 40+ regional clinics blocked real-time patient history synthesis, research analytics, and HL7 FHIR compliance.',
    solution:
      'Built a HIPAA-compliant, FHIR R4-native clinical data lakehouse ingesting HL7 feeds, unstructured clinical notes, and DICOM imaging metadata into a unified query engine.',
    architecture: {
      title: 'FHIR-Native Data Lakehouse Architecture',
      description:
        'De-identification streaming pipeline, FHIR R4 schema registry, and end-to-end encrypted lakehouse analytics.',
      imageUrl: '/images/case-studies/healthcare/architecture.png',
      imageAlt: 'FHIR clinical data platform architecture diagram',
    },
    technologies: [
      { id: 'fhir', name: 'HL7 FHIR R4', category: 'data' },
      { id: 'spark', name: 'Apache Spark', category: 'data' },
      { id: 'delta-lake', name: 'Delta Lake', category: 'database' },
      { id: 'hipaa', name: 'HIPAA Security Controls', category: 'other' },
      { id: 'nlp', name: 'Clinical NLP', category: 'ai' },
    ],
    metrics: [
      { id: 'records', value: '45M+', label: 'Clinical Records', description: 'Harmonized across 40+ clinical networks' },
      { id: 'query-time', value: '88%', label: 'Faster Queries', description: 'Cross-facility patient record retrieval' },
      { id: 'compliance', value: '100%', label: 'HIPAA & ONC Compliant', description: 'Certified secure clinical interoperability' },
    ],
    timeline: {
      duration: '9 months',
      phases: [
        { name: 'Clinical Assessment', description: 'EHR schema mapping and regulatory security posture validation' },
        { name: 'Lakehouse Ingestion', description: 'Built streaming connectors for HL7 v2, v3, and FHIR bundles' },
        { name: 'Interoperability Engine', description: 'Implemented semantic de-identification and clinical ontology tagging' },
        { name: 'Production Rollout', description: 'Clinical dashboard and researcher query portal launch' },
      ],
    },
    outcomes: [
      {
        id: 'unified-patient',
        title: 'Unified Patient History',
        description: 'Comprehensive 360-degree longitudinal patient records across health network',
      },
      {
        id: 'research-acceleration',
        title: 'Accelerated Clinical Research',
        description: 'Reduced cohort discovery from 6 weeks to under 30 minutes',
      },
    ],
    testimonial: {
      quote:
        'The FHIR clinical lakehouse has revolutionized our clinical informatics. Care teams now have unified patient histories in milliseconds, directly improving patient outcomes.',
      author: 'Dr. Elena Rostova',
      title: 'Director of Health Informatics',
      company: 'Providence Health Alliance',
    },
    relatedSolutions: ['data-engineering', 'ai-engineering'],
    seo: {
      title: 'FHIR Clinical Data Platform Case Study',
      description:
        'How Sathus built an HL7 FHIR-native clinical data lakehouse uniting 45M+ patient records with 100% HIPAA compliance.',
      canonical: '/case-studies/fhir-clinical-data-platform',
    },
    featured: true,
    publishedAt: '2024-05-18',
  },
  {
    id: 'supply-chain-resilience',
    slug: 'supply-chain-resilience',
    title: 'Autonomous Supply Chain Resilience & Visibility',
    industry: 'Manufacturing & Logistics',
    challenge:
      'Global manufacturing network suffered multi-million dollar disruption costs due to lack of real-time supplier visibility, freight tracking delays, and manual demand forecasting.',
    solution:
      'Engineered an IoT-driven supply chain control tower with predictive AI forecasting, real-time multimodal container tracking, and automated inventory replenishment triggers.',
    architecture: {
      title: 'Real-Time Supply Chain Control Tower',
      description:
        'IoT streaming ingest, graph database for supply dependency mapping, and reinforcement learning for dynamic rerouting.',
      imageUrl: '/images/case-studies/retail/architecture.png',
      imageAlt: 'Supply chain control tower architecture diagram',
    },
    technologies: [
      { id: 'iot', name: 'IoT Edge Telemetry', category: 'cloud' },
      { id: 'graph', name: 'Graph Databases', category: 'database' },
      { id: 'timeseries', name: 'Time-Series Forecasting', category: 'ai' },
      { id: 'kafka', name: 'Kafka Streams', category: 'data' },
    ],
    metrics: [
      { id: 'disruptions', value: '42%', label: 'Disruption Reduction', description: 'Early detection of supplier bottlenecks' },
      { id: 'inventory-cost', value: '$18M', label: 'Working Capital Saved', description: 'Safety stock reduction across hubs' },
      { id: 'lead-time', value: '35%', label: 'Shorter Lead Times', description: 'Autonomous route optimization' },
    ],
    timeline: {
      duration: '7 months',
      phases: [
        { name: 'Telemetry Integration', description: 'Ingested EDI, ERP, and IoT signals across global supplier nodes' },
        { name: 'Dependency Graph', description: 'Mapped multi-tier vendor dependencies and bottleneck risks' },
        { name: 'Predictive Modeling', description: 'Trained localized demand and ETA forecasting engines' },
        { name: 'Autonomous Control Tower', description: 'Deployed live dashboard and automated exception handling' },
      ],
    },
    outcomes: [
      {
        id: 'end-to-end',
        title: 'Global Visibility',
        description: 'Real-time tracking of 500,000+ active freight shipments worldwide',
      },
      {
        id: 'resilience',
        title: 'Predictive Exception Handling',
        description: 'Automated dynamic rerouting 72 hours before weather and port strikes impact delivery',
      },
    ],
    testimonial: {
      quote:
        'With Sathus, we transformed from reactive firefighting to predictive orchestration. The control tower paid for itself in less than four months.',
      author: 'Henrik Lindqvist',
      title: 'VP of Global Logistics',
      company: 'Nordic Industrial Systems',
    },
    relatedSolutions: ['ai-engineering', 'data-engineering'],
    seo: {
      title: 'Supply Chain Resilience & Visibility Case Study',
      description:
        'Discover how Sathus deployed an AI-powered supply chain control tower saving $18M in working capital and cutting disruptions by 42%.',
      canonical: '/case-studies/supply-chain-resilience',
    },
    featured: true,
    publishedAt: '2024-06-05',
  },
  {
    id: 'enterprise-ai-agent-platform',
    slug: 'enterprise-ai-agent-platform',
    title: 'Production Enterprise AI Agent Platform',
    industry: 'Technology & Enterprise',
    challenge:
      'Enterprise client needed to transition from disconnected LLM prototypes to a secure, enterprise-grade multi-agent autonomous execution platform with role-based guardrails and SLA monitoring.',
    solution:
      'Architected an enterprise multi-agent runtime with deterministic tool execution, sandboxed code interpreters, semantic caching, and strict OWASP Top 10 for LLM guardrails.',
    architecture: {
      title: 'Multi-Agent Enterprise Orchestration Architecture',
      description:
        'Agent coordinator with semantic router, sandboxed execution runtime, vector memory index, and observability telemetry.',
      imageUrl: '/images/case-studies/financial-services/architecture.png',
      imageAlt: 'Enterprise AI agent platform architecture diagram',
    },
    technologies: [
      { id: 'agents', name: 'Multi-Agent Orchestration', category: 'ai' },
      { id: 'guardrails', name: 'AI Guardrails & Safety', category: 'ai' },
      { id: 'otel', name: 'OpenTelemetry Observability', category: 'devops' },
      { id: 'vector-search', name: 'Vector Search Index', category: 'database' },
      { id: 'docker', name: 'Sandboxed Runtimes', category: 'cloud' },
    ],
    metrics: [
      { id: 'automation', value: '82%', label: 'Workflow Automation', description: 'Complex multi-step enterprise tasks automated' },
      { id: 'latency', value: '4x', label: 'Speed Multiplier', description: 'End-to-end task completion acceleration' },
      { id: 'accuracy', value: '99.4%', label: 'Execution Accuracy', description: 'Deterministic tool-use precision' },
    ],
    timeline: {
      duration: '5 months',
      phases: [
        { name: 'Agent Protocol Definition', description: 'Designed agent interaction schemas and tool interface contracts' },
        { name: 'Guardrail & Sandbox Runtime', description: 'Built zero-trust sandboxing and prompt-injection defense' },
        { name: 'Multi-Agent Orchestration', description: 'Implemented hierarchical agent coordinator with semantic memory' },
        { name: 'Enterprise Deployment', description: 'Integrated with internal ERP, CRM, and compliance logging' },
      ],
    },
    outcomes: [
      {
        id: 'scale',
        title: 'Enterprise-Wide Autonomy',
        description: 'Deployed 150+ specialized AI agents handling tier-2 operations autonomously',
      },
      {
        id: 'governance',
        title: 'Complete Traceability',
        description: 'Full step-by-step audit logs of every agent action and tool invocation',
      },
    ],
    testimonial: {
      quote:
        'Sathus delivered the missing bridge between LLM hype and enterprise production reality. Our multi-agent platform is reliable, compliant, and extraordinarily fast.',
      author: 'Kavita Sundaram',
      title: 'Chief Technology Officer',
      company: 'Nexar Global Technologies',
    },
    relatedSolutions: ['ai-engineering', 'enterprise-architecture'],
    seo: {
      title: 'Enterprise AI Agent Platform Case Study',
      description:
        'How Sathus architected a secure, multi-agent AI orchestration platform automating 82% of enterprise workflows with 99.4% precision.',
      canonical: '/case-studies/enterprise-ai-agent-platform',
    },
    featured: true,
    publishedAt: '2024-07-22',
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