'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Code2, Play, Copy, Check, Terminal, Zap, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  headers: Record<string, string>;
  requestBody?: Record<string, any>;
  response: Record<string, any>;
  latencyMs: number;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'agent-dispatch',
    method: 'POST',
    path: '/api/v1/ai/agent/dispatch',
    summary: 'Dispatch Autonomous AI Agent Swarm Execution',
    headers: {
      Authorization: 'Bearer sth_live_99f8a37b...',
      'Content-Type': 'application/json',
    },
    requestBody: {
      task: 'audit_lakehouse_compliance',
      agentSwarm: 'finance_auditor',
      maxBudgetTokens: 4000,
    },
    response: {
      status: 'success',
      agentId: 'ag_77a091f',
      executionTimeMs: 14,
      guardrailScore: 0.999,
      decisions: [
        { step: 1, action: 'vector_search', result: '14 matching policy docs' },
        { step: 2, action: 'audit_check', result: 'SOC 2 Type II compliant' },
      ],
    },
    latencyMs: 14,
  },
  {
    id: 'lakehouse-query',
    method: 'GET',
    path: '/api/v1/lakehouse/query?table=gold_transactions&limit=10',
    summary: 'Sub-10ms High-Throughput Delta Lakehouse Query',
    headers: {
      Authorization: 'Bearer sth_live_99f8a37b...',
      'Accept-Encoding': 'gzip, br',
    },
    response: {
      status: 'ok',
      recordsReturned: 10,
      executionEngine: 'FastAPI + Rust Delta Kernel',
      queryLatencyMs: 8,
      data: [
        { txId: 'tx_9981', amount: 4500.0, currency: 'USD', status: 'settled' },
        { txId: 'tx_9982', amount: 12000.5, currency: 'USD', status: 'settled' },
      ],
    },
    latencyMs: 8,
  },
  {
    id: 'auth-token',
    method: 'POST',
    path: '/api/v1/auth/token',
    summary: 'OAuth2 Zero-Trust Service Account Token Issuance',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    requestBody: {
      grant_type: 'client_credentials',
      client_id: 'sth_client_prod_88',
      client_secret: '••••••••••••••••',
    },
    response: {
      access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'ai:write lakehouse:read security:audit',
    },
    latencyMs: 12,
  },
];

export function ApiPlayground() {
  const [activeEndpoint, setActiveEndpoint] = React.useState<ApiEndpoint>(apiEndpoints[0]);
  const [isSending, setIsSending] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const generateCurl = () => {
    const headerStr = Object.entries(activeEndpoint.headers)
      .map(([k, v]) => `-H "${k}: ${v}"`)
      .join(' ');
    const bodyStr = activeEndpoint.requestBody
      ? `-d '${JSON.stringify(activeEndpoint.requestBody)}'`
      : '';
    return `curl -X ${activeEndpoint.method} "https://api.sathus.in${activeEndpoint.path}" ${headerStr} ${bodyStr}`;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(generateCurl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestRequest = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
    }, 400);
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-6 md:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Interactive FastAPI & OpenAPI Explorer</h3>
            <p className="text-xs text-muted-foreground">Test sub-10ms microservice endpoints and inspect JSON payloads live</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyCurl} className="h-8 text-xs gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'cURL Copied!' : 'Copy cURL'}
          </Button>
          <Button
            size="sm"
            onClick={handleTestRequest}
            disabled={isSending}
            className="h-8 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-md"
          >
            {isSending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {isSending ? 'Sending...' : 'Send Test Request'}
          </Button>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {apiEndpoints.map((ep) => {
          const isActive = activeEndpoint.id === ep.id;
          return (
            <button
              key={ep.id}
              onClick={() => setActiveEndpoint(ep)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/40'
                  : 'border-border bg-background hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="text-xs font-bold text-foreground font-mono truncate">{ep.path.split('?')[0]}</span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1">{ep.summary}</p>
            </button>
          );
        })}
      </div>

      {/* Code Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Request Panel */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-3">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-zinc-800 pb-2">
            <span>HTTP Request</span>
            <span className="text-emerald-400 font-normal">HTTPS / 1.1</span>
          </div>

          <div className="text-zinc-200">
            <span className="text-emerald-400 font-bold">{activeEndpoint.method}</span>{' '}
            <span className="text-zinc-300">{activeEndpoint.path}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase">Headers:</span>
            <pre className="text-[11px] text-zinc-400 bg-zinc-900/60 p-2 rounded border border-zinc-800/80 overflow-x-auto">
              {JSON.stringify(activeEndpoint.headers, null, 2)}
            </pre>
          </div>

          {activeEndpoint.requestBody && (
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase">Body Payload:</span>
              <pre className="text-[11px] text-emerald-300 bg-zinc-900/60 p-2 rounded border border-zinc-800/80 overflow-x-auto">
                {JSON.stringify(activeEndpoint.requestBody, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-3">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-zinc-800 pb-2">
            <span>HTTP Response Payload</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <Zap className="h-3 w-3" /> 200 OK ({activeEndpoint.latencyMs}ms)
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase">JSON Body (sub-{activeEndpoint.latencyMs + 5}ms):</span>
            <pre className="text-[11px] text-zinc-200 bg-zinc-900/60 p-2.5 rounded border border-zinc-800/80 overflow-x-auto h-52">
              {JSON.stringify(activeEndpoint.response, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
