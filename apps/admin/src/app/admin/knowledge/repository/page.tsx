import React from "react";
import { KnowledgeTimeline } from "@/components/knowledge/KnowledgeTimeline";

export default function RepositoryBrowserPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <h1 className="text-2xl font-bold text-white">Repository Browser & Snapshots</h1>
      <KnowledgeTimeline />
    </div>
  );
}
