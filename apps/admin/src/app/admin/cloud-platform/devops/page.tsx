import React from "react";
import Link from "next/link";
import { PipelineCenter } from "@/components/cloud_platform/PipelineCenter";

export default function DevOpsPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center gap-3">
        <Link href="/admin/cloud-platform" className="text-slate-400 hover:text-slate-200 text-sm font-medium">
          ← Back to ECP
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">DevOps & GitOps Pipelines</h1>
        <p className="text-sm text-slate-400 mt-1">Automated deployments, image scanners, SBOM bill of materials, and supply-chain registry.</p>
      </div>

      <PipelineCenter />
    </div>
  );
}
