import React from "react";

export default function CollectionsPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <h1 className="text-2xl font-bold text-white">Knowledge Collections & Spaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Platform Architecture", "AI Agent Specs", "Engineering Manuals"].map((c, idx) => (
          <div key={idx} className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="font-semibold text-white">{c}</h3>
            <p className="text-xs text-slate-400 mt-2">Logical space organizing domain knowledge assets.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
