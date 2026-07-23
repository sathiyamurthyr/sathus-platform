import React from "react";
import Link from "next/link";
import { InfrastructureCenter } from "@/components/cloud_platform/InfrastructureCenter";

export default function IaCPage() {
  return (
    <div className="p-8 space-y-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center gap-3">
        <Link href="/admin/cloud-platform" className="text-slate-400 hover:text-slate-200 text-sm font-medium">
          ← Back to ECP
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Infrastructure as Code (IaC)</h1>
        <p className="text-sm text-slate-400 mt-1">Deploy, apply templates, check configurations drift, and maintain state locking locks.</p>
      </div>

      <ProductIaCCenter />
    </div>
  );
}

const ProductIaCCenter = () => {
  return <InfrastructureCenter />;
};
