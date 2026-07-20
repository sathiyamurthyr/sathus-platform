import type { Product } from '../types';

export const sathusAi: Product = {
  id: 'sathus-ai',
  name: 'Sathus AI Platform',
  slug: 'sathus-ai',
  tagline: 'Enterprise Agentic AI with built-in evaluation, guardrails, and observability',
  description: 'Sathus AI Platform empowers enterprise teams to deploy, monitor, and govern multi-agent workflows with production-grade reliability and strict compliance.',
  hero: {
    title: 'Sathus AI Platform',
    description: 'Deploy autonomous agentic systems with automated quality gates, real-time evaluation harnesses, and enterprise security guardrails.',
    primaryCta: { text: 'Book Strategy Session', href: '/book-strategy-session' },
    secondaryCta: { text: 'Explore Architecture', href: '/solutions/ai-engineering' },
    badge: 'GA Release 2.0',
  },
  overview: {
    problem: 'LLMs and multi-agent systems are difficult to monitor, evaluate, and control in production environments with strict regulatory standards.',
    solution: 'Sathus AI Platform delivers an integrated evaluation harness, zero-trust guardrails, and real-time observability for autonomous agent workflows.',
    differentiator: 'Purpose-built for financial services, healthcare, and regulated industries requiring audit trails, hallucination scoring, and deterministic security controls.',
  },
  features: [
    {
      id: 'agent-orchestration',
      title: 'Multi-Agent Orchestration',
      description: 'Orchestrate complex multi-agent teams with shared context, asynchronous tool calls, and automated fallback logic.',
    },
    {
      id: 'eval-harness',
      title: 'Automated Evaluation Harnesses',
      description: 'Continuous quality gates measuring accuracy, latency, toxicity, and adherence to business rules.',
    },
    {
      id: 'guardrails',
      title: 'Production Guardrails',
      description: 'Real-time filtering of PII, prompt injections, output leaks, and unsafe model completions.',
    },
    {
      id: 'observability',
      title: 'Agentic Observability',
      description: 'Deep tracing of subagent reasoning, token usage, cost allocation, and execution latency.',
    },
  ],
  benefits: [
    {
      id: 'reliability',
      title: '99.9% Execution Reliability',
      description: 'Built-in fallbacks and validation cycles prevent broken agent loops.',
      metric: '99.9%',
    },
    {
      id: 'compliance',
      title: 'SOC 2 & HIPAA Ready',
      description: 'Full audit logging and encryption at rest and in transit.',
      metric: '100%',
    },
  ],
  useCases: [
    {
      id: 'fintech',
      title: 'Automated Financial Compliance',
      description: 'Autonomous agents validating loan applications and fraud signals against regulatory frameworks.',
      industry: 'Financial Services',
    },
    {
      id: 'healthcare',
      title: 'Clinical Workflow Assistance',
      description: 'Context-aware RAG pipelines extracting data from medical charts for decision support.',
      industry: 'Healthcare',
    },
  ],
  screenshots: [],
  technology: [
    { id: 'python', name: 'Python', category: 'Language' },
    { id: 'fastapi', name: 'FastAPI', category: 'Backend' },
    { id: 'kafka', name: 'Apache Kafka', category: 'Streaming' },
    { id: 'databricks', name: 'Databricks', category: 'Data' },
  ],
  security: [
    { id: 'soc2', title: 'SOC 2 Type II Certified', description: 'Audited control environment for security and availability.' },
    { id: 'encryption', title: 'AES-256 & TLS 1.3', description: 'End-to-end encryption for all agent telemetry.' },
  ],
  roadmap: [
    { id: 'r1', quarter: 'Q1 2026', title: 'Agent Swarm Protocol', description: 'Multi-agent consensus protocol.', status: 'completed' },
    { id: 'r2', quarter: 'Q2 2026', title: 'Self-Healing Tool Adapters', description: 'Automated API schema recovery.', status: 'in-progress' },
    { id: 'r3', quarter: 'Q3 2026', title: 'Federated Training', description: 'Private edge model fine-tuning.', status: 'planned' },
  ],
  pricingPreview: {
    cta: { text: 'Request Enterprise Quote', href: '/contact?inquiry=enterprise' },
    plans: [
      {
        id: 'developer',
        name: 'Developer Sandbox',
        price: 'Free Trial',
        description: 'For testing multi-agent workflows and evaluating guardrails in non-production environments.',
        features: ['Up to 3 Agent Workflows', 'Standard Guardrail Presets', 'Community Support', 'Local CLI Tools'],
      },
      {
        id: 'enterprise-vpc',
        name: 'Enterprise Dedicated',
        price: 'Custom SLA',
        description: 'For mission-critical production workloads requiring dedicated infrastructure and compliance controls.',
        features: [
          'Unlimited Agent Workflows',
          'Custom Evaluation Harnesses',
          'Zero Data Retention Policy',
          'Dedicated Customer Success Engineer',
          '24/7 SOC Incident Response SLA',
        ],
        popular: true,
      },
    ],
  },
  deploymentModels: [
    'Multi-Tenant SaaS (US/EU Regions)',
    'Dedicated Cloud VPC (AWS / Azure / GCP)',
    'Air-Gapped On-Premises K8s Cluster',
    'Edge Node Hybrid Deployment',
  ],
  scalabilityMetrics: [
    { value: '99.99%', label: 'Platform Availability SLA', description: 'Multi-region fault-tolerant Kubernetes orchestration.' },
    { value: '< 150ms', label: 'Guardrail Latency overhead', description: 'Ultra-low latency streaming injection and PII check.' },
    { value: '10M+', label: 'Daily Agent Tool Calls', description: 'Benchmarked throughput on distributed event-bus core.' },
  ],
  integrations: [
    { name: 'OpenAI / Anthropic / Cohere API', category: 'LLM Providers', description: 'Native multi-provider model orchestration' },
    { name: 'Pinecone / Milvus / Qdrant', category: 'Vector DBs', description: 'Zero-latency vector index syncing and retrieval' },
    { name: 'Databricks / Snowflake', category: 'Data Warehouses', description: 'Direct SQL & Feature Store connector adapters' },
    { name: 'LangChain / LlamaIndex / MCP', category: 'Frameworks', description: 'Model Context Protocol and agent tooling bridges' },
  ],
  relatedSolutions: [
    { title: 'AI Engineering & Orchestration', href: '/solutions/ai-engineering' },
    { title: 'GenAI & Autonomous Agents', href: '/solutions/genai' },
    { title: 'MCP Development & Tools', href: '/solutions/mcp-development' },
  ],
  faq: [
    {
      id: 'faq-1',
      question: 'Does Sathus AI use client data for training model weights?',
      answer: 'No. Sathus AI operates under strict zero-retention policies. Your enterprise data is never used to train third-party or foundational models.',
    },
    {
      id: 'faq-2',
      question: 'How is Sathus AI deployed?',
      answer: 'We support Multi-tenant SaaS, Dedicated VPC deployments on AWS/Azure, and fully air-gapped on-premises installations for government and defense clients.',
    },
    {
      id: 'faq-3',
      question: 'How does Sathus AI handle model latency and fallbacks?',
      answer: 'Our smart router dynamically retries failed model calls, switches to secondary endpoints during downstream provider outages, and enforces hard timeouts on agent reasoning steps.',
    },
  ],
};
