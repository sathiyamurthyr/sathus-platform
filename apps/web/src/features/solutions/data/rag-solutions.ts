import type { Solution } from '../types';

export const ragSolutionsSolution: Solution = {
  slug: 'rag-solutions',
  title: 'Enterprise RAG & Knowledge Systems',
  description: 'Hybrid vector search, semantic reranking, document parsing, and grounding pipelines for enterprise knowledge retrieval.',
  icon: 'Database',
  hero: {
    title: 'Enterprise Retrieval-Augmented Generation (RAG)',
    description: 'Ground LLMs in confidential enterprise documents with hybrid dense/sparse vector search, semantic reranking, and zero-hallucination guardrails.',
    primaryCta: { text: 'Schedule RAG Assessment', href: '/book-strategy-session' },
    secondaryCta: { text: 'View Case Studies', href: '/case-studies' },
    stats: [
      { value: '98%', valueLabel: 'Retrieval Precision', label: 'Semantic Search' },
      { value: '<50ms', valueLabel: 'Vector Search Latency', label: 'Performance' },
      { value: '100%', valueLabel: 'Role-Based Access', label: 'Document Security' },
    ],
  },
  challenges: [
    { id: 'naive-rag', title: 'Naive RAG Retrieval Failures', description: 'Simple vector search misses domain context, retrieves irrelevant chunks, or exposes unauthorized records.' },
  ],
  capabilities: [
    { id: 'hybrid-search', title: 'Hybrid BM25 + Vector Search', description: 'Combine keyword precision (BM25) with semantic vector embeddings (Qdrant/Milvus).', icon: 'Search' },
    { id: 'semantic-reranking', title: 'Cross-Encoder Reranking', description: 'Re-rank retrieved context using domain-tuned cross-encoders before prompt injection.', icon: 'Layers' },
  ],
  architecture: {
    title: 'Advanced RAG Reference Architecture',
    description: 'Document parser, semantic chunker, hybrid vector DB, Cohere reranker, security filter, and LLM response generator.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Advanced Enterprise RAG Architecture Diagram',
  },
  technologies: [
    { id: 'qdrant', name: 'Qdrant Vector DB', category: 'database' },
    { id: 'milvus', name: 'Milvus', category: 'database' },
    { id: 'python', name: 'Python', category: 'ai' },
    { id: 'fastapi', name: 'FastAPI', category: 'framework' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'RAG engineering framework.',
    stages: [
      { name: 'Document Ingestion Tuning', description: 'Configure custom chunking rules for PDFs, CAD files, and tabular data.' },
      { name: 'Embedding Benchmarking', description: 'Evaluate OpenAI, Cohere, and open-source embedding models against domain data.' },
      { name: 'Security & RBAC Layer', description: 'Enforce document-level permission filters inside vector queries.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '98% Retrieval Accuracy', description: 'Precision context retrieval across complex technical manuals.', metric: '98%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Healthcare Clinical Records RAG Platform',
      client: 'HealthNet Global',
      industry: 'Healthcare',
      challenge: 'Physicians spent 20+ minutes searching un-indexed EHR charts during patient visits.',
      solution: 'HIPAA-compliant RAG pipeline with Qdrant vector search and fine-tuned embeddings.',
      outcome: 'Reduced chart review time to under 30 seconds with 98% factual precision.',
      technologies: ['Qdrant', 'Python', 'FastAPI', 'FHIR R4'],
      duration: '5 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'How do you handle document security in RAG?', answer: 'We embed user group permissions directly into vector payloads, filtering out unauthorized document chunks before context is ever sent to the LLM.' },
  ],
};
