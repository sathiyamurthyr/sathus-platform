'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Terminal, CheckCircle2, Cpu, Database, ShieldCheck, Zap, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentScenario {
  id: string;
  name: string;
  role: string;
  icon: any;
  prompt: string;
  toolCalls: Array<{
    name: string;
    params: Record<string, string>;
    result: string;
  }>;
  output: string;
}

const scenarios: AgentScenario[] = [
  {
    id: 'ai-architect',
    name: 'Sathus Autonomous AI Agent Swarm',
    role: 'Enterprise AI & MCP Orchestrator',
    icon: Cpu,
    prompt: 'Evaluate pgvector vs Neo4j Knowledge Graph grounding for zero-hallucination enterprise RAG',
    toolCalls: [
      {
        name: 'mcp:vector_search',
        params: { query: 'banking compliance regulations', topK: '5' },
        result: 'Retrieved 5 vector embeddings (similarity: 0.96)',
      },
      {
        name: 'mcp:graph_relation_audit',
        params: { entity: 'CoreBankingDB', depth: '2' },
        result: 'Knowledge Graph verified 14 relational dependencies',
      },
      {
        name: 'mcp:guardrail_eval',
        params: { maxHallucination: '0.001' },
        result: 'Guardrail Passed: 0.00% hallucination detected',
      },
    ],
    output: 'Recommendation: Deploy Hybrid GraphRAG. Postgres pgvector provides sub-10ms semantic retrieval, while Neo4j entity graphs eliminate false relationship hallucinations.',
  },
  {
    id: 'data-lakehouse',
    name: 'Real-Time Streaming Lakehouse Agent',
    role: 'Data Platform Engineer',
    icon: Database,
    prompt: 'Stream 50,000 CDC transactions/sec from Oracle DB to Databricks Delta Lake',
    toolCalls: [
      {
        name: 'mcp:kafka_debezium_status',
        params: { topic: 'banking.transactions.cdc' },
        result: 'Kafka Topic Active (Lag: 2ms | Throughput: 52,100 msg/s)',
      },
      {
        name: 'mcp:delta_live_tables_sync',
        params: { targetTable: 'gold_user_balances' },
        result: 'Delta Medallion pipeline updated (Freshness: 1.2 seconds)',
      },
    ],
    output: 'Ingestion Verified: Zero-downtime transactional sync operating under 2-second data freshness with exactly-once processing guarantees.',
  },
  {
    id: 'security-auditor',
    name: 'Zero-Trust Security & Compliance Agent',
    role: 'Automated SOC 2 Auditor',
    icon: ShieldCheck,
    prompt: 'Audit mTLS certificates, client-side KMS keys, and continuous audit logs',
    toolCalls: [
      {
        name: 'mcp:kms_key_rotation_check',
        params: { algorithm: 'AES-256-GCM' },
        result: 'KMS Key Rotation Active (Next rotation: 30 days)',
      },
      {
        name: 'mcp:soc2_compliance_audit',
        params: { framework: 'SOC2_TYPE_II' },
        result: '100% Audit Controls Passed (Zero vulnerabilities detected)',
      },
    ],
    output: 'Security Clearance Approved: All microservices comply with SOC 2 Type II, HIPAA, and GDPR zero-trust encryption standards.',
  },
];

export function McpPlayground() {
  const [activeScenario, setActiveScenario] = React.useState<AgentScenario>(scenarios[0]);
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [executionStep, setExecutionStep] = React.useState<number>(0);
  const [copied, setCopied] = React.useState(false);

  const handleRunSimulation = () => {
    setIsExecuting(true);
    setExecutionStep(0);

    const interval = setInterval(() => {
      setExecutionStep((prev) => {
        if (prev >= activeScenario.toolCalls.length) {
          clearInterval(interval);
          setIsExecuting(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`// Sathus MCP Agent Prompt\n${activeScenario.prompt}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-6 md:p-8 shadow-2xl space-y-6">
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Interactive MCP Agent Simulator</h3>
            <p className="text-xs text-muted-foreground">Test Anthropic Model Context Protocol & AI Agent tool execution live</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
          <Button
            size="sm"
            onClick={handleRunSimulation}
            disabled={isExecuting}
            className="h-8 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-md"
          >
            {isExecuting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {isExecuting ? 'Executing...' : 'Run Agent Test'}
          </Button>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isActive = activeScenario.id === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => {
                setActiveScenario(scenario);
                setExecutionStep(0);
                setIsExecuting(false);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/40'
                  : 'border-border bg-background hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-xs font-bold text-foreground">{scenario.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{scenario.role}</p>
            </button>
          );
        })}
      </div>

      {/* Live Terminal Console */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-xs shadow-inner space-y-4">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-zinc-400">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-zinc-200">mcp-agent-console :: {activeScenario.id}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Agent Ready
          </span>
        </div>

        {/* Prompt Input */}
        <div className="space-y-1">
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider">User Agent Instruction:</div>
          <div className="text-zinc-200 bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 font-semibold">
            &gt; &quot;{activeScenario.prompt}&quot;
          </div>
        </div>

        {/* Tool Execution Logs */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Model Context Protocol Tool Stream:</div>
          <div className="space-y-2">
            {activeScenario.toolCalls.map((tool, idx) => {
              const isStepDone = executionStep >= idx + 1 || !isExecuting;
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isStepDone ? 1 : 0.4, x: 0 }}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    isStepDone
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-zinc-200'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-emerald-400 mb-1">
                    <span>⚡ {tool.name}</span>
                    {isStepDone && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-zinc-400">Params: {JSON.stringify(tool.params)}</div>
                  <div className="text-[11px] text-zinc-300 font-semibold mt-1">Output: {tool.result}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Final Synthesized Output */}
        <AnimatePresence>
          {(!isExecuting || executionStep >= activeScenario.toolCalls.length) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-lg border border-primary/40 bg-primary/10 text-primary-foreground space-y-1 mt-3"
            >
              <div className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Synthesized Agent Decision:
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">{activeScenario.output}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
