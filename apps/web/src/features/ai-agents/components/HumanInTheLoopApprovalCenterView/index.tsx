'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Clock,
  UserCheck,
  FileCheck,
  Shield,
} from 'lucide-react';
import { mockApprovalRequests } from '../../data/mock-agents-data';
import type { ApprovalRequestItem } from '../../types';

export function HumanInTheLoopApprovalCenterView() {
  const [requests, setRequests] = useState<ApprovalRequestItem[]>(mockApprovalRequests);
  const [notice, setNotice] = useState<string | null>(null);

  const handleAction = (reqId: string, action: 'approved' | 'rejected') => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === reqId) {
          setNotice(`Approval request "${r.title}" ${action.toUpperCase()} by administrator.`);
          setTimeout(() => setNotice(null), 3500);
          return { ...r, status: action };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <span>Human-in-the-Loop Approval Center & Risk Engine</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.11 Multi-level approval workflows, risk scoring, digital signatures, and manual intervention gates for high-risk actions.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold font-mono">
          <UserCheck className="w-4 h-4" />
          <span>Human Approval Required for High Risk</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Approval Requests Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <FileCheck className="w-4 h-4 text-primary" />
          <span>Pending & Historical Approval Requests</span>
        </h3>

        <div className="divide-y divide-border">
          {requests.map((req) => (
            <div key={req.id} className="py-4 space-y-3 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-foreground">{req.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        req.riskScore === 'high' || req.riskScore === 'critical'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}
                    >
                      RISK: {req.riskScore}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        req.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : req.status === 'rejected'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Requester Agent: <strong className="text-foreground">{req.requesterAgentName}</strong> • Target: {req.targetType}
                  </div>
                </div>

                {req.status === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAction(req.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 transition-all"
                    >
                      Reject Action
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-emerald-500-foreground text-xs font-semibold hover:opacity-90 transition-all bg-emerald-500 text-white"
                    >
                      Approve & Execute
                    </button>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg bg-background border border-border text-[11px] font-mono text-muted-foreground overflow-x-auto">
                {req.detailsJson}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
