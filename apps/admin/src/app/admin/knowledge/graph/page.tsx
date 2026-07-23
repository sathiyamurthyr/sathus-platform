import React from "react";
import { KnowledgeGraphViewer } from "@/components/knowledge/KnowledgeGraphViewer";

export default function GraphPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <h1 className="text-2xl font-bold text-white">Knowledge Graph Viewer</h1>
      <KnowledgeGraphViewer />
    </div>
  );
}
