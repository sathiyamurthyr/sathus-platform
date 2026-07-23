"use client";

import React, { useState } from "react";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  score: string;
  snippet: string;
}

export const SemanticSearchDashboard: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setResults([
      {
        id: "1",
        title: "Sathus Architecture Guide 2.0",
        type: "pdf",
        score: "0.98",
        snippet: `...matched semantic chunk for '${query}' in Section 4.2 High-Performance Hybrid Search...`,
      },
      {
        id: "2",
        title: "Enterprise Knowledge Graph Spec",
        type: "docx",
        score: "0.94",
        snippet: `...relates to '${query}' via ontology relationship graph edges...`,
      },
      {
        id: "3",
        title: "Context Window Optimization Guidelines",
        type: "md",
        score: "0.89",
        snippet: `...explains token compression and LLM context caching matching '${query}'...`,
      },
    ]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-2">Hybrid Semantic Search Engine</h3>
      <p className="text-xs text-slate-400 mb-4">Combine BM25 keyword matching with dense vector embeddings</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything or search enterprise documents..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Semantic Results ({results.length})</div>
          {results.map((r) => (
            <div key={r.id} className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-lg hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-indigo-300">{r.title}</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  Score: {r.score}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{r.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
