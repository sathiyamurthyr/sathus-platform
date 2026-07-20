import type { Solution } from '../types';

export const genAiSolution: Solution = {
  slug: 'genai',
  title: 'Generative AI & LLM Systems',
  description: 'Custom fine-tuning, RAG pipelines, and generative AI systems built for security-critical enterprises.',
  icon: 'Sparkles',
  hero: {
    title: 'Generative AI & Enterprise LLMs',
    description: 'Design and deploy private RAG pipelines, fine-tuned domain models, and generative AI applications with strict data privacy and zero hallucination guardrails.',
    primaryCta: { text: 'Schedule AI Strategy Call', href: '/book-strategy-session' },
    secondaryCta: { text: 'Explore AI Platform', href: '/products/sathus-ai' },
    stats: [
      { value: '98%', valueLabel: 'RAG Retrieval Accuracy', label: 'Precision Engineering' },
      { value: '0%', valueLabel: 'Data Leakage', label: 'Zero Retention Guarantee' },
    ],
  },
  challenges: [
    { id: 'hallucinations', title: 'Model Hallucinations', description: 'Unchecked generative AI outputs lead to costly compliance and factual errors.' },
    { id: 'privacy', title: 'Data Privacy Concerns', description: 'Sending confidential enterprise records to public LLM APIs violates privacy policies.' },
  ],
  capabilities: [
    { id: 'rag', title: 'Enterprise RAG Pipelines', description: 'Vector databases, hybrid search, and reranking algorithms for precise context injection.', icon: 'Database' },
    { id: 'fine-tuning', title: 'Domain Model Fine-Tuning', description: 'Fine-tune open-weight models (Llama, Mistral) on proprietary enterprise corpora.', icon: 'GitMerge' },
  ],
  architecture: {
    title: 'Enterprise RAG & Guardrails Architecture',
    description: 'Document ingestion, hybrid vector embeddings, contextual reranker, and automated evaluation harnesses.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Generative AI RAG Architecture Diagram',
  },
  technologies: [
    { id: 'py', name: 'Python', category: 'ai' },
    { id: 'vdb', name: 'Qdrant / Milvus', category: 'database' },
    { id: 'pytorch', name: 'PyTorch', category: 'ai' },
    { id: 'platform', name: 'Sathus AI', category: 'ai' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Generative AI engineering stages.',
    stages: [
      { name: 'Corpus Indexing', description: 'Ingest and chunk enterprise knowledge bases with semantic metadata.' },
      { name: 'RAG Optimization', description: 'Tune chunk sizes, vector embeddings, and reranking parameters.' },
      { name: 'Guardrail Deployment', description: 'Wrap LLM APIs with real-time PII and safety filters.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '98% Retrieval Accuracy', description: 'Context retrieval precision across technical documentation.', metric: '98%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Enterprise GenAI Deployment',
      client: 'Global Health',
      industry: 'Healthcare',
      challenge: 'Unstructured clinical document processing.',
      solution: 'Private RAG pipeline with Llama 3 fine-tuning.',
      outcome: '98% precision in medical record extraction.',
      technologies: ['Python', 'Qdrant', 'Sathus AI'],
      duration: '5 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'Can we run LLMs on-premises?', answer: 'Yes. We deploy fine-tuned open-source models inside your private cloud or air-gapped data centers.' },
  ],
};
