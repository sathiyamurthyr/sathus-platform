import React from "react";
import { DashboardMetricsGrid } from "@/components/knowledge/DashboardMetrics";
import { KnowledgeGraphViewer } from "@/components/knowledge/KnowledgeGraphViewer";
import { SemanticSearchDashboard } from "@/components/knowledge/SemanticSearchDashboard";
import { ContextExplorer } from "@/components/knowledge/ContextExplorer";
import { KnowledgeTimeline } from "@/components/knowledge/KnowledgeTimeline";

export default function KnowledgeDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-100">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Knowledge Intelligence Platform (KIP)</h1>
        <p className="text-sm text-slate-400 mt-1">Enterprise Foundation, Document Intelligence, Knowledge Graph & Context Engine</p>
      </div>

      <DashboardMetricsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KnowledgeGraphViewer />
        <SemanticSearchDashboard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContextExplorer />
        <KnowledgeTimeline />
      </div>
    </div>
  );
}
