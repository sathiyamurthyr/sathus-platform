import type { Solution } from '../types';

export const aiAgentsSolution: Solution = {
  slug: 'ai-agents',
  title: 'Autonomous AI Agents & Swarm Systems',
  description: 'Multi-agent orchestration, tool execution, stateful memory, and human-in-the-loop workflows for complex enterprise tasks.',
  icon: 'Bot',
  hero: {
    title: 'Autonomous AI Agents & Agentic Workflows',
    description: 'Deploy stateful multi-agent swarms that autonomously solve multi-step tasks across enterprise software. Built-in evaluation harnesses, real-time safety guardrails, and audit trails.',
    primaryCta: { text: 'Schedule Agentic Demo', href: '/book-strategy-session' },
    secondaryCta: { text: 'Explore AI Platform', href: '/products/sathus-ai' },
    stats: [
      { value: '99.9%', valueLabel: 'Execution Reliability', label: 'Agent Uptime' },
      { value: '85%', valueLabel: 'Task Automation', label: 'Workforce Efficiency' },
      { value: 'Zero', valueLabel: 'Unchecked Hallucinations', label: 'Eval Harness' },
    ],
  },
  challenges: [
    { id: 'agent-loops', title: 'Infinite Loops & Model Hallucinations', description: 'Unmonitored agents get stuck in recursive execution cycles or generate invalid tool parameters.' },
  ],
  capabilities: [
    { id: 'multi-agent', title: 'Multi-Agent Consensus Orchestration', description: 'Coordinate specialized subagents (researcher, planner, execution, reviewer) with shared state.', icon: 'Users' },
    { id: 'tool-execution', title: 'Sandboxed Tool Execution', description: 'Run code execution, SQL queries, and API calls inside isolated Docker containers.', icon: 'Terminal' },
  ],
  architecture: {
    title: 'Enterprise Multi-Agent Architecture',
    description: 'Planner agent, tool registry, evaluation harness, Redis memory store, and human approval queue.',
    imageUrl: '/images/solutions/ai-engineering/architecture.png',
    imageAlt: 'Autonomous AI Agent Architecture Diagram',
  },
  technologies: [
    { id: 'sathus-ai', name: 'Sathus AI Platform', category: 'ai' },
    { id: 'mcp', name: 'Model Context Protocol', category: 'framework' },
    { id: 'python', name: 'Python', category: 'ai' },
    { id: 'redis', name: 'Redis Memory', category: 'database' },
  ],
  methodology: {
    title: 'Delivery Methodology',
    description: 'Agent engineering stages.',
    stages: [
      { name: 'Task Decomposition', description: 'Break enterprise workflows into discrete agent roles.' },
      { name: 'Eval Harness Development', description: 'Build benchmark datasets for accuracy, latency, and tool precision.' },
      { name: 'Production Rollout', description: 'Deploy agents with human-in-the-loop fallback approval queues.' },
    ],
  },
  outcomes: [
    { id: 'o1', title: '85% Workflow Automation', description: 'Reduction in manual document processing and compliance checks.', metric: '85%' },
  ],
  caseStudies: [
    {
      id: 'cs1',
      title: 'Automated Loan Audit Agent Swarm',
      client: 'MetroBank Corp',
      industry: 'Financial Services',
      challenge: 'Manual verification of complex commercial credit applications took 14 days.',
      solution: 'Sathus AI multi-agent swarm analyzing tax forms, credit records, and compliance rules.',
      outcome: 'Audit time reduced from 14 days to 45 minutes with 100% auditable reasoning chains.',
      technologies: ['Sathus AI', 'Python', 'MCP', 'Databricks'],
      duration: '6 Months',
    },
  ],
  faqs: [
    { id: 'f1', question: 'How do you prevent agents from taking dangerous actions?', answer: 'We implement sandboxed execution environments, strict OAuth2 scope limits, and mandatory human-in-the-loop (HITL) approval steps for state-changing operations.' },
  ],
};
