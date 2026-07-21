'use client';

import React, { useState } from 'react';
import {
  Sliders,
  AlertOctagon,
  CheckCircle2,
  Play,
  PauseCircle,
  Activity,
  Zap,
  Cpu,
  Radio,
  Layers,
  Terminal,
} from 'lucide-react';
import { mockAICommandCenterFleetStatus } from '../../data/mock-agents-data';

export function EnterpriseAICommandCenterView() {
  const [fleetStatus, setFleetStatus] = useState(mockAICommandCenterFleetStatus);
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleEmergencyStop = () => {
    const nextState = !fleetStatus.emergencyStopEngaged;
    setFleetStatus((prev) => ({
      ...prev,
      emergencyStopEngaged: nextState,
      activeAgentsCount: nextState ? 0 : 10,
      pausedAgentsCount: nextState ? 12 : 2,
    }));
    setNotice(
      nextState
        ? 'EMERGENCY STOP ENGAGED: All AI worker execution threads suspended immediately.'
        : 'Emergency stop disengaged. Agent fleet execution resumed.'
    );
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
            <span>Enterprise AI Command Center & Fleet Operations</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.15 Centralized command console for real-time fleet health, emergency kill switch, and bulk fleet control.
          </p>
        </div>

        <button
          onClick={handleToggleEmergencyStop}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2 ${
            fleetStatus.emergencyStopEngaged
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>{fleetStatus.emergencyStopEngaged ? 'DISENGAGE EMERGENCY STOP' : 'ENGAGE EMERGENCY STOP'}</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Fleet Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Total Agent Fleet</span>
          <div className="text-2xl font-bold text-foreground font-mono">{fleetStatus.totalAgentsInFleet}</div>
          <div className="text-[10px] text-muted-foreground">{fleetStatus.activeAgentsCount} active workers</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Paused Agents</span>
          <div className="text-2xl font-bold text-amber-500 font-mono">{fleetStatus.pausedAgentsCount}</div>
          <div className="text-[10px] text-muted-foreground">Standby state</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">System Fleet Health</span>
          <div className="text-2xl font-bold text-emerald-500 font-mono uppercase">{fleetStatus.systemHealthStatus}</div>
          <div className="text-[10px] text-muted-foreground">Zero active alerts</div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground">Active Worker Threads</span>
          <div className="text-2xl font-bold text-primary font-mono">{fleetStatus.activeWorkerThreadsCount}</div>
          <div className="text-[10px] text-muted-foreground">Parallel worker pool</div>
        </div>
      </div>
    </div>
  );
}
