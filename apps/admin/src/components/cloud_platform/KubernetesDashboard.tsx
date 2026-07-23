"use client";

import React, { useState } from "react";

export const KubernetesDashboard: React.FC = () => {
  const [clusters, setClusters] = useState([
    {
      id: "eks-prod-cluster-01",
      name: "odyssey-eks-prod-us-east-1",
      region: "us-east-1",
      version: "1.28",
      status: "active",
      provider: "aws",
      endpoint: "https://eks-prod-01.eks.amazonaws.com",
      desiredNodes: 6,
      maxNodes: 20,
      cpuCores: 24,
      memoryGb: 96,
    },
    {
      id: "aks-staging-cluster-02",
      name: "odyssey-aks-stage-eu-west-1",
      region: "eu-west-1",
      version: "1.27",
      status: "active",
      provider: "azure",
      endpoint: "https://aks-stage-02.database.windows.net",
      desiredNodes: 3,
      maxNodes: 10,
      cpuCores: 12,
      memoryGb: 48,
    }
  ]);

  const [selectedClusterId, setSelectedClusterId] = useState(clusters[0].id);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isScaling, setIsScaling] = useState(false);

  const selectedCluster = clusters.find(c => c.id === selectedClusterId) || clusters[0];

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      setClusters(prev => prev.map(c => {
        if (c.id === selectedClusterId) {
          return { ...c, version: "1.28", status: "active" };
        }
        return c;
      }));
      setIsUpgrading(false);
    }, 2000);
  };

  const handleScale = (amount: number) => {
    setIsScaling(true);
    setTimeout(() => {
      setClusters(prev => prev.map(c => {
        if (c.id === selectedClusterId) {
          const newNodes = Math.max(1, c.desiredNodes + amount);
          return { 
            ...c, 
            desiredNodes: newNodes,
            cpuCores: newNodes * 4,
            memoryGb: newNodes * 16,
          };
        }
        return c;
      }));
      setIsScaling(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Active Clusters</span>
            <span className="text-2xl">☸️</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">{clusters.length}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">AWS & Azure</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Total Node Count</span>
            <span className="text-2xl">🖥️</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {clusters.reduce((acc, c) => acc + c.desiredNodes, 0)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Autoscaling</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Compute Cores (CPU)</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {clusters.reduce((acc, c) => acc + c.cpuCores, 0)} Cores
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Healthy</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm font-medium">Memory Allocation</span>
            <span className="text-2xl">📊</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {clusters.reduce((acc, c) => acc + c.memoryGb, 0)} GB
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">98% Limit</span>
          </div>
        </div>
      </div>

      {/* Cluster Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-white">Cluster List</h2>
          <div className="space-y-2">
            {clusters.map(cluster => (
              <button
                key={cluster.id}
                onClick={() => setSelectedClusterId(cluster.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedClusterId === cluster.id
                    ? "bg-indigo-600/20 border-indigo-500/50 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <div className="font-semibold text-sm">{cluster.name}</div>
                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <span className="uppercase px-1.5 py-0.25 bg-slate-800 rounded text-slate-300">
                    {cluster.provider}
                  </span>
                  <span>{cluster.region}</span>
                  <span className="ml-auto text-emerald-400 font-medium">{cluster.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Cluster Details: {selectedCluster.name}</h2>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono">
              Version {selectedCluster.version}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 block">API Endpoint</span>
              <span className="text-slate-300 font-mono text-xs truncate block">{selectedCluster.endpoint}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Kubernetes Version</span>
              <span className="text-slate-300">{selectedCluster.version}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Desired Node Capacity</span>
              <span className="text-slate-300">{selectedCluster.desiredNodes} Nodes (Max {selectedCluster.maxNodes})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Resource Usage</span>
              <span className="text-slate-300">{selectedCluster.cpuCores} Cores / {selectedCluster.memoryGb} GB RAM</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleScale(1)}
              disabled={isScaling}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isScaling ? "Scaling..." : "Scale Node Pool (+1 Node)"}
            </button>
            <button
              onClick={() => handleScale(-1)}
              disabled={isScaling || selectedCluster.desiredNodes <= 1}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isScaling ? "Scaling..." : "Scale Node Pool (-1 Node)"}
            </button>
            <button
              onClick={handleUpgrade}
              disabled={isUpgrading || selectedCluster.version === "1.28"}
              className="px-4 py-2 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors ml-auto disabled:opacity-50"
            >
              {isUpgrading ? "Upgrading..." : selectedCluster.version === "1.28" ? "Up to date (v1.28)" : "Upgrade to v1.28"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
