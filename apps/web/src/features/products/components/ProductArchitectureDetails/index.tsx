import React from 'react';
import Link from 'next/link';
import { Server, Zap, Plug, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Product } from '../../types';

interface ProductArchitectureDetailsProps {
  product: Product;
}

export function ProductArchitectureDetails({ product }: ProductArchitectureDetailsProps) {
  const { deploymentModels, scalabilityMetrics, integrations, relatedSolutions } = product;

  if (
    !deploymentModels?.length &&
    !scalabilityMetrics?.length &&
    !integrations?.length &&
    !relatedSolutions?.length
  ) {
    return null;
  }

  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 space-y-16">
        {/* Scalability & Performance Benchmarks */}
        {scalabilityMetrics && scalabilityMetrics.length > 0 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 text-primary font-semibold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Performance & SLA Architecture</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Enterprise Scalability Metrics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scalabilityMetrics.map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6 text-center space-y-2 shadow-sm">
                  <div className="text-3xl font-extrabold text-primary">{item.value}</div>
                  <div className="font-semibold text-sm text-foreground">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deployment Options & Integrations */}
        {(deploymentModels?.length || integrations?.length) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {deploymentModels && deploymentModels.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-8 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 text-foreground font-semibold">
                  <Server className="w-5 h-5 text-primary" />
                  <h4 className="text-xl font-bold">Supported Deployment Models</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deploymentModels.map((model, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-muted/50 border border-border p-3 rounded-lg text-sm font-medium">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      <span>{model}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {integrations && integrations.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-8 space-y-6 shadow-sm">
                <div className="flex items-center space-x-3 text-foreground font-semibold">
                  <Plug className="w-5 h-5 text-primary" />
                  <h4 className="text-xl font-bold">Ecosystem Integrations</h4>
                </div>
                <div className="space-y-3">
                  {integrations.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between border-b border-border/60 pb-2.5 last:border-0 last:pb-0">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cross-linking to Solutions */}
        {relatedSolutions && relatedSolutions.length > 0 && (
          <div className="bg-muted/30 border border-border rounded-xl p-8 space-y-6 text-center">
            <h4 className="text-lg font-bold">Recommended Engineering Solutions</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {relatedSolutions.map((sol, idx) => (
                <Link
                  key={idx}
                  href={sol.href}
                  className="inline-flex items-center space-x-2 bg-card border border-border hover:border-primary px-4 py-2 rounded-lg text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>{sol.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
