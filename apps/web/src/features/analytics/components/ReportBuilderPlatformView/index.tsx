'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Play,
  Calendar,
  Clock,
  Download,
  Mail,
  Send,
  Sliders,
  CheckCircle2,
  Search,
  Sparkles,
  Layers,
  Star,
  Copy,
  Trash2,
  ChevronRight,
  BarChart3,
  DollarSign,
  Bot,
  Workflow,
  Shield,
  FileSpreadsheet,
  Globe,
  Tag,
} from 'lucide-react';
import {
  mockReportTemplates,
  mockSavedReports,
  mockReportExecutionHistory,
} from '../../data/mock-reporting-data';
import type {
  ReportDefinition,
  ReportTemplate,
  ReportExportFormat,
  ReportScheduleFrequency,
} from '../../types';

export function ReportBuilderPlatformView() {
  const [activeSubTab, setActiveSubTab] = useState<'builder' | 'templates' | 'schedules' | 'library' | 'history'>('builder');
  const [savedReports, setSavedReports] = useState<ReportDefinition[]>(mockSavedReports);
  const [selectedReport, setSelectedReport] = useState<ReportDefinition>(mockSavedReports[0]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Builder Canvas Widget List
  const [builderWidgets, setBuilderWidgets] = useState(mockSavedReports[0].widgets);

  const handleRunReportNow = (format: ReportExportFormat) => {
    setExportNotice(`Executing report "${selectedReport.title}" and generating ${format.toUpperCase()} export...`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleInstantiateTemplate = (tmpl: ReportTemplate) => {
    const newRpt: ReportDefinition = {
      id: `rpt-${Date.now()}`,
      title: `${tmpl.title} (Draft)`,
      description: tmpl.description,
      owner: 'Sathish Kumar (Architect)',
      status: 'draft',
      templateId: tmpl.id,
      version: 'v1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: [tmpl.category.toLowerCase()],
      widgets: [
        { id: `w-${Date.now()}`, title: `${tmpl.title} Widget`, type: 'line_chart', metric: 'mrrDollars', period: 'month', size: 'medium' },
      ],
    };
    setSavedReports((prev) => [newRpt, ...prev]);
    setSelectedReport(newRpt);
    setBuilderWidgets(newRpt.widgets);
    setActiveSubTab('builder');
    setExportNotice(`Report instantiated from template "${tmpl.title}".`);
    setTimeout(() => setNoticeNull(), 3500);
  };

  const setNoticeNull = () => setTimeout(() => setExportNotice(null), 3500);

  const formatBadges: Record<ReportExportFormat, string> = {
    pdf: 'bg-red-500/10 text-red-500 border-red-500/20',
    xlsx: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    csv: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    json: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
            <span>Enterprise Visual Report Builder & Scheduled Reporting</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Story 14.3 Visual report canvas, pre-built templates, automated cron scheduling, multi-format exports (PDF/Excel/CSV), and delivery tracking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleRunReportNow('pdf')}
            className="inline-flex items-center space-x-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run & Generate PDF</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Primary Navigation Sub-Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'builder', label: 'Visual Report Canvas Builder', icon: <FileText className="w-4 h-4" /> },
          { id: 'templates', label: 'Report Templates Gallery', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'schedules', label: 'Automated Cron Schedules', icon: <Clock className="w-4 h-4" /> },
          { id: 'library', label: 'Report Library & Archives', icon: <Layers className="w-4 h-4" /> },
          { id: 'history', label: 'Execution & Delivery History', icon: <Send className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as 'builder' | 'templates' | 'schedules' | 'library' | 'history')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
              activeSubTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: VISUAL REPORT CANVAS BUILDER */}
      {activeSubTab === 'builder' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-foreground">{selectedReport.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {selectedReport.version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pt-0.5">{selectedReport.description}</p>
              </div>

              <div className="flex items-center space-x-2 font-mono text-xs">
                {(['pdf', 'xlsx', 'csv', 'json'] as ReportExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => handleRunReportNow(fmt)}
                    className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase border transition-all ${formatBadges[fmt]}`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Page Preview */}
            <div className="p-6 rounded-xl bg-background border border-border space-y-6">
              {/* Header Branding Block */}
              <div className="p-4 rounded-lg bg-card border border-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary font-bold text-sm">SATHUS</div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Sathus Cloud Corporate Report Header</div>
                    <div className="text-[10px] text-muted-foreground">Tenant: Acme Global Corp • Date: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-emerald-500 font-bold">CONFIDENTIAL</div>
              </div>

              {/* Report Widgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {builderWidgets.map((w) => (
                  <div key={w.id} className="p-4 rounded-xl bg-card border border-border space-y-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{w.title}</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{w.type}</span>
                    </div>

                    <div className="h-28 rounded-lg bg-background border border-border flex items-center justify-center text-xs text-muted-foreground font-mono">
                      [ Live Analytics Widget Data Stream: {w.metric} ]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REPORT TEMPLATES GALLERY */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Built-in Enterprise Report Templates</h3>
            <p className="text-xs text-muted-foreground">Instant 1-click report instantiation for C-suite executive and operational reporting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockReportTemplates.map((tmpl) => (
              <div key={tmpl.id} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                      {tmpl.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${formatBadges[tmpl.defaultFormat]}`}>
                      {tmpl.defaultFormat}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground">{tmpl.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tmpl.description}</p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">{tmpl.widgetIds.length} Pre-configured Widgets</span>
                  <button
                    onClick={() => handleInstantiateTemplate(tmpl)}
                    className="inline-flex items-center space-x-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AUTOMATED CRON SCHEDULES */}
      {activeSubTab === 'schedules' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Automated Scheduled Reports Engine</h3>
              <p className="text-xs text-muted-foreground">Cron-based recurring report distribution over Email and In-App Notifications.</p>
            </div>
            <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90">
              <Plus className="w-4 h-4" />
              <span>Create Cron Schedule</span>
            </button>
          </div>

          <div className="space-y-4">
            {savedReports.filter((r) => r.schedule).map((r) => {
              const sch = r.schedule!;
              return (
                <div key={sch.id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-foreground">{r.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {sch.frequency}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-primary">Cron: {sch.cronExpression} ({sch.timeZone})</div>
                    </div>

                    <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground">
                      <span>Next: <strong className="text-foreground">{new Date(sch.nextExecutionAt).toLocaleDateString()}</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border text-xs text-muted-foreground flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>Recipients: <strong className="text-foreground">{sch.recipients.join(', ')}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: REPORT LIBRARY */}
      {activeSubTab === 'library' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Saved Reports Directory & Version Control</h3>
            <p className="text-xs text-muted-foreground">Multi-tenant report repository with version tracking and tag organization.</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {savedReports.map((rpt) => (
              <div key={rpt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-foreground">{rpt.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">{rpt.version}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">Owner: {rpt.owner} • Updated {new Date(rpt.updatedAt).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedReport(rpt);
                      setBuilderWidgets(rpt.widgets);
                      setActiveSubTab('builder');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                  >
                    Open in Builder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: EXECUTION & DELIVERY HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">Report Execution & Delivery Audit Log</h3>
            <p className="text-xs text-muted-foreground">Audit logs of generated report exports and delivery channel status.</p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
            {mockReportExecutionHistory.map((hist) => (
              <div key={hist.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-foreground">{hist.reportTitle}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${formatBadges[hist.format]}`}>
                      {hist.format}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    Executed: {new Date(hist.executedAt).toLocaleString()} • Size: {(hist.fileSizeBytes / 1000000).toFixed(2)} MB
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {hist.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
