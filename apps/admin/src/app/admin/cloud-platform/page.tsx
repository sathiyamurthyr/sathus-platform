import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { KubernetesDashboard } from "@/components/cloud_platform/KubernetesDashboard";
import { PipelineCenter } from "@/components/cloud_platform/PipelineCenter";
import { InfrastructureCenter } from "@/components/cloud_platform/InfrastructureCenter";

export const metadata: Metadata = {
  title: "Enterprise Cloud Platform Control",
  description: "Monitor multi-region Kubernetes clusters, GitOps pipelines, and Terraform configurations.",
  alternates: {
    canonical: "/admin/cloud-platform",
  },
};

export default function CloudPlatformDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Enterprise Cloud Platform (ECP)</h1>
          <p className="text-sm text-slate-400 mt-1">Multi-Region Kubernetes, GitOps CI/CD Pipelines & Infrastructure as Code</p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/admin/cloud-platform/kubernetes"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm font-medium transition-colors"
          >
            Kubernetes Manager
          </Link>
          <Link
            href="/admin/cloud-platform/devops"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm font-medium transition-colors"
          >
            CI/CD Pipelines
          </Link>
          <Link
            href="/admin/cloud-platform/iac"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm font-medium transition-colors"
          >
            IaC State Center
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-900 pt-6">
        <h2 className="text-xl font-semibold text-white mb-4">☸️ Cluster Management Status</h2>
        <KubernetesDashboard />
      </div>

      <div className="border-t border-slate-900 pt-6">
        <h2 className="text-xl font-semibold text-white mb-4">🚀 DevOps GitOps Workflows</h2>
        <PipelineCenter />
      </div>

      <div className="border-t border-slate-900 pt-6">
        <h2 className="text-xl font-semibold text-white mb-4">🔒 Infrastructure as Code (IaC)</h2>
        <InfrastructureCenter />
      </div>
    </div>
  );
}
