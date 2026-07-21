'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Award,
  Clock,
  Filter,
  Globe,
  Lock,
  Sparkles,
  Hash,
  Database,
} from 'lucide-react';
import { mockAuditLogs, mockComplianceFrameworks } from '../../data/mock-audit-compliance-data';
import type { AuditLogEvent, ComplianceFrameworkItem, AuditEventCategory } from '../../types';

export function AuditComplianceCenterView() {
  const [auditLogs] = useState<AuditLogEvent[]>(mockAuditLogs);
  const [frameworks] = useState<ComplianceFrameworkItem[]>(mockComplianceFrameworks);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [retentionDays, setRetentionDays] = useState(365);

  const [notice, setNotice] = useState<string | null>(null);

  const handleExportAuditLogs = () => {
    setNotice('Audit Trail exported in SIEM JSON format (sha256 verified).');
    setTimeout(() => setNotice(null), 4000);
  };

  const filteredLogs = auditLogs.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.targetResource.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || evt.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || evt.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const severityBadges: Record<string, string> = {
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Immutable Audit Logs & Compliance Center</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.9 Immutable audit trail stream, SIEM log export, and ISO 27001 / SOC 2 / GDPR compliance governance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportAuditLogs}
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export SIEM Audit Logs</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Compliance Framework Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {frameworks.map((fw) => (
          <div key={fw.id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{fw.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${fw.status === 'compliant' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                {fw.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold font-mono text-emerald-500">{fw.complianceScorePercent}%</div>
              <div className="text-[10px] text-muted-foreground">
                Passing: {fw.passingControlsCount} / {fw.totalControlsCount} controls
              </div>
            </div>

            <div className="pt-2 border-t border-border text-[10px] font-mono text-muted-foreground">
              Audited: {new Date(fw.lastAuditedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Stream Controls & Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
            <Hash className="w-4 h-4 text-primary" />
            <span>Immutable Audit Trail Stream</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit stream..."
                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground"
            >
              <option value="all">All Categories</option>
              <option value="security">Security</option>
              <option value="api">API Events</option>
              <option value="billing">Billing</option>
              <option value="authentication">Authentication</option>
            </select>

            {/* Retention Slider */}
            <div className="flex items-center space-x-2 bg-background border border-border px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-muted-foreground">Retention:</span>
              <strong className="text-primary">{retentionDays} Days</strong>
            </div>
          </div>
        </div>

        {/* Audit Stream Table */}
        <div className="divide-y divide-border font-mono">
          {filteredLogs.map((evt) => (
            <div key={evt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">{evt.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${severityBadges[evt.severity]}`}>
                    {evt.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                    {evt.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">{evt.description}</p>
                <div className="text-[10px] text-muted-foreground">
                  By: <strong className="text-foreground">{evt.performedBy}</strong> ({evt.performedByRole}) • IP: {evt.ipAddress} • Target: <code className="text-primary">{evt.targetResource}</code>
                </div>
              </div>

              <div className="text-right text-[10px] text-muted-foreground shrink-0 space-y-1">
                <div>{new Date(evt.timestamp).toLocaleString()}</div>
                <div className="text-emerald-500 font-extrabold">{evt.hashSignature}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
