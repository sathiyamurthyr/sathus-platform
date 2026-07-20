import type { Product } from '../types';

export const socialHubMcp: Product = {
  id: 'socialhub-mcp',
  name: 'SocialHub MCP',
  slug: 'socialhub-mcp',
  tagline: 'Secure Model Context Protocol Gateway for Enterprise AI Connectivity',
  description: 'SocialHub MCP connects AI agents seamlessly to social networks, messaging platforms, enterprise CRM, and collaboration tools via standardized Model Context Protocol tools and resources.',
  hero: {
    title: 'SocialHub MCP Gateway',
    description: 'Connect enterprise AI agents to external channels with rate limiting, credentials vault, and fine-grained permissions.',
    primaryCta: { text: 'Book Strategy Session', href: '/book-strategy-session' },
    secondaryCta: { text: 'View Products', href: '/products' },
    badge: 'Enterprise Gateway',
  },
  overview: {
    problem: 'AI agents require safe, authorized connectivity to external APIs and communication platforms without exposing raw API keys or violating OAuth scopes.',
    solution: 'SocialHub MCP acts as a secure Model Context Protocol gateway, enabling standardized tool definitions, dynamic access tokens, and encrypted webhook streams.',
    differentiator: 'Enterprise security governance built specifically for agent-to-API communication with audit trails and automated scope revocation.',
  },
  features: [
    {
      id: 'mcp-server',
      title: 'Standardized MCP Server',
      description: 'Fully compliant implementation of Anthropic Model Context Protocol specification.',
    },
    {
      id: 'token-vault',
      title: 'OAuth2 Vault & Scope Management',
      description: 'Secure token storage with automated refresh routines and zero-exposure credential handling.',
    },
    {
      id: 'rate-limiting',
      title: 'Intelligent Rate Limiting',
      description: 'Protects enterprise social and API accounts from being flagged or rate-limited by upstream providers.',
    },
  ],
  benefits: [
    {
      id: 'speed',
      title: '10x Faster Agent Integration',
      description: 'Plug-and-play MCP connectors for major platforms.',
      metric: '10x',
    },
  ],
  useCases: [
    {
      id: 'customer-service',
      title: 'Omnichannel Agent Response',
      description: 'Deploy AI customer support agents across WhatsApp, Twitter, and Slack with unified compliance.',
      industry: 'Enterprise SaaS',
    },
  ],
  screenshots: [],
  technology: [
    { id: 'ts', name: 'TypeScript', category: 'Language' },
    { id: 'go', name: 'Go', category: 'Backend' },
    { id: 'redis', name: 'Redis', category: 'Caching' },
  ],
  security: [
    { id: 'hsm', title: 'HSM Key Management', description: 'Hardware security module token protection.' },
  ],
  roadmap: [
    { id: 'r1', quarter: 'Q1 2026', title: 'MCP Spec 1.0 Support', description: 'Full protocol compliance.', status: 'completed' },
  ],
  pricingPreview: {
    cta: { text: 'Contact Gateway Team', href: '/contact' },
    plans: [
      {
        id: 'starter',
        name: 'Developer Hub',
        price: 'Free Open Source',
        description: 'Self-hosted MCP server connector for local agent development.',
        features: ['Standard MCP Tools', 'Local OAuth Token Storage', 'Community Adapters'],
      },
      {
        id: 'enterprise-gateway',
        name: 'Enterprise Gateway',
        price: 'Usage Tiered',
        description: 'Managed high-availability MCP cluster with HSM key storage and central governance.',
        features: [
          'Unlimited Tool Connections',
          'HSM Hardware Token Protection',
          'Distributed Rate Limiting & Queueing',
          'SIEM Audit Event Stream',
        ],
        popular: true,
      },
    ],
  },
  deploymentModels: [
    'Managed Cloud Gateway',
    'Self-Hosted K8s MCP Sidecar',
    'Edge API Proxy',
  ],
  scalabilityMetrics: [
    { value: '50k RPS', label: 'Gateway Throughput', description: 'Low-latency Go-based routing engine.' },
    { value: '< 10ms', label: 'Token Vault Retrieval', description: 'Hardware security module caching layer.' },
    { value: '100% Spec', label: 'Anthropic MCP Compliance', description: 'Standardized tools, prompts, and resources.' },
  ],
  integrations: [
    { name: 'WhatsApp / Telegram / Slack / Teams', category: 'Messaging Platforms', description: 'Bi-directional agent communication bridges' },
    { name: 'Salesforce / HubSpot / Zendesk', category: 'Enterprise CRM', description: 'Contextual customer record retrieval & actions' },
    { name: 'Claude Desktop / Sathus AI Core', category: 'Agent Runtime Hosts', description: 'Direct MCP protocol socket binding' },
  ],
  relatedSolutions: [
    { title: 'MCP Development & Tools', href: '/solutions/mcp-development' },
    { title: 'AI Agents & Workflows', href: '/solutions/ai-agents' },
    { title: 'API Engineering & Gateway Design', href: '/solutions/api-development' },
  ],
  faq: [
    {
      id: 'faq-1',
      question: 'What is MCP?',
      answer: 'Model Context Protocol (MCP) is an open standard that enables secure, bi-directional connectivity between AI applications and data sources or external tools.',
    },
    {
      id: 'faq-2',
      question: 'How does SocialHub MCP protect sensitive API tokens?',
      answer: 'Tokens are encrypted using envelope encryption stored in a dedicated Hardware Security Module (HSM) or HashiCorp Vault instance. Raw keys are never exposed to LLMs or client logs.',
    },
  ],
};
