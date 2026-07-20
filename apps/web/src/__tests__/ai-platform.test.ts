import {
  mockAIModels,
  mockAIAgents,
  mockPromptTemplates,
  mockKnowledgeSources,
  mockChatSession,
  mockAIMetrics,
} from '../features/ai/data/mock-ai-data';

describe('EPIC-020 Enterprise AI Platform Verification', () => {
  it('contains supported provider models (OpenAI, Anthropic, Gemini, Ollama)', () => {
    expect(mockAIModels.length).toBeGreaterThan(0);
    const providers = mockAIModels.map((m) => m.provider);
    expect(providers).toContain('openai');
    expect(providers).toContain('anthropic');
    expect(providers).toContain('gemini');
    expect(providers).toContain('ollama');
  });

  it('validates autonomous agent role types and attached tools', () => {
    expect(mockAIAgents.length).toBeGreaterThan(0);
    mockAIAgents.forEach((agent) => {
      expect(agent.id).toBeTruthy();
      expect(agent.name).toBeTruthy();
      expect(agent.systemPrompt).toBeTruthy();
      expect(agent.tools.length).toBeGreaterThan(0);
    });
  });

  it('validates prompt library templates and variable placeholders', () => {
    expect(mockPromptTemplates.length).toBeGreaterThan(0);
    mockPromptTemplates.forEach((p) => {
      expect(p.name).toBeTruthy();
      expect(p.template).toBeTruthy();
      expect(p.variables.length).toBeGreaterThan(0);
    });
  });

  it('validates RAG knowledge base document ingestion', () => {
    expect(mockKnowledgeSources.length).toBeGreaterThan(0);
    mockKnowledgeSources.forEach((k) => {
      expect(k.chunkCount).toBeGreaterThan(0);
      expect(k.vectorCount).toBe(k.chunkCount);
      expect(k.status).toBe('indexed');
    });
  });

  it('validates chat session message stream and citation metadata', () => {
    expect(mockChatSession.messages.length).toBeGreaterThan(0);
    const assistantMsg = mockChatSession.messages.find((m) => m.sender === 'assistant');
    expect(assistantMsg).toBeDefined();
    expect(assistantMsg?.citations?.length).toBeGreaterThan(0);
    expect(assistantMsg?.tokensUsed).toBeGreaterThan(0);
  });

  it('validates AI observability metrics', () => {
    expect(mockAIMetrics.totalRequests).toBeGreaterThan(0);
    expect(mockAIMetrics.successRatePercent).toBeGreaterThan(99);
  });
});
