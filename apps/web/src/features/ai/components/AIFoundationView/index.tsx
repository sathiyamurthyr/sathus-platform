'use client';

import React, { useState } from 'react';
import {
  Bot,
  MessageSquare,
  Sparkles,
  Send,
  Cpu,
  BookOpen,
  Database,
  BarChart3,
  Zap,
  Play,
  Copy,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import {
  mockAIModels,
  mockAIAgents,
  mockPromptTemplates,
  mockKnowledgeSources,
  mockChatSession,
  mockAIMetrics,
} from '../../data/mock-ai-data';
import type { AIChatMessage, AIAgent, PromptTemplate, RAGKnowledgeSource } from '../../types';
import { AIAgentsPlatformView } from '@/features/ai-agents/components/AIAgentsPlatformView';

export function AIFoundationView() {
  const [activeTab, setActiveTab] = useState<'copilot' | 'agents' | 'prompts' | 'knowledge' | 'observability'>('copilot');

  // Chat State
  const [selectedModel, setSelectedModel] = useState<string>('claude-3-5-sonnet');
  const [selectedAgent, setSelectedAgent] = useState<string>('agent-audit-01');
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>(mockChatSession.messages);
  const [isGenerating, setIsGenerating] = useState(false);

  // Agent State
  const [agents, setAgents] = useState<AIAgent[]>(mockAIAgents);

  // Prompts State
  const [prompts, setPrompts] = useState<PromptTemplate[]>(mockPromptTemplates);
  const [activePrompt, setActivePrompt] = useState<PromptTemplate | null>(mockPromptTemplates[0]);

  // Knowledge State
  const [knowledge, setKnowledge] = useState<RAGKnowledgeSource[]>(mockKnowledgeSources);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;

    const userMsg: AIChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      content: inputPrompt,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    // Simulate streaming response
    setTimeout(() => {
      const assistantMsg: AIChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: 'assistant',
        content: `I have processed your query using **${selectedModel}** and the active agent context.\n\n### Execution Telemetry:\n- **Model**: ${selectedModel}\n- **Provider Routing**: Unified Sathus AI Gateway\n- **Vector Context**: Retained from active Memomes RAG knowledge base\n- **PII Guardrail**: 100% Redacted\n\nYour request has been fulfilled with zero retention policy compliance.`,
        timestamp: new Date().toLocaleTimeString(),
        citations: ['SOC_2_Controls_and_Policies_2026.pdf (p. 18)'],
        tokensUsed: 410,
        latencyMs: 98,
        agentId: selectedAgent,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 1200);
  };

  const providerBadges: Record<string, string> = {
    openai: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    anthropic: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    gemini: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    ollama: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    azure_openai: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span>Enterprise AI Operating Platform</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            EPIC-020 Provider-agnostic AI Gateway, RAG vector retrieval engine, and agentic orchestration.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Gateway Online (4 Providers)</span>
          </span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'copilot', label: 'AI Copilot Chat', icon: <MessageSquare className="w-4 h-4" /> },
          { id: 'agents', label: 'Autonomous Agents', icon: <Bot className="w-4 h-4" /> },
          { id: 'prompts', label: 'Prompt Library', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'knowledge', label: 'RAG & Knowledge Base', icon: <Database className="w-4 h-4" /> },
          { id: 'observability', label: 'Observability & Costs', icon: <BarChart3 className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as 'copilot' | 'agents' | 'prompts' | 'knowledge' | 'observability')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: AI COPILOT CHAT PLATFORM */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 space-y-5 shadow-sm">
              <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-primary" />
                <span>Model Selector</span>
              </div>

              <div className="space-y-2">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  {mockAIModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider.toUpperCase()})
                    </option>
                  ))}
                </select>
                <div className="text-[10px] text-muted-foreground">
                  Latency: 115ms • Max Tokens: 200,000
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-border">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-1.5">
                  <Bot className="w-4 h-4 text-primary" />
                  <span>Agent Context</span>
                </div>

                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-3 border-t border-border">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Security Guardrails
                </div>
                <div className="space-y-1.5 text-[11px] text-muted-foreground font-medium">
                  <div className="flex items-center space-x-1.5 text-emerald-500">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PII Masking Active</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Zero Data Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Conversation Stream */}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl shadow-sm flex flex-col h-[550px] overflow-hidden">
            {/* Chat Stream Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl p-4 rounded-xl text-xs space-y-2 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'bg-muted/40 border border-border text-foreground'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {msg.citations && (
                      <div className="pt-2 border-t border-border/50 space-y-1 text-[10px] text-muted-foreground">
                        <div className="font-bold uppercase tracking-wider text-primary">
                          Citations & Vector Sources:
                        </div>
                        {msg.citations.map((c, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            <BookOpen className="w-3 h-3 text-primary" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.tokensUsed && (
                      <div className="text-[9px] text-muted-foreground font-mono text-right">
                        {msg.tokensUsed} tokens • {msg.latencyMs}ms
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted border border-border font-bold flex items-center justify-center text-xs shrink-0 mt-1 text-foreground">
                      SK
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground p-3 rounded-lg bg-muted/20 animate-pulse">
                  <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  <span>Sathus AI Agent reasoning and evaluating vector context...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-muted/20 flex items-center space-x-3">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask Sathus AI Copilot or instruct active agent..."
                className="flex-1 h-11 px-4 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={isGenerating || !inputPrompt.trim()}
                className="h-11 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: AUTONOMOUS AGENTS SUITE (EPIC-027) */}
      {activeTab === 'agents' && <AIAgentsPlatformView />}

      {/* TAB 3: PROMPT LIBRARY */}
      {activeTab === 'prompts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Prompt Templates</div>
            {prompts.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePrompt(p)}
                className={`w-full p-4 rounded-xl text-left border transition-all space-y-1 ${
                  activePrompt?.id === p.id
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'bg-card border-border hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{p.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    v{p.version}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground capitalize">{p.category} Category</div>
              </button>
            ))}
          </div>

          {activePrompt && (
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h4 className="text-base font-bold text-foreground">{activePrompt.name}</h4>
                  <div className="text-xs text-muted-foreground">Created by {activePrompt.author}</div>
                </div>
                <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center space-x-1">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Template</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prompt Template String</label>
                <pre className="p-4 rounded-xl bg-background border border-border text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">
                  {activePrompt.template}
                </pre>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Interpolated Variables</label>
                <div className="flex flex-wrap gap-2">
                  {activePrompt.variables.map((v, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RAG & KNOWLEDGE BASE */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Vector Knowledge Base & Ingestion</h3>
              <p className="text-xs text-muted-foreground">pgvector embedding stores and document chunking status for EPIC-020 RAG.</p>
            </div>
            <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90">
              <Plus className="w-4 h-4" />
              <span>Ingest Document</span>
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
            {knowledge.map((source) => (
              <div key={source.id} className="p-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-lg bg-muted border border-border shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{source.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center space-x-3 pt-0.5">
                      <span>Chunks: <strong className="text-foreground">{source.chunkCount}</strong></span>
                      <span>• Vectors: <strong className="text-foreground">{source.vectorCount}</strong></span>
                      <span>• Model: {source.embeddingModel}</span>
                    </div>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {source.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: OBSERVABILITY & COST TRACKING */}
      {activeTab === 'observability' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">AI Gateway Observability & Token Metrics</h3>
            <p className="text-xs text-muted-foreground">Real-time usage telemetry, provider latency, and cost allocation breakdown.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total AI Requests', val: mockAIMetrics.totalRequests.toLocaleString(), icon: <Zap className="w-4 h-4 text-primary" /> },
              { label: 'Tokens Processed', val: mockAIMetrics.totalTokensProcessed.toLocaleString(), icon: <Cpu className="w-4 h-4 text-purple-500" /> },
              { label: 'Estimated Provider Cost', val: `$${mockAIMetrics.estimatedCostUsd}`, icon: <BarChart3 className="w-4 h-4 text-emerald-500" /> },
              { label: 'Average Response Latency', val: `${mockAIMetrics.averageLatencyMs} ms`, icon: <Clock className="w-4 h-4 text-amber-500" /> },
            ].map((m, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>{m.label}</span>
                  {m.icon}
                </div>
                <div className="text-2xl font-extrabold text-foreground">{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
