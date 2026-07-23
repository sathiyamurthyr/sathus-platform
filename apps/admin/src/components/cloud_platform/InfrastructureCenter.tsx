"use client";

import React, { useState } from "react";

export const InfrastructureCenter: React.FC = () => {
  const [templates, setTemplates] = useState([
    {
      id: "iac-01",
      name: "odyssey-networking-vpc",
      description: "Provision core VPC, subnets, and routes across regions",
      provider: "terraform",
      status: "synced",
      driftDetected: false,
      resourcesCount: 14,
    },
    {
      id: "iac-02",
      name: "odyssey-databases-aurora",
      description: "Postgres Aurora Cluster with scaling groups",
      provider: "terraform",
      status: "synced",
      driftDetected: true,
      resourcesCount: 8,
    }
  ]);

  const [drifts, setDrifts] = useState([
    {
      id: "drift-01",
      templateId: "iac-02",
      resource: "aws_rds_cluster.postgres",
      attribute: "backup_retention_period",
      expected: "7 days",
      actual: "1 day",
      reason: "Modified in AWS Console out-of-band",
      time: "2026-07-22 12:45"
    }
  ]);

  const [selectedTempId, setSelectedTempId] = useState("iac-01");
  const [isPlanning, setIsPlanning] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [stateLocked, setStateLocked] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTempId) || templates[0];

  const handlePlan = () => {
    setIsPlanning(true);
    setStateLocked(true);
    setLogs(prev => [...prev, `[INFO] Initializing state workspace for ${selectedTemplate.name}...`]);
    
    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        `[INFO] Planning changes for environment 'development'...`,
        `[SUCCESS] Plan: 3 resources to add, 0 to change, 0 to destroy.`,
        `[INFO] Running drift detection check...`,
        selectedTemplate.driftDetected 
          ? `[WARNING] Drift detected! Out-of-band modification found in aws_rds_cluster.postgres.`
          : `[SUCCESS] State matches active template infrastructure configuration (No Drift).`
      ]);
      setIsPlanning(false);
    }, 2000);
  };

  const handleApply = () => {
    setIsApplying(true);
    setLogs(prev => [...prev, `[INFO] Acquiring lock for state file...`]);
    
    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        `[INFO] Applying plan: adding VPC networks and routing policies...`,
        `[INFO] Updating state database registry...`,
        `[SUCCESS] Apply completed successfully! 3 resources added.`,
        `[INFO] Releasing state file lock...`
      ]);
      
      if (selectedTemplate.driftDetected) {
        // Resolve drift after apply
        setTemplates(prev => prev.map(t => {
          if (t.id === selectedTempId) {
            return { ...t, driftDetected: false };
          }
          return t;
        }));
      }

      setIsApplying(false);
      setStateLocked(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">IaC Templates</span>
            <span className="text-2xl">📋</span>
          </div>
          <span className="text-3xl font-bold text-white block mt-3">{templates.length} Active</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Managed Resources</span>
            <span className="text-2xl">🏢</span>
          </div>
          <span className="text-3xl font-bold text-white block mt-3">
            {templates.reduce((acc, t) => acc + t.resourcesCount, 0)} Items
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Drift Status</span>
            <span className="text-2xl">🔍</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {templates.filter(t => t.driftDetected).length > 0 ? "Drifted" : "In Sync"}
            </span>
            {templates.filter(t => t.driftDetected).length > 0 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Action Required</span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Operational</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">State Lock</span>
            <span className="text-2xl">🔒</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {stateLocked ? "Locked" : "Unlocked"}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">Concurrency Safe</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-white">IaC Configuration Files</h2>
          <div className="space-y-2">
            {templates.map(temp => (
              <button
                key={temp.id}
                onClick={() => { setSelectedTempId(temp.id); setLogs([]); }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedTempId === temp.id
                    ? "bg-indigo-600/20 border-indigo-500/50 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <div className="font-semibold text-sm">{temp.name}</div>
                <div className="text-xs text-slate-500 mt-1 truncate">{temp.description}</div>
                <div className="flex justify-between items-center text-xs mt-3">
                  <span className="uppercase px-1.5 py-0.25 bg-slate-800 rounded text-slate-400">
                    {temp.provider}
                  </span>
                  {temp.driftDetected ? (
                    <span className="text-rose-400 font-medium">⚠️ Drift Detected</span>
                  ) : (
                    <span className="text-emerald-400 font-medium">✓ In Sync</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Infrastructure Actions: {selectedTemplate.name}</h2>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 font-mono">
                Environment: development
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePlan}
                disabled={isPlanning || isApplying}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isPlanning ? "Planning..." : "Run IaC Plan & Check Drift"}
              </button>
              <button
                onClick={handleApply}
                disabled={isApplying || logs.length === 0 || isPlanning}
                className="px-4 py-2 border border-slate-700 hover:border-slate-600 disabled:opacity-50 text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                {isApplying ? "Applying..." : "Apply Infrastructure Changes"}
              </button>
            </div>

            {/* Execution logs output console */}
            {logs.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 font-mono text-xs text-slate-300 space-y-2 h-44 overflow-y-auto">
                <span className="text-slate-500 block border-b border-slate-850 pb-1 mb-2">Workspace Logs</span>
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className={
                      log.includes("[SUCCESS]")
                        ? "text-emerald-400"
                        : log.includes("[WARNING]")
                        ? "text-rose-400"
                        : "text-slate-300"
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drift details panel if active */}
          {selectedTemplate.driftDetected && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>⚠️</span> Active Drift details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="py-2">Cloud Resource</th>
                      <th>Attribute</th>
                      <th>Expected Configuration</th>
                      <th>Actual Value</th>
                      <th>Drift Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300 font-mono">
                    {drifts.filter(d => d.templateId === selectedTemplate.id).map(drift => (
                      <tr key={drift.id}>
                        <td className="py-3 text-indigo-400 font-semibold">{drift.resource}</td>
                        <td className="text-slate-400">{drift.attribute}</td>
                        <td className="text-emerald-400">{drift.expected}</td>
                        <td className="text-rose-400">{drift.actual}</td>
                        <td className="text-slate-400 font-sans">{drift.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
