'use client';

import React from 'react';
import { ShieldCheck, Activity, Wifi, Lock } from 'lucide-react';

export function StatusBar() {
  return (
    <div className="h-7 border-t border-border bg-card/60 px-4 flex items-center justify-between text-[11px] text-muted-foreground select-none font-mono">
      <div className="flex items-center space-x-4">
        <span className="flex items-center space-x-1.5 text-emerald-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sathus Node: US-East-1 (Healthy)</span>
        </span>
        <span className="hidden sm:flex items-center space-x-1">
          <Wifi className="w-3 h-3 text-muted-foreground" />
          <span>Latency: 24ms</span>
        </span>
        <span className="hidden md:flex items-center space-x-1">
          <Activity className="w-3 h-3 text-primary" />
          <span>SLA: 99.99%</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="flex items-center space-x-1">
          <Lock className="w-3 h-3 text-emerald-500" />
          <span>Zero-Knowledge Vault Active</span>
        </span>
        <span className="hidden lg:flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-primary" />
          <span>RBAC Enforced</span>
        </span>
      </div>
    </div>
  );
}
