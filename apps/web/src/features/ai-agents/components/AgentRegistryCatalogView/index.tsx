'use client';

import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Search,
  CheckCircle2,
  Sliders,
  Cpu,
  Zap,
  Globe,
  Lock,
  Layers,
  Activity,
  History,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';
import { mockAIAgents } from '../../data/mock-agents-data';
import type { AgentItem, AgentCategory, AgentStatus } from '../../types';

export function AgentRegistryCatalogView() {
  const [agents, setAgents] = useState<AgentItem[]>(mockAIAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Registration Form State
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [newAgentCategory, setNewAgentCategory] = useState<AgentCategory>('analytics_bi');
  const [newAgentModel, setNewAgentModel] = useState('Claude 3.5 Sonnet (Anthropic)');

  const [notice, setNotice] = useState<string | null>(null);

  const handleRegisterAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newAgent: AgentItem = {
      id: `agent-${Date.now()}`,
      name: newAgentName,
      description: newAgentDescription,
      category: newAgentCategory,
      status: 'active',
      currentVersion: 'v1.0.0',
      modelProvider: newAgentModel,
      temperature: 0.1,
      maxContextTokens: 128000,
      capabilities: [
        { id: `cap-${Date.now()}-1`, name: 'Vector RAG Search', description: 'Semantic search over knowledge base.', category: 'search', isEnabled: true },
        { id: `cap-${Date.now()}-2`, name: 'Structured JSON Output', description: 'Enforces strict JSON schemas.', category: 'output', isEnabled: true },
      ],
      availableVersions: [
        { version: 'v1.0.0', changelog: 'Initial production release.', modelProvider: newAgentModel, releasedAt: new Date().toISOString(), isActive: true },
      ],
      ownerTenant: 'Acme Production Main',
      totalExecutionsCount: 0,
      avgLatencyMs: 850,
      successRatePercent: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAgents((prev) => [newAgent, ...prev]);
    setShowRegisterModal(false);
    setNewAgentName('');
    setNewAgentDescription('');
    setNotice(`AI Agent "${newAgent.name}" registered and deployed to registry.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          const nextStatus: AgentStatus = a.status === 'active' ? 'suspended' : 'active';
          setNotice(`Agent "${a.name}" status toggled to ${nextStatus.toUpperCase()}.`);
          setTimeout(() => setNotice(null), 3500);
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.modelProvider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>Enterprise Agent Registry & Catalog</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.2 Register, discover, version (v1, v2), and manage capabilities for autonomous AI agents.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register New AI Agent</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents by name, model, or capability..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'analytics_bi', label: 'BI & Analytics' },
            { id: 'devops_sre', label: 'DevOps & SRE' },
            { id: 'security_audit', label: 'Security & Audit' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                    {agent.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-foreground pt-1">{agent.name}</h3>
                </div>

                <button
                  onClick={() => handleToggleAgentStatus(agent.id)}
                  title="Toggle Agent Status"
                  className="text-xs font-bold"
                >
                  {agent.status === 'active' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      SUSPENDED
                    </span>
                  )}
                </button>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2">{agent.description}</p>

              <div className="p-3 rounded-lg bg-background border border-border space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>LLM Kernel:</span>
                  <strong className="text-foreground">{agent.modelProvider}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Version:</span>
                  <strong className="text-primary">{agent.currentVersion}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Success SLA:</span>
                  <strong className="text-emerald-500">{agent.successRatePercent}%</strong>
                </div>
              </div>

              {/* Capabilities Pills */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Active Capabilities:</span>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((cap) => (
                    <span key={cap.id} className="px-2 py-0.5 rounded text-[10px] bg-muted/50 text-foreground border border-border">
                      {cap.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Executions: {agent.totalExecutionsCount}</span>
              <span>Avg Latency: {agent.avgLatencyMs}ms</span>
            </div>
          </div>
        ))}
      </div>

      {/* Register Agent Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <Bot className="w-5 h-5 text-primary" />
                <span>Register Enterprise AI Agent</span>
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterAgent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Warehouse ETL Optimization Agent"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Description & Objectives</label>
                <textarea
                  rows={2}
                  placeholder="Describe autonomous responsibilities and system boundaries..."
                  value={newAgentDescription}
                  onChange={(e) => setNewAgentDescription(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Category</label>
                  <select
                    value={newAgentCategory}
                    onChange={(e) => setNewAgentCategory(e.target.value as AgentCategory)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                  >
                    <option value="analytics_bi">BI & Analytics</option>
                    <option value="devops_sre">DevOps & SRE</option>
                    <option value="security_audit">Security & Audit</option>
                    <option value="customer_support">Customer Support</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">LLM Kernel</label>
                  <select
                    value={newAgentModel}
                    onChange={(e) => setNewAgentModel(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                  >
                    <option value="Claude 3.5 Sonnet (Anthropic)">Claude 3.5 Sonnet</option>
                    <option value="GPT-4o (OpenAI)">GPT-4o</option>
                    <option value="Gemini 1.5 Pro (Google)">Gemini 1.5 Pro</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Deploy to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
