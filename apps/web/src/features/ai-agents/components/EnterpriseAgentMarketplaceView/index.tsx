'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Star,
  Download,
  CheckCircle2,
  Search,
  Tag,
  ShieldCheck,
  Bot,
  Zap,
} from 'lucide-react';
import { mockMarketplaceAgents } from '../../data/mock-agents-data';
import type { MarketplaceAgentItem } from '../../types';

export function EnterpriseAgentMarketplaceView() {
  const [agents, setAgents] = useState<MarketplaceAgentItem[]>(mockMarketplaceAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleInstallToggle = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextInstalled = !a.isInstalled;
          setNotice(`Agent "${a.name}" ${nextInstalled ? 'INSTALLED' : 'UNINSTALLED'}.`);
          setTimeout(() => setNotice(null), 3500);
          return { ...a, isInstalled: nextInstalled };
        }
        return a;
      })
    );
  };

  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span>Enterprise AI Agent Marketplace & Distribution Gallery</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.12 Discover, install, and share pre-built organization & tenant agent packages with 1-click deployment.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Enterprise Catalog</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search marketplace agents by name, category, or publisher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Agent Marketplace Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                  {agent.category}
                </span>
                <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{agent.rating}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-foreground">{agent.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>

              <div className="p-3 rounded-lg bg-background border border-border space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Publisher:</span>
                  <strong className="text-foreground">{agent.publisherName}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Installations:</span>
                  <strong className="text-emerald-500">{agent.installationsCount} active installs</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase">
                Model: {agent.priceModel}
              </span>
              <button
                onClick={() => handleInstallToggle(agent.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  agent.isInstalled
                    ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
                }`}
              >
                {agent.isInstalled ? 'Installed (Remove)' : '1-Click Install'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
