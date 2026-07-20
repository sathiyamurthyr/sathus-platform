import { Clock, ShieldAlert, CheckCircle2, User, Key, HardDrive } from 'lucide-react';

export default function AppActivityPage() {
  const activities = [
    { title: 'API Token Generated', desc: 'Sathish Kumar created sk_live_99f for Staging Cluster', time: '10m ago', icon: <Key className="w-4 h-4 text-primary" /> },
    { title: 'SOC 2 Audit Exported', desc: 'System exported compliance log bundle for US-East-1', time: '1h ago', icon: <ShieldAlert className="w-4 h-4 text-emerald-500" /> },
    { title: 'Memomes Vault Storage Sync', desc: 'Encrypted object payload 1.2 GB uploaded via zero-knowledge vault', time: '3h ago', icon: <HardDrive className="w-4 h-4 text-primary" /> },
    { title: 'Sathus AI Agent Launched', desc: 'Autonomous risk assessment workflow deployed with guardrails', time: '5h ago', icon: <CheckCircle2 className="w-4 h-4 text-primary" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
          <Clock className="w-6 h-6 text-primary" />
          <span>Platform Audit & Activity Log</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Real-time event stream for workspace security, API actions, and tenant activities.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="space-y-3 divide-y divide-border/60">
          {activities.map((act, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex items-start space-x-3">
              <div className="p-2 rounded-md bg-muted shrink-0 mt-0.5">{act.icon}</div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>{act.title}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{act.time}</span>
                </div>
                <div className="text-xs text-muted-foreground">{act.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
