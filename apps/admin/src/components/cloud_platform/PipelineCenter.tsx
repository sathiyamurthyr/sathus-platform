"use client";

import React, { useState } from "react";

export const PipelineCenter: React.FC = () => {
  const [pipelines, setPipelines] = useState([
    {
      id: "pipe-01",
      name: "odyssey-gateway-api",
      repository: "https://github.com/odyssey/gateway-api.git",
      branch: "main",
      status: "active",
      lastRun: "2026-07-22 10:15",
      lastStatus: "success",
    },
    {
      id: "pipe-02",
      name: "odyssey-auth-service",
      repository: "https://github.com/odyssey/auth-service.git",
      branch: "release-v2",
      status: "active",
      lastRun: "2026-07-21 14:32",
      lastStatus: "success",
    }
  ]);

  const [runs, setRuns] = useState([
    {
      id: "run-01",
      pipelineId: "pipe-01",
      runNumber: 142,
      trigger: "commit",
      commit: "aef3c21",
      status: "success",
      startedAt: "2026-07-22 10:11",
      duration: "3m 42s",
      vulnerabilities: { critical: 0, high: 1, medium: 4, low: 12 },
      dependencies: ["fastapi (0.100.0)", "sqlalchemy (2.0.18)", "asyncpg (0.28.0)"]
    },
    {
      id: "run-02",
      pipelineId: "pipe-01",
      runNumber: 141,
      trigger: "manual",
      commit: "5e2c1a8",
      status: "success",
      startedAt: "2026-07-22 09:20",
      duration: "3m 35s",
      vulnerabilities: { critical: 0, high: 0, medium: 2, low: 10 },
      dependencies: ["fastapi (0.100.0)", "sqlalchemy (2.0.18)", "asyncpg (0.28.0)"]
    }
  ]);

  const [selectedPipeId, setSelectedPipeId] = useState("pipe-01");
  const [isTriggering, setIsTriggering] = useState(false);
  const [selectedRun, setSelectedRun] = useState<typeof runs[0] | null>(runs[0]);

  const handleTrigger = () => {
    setIsTriggering(true);
    setTimeout(() => {
      const newRunNumber = runs.filter(r => r.pipelineId === selectedPipeId).length + 143;
      const newRun = {
        id: `run-${newRunNumber}`,
        pipelineId: selectedPipeId,
        runNumber: newRunNumber,
        trigger: "manual",
        commit: Math.random().toString(16).substring(2, 9),
        status: "success",
        startedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        duration: "3m 12s",
        vulnerabilities: { critical: 0, high: 0, medium: 1, low: 5 },
        dependencies: ["fastapi (0.100.0)", "sqlalchemy (2.0.18)", "asyncpg (0.28.0)"]
      };

      setRuns(prev => [newRun, ...prev]);
      setSelectedRun(newRun);
      setIsTriggering(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">GitOps Pipelines</span>
            <span className="text-2xl">🚀</span>
          </div>
          <span className="text-3xl font-bold text-white block mt-3">{pipelines.length} Registered</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Security Scan Coverage</span>
            <span className="text-2xl">🛡️</span>
          </div>
          <span className="text-3xl font-bold text-white block mt-3">100% SBOM</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Supply Chain Registry</span>
            <span className="text-2xl">📦</span>
          </div>
          <span className="text-3xl font-bold text-white block mt-3">Verified Digests</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-white">Pipelines list</h2>
          <div className="space-y-2">
            {pipelines.map(pipe => (
              <button
                key={pipe.id}
                onClick={() => setSelectedPipeId(pipe.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedPipeId === pipe.id
                    ? "bg-indigo-600/20 border-indigo-500/50 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <div className="font-semibold text-sm">{pipe.name}</div>
                <div className="text-xs text-slate-500 truncate mt-1">{pipe.repository}</div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span>Branch: {pipe.branch}</span>
                  <span className="text-emerald-400 font-medium">● {pipe.status}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleTrigger}
            disabled={isTriggering}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isTriggering ? "Triggering..." : "Trigger GitOps Pipeline"}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-white">Run History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5">Run Number</th>
                    <th>Commit</th>
                    <th>Trigger</th>
                    <th>Started At</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {runs.filter(r => r.pipelineId === selectedPipeId).map(run => (
                    <tr
                      key={run.id}
                      onClick={() => setSelectedRun(run)}
                      className={`cursor-pointer transition-colors ${
                        selectedRun?.id === run.id ? "bg-slate-800/40 text-white" : "text-slate-300 hover:bg-slate-800/20"
                      }`}
                    >
                      <td className="py-3 font-semibold text-indigo-400">#{run.runNumber}</td>
                      <td className="font-mono text-xs">{run.commit}</td>
                      <td className="capitalize">{run.trigger}</td>
                      <td>{run.startedAt}</td>
                      <td>{run.duration}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {run.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedRun && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>🛡️</span> Security Scan results (Run #{selectedRun.runNumber})
                </h3>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center text-rose-400">
                    <span>Critical CVEs</span>
                    <span className="font-semibold">{selectedRun.vulnerabilities.critical}</span>
                  </div>
                  <div className="flex justify-between items-center text-amber-500">
                    <span>High CVEs</span>
                    <span className="font-semibold">{selectedRun.vulnerabilities.high}</span>
                  </div>
                  <div className="flex justify-between items-center text-yellow-400">
                    <span>Medium CVEs</span>
                    <span className="font-semibold">{selectedRun.vulnerabilities.medium}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Low CVEs</span>
                    <span className="font-semibold">{selectedRun.vulnerabilities.low}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>📦</span> Software Bill of Materials (SBOM)
                </h3>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs space-y-2">
                  <span className="text-slate-500 block mb-1.5">Package Inventory</span>
                  {selectedRun.dependencies.map((dep: string, i: number) => (
                    <div key={i} className="flex justify-between text-slate-300 font-mono">
                      <span>{dep.split(" ")[0]}</span>
                      <span className="text-slate-500">{dep.split(" ")[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
