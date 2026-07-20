import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Building2, Users, Layers, Package } from 'lucide-react';
import type { Solution } from '../../types';

interface SolutionOverviewProps {
  solution: Solution;
}

export function SolutionOverview({ solution }: SolutionOverviewProps) {
  const {
    problemStatement,
    businessImpact,
    technicalApproach,
    idealCustomers,
    targetIndustries,
    relatedSolutions,
    relatedProducts,
  } = solution;

  if (
    !problemStatement &&
    !technicalApproach &&
    !idealCustomers?.length &&
    !targetIndustries?.length &&
    !relatedSolutions?.length &&
    !relatedProducts?.length
  ) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 space-y-16">
        {/* Problem Statement & Technical Approach */}
        {(problemStatement || technicalApproach || businessImpact) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {problemStatement && (
              <div className="space-y-6 bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="inline-flex items-center space-x-2 text-primary font-semibold text-sm uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>The Enterprise Challenge</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Enterprise Context & Bottlenecks</h3>
                <p className="text-muted-foreground leading-relaxed">{problemStatement}</p>
                {businessImpact && businessImpact.length > 0 && (
                  <div className="pt-4 border-t border-border space-y-3">
                    <p className="text-sm font-semibold text-foreground">Operational & Economic Drivers:</p>
                    <ul className="space-y-2">
                      {businessImpact.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mr-2.5 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {technicalApproach && (
              <div className="space-y-6 bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="inline-flex items-center space-x-2 text-primary font-semibold text-sm uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>Technical Blueprint</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Our Engineering Approach</h3>
                <p className="text-muted-foreground leading-relaxed">{technicalApproach}</p>
              </div>
            )}
          </div>
        )}

        {/* Target Audience & Industries */}
        {(idealCustomers?.length || targetIndustries?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {idealCustomers && idealCustomers.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3 text-foreground font-semibold">
                  <Users className="w-5 h-5 text-primary" />
                  <h4>Ideal Organizations & Teams</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {idealCustomers.map((cust, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-foreground border border-border"
                    >
                      {cust}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {targetIndustries && targetIndustries.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center space-x-3 text-foreground font-semibold">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h4>Primary Industries Served</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {targetIndustries.map((ind, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cross-linking to Related Solutions & Products */}
        {(relatedSolutions?.length || relatedProducts?.length) && (
          <div className="space-y-8 pt-8 border-t border-border">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Related Capabilities & Products</h3>
              <p className="text-sm text-muted-foreground">
                Explore connected engineering offerings and product frameworks in the Sathus ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSolutions?.map((sol, idx) => (
                <Link
                  key={`sol-${idx}`}
                  href={sol.href}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="flex items-center space-x-1.5">
                        <Layers className="w-4 h-4 text-primary" />
                        <span>Solution</span>
                      </span>
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">{sol.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{sol.description}</p>
                  </div>
                  <div className="pt-4 flex items-center text-xs font-medium text-primary">
                    <span>Explore Solution</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}

              {relatedProducts?.map((prod, idx) => (
                <Link
                  key={`prod-${idx}`}
                  href={prod.href}
                  className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="flex items-center space-x-1.5">
                        <Package className="w-4 h-4 text-primary" />
                        <span>Platform Product</span>
                      </span>
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors">{prod.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{prod.description}</p>
                  </div>
                  <div className="pt-4 flex items-center text-xs font-medium text-primary">
                    <span>View Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
