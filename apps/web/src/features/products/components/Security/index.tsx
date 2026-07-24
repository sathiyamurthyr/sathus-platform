import { Shield, Lock, Key, Clock, Download, FileText } from 'lucide-react';
import type { SecurityFeature } from '../../types';

interface SecurityProps {
  security: SecurityFeature[];
}

const ICONS: Record<string, React.ReactNode> = {
  'aes-256': <Lock className="h-5 w-5" />,
  'zero-knowledge': <Shield className="h-5 w-5" />,
  'password-sharing': <Key className="h-5 w-5" />,
  'expiring-links': <Clock className="h-5 w-5" />,
  'download-controls': <Download className="h-5 w-5" />,
  'audit-logs': <FileText className="h-5 w-5" />,
};

export function Security({ security }: SecurityProps) {
  return (
    <div className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Security</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {security.map((feature) => (
            <div key={feature.id} className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {ICONS[feature.id] || <Shield className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}