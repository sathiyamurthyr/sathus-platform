"use client";

import React from "react";

export const KnowledgeTimeline: React.FC = () => {
  const events = [
    { time: "10 mins ago", title: "Document Intelligence Pipeline", desc: "Parsed 12 new PDF documents and extracted 140 metadata entities.", type: "system" },
    { time: "1 hour ago", title: "Knowledge Graph Update", desc: "Discovered 6 new relationship edges connecting Sathus Platform modules.", type: "graph" },
    { time: "3 hours ago", title: "Semantic Index Optimization", desc: "Refreshed dense vector embeddings across 1,420 chunks.", type: "search" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">Knowledge Repository Timeline</h3>
      <div className="space-y-4">
        {events.map((e, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{e.title}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">{e.time}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
