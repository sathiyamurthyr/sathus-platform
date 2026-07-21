'use client';

import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Shield,
  Layers,
  Cpu,
  Brain,
  Sparkles,
  Lock,
} from 'lucide-react';
import { mockEnterpriseMemories } from '../../data/mock-agents-data';
import type { MemoryItem, MemoryType, MemoryScope } from '../../types';

export function EnterpriseMemorySystemView() {
  const [memories] = useState<MemoryItem[]>(mockEnterpriseMemories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [retrievedResults, setRetrievedResults] = useState<MemoryItem[]>(mockEnterpriseMemories);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = memories.filter((m) => {
      const matchesText = m.content.toLowerCase().includes(searchQuery.toLowerCase()) || m.scopeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || m.memoryType === selectedType;
      return matchesText && matchesType;
    });
    setRetrievedResults(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>Enterprise Memory System & Context Retrieval Engine</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.6 Short-term, Long-term, Semantic, Episodic, and Working Memory with vector embedding abstraction and tenant isolation.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20 text-xs font-bold font-mono">
          <Sparkles className="w-4 h-4" />
          <span>Vector Index: Multi-Provider Abstraction Layer</span>
        </div>
      </div>

      {/* Semantic Memory Search Toolbar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search enterprise memory by semantic query or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'long_term', label: 'Long-Term' },
            { id: 'semantic', label: 'Semantic' },
            { id: 'episodic', label: 'Episodic' },
          ].map((type) => (
            <button
              type="button"
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedType === type.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {type.label}
            </button>
          ))}
          <button type="submit" className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90">
            Search
          </button>
        </div>
      </form>

      {/* Memory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retrievedResults.map((mem) => (
          <div key={mem.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  {mem.memoryType.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  SCORE: {(mem.importanceScore * 100).toFixed(0)}%
                </span>
              </div>

              <p className="text-xs text-foreground leading-relaxed">{mem.content}</p>

              <div className="p-3 rounded-lg bg-background border border-border space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Scope ({mem.scope}):</span>
                  <strong className="text-foreground">{mem.scopeId}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Vector Ref:</span>
                  <strong className="text-primary">{mem.vectorEmbeddingId}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono">
              <span>Tenant Isolated</span>
              <span>{new Date(mem.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
