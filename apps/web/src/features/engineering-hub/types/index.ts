export type PageType =
  | 'money-service'
  | 'architecture-guide'
  | 'implementation-guide'
  | 'technical-reference'
  | 'glossary'
  | 'case-study';

export type SchemaType =
  | 'Service'
  | 'TechArticle'
  | 'Dataset'
  | 'DefinedTerm'
  | 'DefinedTermSet'
  | 'ProfilePage'
  | 'CollectionPage';

export interface TopicFaq {
  question: string;
  answer: string;
}

export interface ArchitectureComponent {
  name: string;
  description: string;
  tech: string;
}

export interface DiagnosticStep {
  toolOrTab: string;
  signal: string;
  interpretation: string;
  remediation: string;
}

export interface DeepExplanationSection {
  title: string;
  content: string;
  codeOrSteps?: string[];
}

export type EvidenceType =
  | 'verified-result'
  | 'production-experience'
  | 'reproducible-benchmark'
  | 'reference-architecture'
  | 'illustrative-example';

export interface EvidenceStandard {
  type: EvidenceType;
  label:
    | 'VERIFIED SATHUS RESULT'
    | 'REPRODUCIBLE BENCHMARK'
    | 'REFERENCE ARCHITECTURE'
    | 'ILLUSTRATIVE BENCHMARK SCENARIO'
    | 'ILLUSTRATIVE EXAMPLE'
    | 'Sathus Production Experience'
    | 'Reproducible Benchmark'
    | 'Reference Architecture';
  methodologyNote: string;
  hardwareOrDataset?: string;
  disclaimer?: string;
}

export interface BeforeAfterArchitecture {
  beforeTitle: string;
  beforeDescription: string;
  afterTitle: string;
  afterDescription: string;
  impactMetric: string;
  evidence?: EvidenceStandard;
}

export interface AuthoritativeReference {
  title: string;
  organization: string;
  url: string;
}

export interface HubTopic {
  id: string;
  slug: string;
  pillarSlug: string;
  title: string;
  metaTitle?: string;
  description: string;
  pageType: PageType;
  schemaType: SchemaType;
  targetQueries: string[];
  readingTime: number;
  lastUpdated: string;
  author: {
    name: string;
    role: string;
    practice: string;
  };
  directAnswer?: string;
  searchIntent?: {
    intent: 'Commercial' | 'Informational' | 'Transactional' | 'Troubleshooting';
    targetAudience: string;
  };
  keyTakeaways: string[];
  deepExplanationSections?: DeepExplanationSection[];
  diagnosticSteps?: DiagnosticStep[];
  beforeAfterArchitecture?: BeforeAfterArchitecture;
  architectureOverview?: {
    summary: string;
    components: ArchitectureComponent[];
  };
  codeSnippet?: {
    language: string;
    title: string;
    code: string;
  };
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  faqs: TopicFaq[];
  authoritativeReferences?: AuthoritativeReference[];
  interactiveTool?: 'spark-memory-calculator' | 'document-ai-cost-estimator';
  relatedTopicSlugs: string[];
  conversionCta: {
    title: string;
    description: string;
    buttonText: string;
    href: string;
  };
}

export interface Subcluster {
  name: string;
  description: string;
  topicCount: number;
}

export interface HubPillar {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  featuredQueries: string[];
  commercialServiceHref: string;
  commercialServiceTitle: string;
  subclusters: Subcluster[];
}
