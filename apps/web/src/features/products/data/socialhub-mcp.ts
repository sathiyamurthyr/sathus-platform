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
  faq: [
    {
      id: 'faq-1',
      question: 'What is MCP?',
      answer: 'Model Context Protocol (MCP) is an open standard that enables secure, bi-directional connectivity between AI applications and data sources or external tools.',
    },
  ],
};
