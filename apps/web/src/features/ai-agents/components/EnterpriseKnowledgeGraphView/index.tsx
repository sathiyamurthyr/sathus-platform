'use client';

import React, { useState } from 'react';
import {
  Network,
  Share2,
  GitBranch,
  Database,
  Layers,
  Search,
  CheckCircle2,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { mockKnowledgeEntities, mockKnowledgeRelationships } from '../../data/mock-agents-data';
import type { KnowledgeEntity } from '../../types';

export function EnterpriseKnowledgeGraphView() {
  const [entities] = useState<KnowledgeEntity[]>(mockKnowledgeEntities);
  const [relationships] = useState(mockKnowledgeRelationships);
  const [selectedEntityId, setSelectedEntityId] = useState('ent-srv-01');

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) || entities[0];

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Network className="w-5 h-5 text-primary" />
            <span>Enterprise Knowledge Graph & Context Engine</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.8 Entity registry, relationship mapping (`depends_on`, `owns`, `accesses`), and semantic context unification.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold font-mono">
          <Share2 className="w-4 h-4" />
          <span>Unified Context Window Active</span>
        </div>
      </div>

      {/* Graph Visualizer & Entity Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Knowledge Entities ({entities.length})
          </h3>

          <div className="space-y-2">
            {entities.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelectedEntityId(e.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${
                  selectedEntityId === e.id
                    ? 'border-primary bg-primary/5 text-primary font-bold'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{e.name}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-extrabold">
                    {e.type}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground pt-1">{e.ownerTenant}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Entity Relationship Inspector */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground font-sans">{selectedEntity.name}</h3>
              <p className="text-xs text-muted-foreground font-sans">{selectedEntity.description}</p>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20">
              {selectedEntity.type}
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-muted-foreground font-bold text-[11px] font-sans block">
              Knowledge Graph Relationships:
            </span>

            {relationships
              .filter((r) => r.sourceEntityId === selectedEntity.id || r.targetEntityId === selectedEntity.id)
              .map((rel) => (
                <div key={rel.id} className="p-3 rounded-lg bg-background border border-border flex items-center justify-between font-sans">
                  <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
                    <span>{rel.sourceEntityName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-primary/10 text-primary">
                      {rel.relationType}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <span>{rel.targetEntityName}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <span className="text-muted-foreground font-bold text-[11px] font-sans block">
              Entity Attributes Metadata:
            </span>
            <pre className="p-3 rounded-lg bg-background border border-border text-emerald-500 text-[11px]">
              {selectedEntity.attributesJson}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
