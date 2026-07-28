import type { SearchProvider, SearchResult, SearchFilters } from '../types';

// Comprehensive site-wide search index
const MOCK_RESULTS: SearchResult[] = [
  // Solutions
  {
    id: 'ai-engineering',
    title: 'AI Engineering & Production LLMs',
    description: 'Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls.',
    category: 'solutions',
    url: '/solutions/ai-engineering',
    badge: 'Popular',
    snippet: 'Evaluation harnesses, zero-hallucination guardrails, self-hosted LLM deployment, model context protocol.',
  },
  {
    id: 'ai-agents',
    title: 'AI Agent Swarms & MCP Integration',
    description: 'Autonomous multi-agent orchestration platforms using Model Context Protocol (MCP) and sandboxed tools.',
    category: 'solutions',
    url: '/solutions/ai-agents',
    badge: 'Hot',
    snippet: 'Supervisor-worker agent networks, tool sandboxing, WebAssembly runtime, human approval gates.',
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering & Lakehouses',
    description: 'Governed lakehouses and streaming pipelines that turn raw events into trustworthy, query-ready intelligence.',
    category: 'solutions',
    url: '/solutions/data-engineering',
    badge: 'Popular',
    snippet: 'Kafka CDC, Delta Lake, Apache Iceberg, dbt data lineage, sub-second latency streaming.',
  },
  {
    id: 'rag-solutions',
    title: 'Enterprise RAG Systems (GraphRAG)',
    description: 'Dense vector search paired with knowledge graph grounding for 99%+ precision RAG.',
    category: 'solutions',
    url: '/solutions/rag-solutions',
    snippet: 'pgvector, Qdrant, Neo4j knowledge graphs, hybrid retrieval, cross-encoder reranking.',
  },
  {
    id: 'cloud-engineering',
    title: 'Cloud Engineering & GitOps Platform',
    description: 'Cloud-native infrastructure automation on AWS and Azure with Kubernetes and FinOps cost governance.',
    category: 'solutions',
    url: '/solutions/cloud-engineering',
    snippet: 'Terraform IaC, Crossplane, ArgoCD GitOps, 99.99% SLA, multi-region failover.',
  },
  {
    id: 'cloud-modernization',
    title: 'Legacy Cloud Modernization',
    description: 'Re-platform legacy monoliths to cloud-native microservices with zero-downtime cutovers.',
    category: 'solutions',
    url: '/solutions/cloud-modernization',
    snippet: 'Strangler Fig refactoring pattern, database migration, legacy Oracle/Teradata cutover.',
  },
  {
    id: 'api-development',
    title: 'High-Concurrency API Engineering',
    description: 'Sub-10ms async Python and Node.js microservices designed for 10,000+ RPS workloads.',
    category: 'solutions',
    url: '/solutions/api-development',
    snippet: 'FastAPI, Redis Cluster, Pydantic v2, gRPC streaming, OpenAPI schemas.',
  },
  {
    id: 'product-engineering',
    title: 'Embedded Product Engineering Squads',
    description: '3-person senior engineering squads integrated with your team for sprint velocity and delivery SLAs.',
    category: 'solutions',
    url: '/solutions/product-engineering',
    snippet: 'Embedded squad, principal engineer, daily standups, sprint velocity, pair programming.',
  },

  // Pricing & Engagements
  {
    id: 'pricing-audit',
    title: 'Platform Audit Engagement ($4,800)',
    description: '2-week deep-dive technical audit of your AI, data, or cloud platform led by a Principal Engineer.',
    category: 'products',
    url: '/pricing',
    badge: '2-Week',
    snippet: 'Architecture gap analysis, security audit, written report, 30-day Q&A follow-up.',
  },
  {
    id: 'pricing-squad',
    title: 'Embedded Squad Pricing ($18,500/mo)',
    description: '3-person dedicated engineering team (Principal Engineer + 2 Seniors) with contractual SLAs.',
    category: 'products',
    url: '/pricing',
    badge: 'Most Popular',
    snippet: 'Dedicated engineers, SOC 2 delivery, direct Slack access, daily pairing.',
  },

  // Industries
  {
    id: 'financial-services',
    title: 'Financial Services & Banking Solutions',
    description: 'Enterprise AI and lakehouse solutions for banks, fintechs, and asset managers under SEC/FINRA rules.',
    category: 'industries',
    url: '/industries/financial-services',
    snippet: 'Core banking migration, fraud detection streaming, real-time ledger sync.',
  },
  {
    id: 'fintech',
    title: 'Fintech & Payment Gateway Engineering',
    description: 'High-throughput payment processors, double-entry ledgers, and real-time transaction monitoring.',
    category: 'industries',
    url: '/industries/fintech',
    snippet: 'PCI DSS compliant, zero transaction loss, transactional outbox pattern.',
  },

  // Resources & Blog
  {
    id: 'blog-eval-harnesses',
    title: 'Deterministic Evaluation Harnesses for Production Agent Swarms',
    description: 'Preventing agent hallucinations and infinite loops using quality gates and automated benchmarks.',
    category: 'blog',
    url: '/resources/blog/eval-harnesses-agent-systems',
    badge: 'Whitepaper',
    snippet: 'Agent evaluation, guardrails, LLM benchmarks, zero-hallucination rate.',
  },
  {
    id: 'blog-quantization',
    title: 'Quantization, LoRA Fine-Tuning & Self-Hosted Enterprise LLMs',
    description: 'Technical benchmark report on GGUF and AWQ 4-bit quantized open-weights models with vLLM.',
    category: 'blog',
    url: '/resources/blog/quantization-lora-self-hosted-llms',
    badge: 'Benchmark',
    snippet: 'vLLM, Llama-3, 4-bit AWQ, memory usage, latency trade-offs.',
  },
  {
    id: 'blog-multi-agent',
    title: 'Multi-Agent Swarm Orchestration with Autonomous Task Allocation',
    description: 'Architecting supervisor-worker agent networks using LangGraph, CrewAI, and temporal event streams.',
    category: 'blog',
    url: '/resources/blog/multi-agent-swarm-orchestration',
    badge: 'Guide',
    snippet: 'LangGraph, supervisor agent, sub-task delegation, emergency override.',
  },
  {
    id: 'blog-hybrid-rag',
    title: 'Hybrid Dense Vector & Knowledge Graph Grounding for Zero-Hallucination RAG',
    description: 'Combining pgvector similarity search with Neo4j entity graphs for enterprise retrieval accuracy.',
    category: 'blog',
    url: '/resources/blog/hybrid-vector-knowledge-graph-rag',
    badge: 'Whitepaper',
    snippet: 'GraphRAG, Neo4j, pgvector, hybrid search, zero-hallucination.',
  },
  {
    id: 'blog-streaming-lakehouses',
    title: 'High-Throughput Streaming Lakehouses with Kafka CDC & Delta Live Tables',
    description: 'Processing 50,000 events/sec with Debezium CDC, Kafka, and Delta Lake Medallion architecture.',
    category: 'blog',
    url: '/resources/blog/streaming-lakehouses-kafka-delta-live-tables',
    badge: 'Case Study',
    snippet: 'Sub-minute data freshness, CDC, Debezium, Medallion Architecture.',
  },

  // Trust & Security
  {
    id: 'trust-compliance',
    title: 'Trust Center: SOC 2, HIPAA & ISO 27001 Compliance',
    description: 'Our audited security controls, compliance posture, and data protection guarantees.',
    category: 'trust-center',
    url: '/trust/compliance',
    badge: 'SOC 2',
    snippet: 'SOC 2 Type II, HIPAA, ISO 27001, GDPR, data encryption at rest.',
  },
];

