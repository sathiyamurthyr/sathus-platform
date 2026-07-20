import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { BookOpen, Code2, Server, Terminal, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation & API Guides',
  description: 'Technical documentation, OpenAPI specifications, SDK references, and architecture blueprints for Sathus Platform.',
  alternates: {
    canonical: '/resources/documentation',
  },
  openGraph: {
    title: 'Documentation & API Guides — Sathus Technology',
    description: 'Technical documentation, OpenAPI specifications, SDK references, and architecture blueprints for Sathus Platform.',
    url: `${siteConfig.url}/resources/documentation`,
  },
};

const docSections = [
  {
    title: 'FastAPI Backend Specifications',
    description: 'OpenAPI 3.0 schemas, RFC 7807 error envelopes, rate limiting, and OAuth2 authentication endpoints.',
    icon: Server,
    badge: 'API Spec',
    href: '/resources/documentation#api',
  },
  {
    title: 'Model Context Protocol (MCP) SDKs',
    description: 'TypeScript, Python, and Go SDK documentation for building custom MCP tools, prompts, and resources.',
    icon: Code2,
    badge: 'SDK Reference',
    href: '/resources/documentation#mcp',
  },
  {
    title: 'Data Platform & Lakehouse Blueprints',
    description: 'Databricks, Apache Iceberg, Unity Catalog governance, and PySpark streaming data pipeline architectures.',
    icon: Terminal,
    badge: 'Architecture',
    href: '/resources/documentation#lakehouse',
  },
  {
    title: 'Security & Compliance Guides',
    description: 'HIPAA, SOC 2 Type II controls, zero-retention AI guardrails, and audit logging setup instructions.',
    icon: ShieldCheck,
    badge: 'Security',
    href: '/resources/documentation#security',
  },
];

export default function DocumentationPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <div>
        <Breadcrumb items={[{ label: 'Resources', href: '/resources' }, { label: 'Documentation' }]} />
        <SectionIntro
          eyebrow="Developer Hub"
          title="Platform Documentation & API Reference"
          description="Access comprehensive API references, SDK documentation, OpenAPI schemas, and enterprise architecture blueprints."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {docSections.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.title} className="rounded-xl border border-border p-6 bg-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-muted px-2 py-0.5 rounded text-muted-foreground">
                    {doc.badge}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">{doc.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{doc.description}</p>
              </div>
              <Link
                href={doc.href}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                Read Documentation
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
        <h2 className="text-xl font-bold">Quick Start Code Examples</h2>
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary">1. Model Context Protocol (MCP) Tool Definition (TypeScript)</h3>
          <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-x-auto text-foreground">
{`import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({ name: "sathus-mcp-gateway", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "query_lakehouse",
    description: "Executes governed SQL query against Databricks Iceberg table",
    inputSchema: { type: "object", properties: { sql: { type: "string" } }, required: ["sql"] }
  }]
}));`}
          </pre>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center max-w-4xl mx-auto">
        <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Need Dedicated Engineering Support?</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
          Our principal engineers assist enterprise teams with custom SDK integrations and architecture reviews.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
        >
          Contact Developer Support
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
