import type { Solution } from '../types';

export const mcpDevelopmentSolution: Solution = {
  slug: 'mcp-development',
  title: 'Model Context Protocol (MCP) Development',
  description: 'Standardized, secure Model Context Protocol servers connecting enterprise AI agents to external tools, databases, and APIs.',
  icon: 'Network',
  hero: {
    title: 'Model Context Protocol (MCP) Engineering',
    description: 'Build enterprise-grade Model Context Protocol (MCP) servers, tools, and prompts. Connect LLMs and agentic swarms securely to internal enterprise APIs with fine-grained access control.',
    primaryCta: { text: 'Schedule MCP Strategy Session', href: '/book-strategy-session' },
    secondaryCta: { text: 'Explore Products', href: '/products/socialhub-mcp' },
    stats: [
      { value: '100%', valueLabel: 'MCP Spec Compliant', label: 'Protocol Standard' },
      { value: '<10ms', valueLabel: 'Tool Call Overhead', label: 'Performance' },
      { value: 'Zero', valueLabel: 'Credential Leaks', label: 'OAuth Security' },
    ],
  },
  challenges: [
    { id: 'custom-integrations', title: 'Brittle Custom API Connectors', description: 'Every AI project builds bespoke API wrappers that break whenever endpoint schemas change.' },
    { id: 'security-exposure', title: 'Credential & OAuth Scope Exposure', description: 'Agents accessing raw tokens or database handles risk data leaks and unauthorized execution.' },
  ],
  capabilities: [
    { id: 'mcp-servers', title: 'Custom MCP Server Development', description: 'Build high-performance TypeScript and Go MCP servers implementing resources, prompts, and tool handlers.', icon: 'Server' },
    { id: 'mcp-gateways', title: 'Enterprise MCP Gateways', description: 'Centralized authentication, rate-limiting, and telemetry for agentic tool execution.', icon: 'ShieldCheck' },
  ],
  architecture: {
    title: 'Enterprise MCP Gateway Architecture',
    description: 'Anthropic Model Context Protocol specification, OAuth2 credential vault, tool call rate limiter, and audit logging stream.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Model Context Protocol Gateway Architecture Diagram',
  },
  technologies: [
    { id: 'ts', name: 'TypeScript MCP SDK', category: 'framework' },
    { id: 'py', name: 'Python MCP SDK', category: 'ai' },
    { id: 'go', name: 'Go SDK', category: 'devops' },
    { id: 'gateway', name: 'SocialHub MCP Gateway', category: 'cloud' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'MCP server lifecycle.',
    stages: [
      { name: 'API Mapping', description: 'Identify enterprise REST/GraphQL APIs for MCP tool packaging.' },
      { name: 'Server Engineering', description: 'Develop typed MCP resources, prompts, and tool endpoints.' },
      { name: 'Security & Token Vaulting', description: 'Wrap endpoints with OAuth2 token rotation and scope checks.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '10x Faster Agent Enablement', description: 'Accelerated connectivity between LLM agents and internal APIs.', metric: '10x' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Global SaaS MCP Integration',
      client: 'SaaS Global',
      industry: 'Enterprise Software',
      challenge: 'AI agents required safe tool execution across 20+ microservices.',
      solution: 'Unified MCP Gateway with automated scope revocation.',
      outcome: '10x faster agent tool onboarding with 100% audit logging.',
      technologies: ['TypeScript', 'Model Context Protocol', 'SocialHub MCP'],
      duration: '4 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'What is Model Context Protocol (MCP)?', answer: 'MCP is an open standard created by Anthropic that enables secure, standardized bi-directional communication between AI models and external software systems.' },
  ],
};
