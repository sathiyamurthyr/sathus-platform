'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  RefreshCw,
  Database,
  Trash2,
  CheckCircle2,
  Radio,
  Server,
  Layers,
  Clock,
  Play,
  PauseCircle,
  Megaphone,
} from 'lucide-react';
import { mockMaintenanceTasks, mockEmergencyBanner } from '../../data/mock-maintenance-data';
import type { MaintenanceTaskItem, EmergencyBannerConfig } from '../../types';

export function SystemMaintenanceOperationsView() {
  const [tasks] = useState<MaintenanceTaskItem[]>(mockMaintenanceTasks);
  const [banner, setBanner] = useState<EmergencyBannerConfig>(mockEmergencyBanner);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleMaintenanceMode = () => {
    const nextState = !isMaintenanceMode;
    setIsMaintenanceMode(nextState);
    setNotice(`Platform Maintenance Mode ${nextState ? 'ENABLED (Non-admin write locks active)' : 'DISABLED (Normal operations resumed)'}.`);
    setTimeout(() => setNotice(null), 4500);
  };

  const handleToggleEmergencyBanner = () => {
    setBanner((prev) => ({ ...prev, isActive: !prev.isActive }));
    setNotice(`Emergency Announcement Banner ${!banner.isActive ? 'published to all active sessions' : 'dismissed'}.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleFlushCache = () => {
    setNotice('Redis 7.2 L2 Cache flushed successfully. Session tokens preserved.');
    setTimeout(() => setNotice(null), 3500);
  };

  const handleVacuumDatabase = () => {
    setNotice('PostgreSQL 16 VACUUM ANALYZE trigger initiated for pgvector tables.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>System Maintenance & Operations Center</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.13 Monitor background worker queues, trigger platform maintenance mode, dispatch emergency banners, and execute DB vacuum tasks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleMaintenanceMode}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2 ${
              isMaintenanceMode
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-card border border-border text-foreground hover:bg-muted/40'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>{isMaintenanceMode ? 'Maintenance Mode ACTIVE' : 'Enable Maintenance Mode'}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Emergency Announcement Banner Control */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
            <Megaphone className="w-4 h-4 text-primary" />
            <span>Broadcast Emergency Announcement Banner</span>
          </h3>

          <button
            onClick={handleToggleEmergencyBanner}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              banner.isActive
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {banner.isActive ? 'Deactivate Banner' : 'Publish Announcement Banner'}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-background border border-border space-y-2">
          <div className="text-xs font-bold text-foreground">{banner.title}</div>
          <p className="text-xs text-muted-foreground">{banner.message}</p>
        </div>
      </div>

      {/* 1-Click Operations Control Grid */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Server className="w-4 h-4 text-primary" />
          <span>Administrative System Tasks</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleFlushCache}
            className="p-4 rounded-xl bg-background border border-border hover:bg-muted/20 text-left space-y-2 transition-colors"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
              <RefreshCw className="w-4 h-4 text-primary" />
              <span>Flush Redis Cache</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Flush L2 query cache and reset transient API rate limit counters.</p>
          </button>

          <button
            onClick={handleVacuumDatabase}
            className="p-4 rounded-xl bg-background border border-border hover:bg-muted/20 text-left space-y-2 transition-colors"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>PostgreSQL Vacuum</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Run VACUUM ANALYZE to reclaim disk space and re-index vector tables.</p>
          </button>

          <button
            onClick={() => {
              setNotice('Celery worker pool restarted successfully (64 workers online).');
              setTimeout(() => setNotice(null), 3500);
            }}
            className="p-4 rounded-xl bg-background border border-border hover:bg-muted/20 text-left space-y-2 transition-colors"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
              <Radio className="w-4 h-4 text-purple-500" />
              <span>Restart Worker Pool</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Gracefully restart Celery background queue workers.</p>
          </button>
        </div>
      </div>

      {/* Scheduled Maintenance Tasks */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span>Scheduled Maintenance Schedule</span>
        </h3>

        <div className="divide-y divide-border font-mono text-xs">
          {tasks.map((t) => (
            <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2 font-sans">
                  <span className="font-bold text-foreground">{t.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${t.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-sans">{t.description}</p>
              </div>

              <div className="text-right text-[10px] text-muted-foreground shrink-0">
                Start: {new Date(t.scheduledStartTime).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
