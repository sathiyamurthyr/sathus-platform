export type AgentCategory = 'analytics_bi' | 'devops_sre' | 'customer_support' | 'security_audit' | 'data_pipeline' | 'workflow_automation';
export type AgentStatus = 'active' | 'suspended' | 'retired' | 'configuring';
export type TaskPriority = 'P0_critical' | 'P1_high' | 'P2_normal' | 'P3_low';
export type TaskStatus = 'running' | 'queued' | 'completed' | 'failed' | 'cancelled';

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
}

export interface AgentVersion {
  version: string;
  changelog: string;
  modelProvider: string;
  releasedAt: string;
  isActive: boolean;
}

export interface AgentItem {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  status: AgentStatus;
  currentVersion: string;
  modelProvider: string;
  temperature: number;
  maxContextTokens: number;
  capabilities: AgentCapability[];
  availableVersions: AgentVersion[];
  ownerTenant: string;
  totalExecutionsCount: number;
  avgLatencyMs: number;
  successRatePercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskExecutionStep {
  stepIndex: number;
  thought: string;
  toolInvocation?: {
    toolName: string;
    parametersJson: string;
    outputSnippet: string;
  };
  status: 'passed' | 'failed' | 'executing';
  timestamp: string;
}

export interface AgentTaskItem {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  priority: TaskPriority;
  status: TaskStatus;
  progressPercent: number;
  assignedTenant: string;
  executionSteps: TaskExecutionStep[];
  startedAt: string;
  completedAt?: string;
  errorLog?: string;
}

export interface AIAgentsOverviewMetrics {
  totalRegisteredAgents: number;
  activeAgentsCount: number;
  runningTasksCount: number;
  completedTasksCount: number;
  avgTaskLatencySeconds: number;
  globalSuccessRatePercent: number;
}

export interface WorkflowNode {
  id: string;
  agentId: string;
  name: string;
  status: 'completed' | 'running' | 'pending';
  outputKey: string;
}

export interface MultiAgentWorkflowItem {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  nodes: WorkflowNode[];
  status: 'active' | 'draft' | 'paused';
  totalRunsCount: number;
  lastRunAt: string;
}

export interface SafetyGuardrailPolicy {
  id: string;
  name: string;
  category: 'prompt_injection' | 'pii_masking' | 'rbac_enforcement' | 'cost_cap';
  threshold: string;
  isEnforced: boolean;
  violatedCount: number;
}

// Story 27.4 Multi-Agent Collaboration Engine
export interface AgentTeamMember {
  agentId: string;
  agentName: string;
  role: 'coordinator' | 'worker' | 'reviewer';
  capabilities: string[];
}

export interface AgentTeam {
  id: string;
  name: string;
  description: string;
  coordinatorAgentId: string;
  members: AgentTeamMember[];
  consensusStrategy: 'majority_vote' | 'coordinator_override' | 'unanimous';
  activeSessionsCount: number;
  tenantId: string;
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  senderAgentId: string;
  senderAgentName: string;
  receiverAgentId: string;
  receiverAgentName: string;
  messageType: 'task_delegation' | 'context_share' | 'review_request' | 'conflict_escalation';
  content: string;
  timestamp: string;
}

export interface CollaborationSession {
  id: string;
  teamId: string;
  teamName: string;
  topic: string;
  status: 'active' | 'resolved' | 'escalated';
  messages: AgentMessage[];
  startedAt: string;
}

// Story 27.5 Planning & Goal Decomposition
export type PlannerType = 'strategic' | 'tactical' | 'execution';

export interface MilestoneItem {
  id: string;
  title: string;
  dueDate: string;
  isReached: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  plannerType: PlannerType;
  priority: 'P0' | 'P1' | 'P2';
  progressPercent: number;
  subGoals: GoalItem[];
  milestones: MilestoneItem[];
  status: 'in_progress' | 'completed' | 'blocked';
}

export interface GoalPlan {
  id: string;
  title: string;
  description: string;
  ownerTenant: string;
  strategicGoals: GoalItem[];
  createdAt: string;
}

// Story 27.6 Enterprise Memory System
export type MemoryType = 'short_term' | 'long_term' | 'semantic' | 'episodic' | 'working';
export type MemoryScope = 'tenant' | 'workspace' | 'team' | 'agent' | 'conversation';

export interface MemoryItem {
  id: string;
  content: string;
  memoryType: MemoryType;
  scope: MemoryScope;
  scopeId: string;
  importanceScore: number;
  vectorEmbeddingId: string;
  metadataJson: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ContextRetrievalQuery {
  queryText: string;
  scope: MemoryScope;
  scopeId: string;
  topK: number;
  minImportance: number;
}

// Story 27.7 Tool Calling & Function Execution
export type ToolCategory = 'rest_api' | 'database' | 'workflow' | 'analytics' | 'notifications' | 'file_ops';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  isSandboxed: boolean;
  version: string;
  permissionsRequired: string[];
  totalInvocationsCount: number;
  successRatePercent: number;
  avgLatencyMs: number;
  schemaJson: string;
}

// Story 27.8 Enterprise Knowledge Graph & Context Engine
export interface KnowledgeEntity {
  id: string;
  name: string;
  type: 'service' | 'tenant' | 'dataset' | 'policy' | 'workflow';
  description: string;
  ownerTenant: string;
  attributesJson: string;
}

export interface KnowledgeRelationship {
  id: string;
  sourceEntityId: string;
  sourceEntityName: string;
  targetEntityId: string;
  targetEntityName: string;
  relationType: 'depends_on' | 'owns' | 'monitors' | 'accesses';
}

// Story 27.9 Autonomous Workflow Optimization
export interface WorkflowOptimizationRecommendation {
  id: string;
  workflowId: string;
  workflowName: string;
  bottleneckNode: string;
  suggestion: string;
  targetMetric: 'speed' | 'cost' | 'reliability' | 'token_consumption';
  estimatedSavingsPercent: number;
  status: 'suggested' | 'applied' | 'dismissed';
}

// Story 27.10 AI Operations Center
export interface AIOperationsOverview {
  totalDeploymentsCount: number;
  activeDeploymentsCount: number;
  totalTokenUsageMonth: number;
  totalCostMonthUSD: number;
  avgLatencyMs: number;
  errorRatePercent: number;
}

export interface AgentDeployment {
  id: string;
  agentId: string;
  agentName: string;
  version: string;
  environment: 'production' | 'staging' | 'development';
  status: 'healthy' | 'degraded' | 'paused';
  tokensUsed24h: number;
  costUSD24h: number;
  deployedAt: string;
}

// Story 27.11 Human-in-the-Loop Approval Engine
export type ApprovalTargetType = 'workflow' | 'tool_call' | 'api_call' | 'billing_action' | 'tenant_change';

export interface ApprovalRequestItem {
  id: string;
  title: string;
  requesterAgentName: string;
  targetType: ApprovalTargetType;
  riskScore: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  requestedAt: string;
  detailsJson: string;
}

// Story 27.12 Enterprise Agent Marketplace
export interface MarketplaceAgentItem {
  id: string;
  name: string;
  publisherName: string;
  category: string;
  rating: number;
  installationsCount: number;
  description: string;
  priceModel: 'free' | 'per_token' | 'subscription';
  isInstalled: boolean;
}

// Story 27.13 Agent Security & Governance
export interface AgentSecurityPolicy {
  id: string;
  name: string;
  scope: 'tenant' | 'workspace' | 'global';
  policyType: 'data_access' | 'pii_protection' | 'prompt_injection' | 'tool_permission';
  riskScoreThreshold: 'low' | 'medium' | 'high';
  isEnforced: boolean;
  blockedAttemptsCount: number;
}

// Story 27.14 Agent Analytics & Continuous Learning
export interface AgentPerformanceAnalytics {
  agentId: string;
  agentName: string;
  category: string;
  taskSuccessRatePercent: number;
  reasoningQualityScore: number;
  businessImpactScore: number;
  tokenCostUSD24h: number;
  userSatisfactionPercent: number;
}

export interface AgentLearningFeedback {
  id: string;
  agentId: string;
  agentName: string;
  userFeedback: 'positive' | 'negative' | 'neutral';
  comment: string;
  autoOptimizationSuggestion: string;
  timestamp: string;
}

// Story 27.15 Enterprise AI Command Center
export interface AICommandCenterFleetStatus {
  totalAgentsInFleet: number;
  activeAgentsCount: number;
  pausedAgentsCount: number;
  emergencyStopEngaged: boolean;
  systemHealthStatus: 'optimal' | 'degraded' | 'critical';
  activeWorkerThreadsCount: number;
}





