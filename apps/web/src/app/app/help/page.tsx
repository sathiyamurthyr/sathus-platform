import Link from 'next/link';
import { HelpCircle, BookOpen, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';

export default function AppHelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          <span>Help & Enterprise Support Hub</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Documentation, architectural guides, security SLAs, and direct support routing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 text-foreground font-bold text-sm">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Developer Documentation</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Explore API references, Model Context Protocol (MCP) specs, and deployment reference guides.
          </p>
          <Link
            href="/resources/documentation"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>View Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-3 text-foreground font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Trust Center & Security</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Audit controls, zero-knowledge encryption architecture, and HIPAA/SOC 2 compliance details.
          </p>
          <Link
            href="/trust/security"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>Trust Center</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
