"use client";

import React, { useState } from "react";

export const KnowledgeGraphViewer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>("Sathus Platform");

  const nodes = [
    { id: "1", label: "Sathus Platform", type: "System", color: "#6366f1", x: 250, y: 150 },
    { id: "2", label: "Document Intelligence", type: "Module", color: "#10b981", x: 100, y: 80 },
    { id: "3", label: "Knowledge Graph Engine", type: "Engine", color: "#f59e0b", x: 400, y: 90 },
    { id: "4", label: "Semantic Search", type: "Search", color: "#ec4899", x: 120, y: 250 },
    { id: "5", label: "Context Engine", type: "LLM Context", color: "#8b5cf6", x: 380, y: 240 },
  ];

  const edges = [
    { from: "1", to: "2", label: "INCLUDES" },
    { from: "1", to: "3", label: "POWERS" },
    { from: "1", to: "4", label: "INDEXES" },
    { from: "1", to: "5", label: "OPTIMIZES" },
    { from: "2", to: "3", label: "EXTRACTS" },
    { from: "4", to: "5", label: "RETRIEVES" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Enterprise Knowledge Graph</h3>
          <p className="text-xs text-slate-400">Interactive node-edge relationship visualization</p>
        </div>
        <div className="flex space-x-2">
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded">5 Nodes</span>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded">6 Edges</span>
        </div>
      </div>

      <div className="relative w-full h-[320px] bg-slate-950/60 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full">
          {edges.map((e, idx) => {
            const source = nodes.find((n) => n.id === e.from);
            const target = nodes.find((n) => n.id === e.to);
            if (!source || !target) return null;
            return (
              <g key={idx}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              </g>
            );
          })}
          {nodes.map((n) => (
            <g
              key={n.id}
              onClick={() => setSelectedNode(n.label)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <circle cx={n.x} cy={n.y} r="22" fill={n.color} opacity="0.9" />
              <text x={n.x} y={n.y + 35} fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="500">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {selectedNode && (
        <div className="mt-4 p-3 bg-slate-800/60 border border-slate-700/50 rounded-lg flex items-center justify-between text-xs text-slate-300">
          <span>Selected Node: <strong className="text-white">{selectedNode}</strong></span>
          <span className="text-indigo-400">Confidence: 99.2% | Lineage: Verifiable</span>
        </div>
      )}
    </div>
  );
};
