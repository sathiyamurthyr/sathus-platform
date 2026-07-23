"use client";

import React, { useState } from "react";

export const ContextExplorer: React.FC = () => {
  const [allocatedTokens, setAllocatedTokens] = useState(4250);
  const maxTokens = 128000;

  const utilizationPct = ((allocatedTokens / maxTokens) * 100).toFixed(2);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Enterprise Context Engine</h3>
          <p className="text-xs text-slate-400">LLM Context Window & Token Optimization</p>
        </div>
        <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
          Session Active
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Context Window Allocation</span>
          <span className="font-mono text-indigo-300">{allocatedTokens.toLocaleString()} / {maxTokens.toLocaleString()} Tokens ({utilizationPct}%)</span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500" style={{ width: `${utilizationPct}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-xs mt-4">
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="block text-slate-500">Tenant Scope</span>
          <span className="text-white font-semibold">Policy Active</span>
        </div>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="block text-slate-500">Compression</span>
          <span className="text-emerald-400 font-semibold">50% Token Reduction</span>
        </div>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <span className="block text-slate-500">Context Cache</span>
          <span className="text-indigo-400 font-semibold">HIT (&lt;1ms)</span>
        </div>
      </div>
    </div>
  );
};
