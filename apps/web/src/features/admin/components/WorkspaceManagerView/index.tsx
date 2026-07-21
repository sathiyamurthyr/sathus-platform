'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Users,
  Bot,
  Archive,
  RotateCcw,
  Sparkles,
  Database,
  Server,
  LayoutGrid,
} from 'lucide-react';
import { mockWorkspaces } from '../../data/mock-workspace-data';
import type { WorkspaceItem } from '../../types';

export function WorkspaceManagerView() {
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>(mockWorkspaces);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Workspace Form State
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');
  const [newWsTemplate, setNewWsTemplate] = useState<'ai_rag_agent' | 'data_lakehouse' | 'cloud_microservices' | 'custom'>('ai_rag_agent');
  const [newWsQuotaGB, setNewWsQuotaGB] = useState(500);

  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleArchive = (id: string, isArchived: boolean) => {
    setWorkspaces((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isArchived: !isArchived } : w))
    );
    setNotice(`Workspace "${id}" ${isArchived ? 'restored' : 'archived'} successfully.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    const newWs: WorkspaceItem = {
      id: `ws-${Date.now()}`,
      tenantId: 'tnt-101',
      tenantName: 'Acme Production Main',
      name: newWsName,
      description: newWsDesc || 'Enterprise workspace isolated resource boundary.',
      template: newWsTemplate,
      memberCount: 1,
      storageUsedGB: 5,
      storageQuotaGB: Number(newWsQuotaGB),
      aiRequestsMonthly: 0,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkspaces((prev) => [newWs, ...prev]);
    setShowCreateModal(false);
    setNewWsName('');
    setNewWsDesc('');
    setNotice(`Workspace "${newWs.name}" created successfully.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const filteredWorkspaces = workspaces.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const templateBadges: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    ai_rag_agent: { label: 'AI RAG Agent Squad', color: 'bg-primary/10 text-primary border-primary/20', icon: <Sparkles className="w-3.5 h-3.5" /> },
    data_lakehouse: { label: 'Data Lakehouse', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', icon: <Database className="w-3.5 h-3.5" /> },
    cloud_microservices: { label: 'Microservices Mesh', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: <Server className="w-3.5 h-3.5" /> },
    custom: { label: 'Custom Architecture', color: 'bg-muted text-muted-foreground border-border', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Layers className="w-5 h-5 text-primary" />
            <span>Workspace Lifecycle & Resource Governance</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.3 Create isolated workspaces from architectural templates, meter storage & AI token quotas, and archive/restore workspaces.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workspace</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workspaces or templates..."
            className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          Showing <strong>{filteredWorkspaces.length}</strong> active & archived workspaces
        </div>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredWorkspaces.map((ws) => {
          const tmpl = templateBadges[ws.template] || templateBadges.custom;
          return (
            <div key={ws.id} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border flex items-center space-x-1.5 ${tmpl.color}`}>
                    {tmpl.icon}
                    <span>{tmpl.label}</span>
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">Tenant: {ws.tenantName}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground">{ws.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">{ws.description}</p>
                </div>

                {/* Storage & AI Usage Bar */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground">Storage Meter:</span>
                    <span className="font-bold text-foreground">{ws.storageUsedGB} / {ws.storageQuotaGB} GB</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(ws.storageUsedGB / ws.storageQuotaGB) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center space-x-1"><Users className="w-3.5 h-3.5 text-primary" /><span>{ws.memberCount}</span></span>
                  <span className="flex items-center space-x-1"><Bot className="w-3.5 h-3.5 text-primary" /><span>{(ws.aiRequestsMonthly / 1000).toFixed(1)}k</span></span>
                </div>

                <button
                  onClick={() => handleToggleArchive(ws.id, ws.isArchived)}
                  className="p-1.5 rounded-lg bg-card border border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                  title={ws.isArchived ? 'Restore Workspace' : 'Archive Workspace'}
                >
                  {ws.isArchived ? <RotateCcw className="w-4 h-4 text-emerald-500" /> : <Archive className="w-4 h-4 text-amber-500" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>Launch New Workspace</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Workspace Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Healthcare GenAI Squad"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Isolated workspace for LLM fine-tuning and agent workflows."
                  value={newWsDesc}
                  onChange={(e) => setNewWsDesc(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Architectural Template</label>
                <select
                  value={newWsTemplate}
                  onChange={(e) => setNewWsTemplate(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                >
                  <option value="ai_rag_agent">AI RAG Agent Squad (Vector Search + LLM Gateway)</option>
                  <option value="data_lakehouse">Data Lakehouse (Streaming Pipelines + Lakehouse)</option>
                  <option value="cloud_microservices">Cloud Microservices (FastAPI + Kafka Mesh)</option>
                  <option value="custom">Custom Blank Workspace</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Storage Allocation Quota (GB)</label>
                <input
                  type="number"
                  value={newWsQuotaGB}
                  onChange={(e) => setNewWsQuotaGB(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                />
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Launch Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
