import React from "react";
import { SemanticSearchDashboard } from "@/components/knowledge/SemanticSearchDashboard";

export default function SearchPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <h1 className="text-2xl font-bold text-white">Semantic Search Dashboard</h1>
      <SemanticSearchDashboard />
    </div>
  );
}
