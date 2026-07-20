'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Bookmark,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Trash2,
  FolderKanban,
  FileText,
  Bot,
  Bell,
  BookOpen,
  User,
  CheckCircle2,
} from 'lucide-react';
import { mockSearchDocuments, mockSavedSearches, mockSearchSuggestions } from '../../data/mock-search-index';
import type { SearchEntityType, SavedSearch } from '../../types';

export function GlobalSearchHubView() {
  const [query, setQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter items based on search query, entity type, tag
  const filteredResults = mockSearchDocuments.filter((doc) => {
    if (selectedEntity !== 'all' && doc.entityType !== selectedEntity) return false;
    if (selectedTag !== 'all' && !doc.tags?.includes(selectedTag)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.snippet?.toLowerCase().includes(q) ||
      doc.content?.toLowerCase().includes(q) ||
      doc.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return (b.score || 0) - (a.score || 0);
  });

  const handleSaveSearch = () => {
    if (!query) return;
    const newSaved: SavedSearch = {
      id: `saved-${Date.now()}`,
      userId: 'user-1',
      name: `Search: "${query}"`,
      query: query,
      filters: { entityTypes: selectedEntity !== 'all' ? [selectedEntity as SearchEntityType] : [] },
      createdAt: new Date().toISOString(),
    };
    setSavedSearches([...savedSearches, newSaved]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedSearches(savedSearches.filter((s) => s.id !== id));
  };

  const entityIcons: Record<string, React.ReactNode> = {
    projects: <FolderKanban className="w-4 h-4 text-cyan-500" />,
    tasks: <FolderKanban className="w-4 h-4 text-blue-500" />,
    files: <FileText className="w-4 h-4 text-amber-500" />,
    ai_knowledge: <Bot className="w-4 h-4 text-primary" />,
    notifications: <Bell className="w-4 h-4 text-emerald-500" />,
    documentation: <BookOpen className="w-4 h-4 text-purple-500" />,
    users: <User className="w-4 h-4 text-pink-500" />,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
          <Search className="w-6 h-6 text-primary" />
          <span>Enterprise Search & Knowledge Hub</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          EPIC-019 Multi-tenant full-text & semantic vector search engine across Sathus Cloud.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>Search query saved to your workspace bookmarks!</span>
        </div>
      )}

      {/* Main Search Input & Auto-complete */}
      <div className="relative bg-card border border-border rounded-xl p-4 shadow-md space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Search projects, AI knowledge base, files, documentation, tasks..."
            className="w-full h-12 pl-12 pr-24 rounded-lg border border-border bg-background text-sm font-medium text-foreground focus:outline-none focus:border-primary shadow-inner"
          />

          <div className="absolute right-3 top-3 flex items-center space-x-2">
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex px-2 py-1 text-[10px] font-mono font-bold bg-muted border border-border rounded text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Auto-complete suggestions dropdown */}
        {showSuggestions && query && (
          <div className="absolute left-0 right-0 top-16 mt-1 bg-card border border-border rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1">
              <span>Suggestions & Quick Links</span>
              <button onClick={() => setShowSuggestions(false)} className="hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1 mt-1">
              {mockSearchSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(s.text);
                    setShowSuggestions(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-muted text-xs font-medium text-foreground transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{s.text}</span>
                  </span>
                  {s.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase">
                      {s.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent & Saved Searches Quick Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-border/50">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-muted-foreground font-semibold flex items-center space-x-1 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              <span>Recent:</span>
            </span>
            {['SOC 2 Audit', 'Lakehouse Migration', 'MCP Protocol', 'Rate Limiter'].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(q)}
                className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 text-[11px] font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {query && (
            <button
              onClick={handleSaveSearch}
              className="inline-flex items-center space-x-1 text-primary hover:underline font-semibold text-xs"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmark Query</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Faceted Filter Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-bold text-sm text-foreground flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-primary" />
                <span>Facet Filters</span>
              </span>
              {(selectedEntity !== 'all' || selectedTag !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedEntity('all');
                    setSelectedTag('all');
                  }}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Entity Type Filter */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                Entity Category
              </div>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Entities' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'tasks', label: 'Tasks' },
                  { id: 'files', label: 'Memomes Files' },
                  { id: 'ai_knowledge', label: 'AI Knowledge' },
                  { id: 'documentation', label: 'Documentation' },
                ].map((ent) => (
                  <button
                    key={ent.id}
                    onClick={() => setSelectedEntity(ent.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedEntity === ent.id
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span>{ent.label}</span>
                    {selectedEntity === ent.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                Popular Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Lakehouse', 'SOC 2', 'AI Agent', 'MCP', 'Security'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      selectedTag === tag
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center space-x-1">
                  <Bookmark className="w-3.5 h-3.5 text-primary" />
                  <span>Saved Bookmarks</span>
                </div>
                <div className="space-y-1">
                  {savedSearches.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border text-xs"
                    >
                      <button
                        onClick={() => setQuery(s.query)}
                        className="font-medium text-foreground hover:text-primary transition-colors text-left line-clamp-1 flex-1"
                      >
                        {s.name}
                      </button>
                      <button
                        onClick={() => handleDeleteSaved(s.id)}
                        className="text-muted-foreground hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Results Stream */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Results Count & Sort */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Found <span className="font-bold text-foreground">{sortedResults.length}</span> search results
            </div>

            <div className="flex items-center space-x-2">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'title')}
                className="h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="relevance">Relevance Score</option>
                <option value="date">Last Updated</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Stream */}
          <div className="space-y-4">
            {sortedResults.length > 0 ? (
              sortedResults.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-muted border border-border shrink-0 mt-0.5">
                        {(doc.entityType && entityIcons[doc.entityType]) || <Search className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">
                            {(doc.entityType || 'general').replace('_', ' ')}
                          </span>
                          {doc.score !== undefined && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              Score: {(doc.score * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                        <Link
                          href={doc.url}
                          className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center space-x-1.5"
                        >
                          <span>{doc.title}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{doc.snippet}</p>

                  {/* AI RAG Semantic Preview Card for EPIC-020 */}
                  {doc.ragSnippet && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI RAG Vector Summary Preview</span>
                      </div>
                      <p className="text-xs text-foreground italic">{doc.ragSnippet}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
                    <div className="flex flex-wrap gap-1.5">
                      {doc.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      {doc.author && <span>By {doc.author}</span>}
                      {doc.updatedAt && <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center space-y-3 bg-card border border-border rounded-xl">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Search className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-foreground">No Matching Documents</div>
                <div className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your query term or resetting your entity category filters.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
