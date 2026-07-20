'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Siren,
  ShieldAlert,
  CheckCircle2,
  Clock,
  UserCheck,
  Zap,
  Bell,
  Sliders,
  GitPullRequest,
  Network,
  Plus,
  X,
  Check,
  ChevronRight,
  MessageSquare,
  Mail,
  Flame,
  User,
} from 'lucide-react';
import {
  mockAlertRules,
  mockFiringAlerts,
  mockIncidents,
  mockEscalationPolicy,
  mockServiceDependencies,
} from '../../data/mock-alerting-data';
import type { Incident, AlertRule, AlertInstance, IncidentStatus, AlertSeverity } from '../../types';

export function AlertingIncidentPlatformView() {
  const [activeTab, setActiveTab] = useState<'incidents' | 'rules' | 'alerts' | 'escalations' | 'dependencies'>('incidents');

  // Incident State
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(mockIncidents[0]);
  const [notice, setNotice] = useState<string | null>(null);

  // Alert Rules State
  const [rules, setRules] = useState<AlertRule[]>(mockAlertRules);

  // Firing Alerts State
  const [firingAlerts, setFiringAlerts] = useState<AlertInstance[]>(mockFiringAlerts);

  const handleStatusChange = (incidentId: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const updatedTimeline = [
            ...inc.timeline,
            {
              id: `t-${Date.now()}`,
              timestamp: new Date().toISOString(),
              action: `Status updated to ${newStatus.toUpperCase()}`,
              user: 'Sathish Kumar (DevOps)',
            },
          ];
          const updatedInc = { ...inc, status: newStatus, timeline: updatedTimeline, updatedAt: new Date().toISOString() };
          if (selectedIncident?.id === incidentId) {
            setSelectedIncident(updatedInc);
          }
          return updatedInc;
        }
        return inc;
      })
    );
    setNotice(`Incident ${incidentId} status updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isEnabled: !r.isEnabled } : r))
    );
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setFiringAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
    );
    setNotice(`Alert ${alertId} acknowledged.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const severityBadges: Record<AlertSeverity, string> = {
    P0_CRITICAL: 'bg-red-500/10 text-red-500 border-red-500/20',
    P1_HIGH: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    P2_MEDIUM: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    P3_LOW: 'bg-muted text-muted-foreground border-border',
  };

  const statusBadges: Record<IncidentStatus, string> = {
    open: 'bg-red-500/10 text-red-500 border-red-500/20',
    acknowledged: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    investigating: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    mitigated: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    closed: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Siren className="w-6 h-6 text-red-500 animate-pulse" />
            <span>Enterprise Alerting & Incident Platform</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Story 13.3 Proactive alert evaluation, incident response lifecycles, 3-tier escalations, and dependency mapping.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center space-x-1.5">
            <Flame className="w-4 h-4" />
            <span>1 Active Incident (P1 High)</span>
          </span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'incidents', label: 'Incident Dashboard', icon: <Siren className="w-4 h-4" /> },
          { id: 'rules', label: 'Alert Rules Engine', icon: <Sliders className="w-4 h-4" /> },
          { id: 'alerts', label: 'Firing & Historical Alerts', icon: <Bell className="w-4 h-4" /> },
          { id: 'escalations', label: 'Escalation Policies', icon: <GitPullRequest className="w-4 h-4" /> },
          { id: 'dependencies', label: 'Service Dependencies', icon: <Network className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as 'incidents' | 'rules' | 'alerts' | 'escalations' | 'dependencies')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: INCIDENT DASHBOARD */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          {/* Key Metrics KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-1 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground uppercase">Active Incidents</div>
              <div className="text-2xl font-extrabold text-amber-500">1 P1 High</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 space-y-1 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground uppercase">MTTA (Mean Time to Acknowledge)</div>
              <div className="text-2xl font-extrabold text-foreground">4 <span className="text-xs font-normal text-muted-foreground">mins</span></div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 space-y-1 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground uppercase">MTTR (Mean Time to Resolve)</div>
              <div className="text-2xl font-extrabold text-foreground">24 <span className="text-xs font-normal text-muted-foreground">mins</span></div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 space-y-1 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground uppercase">Escalation Status</div>
              <div className="text-2xl font-extrabold text-emerald-500">Level 1 On-Call</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Incident Directory</div>
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`w-full p-4 rounded-xl text-left border transition-all space-y-2 ${
                    selectedIncident?.id === inc.id
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-card border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${severityBadges[inc.severity]}`}>
                      {inc.severity.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${statusBadges[inc.status]}`}>
                      {inc.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-foreground leading-snug">{inc.title}</h4>
                  <div className="text-[10px] text-muted-foreground">Owner: {inc.owner}</div>
                </button>
              ))}
            </div>

            {selectedIncident && (
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase border ${severityBadges[selectedIncident.severity]}`}>
                        {selectedIncident.severity.replace('_', ' ')}
                      </span>
                      <h3 className="text-base font-bold text-foreground">{selectedIncident.title}</h3>
                    </div>
                    <div className="text-xs text-muted-foreground pt-1">
                      Incident ID: <strong className="text-foreground">{selectedIncident.id}</strong> • Assigned: <strong className="text-foreground">{selectedIncident.owner}</strong>
                    </div>
                  </div>

                  {/* Status Transition Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {selectedIncident.status !== 'resolved' && selectedIncident.status !== 'closed' && (
                      <>
                        {selectedIncident.status === 'open' && (
                          <button
                            onClick={() => handleStatusChange(selectedIncident.id, 'acknowledged')}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:opacity-90"
                          >
                            Acknowledge
                          </button>
                        )}
                        {selectedIncident.status === 'acknowledged' && (
                          <button
                            onClick={() => handleStatusChange(selectedIncident.id, 'investigating')}
                            className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:opacity-90"
                          >
                            Investigate
                          </button>
                        )}
                        {selectedIncident.status === 'investigating' && (
                          <button
                            onClick={() => handleStatusChange(selectedIncident.id, 'mitigated')}
                            className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:opacity-90"
                          >
                            Mitigate
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(selectedIncident.id, 'resolved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:opacity-90"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Root Cause Analysis if present */}
                {selectedIncident.rootCause && (
                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary">Diagnosed Root Cause</div>
                    <p className="text-xs text-foreground leading-relaxed">{selectedIncident.rootCause}</p>
                  </div>
                )}

                {/* Affected Microservices */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Affected Platform Services</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.affectedServices.map((srv, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-background border border-border text-xs font-semibold text-foreground">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline Log */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Incident Timeline & Audit Logs</div>
                  <div className="space-y-2">
                    {selectedIncident.timeline.map((event) => (
                      <div key={event.id} className="p-3 rounded-lg bg-background border border-border text-xs space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground font-mono text-[10px]">
                          <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                          <span>{event.user}</span>
                        </div>
                        <p className="text-foreground leading-relaxed font-medium">{event.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ALERT RULES ENGINE */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Configured Alert Rules Engine</h3>
              <p className="text-xs text-muted-foreground">Metric threshold, latency, AI provider, and database connection evaluators.</p>
            </div>
            <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90">
              <Plus className="w-4 h-4" />
              <span>Create Alert Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${severityBadges[rule.severity]}`}>
                      {rule.severity.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                        rule.isEnabled ? 'bg-primary justify-end' : 'bg-muted justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-foreground">{rule.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>

                  <div className="p-3 rounded-lg bg-background border border-border font-mono text-xs space-y-1">
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Rule Condition</div>
                    <div className="text-primary font-bold text-ellipsis overflow-hidden">{rule.condition}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Window: {rule.evaluationWindowMin}m • Cooldown: {rule.cooldownMin}m</span>
                  <div className="flex space-x-1.5">
                    {rule.channels.map((c, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-muted text-[10px] font-semibold uppercase">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FIRING & HISTORICAL ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Firing & Historical Alert Instances</h3>
            <p className="text-xs text-muted-foreground">Real-time alert firings, threshold evaluation values, and notification delivery state.</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {firingAlerts.map((alt) => (
              <div key={alt.id} className="p-5 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 shrink-0">
                    <Bell className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-foreground">{alt.ruleName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${severityBadges[alt.severity]}`}>
                        {alt.severity.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground pt-0.5">{alt.summary}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {alt.status === 'firing' ? (
                    <button
                      onClick={() => handleAcknowledgeAlert(alt.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold text-xs hover:opacity-90"
                    >
                      Acknowledge Alert
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {alt.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ESCALATION POLICIES */}
      {activeTab === 'escalations' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-foreground">{mockEscalationPolicy.name}</h3>
            <p className="text-xs text-muted-foreground">3-Tier automated notification escalation chain with 15-minute timeout policy.</p>
          </div>

          <div className="space-y-4">
            {[
              { level: 'Level 1: DevOps On-Call', recipients: mockEscalationPolicy.level1, badge: 'bg-primary/10 text-primary border-primary/20' },
              { level: 'Level 2: Tech Leads & Architects', recipients: mockEscalationPolicy.level2, badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
              { level: 'Level 3: Executive Escalation', recipients: mockEscalationPolicy.level3, badge: 'bg-red-500/10 text-red-500 border-red-500/20' },
            ].map((chain, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-background border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase border ${chain.badge}`}>
                    {chain.level}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">Timeout: {mockEscalationPolicy.timeoutMin} mins</span>
                </div>
                <div className="text-xs text-foreground font-semibold flex items-center space-x-2 pt-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{chain.recipients.join(' • ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SERVICE DEPENDENCY MAPPING */}
      {activeTab === 'dependencies' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Service Dependencies & Downstream Blast Radius</h3>
            <p className="text-xs text-muted-foreground">Topological relationships and incident impact visualizer across microservices.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            {mockServiceDependencies.map((node) => (
              <div key={node.id} className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Network className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-xs font-bold text-foreground">{node.name}</div>
                    {node.parentServiceId && (
                      <div className="text-[10px] text-muted-foreground font-mono">Depends on: {node.parentServiceId}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {node.impactedByIncidentId && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Impacted by {node.impactedByIncidentId}
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {node.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
