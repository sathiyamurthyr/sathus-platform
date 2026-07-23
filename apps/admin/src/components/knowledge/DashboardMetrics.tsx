"use client";

import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: string;
  trend: "up" | "down" | "neutral";
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded ${
            trend === "up"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : trend === "down"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};

export const DashboardMetricsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <MetricCard title="Repository Size" value="2.4 GB" change="+14% this mo" icon="💾" trend="up" />
      <MetricCard title="Total Documents" value="14,890" change="+1,240 new" icon="📄" trend="up" />
      <MetricCard title="Knowledge Graph Nodes" value="48,210" change="+8.4%" icon="🕸️" trend="up" />
      <MetricCard title="Context Cache Hit Rate" value="98.6%" change="Sub-ms SLA" icon="⚡" trend="neutral" />
    </div>
  );
};
