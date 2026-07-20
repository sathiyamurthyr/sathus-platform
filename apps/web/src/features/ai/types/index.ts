// EPIC-020 Enterprise AI Platform Domain Types

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'azure_openai' | 'ollama';

export type AgentRoleType = 'task' | 'research' | 'coding' | 'workflow' | 'document' | 'support';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  version: string;
  maxTokens: number;
  costPer1kTokens: number; // USD
  latencyMs: number;
  isAvailable: boolean;
  status: 'active' | 'deprecated' | 'maintenance';
}

export interface AIAgent {
  id: string;
  name: string;
  role: AgentRoleType;
  description: string;
  systemPrompt: string;
  model: string;
  provider: AIProvider;
  tools: string[];
  status: 'idle' | 'running' | 'paused';
  totalTasksCompleted: number;
  createdAt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  category: 'engineering' | 'security' | 'architecture' | 'support' | 'analytics';
  variables: string[];
  version: number;
  isPublic: boolean;
  author: string;
  createdAt: string;
}

export interface RAGKnowledgeSource {
  id: string;
  tenantId: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'mcp_tool';
  chunkCount: number;
  vectorCount: number;
  embeddingModel: string;
  status: 'indexed' | 'indexing' | 'failed';
  updatedAt: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: string[];
  tokensUsed?: number;
  latencyMs?: number;
  agentId?: string;
}

export interface AIChatSession {
  id: string;
  title: string;
  model: string;
  provider: AIProvider;
  agentId?: string;
  messages: AIChatMessage[];
  totalTokens: number;
  createdAt: string;
}

export interface AIObservabilityMetrics {
  totalRequests: number;
  totalTokensProcessed: number;
  estimatedCostUsd: number;
  averageLatencyMs: number;
  successRatePercent: number;
  activeAgentsCount: number;
  activeVectorDocuments: number;
}
