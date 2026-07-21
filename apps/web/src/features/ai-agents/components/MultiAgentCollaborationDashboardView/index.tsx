'use client';

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Shield,
  Send,
  CheckCircle2,
  GitBranch,
  Bot,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import { mockAgentTeams, mockCollaborationSessions } from '../../data/mock-agents-data';
import type { AgentMessage } from '../../types';

export function MultiAgentCollaborationDashboardView() {
  const [teams] = useState(mockAgentTeams);
  const [sessions, setSessions] = useState(mockCollaborationSessions);
  const [selectedSessionId, setSelectedSessionId] = useState('collab-701');

  const [newMessage, setNewMessage] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const activeSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: AgentMessage = {
      id: `msg-${Date.now()}`,
      sessionId: activeSession.id,
      senderAgentId: 'agent-sec-301',
      senderAgentName: 'Cybersecurity Threat Hunter (Coordinator)',
      receiverAgentId: 'agent-sre-201',
      receiverAgentName: 'DevOps SRE Remediation Agent',
      messageType: 'task_delegation',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? { ...s, messages: [...s.messages, message] } : s))
    );
    setNewMessage('');
    setNotice('Agent-to-Agent message broadcast on Event Bus.');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Multi-Agent Collaboration Engine & Agent Teams</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 27.4 Agent-to-agent messaging, task delegation, consensus strategies, and hierarchical coordinator-worker teams.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold font-mono">
          <span>Coordinator Consensus: Coordinator Override</span>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agent Team Roster */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center space-x-2">
            <Bot className="w-4 h-4 text-primary" />
            <span>Active Agent Teams ({teams.length})</span>
          </h3>

          {teams.map((team) => (
            <div key={team.id} className="p-4 rounded-xl bg-background border border-border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground">{team.name}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500">
                  {team.consensusStrategy.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{team.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <span className="text-[10px] font-bold text-muted-foreground">Team Roster & Roles:</span>
                {team.members.map((m) => (
                  <div key={m.agentId} className="flex items-center justify-between text-[11px]">
                    <span className="text-foreground">{m.agentName}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        m.role === 'coordinator'
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                          : m.role === 'reviewer'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}
                    >
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Live Agent-to-Agent Message Stream */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">{activeSession.topic}</h3>
                <p className="text-xs text-muted-foreground">Team: {activeSession.teamName}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500">
                {activeSession.status}
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {activeSession.messages.map((msg) => (
                <div key={msg.id} className="p-3 rounded-xl bg-background border border-border space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-2">
                      <strong className="text-primary">{msg.senderAgentName}</strong>
                      <span className="text-muted-foreground">➔ {msg.receiverAgentName}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-muted text-muted-foreground uppercase">
                      {msg.messageType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-foreground font-sans text-xs bg-muted/20 p-2.5 rounded border border-border/40">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-3 border-t border-border">
            <input
              type="text"
              placeholder="Inject coordinator instruction or trigger cross-agent event..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
