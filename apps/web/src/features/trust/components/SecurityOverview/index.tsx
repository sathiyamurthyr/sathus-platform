import { Lock, Shield, Key, Server, Vault, Package, Activity, AlertCircle } from 'lucide-react';
import type { SecurityControl } from '../../types';

interface SecurityOverviewProps {
  controls: SecurityControl[];
}

const ICONS: Record<string, React.ReactNode> = {
  sdls: <Shield className="h-5 w-5" />,
  iam: <Key className="h-5 w-5" />,
  encryption: <Lock className="h-5 w-5" />,
  infrastructure: <Server className="h-5 w-5" />,
  secrets: <Vault className="h-5 w-5" />,
  dependencies: <Package className="h-5 w-5" />,
  monitoring: <Activity className="h-5 w-5" />,
  incident: <AlertCircle className="h-5 w-5" />,
};

export function SecurityOverview({ controls }: SecurityOverviewProps) {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Security Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {controls.map((control) => (
            <div key={control.id} className="rounded-lg border border-border p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                {ICONS[control.category] || <Shield className="h-5 w-5" />}
              </div>
              <h3 className="font-semibold mb-2">{control.title}</h3>
              <p className="text-sm text-muted-foreground">{control.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}