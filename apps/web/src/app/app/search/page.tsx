import Link from 'next/link';
import { Search, ArrowRight, ShieldCheck, Layers, Bot, FileText, FolderKanban } from 'lucide-react';

export default function AppSearchPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
          <Search className="w-6 h-6 text-primary" />
          <span>Global Search Hub</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Search across workspace projects, agentic AI tasks, Memomes files, and platform audit logs.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Type query to search across Sathus Cloud..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:border-primary"
            autoFocus
          />
        </div>

        <div className="pt-4 border-t border-border space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Search Index Categories
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Projects & Workspaces', desc: 'EPIC-016 Repository synchronization index', icon: <FolderKanban className="w-4 h-4 text-primary" />, href: '/app/projects' },
              { title: 'Sathus AI Agent Workflows', desc: 'EPIC-020 Agentic reasoning traces & tool calls', icon: <Bot className="w-4 h-4 text-primary" />, href: '/app/ai' },
              { title: 'Memomes Encrypted Files', desc: 'EPIC-015 AES-256 client-side zero-knowledge vault', icon: <FileText className="w-4 h-4 text-primary" />, href: '/app/files' },
              { title: 'Audit & Compliance Stream', desc: 'EPIC-025 Security events & SIEM logs', icon: <ShieldCheck className="w-4 h-4 text-primary" />, href: '/app/activity' },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="p-4 rounded-lg bg-muted/40 border border-border hover:border-primary/50 transition-all flex items-start space-x-3 group"
              >
                <div className="p-2 rounded-md bg-card shrink-0 mt-0.5">{cat.icon}</div>
                <div className="flex-1 space-y-0.5">
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{cat.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[10px] text-muted-foreground">{cat.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
