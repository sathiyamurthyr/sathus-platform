import React from "react";
import { ContextExplorer } from "@/components/knowledge/ContextExplorer";

export default function ContextPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <h1 className="text-2xl font-bold text-white">Context Engine & Window Explorer</h1>
      <ContextExplorer />
    </div>
  );
}
