'use client';

import React, { useState } from 'react';
import {
  Bot,
  Layers,
  Terminal,
  Activity,
  CheckCircle2,
  Cpu,
  Zap,
  Sliders,
  LayoutDashboard,
  Radio,
} from 'lucide-react';
import { mockAIAgentsOverviewMetrics } from '../../data/mock-agents-data';
import { AgentRegistryCatalogView } from '../AgentRegistryCatalogView';
import { AutonomousTaskOrchestratorView } from '../AutonomousTaskOrchestratorView';
import { AgentRuntimeExecutionViewer } from '../AgentRuntimeExecutionViewer';
import { MultiAgentWorkflowCanvasView } from '../MultiAgentWorkflowCanvasView';
import { AgentSafetyGuardrailsView } from '../AgentSafetyGuardrailsView';
import { MultiAgentCollaborationDashboardView } from '../MultiAgentCollaborationDashboardView';
import { GoalPlanningDecompositionView } from '../GoalPlanningDecompositionView';
import { EnterpriseMemorySystemView } from '../EnterpriseMemorySystemView';
import { ToolCallingRegistryView } from '../ToolCallingRegistryView';
import { EnterpriseKnowledgeGraphView } from '../EnterpriseKnowledgeGraphView';
import { AutonomousWorkflowOptimizationView } from '../AutonomousWorkflowOptimizationView';
import { AIOperationsCenterView } from '../AIOperationsCenterView';
import { HumanInTheLoopApprovalCenterView } from '../HumanInTheLoopApprovalCenterView';
import { EnterpriseAgentMarketplaceView } from '../EnterpriseAgentMarketplaceView';
import { AgentSecurityGovernanceCenterView } from '../AgentSecurityGovernanceCenterView';
import { AgentAnalyticsContinuousLearningView } from '../AgentAnalyticsContinuousLearningView';
import { EnterpriseAICommandCenterView } from '../EnterpriseAICommandCenterView';
import { GitMerge, ShieldCheck, Users, Target, Brain, Wrench, Network, TrendingUp, Activity, ShieldAlert, ShoppingBag, Radio, Award, Lock } from 'lucide-react';

export function AIAgentsPlatformView() {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'command_center'
    | 'security'
    | 'analytics_learning'
    | 'operations'
    | 'approvals'
    | 'marketplace'
    | 'registry'
    | 'orchestrator'
    | 'tools'
    | 'knowledge'
    | 'optimization'
    | 'collaboration'
    | 'planning'
    | 'memory'
  >('overview');
  const [metrics] = useState(mockAIAgentsOverviewMetrics);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <Bot className="w-6 h-6 text-primary" />
            <span>Enterprise AI Agents & Autonomous Operations Platform</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            EPIC-027 Enterprise Command Center, Security & Governance, Continuous Learning, Operations, HITL Approvals & Marketplace.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold font-mono">
            <Activity className="w-4 h-4" />
            <span>Success Rate: {metrics.globalSuccessRatePercent}%</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-border overflow-x-auto space-x-2">
        {[
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'command_center', label: 'Command Center', icon: <Radio className="w-4 h-4 text-red-500" /> },
          { id: 'security', label: 'Security & Governance', icon: <Lock className="w-4 h-4 text-purple-500" /> },
          { id: 'analytics_learning', label: 'Analytics & Learning', icon: <Award className="w-4 h-4 text-amber-500" /> },
          { id: 'operations', label: 'AI Operations', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
          { id: 'approvals', label: 'HITL Approvals', icon: <ShieldAlert className="w-4 h-4 text-amber-500" /> },
          { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4 text-primary" /> },
          { id: 'registry', label: 'Agent Registry', icon: <Bot className="w-4 h-4 text-primary" /> },
          { id: 'orchestrator', label: 'Task Orchestrator', icon: <Layers className="w-4 h-4 text-emerald-500" /> },
          { id: 'tools', label: 'Tool Calling', icon: <Wrench className="w-4 h-4 text-amber-500" /> },
          { id: 'knowledge', label: 'Knowledge Graph', icon: <Network className="w-4 h-4 text-blue-500" /> },
          { id: 'optimization', label: 'Optimizer', icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
          { id: 'collaboration', label: 'Collaboration', icon: <Users className="w-4 h-4 text-indigo-500" /> },
          { id: 'planning', label: 'Goal Planning', icon: <Target className="w-4 h-4 text-rose-500" /> },
          { id: 'memory', label: 'Enterprise Memory', icon: <Brain className="w-4 h-4 text-purple-500" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === t.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Registered Agents</span>
              <div className="text-2xl font-bold text-foreground font-mono">{metrics.totalRegisteredAgents}</div>
              <div className="text-[10px] text-muted-foreground">{metrics.activeAgentsCount} currently active</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Running Tasks</span>
              <div className="text-2xl font-bold text-primary font-mono">{metrics.runningTasksCount}</div>
              <div className="text-[10px] text-muted-foreground">Across parallel workers</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Completed Tasks</span>
              <div className="text-2xl font-bold text-emerald-500 font-mono">{metrics.completedTasksCount}</div>
              <div className="text-[10px] text-muted-foreground">Total executed</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-1 shadow-sm">
              <span className="text-xs font-semibold text-muted-foreground">Avg Latency</span>
              <div className="text-2xl font-bold text-foreground font-mono">{metrics.avgTaskLatencySeconds}s</div>
              <div className="text-[10px] text-muted-foreground">Per execution step</div>
            </div>
          </div>

          <EnterpriseAICommandCenterView />
        </div>
      )}

      {/* TAB 2: COMMAND CENTER */}
      {activeTab === 'command_center' && <EnterpriseAICommandCenterView />}

      {/* TAB 3: SECURITY & GOVERNANCE */}
      {activeTab === 'security' && <AgentSecurityGovernanceCenterView />}

      {/* TAB 4: ANALYTICS & LEARNING */}
      {activeTab === 'analytics_learning' && <AgentAnalyticsContinuousLearningView />}

      {/* TAB 5: OPERATIONS */}
      {activeTab === 'operations' && <AIOperationsCenterView />}

      {/* TAB 6: APPROVALS */}
      {activeTab === 'approvals' && <HumanInTheLoopApprovalCenterView />}

      {/* TAB 7: MARKETPLACE */}
      {activeTab === 'marketplace' && <EnterpriseAgentMarketplaceView />}

      {/* TAB 8: REGISTRY */}
      {activeTab === 'registry' && <AgentRegistryCatalogView />}

      {/* TAB 9: ORCHESTRATOR */}
      {activeTab === 'orchestrator' && <AutonomousTaskOrchestratorView />}

      {/* TAB 10: TOOLS */}
      {activeTab === 'tools' && <ToolCallingRegistryView />}

      {/* TAB 11: KNOWLEDGE */}
      {activeTab === 'knowledge' && <EnterpriseKnowledgeGraphView />}

      {/* TAB 12: OPTIMIZATION */}
      {activeTab === 'optimization' && <AutonomousWorkflowOptimizationView />}

      {/* TAB 13: COLLABORATION */}
      {activeTab === 'collaboration' && <MultiAgentCollaborationDashboardView />}

      {/* TAB 14: PLANNING */}
      {activeTab === 'planning' && <GoalPlanningDecompositionView />}

      {/* TAB 15: MEMORY */}
      {activeTab === 'memory' && <EnterpriseMemorySystemView />}
    </div>
  );
}