const POPULAR_SEARCHES = [
  'AI Engineering',
  'Data Lakehouse',
  'Pricing & Squads',
  'GraphRAG',
  'SOC 2 Compliance',
  'Kafka CDC',
];

const RECENT_SEARCHES_KEY = 'sathus-recent-searches';

export class MockSearchProvider implements SearchProvider {
  async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    if (!query.trim()) {
      return [];
    }

    const searchTerms = query.toLowerCase().trim().split(/\s+/);

    return MOCK_RESULTS.filter((result) => {
      const fullText = `${result.title} ${result.description} ${result.snippet || ''} ${result.category}`.toLowerCase();
      
      // All search terms must match somewhere in the result text
      const matchesQuery = searchTerms.every((term) => fullText.includes(term));

      if (filters?.category && filters.category !== 'all' && result.category !== filters.category) {
        return false;
      }

      return matchesQuery;
    });
  }

  async getPopularSearches(): Promise<string[]> {
    return POPULAR_SEARCHES;
  }

  async getRecentSearches(): Promise<string[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async saveRecentSearch(query: string): Promise<void> {
    if (typeof window === 'undefined' || !query.trim()) {
      return;
    }

    try {
      const recent = await this.getRecentSearches();
      const updated = [query.trim(), ...recent.filter((q) => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 5);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }
}