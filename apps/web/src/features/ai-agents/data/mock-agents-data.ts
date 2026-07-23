import type { AgentItem, AgentTaskItem, AIAgentsOverviewMetrics, CollaborationSession, AgentTeam } from '../types';

export const mockAIAgentsOverviewMetrics: AIAgentsOverviewMetrics = {
  totalRegisteredAgents: 12,
  activeAgentsCount: 9,
  runningTasksCount: 4,
  completedTasksCount: 1280,
  avgTaskLatencySeconds: 1.8,
  globalSuccessRatePercent: 99.4,
};

export const mockAIAgents: AgentItem[] = [
  {
    id: 'agent-bi-101',
    name: 'Executive BI & Financial Insights Agent',
    description: 'Autonomous analytics agent performing SQL query generation, cohort retention analysis, and revenue forecasting.',
    category: 'analytics_bi',
    status: 'active',
    currentVersion: 'v2.1.0',
    modelProvider: 'Claude 3.5 Sonnet (Anthropic)',
    temperature: 0.1,
    maxContextTokens: 128000,
    capabilities: [
      { id: 'cap-1', name: 'SQL Query Execution', description: 'Executes read-only queries against PostgreSQL analytics warehouse.', category: 'data', isEnabled: true },
      { id: 'cap-2', name: 'KPI Forecasting', description: 'Runs ARIMA & Prophet forecasting algorithms.', category: 'analytics', isEnabled: true },
      { id: 'cap-3', name: 'PDF Report Dispatcher', description: 'Generates branded executive summaries.', category: 'output', isEnabled: true },
    ],
    availableVersions: [
      { version: 'v2.1.0', changelog: 'Added multi-tenant schema isolation checks and faster vector RAG.', modelProvider: 'Claude 3.5 Sonnet', releasedAt: '2026-07-15T00:00:00Z', isActive: true },
      { version: 'v2.0.0', changelog: 'Initial v2 release with streaming Chain-of-Thought.', modelProvider: 'GPT-4o', releasedAt: '2026-06-01T00:00:00Z', isActive: false },
    ],
    ownerTenant: 'Acme Production Main',
    totalExecutionsCount: 542,
    avgLatencyMs: 1450,
    successRatePercent: 99.8,
    createdAt: '2026-05-10T00:00:00Z',
    updatedAt: '2026-07-15T00:00:00Z',
  },
  {
    id: 'agent-sre-201',
    name: 'DevOps & SRE Autonomous Remediation Agent',
    description: 'Monitors OpenTelemetry traces and Prometheus alerts to automatically restart degraded worker pools and scale database replicas.',
    category: 'devops_sre',
    status: 'active',
    currentVersion: 'v1.4.2',
    modelProvider: 'GPT-4o (OpenAI)',
    temperature: 0.0,
    maxContextTokens: 64000,
    capabilities: [
      { id: 'cap-4', name: 'Worker Pool Restart', description: 'Trigger Celery and Kubernetes pod restarts.', category: 'devops', isEnabled: true },
      { id: 'cap-5', name: 'Log Anomaly Triaging', description: 'Scans OpenSearch log streams for error tracebacks.', category: 'observability', isEnabled: true },
    ],
    availableVersions: [
      { version: 'v1.4.2', changelog: 'Integrated 1-click fallback to standby DR region.', modelProvider: 'GPT-4o', releasedAt: '2026-07-18T00:00:00Z', isActive: true },
    ],
    ownerTenant: 'Platform Infrastructure Global',
    totalExecutionsCount: 318,
    avgLatencyMs: 980,
    successRatePercent: 99.1,
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-07-18T00:00:00Z',
  },
  {
    id: 'agent-sec-301',
    name: 'Cybersecurity Audit & Threat Hunter Agent',
    description: 'Continuously audits IAM RBAC permission matrices, API key rotation age, and IP CIDR anomaly logs.',
    category: 'security_audit',
    status: 'active',
    currentVersion: 'v1.1.0',
    modelProvider: 'Claude 3.5 Sonnet (Anthropic)',
    temperature: 0.0,
    maxContextTokens: 128000,
    capabilities: [
      { id: 'cap-6', name: 'RBAC Drift Detector', description: 'Scans for unauthorized role elevation.', category: 'security', isEnabled: true },
      { id: 'cap-7', name: 'IP Geo-Anomaly Alert', description: 'Detects unexpected overseas API token access.', category: 'security', isEnabled: true },
    ],
    availableVersions: [
      { version: 'v1.1.0', changelog: 'Added ISO 27001 automated compliance matrix check.', modelProvider: 'Claude 3.5 Sonnet', releasedAt: '2026-07-10T00:00:00Z', isActive: true },
    ],
    ownerTenant: 'Platform Security Operations',
    totalExecutionsCount: 420,
    avgLatencyMs: 1200,
    successRatePercent: 99.5,
    createdAt: '2026-06-15T00:00:00Z',
    updatedAt: '2026-07-10T00:00:00Z',
  },
];

export const mockAgentTasks: AgentTaskItem[] = [
  {
    id: 'task-9001',
    title: 'Quarterly Executive Revenue Synthesis & Cohort Forecast',
    agentId: 'agent-bi-101',
    agentName: 'Executive BI & Financial Insights Agent',
    priority: 'P0_critical',
    status: 'running',
    progressPercent: 65,
    assignedTenant: 'Acme Production Main',
    executionSteps: [
      {
        stepIndex: 1,
        thought: 'Querying PostgreSQL 16 analytics schema for Q2 revenue numbers by workspace shard.',
        toolInvocation: {
          toolName: 'execute_sql_analytics',
          parametersJson: '{"timeframe": "Q2-2026", "metrics": ["mrr", "arr", "churn"]}',
          outputSnippet: '{"q2_mrr": 24800, "q2_arr": 297600, "churn_rate": 0.02}',
        },
        status: 'passed',
        timestamp: '2026-07-21T18:30:00Z',
      },
      {
        stepIndex: 2,
        thought: 'Calculating ARIMA predictive curve for Q3 revenue forecast.',
        status: 'executing',
        timestamp: '2026-07-21T18:31:00Z',
      },
    ],
    startedAt: '2026-07-21T18:30:00Z',
  },
  {
    id: 'task-9002',
    title: 'OpenTelemetry Trace Anomaly Remediation & Redis Flush',
    agentId: 'agent-sre-201',
    agentName: 'DevOps & SRE Autonomous Remediation Agent',
    priority: 'P1_high',
    status: 'completed',
    progressPercent: 100,
    assignedTenant: 'Platform Infrastructure Global',
    executionSteps: [
      {
        stepIndex: 1,
        thought: 'Received high latency alert (450ms) on API Gateway.',
        toolInvocation: {
          toolName: 'inspect_opentelemetry_spans',
          parametersJson: '{"service": "api-gateway", "window": "5m"}',
          outputSnippet: '{"bottleneck": "redis_l2_cache_key_eviction"}',
        },
        status: 'passed',
        timestamp: '2026-07-21T18:00:00Z',
      },
      {
        stepIndex: 2,
        thought: 'Executing transient cache flush on Redis 7.2 node redis-master-01.',
        toolInvocation: {
          toolName: 'flush_redis_l2_cache',
          parametersJson: '{"node": "redis-master-01"}',
          outputSnippet: '{"status": "OK", "keys_freed": 14200}',
        },
        status: 'passed',
        timestamp: '2026-07-21T18:01:00Z',
      },
    ],
    startedAt: '2026-07-21T18:00:00Z',
    completedAt: '2026-07-21T18:01:30Z',
  },
];

export const mockMultiAgentWorkflows = [
  {
    id: 'wf-101',
    name: 'Autonomous Incident Triage & SRE Remediation Pipeline',
    description: 'Multi-agent orchestration DAG connecting Threat Hunter, SRE Remediation, and BI Notification agents.',
    triggerEvent: 'Prometheus Alert P0 Triggered',
    status: 'active' as const,
    totalRunsCount: 84,
    lastRunAt: '2026-07-21T18:00:00Z',
    nodes: [
      { id: 'node-1', agentId: 'agent-sec-301', name: 'Security Audit Agent', status: 'completed' as const, outputKey: 'threat_assessment' },
      { id: 'node-2', agentId: 'agent-sre-201', name: 'DevOps SRE Agent', status: 'running' as const, outputKey: 'remediation_result' },
      { id: 'node-3', agentId: 'agent-bi-101', name: 'Executive BI Agent', status: 'pending' as const, outputKey: 'executive_summary' },
    ],
  },
  {
    id: 'wf-102',
    name: 'Automated Financial Audit & Compliance Sync',
    description: 'Extracts ledger data, checks RBAC drift, and generates compliance artifacts.',
    triggerEvent: 'Scheduled Nightly Cron (00:00 UTC)',
    status: 'active' as const,
    totalRunsCount: 142,
    lastRunAt: '2026-07-21T00:00:00Z',
    nodes: [
      { id: 'node-10', agentId: 'agent-bi-101', name: 'BI Insights Agent', status: 'completed' as const, outputKey: 'revenue_matrix' },
      { id: 'node-11', agentId: 'agent-sec-301', name: 'Security Audit Agent', status: 'completed' as const, outputKey: 'audit_certification' },
    ],
  },
];

export const mockSafetyGuardrails = [
  {
    id: 'guard-01',
    name: 'Prompt Injection & Jailbreak Defense System',
    category: 'prompt_injection' as const,
    threshold: 'Strict (Cosine Similarity > 0.85)',
    isEnforced: true,
    violatedCount: 14,
  },
  {
    id: 'guard-02',
    name: 'PII & Sensitive Data Redaction Filter',
    category: 'pii_masking' as const,
    threshold: 'Regex & Named Entity Recognition',
    isEnforced: true,
    violatedCount: 3,
  },
  {
    id: 'guard-03',
    name: 'Tenant Data Isolation & RBAC Scoping Guard',
    category: 'rbac_enforcement' as const,
    threshold: 'Zero-Trust Row-Level Security',
    isEnforced: true,
    violatedCount: 0,
  },
  {
    id: 'guard-04',
    name: 'Per-Execution LLM Token & Cost Throttle',
    category: 'cost_cap' as const,
    threshold: 'Max $5.00 / Task Execution',
    isEnforced: true,
    violatedCount: 1,
  },
];

export const mockAgentTeams: AgentTeam[] = [
  {
    id: 'team-ops-01',
    name: 'Enterprise SRE & Security Incident Response Team',
    description: 'Hierarchical team comprising Threat Hunter, SRE Remediation, and BI Reviewer agents.',
    coordinatorAgentId: 'agent-sec-301',
    consensusStrategy: 'coordinator_override' as const,
    activeSessionsCount: 2,
    tenantId: 'Acme Production Main',
    members: [
      { agentId: 'agent-sec-301', agentName: 'Cybersecurity Threat Hunter', role: 'coordinator' as const, capabilities: ['Threat Assessment', 'RBAC Audit'] },
      { agentId: 'agent-sre-201', agentName: 'DevOps SRE Remediation Agent', role: 'worker' as const, capabilities: ['Kubernetes Pod Restart', 'Redis Flush'] },
      { agentId: 'agent-bi-101', agentName: 'Executive BI Insights Agent', role: 'reviewer' as const, capabilities: ['Post-Mortem PDF Report'] },
    ],
  },
];

export const mockCollaborationSessions: CollaborationSession[] = [
  {
    id: 'collab-701',
    teamId: 'team-ops-01',
    teamName: 'Enterprise SRE & Security Incident Response Team',
    topic: 'P0 DDoS Anomaly Detection & Worker Auto-Scaling Strategy',
    status: 'active' as const,
    startedAt: '2026-07-21T18:40:00Z',
    messages: [
      {
        id: 'msg-1',
        sessionId: 'collab-701',
        senderAgentId: 'agent-sec-301',
        senderAgentName: 'Cybersecurity Threat Hunter',
        receiverAgentId: 'agent-sre-201',
        receiverAgentName: 'DevOps SRE Remediation Agent',
        messageType: 'task_delegation' as const,
        content: 'Detected suspicious traffic spike from subnet 192.168.4.0/24. Execute pod scaling and rate limiting.',
        timestamp: '2026-07-21T18:40:05Z',
      },
      {
        id: 'msg-2',
        sessionId: 'collab-701',
        senderAgentId: 'agent-sre-201',
        senderAgentName: 'DevOps SRE Remediation Agent',
        receiverAgentId: 'agent-sec-301',
        receiverAgentName: 'Cybersecurity Threat Hunter',
        messageType: 'context_share' as const,
        content: 'Scaled API gateway replicas from 4 to 12. Redis cache latency returned to 12ms baseline.',
        timestamp: '2026-07-21T18:41:20Z',
      },
      {
        id: 'msg-3',
        sessionId: 'collab-701',
        senderAgentId: 'agent-bi-101',
        senderAgentName: 'Executive BI Insights Agent',
        receiverAgentId: 'agent-sec-301',
        receiverAgentName: 'Cybersecurity Threat Hunter',
        messageType: 'review_request' as const,
        content: 'Drafted incident post-mortem executive summary report. Awaiting coordinator review signature.',
        timestamp: '2026-07-21T18:42:00Z',
      },
    ],
  },
];

export const mockGoalPlans = [
  {
    id: 'plan-2026-q3',
    title: 'Multi-Tenant Scale & Zero-Trust Infrastructure Readiness Plan',
    description: 'Hierarchical strategic and tactical goal decomposition for Q3 2026 platform rollout.',
    ownerTenant: 'Acme Production Main',
    createdAt: '2026-07-01T00:00:00Z',
    strategicGoals: [
      {
        id: 'goal-str-1',
        title: 'Achieve 99.99% Infrastructure Availability SLA',
        plannerType: 'strategic' as const,
        priority: 'P0' as const,
        progressPercent: 78,
        status: 'in_progress' as const,
        subGoals: [
          {
            id: 'goal-tac-11',
            title: 'Automate Redis & PostgreSQL Multi-Region Failover',
            plannerType: 'tactical' as const,
            priority: 'P0' as const,
            progressPercent: 90,
            status: 'in_progress' as const,
            subGoals: [],
            milestones: [
              { id: 'm-1', title: 'DR Mock Drill in Staging', dueDate: '2026-07-25', isReached: true },
              { id: 'm-2', title: 'Production Multi-Region Pilot', dueDate: '2026-08-01', isReached: false },
            ],
          },
        ],
        milestones: [],
      },
    ],
  },
];

export const mockEnterpriseMemories = [
  {
    id: 'mem-001',
    content: 'Tenant Acme Main requires strictly isolated vector index namespaces using tenant_id metadata filters.',
    memoryType: 'long_term' as const,
    scope: 'tenant' as const,
    scopeId: 'Acme Production Main',
    importanceScore: 0.95,
    vectorEmbeddingId: 'vec-emb-9012',
    metadataJson: '{"category": "security", "author": "Security Audit Agent"}',
    createdAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 'mem-002',
    content: 'Redis master node redis-master-01 threshold rule set to maximum 50,000 keys before eviction trigger.',
    memoryType: 'semantic' as const,
    scope: 'workspace' as const,
    scopeId: 'ws-sre-global',
    importanceScore: 0.88,
    vectorEmbeddingId: 'vec-emb-9013',
    metadataJson: '{"category": "sre", "author": "DevOps SRE Agent"}',
    createdAt: '2026-07-15T14:30:00Z',
  },
  {
    id: 'mem-003',
    content: 'Quarterly financial report format requires ARIMA cohort analysis and executive PDF download attachment.',
    memoryType: 'episodic' as const,
    scope: 'team' as const,
    scopeId: 'team-ops-01',
    importanceScore: 0.82,
    vectorEmbeddingId: 'vec-emb-9014',
    metadataJson: '{"category": "analytics", "author": "Executive BI Agent"}',
    createdAt: '2026-07-18T09:15:00Z',
  },
];

export const mockEnterpriseTools = [
  {
    id: 'tool-sql-exec',
    name: 'execute_sql_analytics',
    description: 'Executes read-only SQL queries against PostgreSQL analytics warehouse with mandatory tenant filters.',
    category: 'database' as const,
    isSandboxed: true,
    version: 'v1.2.0',
    permissionsRequired: ['tenant_analytics_read'],
    totalInvocationsCount: 1420,
    successRatePercent: 99.7,
    avgLatencyMs: 140,
    schemaJson: '{"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}',
  },
  {
    id: 'tool-k8s-restart',
    name: 'restart_k8s_worker_pod',
    description: 'Triggers automated Kubernetes pod restarts for degraded worker nodes in SRE workflows.',
    category: 'workflow' as const,
    isSandboxed: true,
    version: 'v2.0.1',
    permissionsRequired: ['infrastructure_admin_write'],
    totalInvocationsCount: 310,
    successRatePercent: 99.1,
    avgLatencyMs: 850,
    schemaJson: '{"type": "object", "properties": {"podName": {"type": "string"}}, "required": ["podName"]}',
  },
  {
    id: 'tool-pdf-generator',
    name: 'generate_pdf_report',
    description: 'Generates branded executive PDF reports and stores them in Enterprise Media S3 buckets.',
    category: 'file_ops' as const,
    isSandboxed: false,
    version: 'v1.0.4',
    permissionsRequired: ['media_storage_write'],
    totalInvocationsCount: 890,
    successRatePercent: 100,
    avgLatencyMs: 420,
    schemaJson: '{"type": "object", "properties": {"reportId": {"type": "string"}}, "required": ["reportId"]}',
  },
];

export const mockKnowledgeEntities = [
  {
    id: 'ent-srv-01',
    name: 'API Gateway Service',
    type: 'service' as const,
    description: 'Core ingress router handling JWT authentication, rate limiting, and tenant subdomain resolution.',
    ownerTenant: 'Platform Infrastructure Global',
    attributesJson: '{"version": "v2.4.0", "sla": "99.99%"}',
  },
  {
    id: 'ent-db-01',
    name: 'PostgreSQL Analytics Warehouse Shard 01',
    type: 'dataset' as const,
    description: 'Read-replica database shard storing multi-tenant cohort analytics and billing usage ledgers.',
    ownerTenant: 'Acme Production Main',
    attributesJson: '{"engine": "PostgreSQL 16", "size": "450GB"}',
  },
];

export const mockKnowledgeRelationships = [
  {
    id: 'rel-01',
    sourceEntityId: 'ent-srv-01',
    sourceEntityName: 'API Gateway Service',
    targetEntityId: 'ent-db-01',
    targetEntityName: 'PostgreSQL Analytics Warehouse Shard 01',
    relationType: 'accesses' as const,
  },
];

export const mockWorkflowOptimizations = [
  {
    id: 'opt-001',
    workflowId: 'wf-101',
    workflowName: 'Autonomous Incident Triage & SRE Remediation Pipeline',
    bottleneckNode: 'DevOps SRE Agent (Node #2)',
    suggestion: 'Enable parallel execution of Redis cache flush and Kubernetes pod restart to reduce pipeline latency.',
    targetMetric: 'speed' as const,
    estimatedSavingsPercent: 42,
    status: 'suggested' as const,
  },
  {
    id: 'opt-002',
    workflowId: 'wf-102',
    workflowName: 'Automated Financial Audit & Compliance Sync',
    bottleneckNode: 'BI Insights Agent (Node #10)',
    suggestion: 'Cache intermediate cohort calculation vectors to cut LLM token consumption per run.',
    targetMetric: 'token_consumption' as const,
    estimatedSavingsPercent: 35,
    status: 'applied' as const,
  },
];

export const mockAIOperationsOverview = {
  totalDeploymentsCount: 18,
  activeDeploymentsCount: 16,
  totalTokenUsageMonth: 42800000,
  totalCostMonthUSD: 240.50,
  avgLatencyMs: 110,
  errorRatePercent: 0.12,
};

export const mockAgentDeployments = [
  {
    id: 'dep-prod-101',
    agentId: 'agent-bi-101',
    agentName: 'Executive BI & Financial Insights Agent',
    version: 'v2.1.0',
    environment: 'production' as const,
    status: 'healthy' as const,
    tokensUsed24h: 1850000,
    costUSD24h: 12.40,
    deployedAt: '2026-07-15T00:00:00Z',
  },
  {
    id: 'dep-prod-201',
    agentId: 'agent-sre-201',
    agentName: 'DevOps & SRE Autonomous Remediation Agent',
    version: 'v1.4.2',
    environment: 'production' as const,
    status: 'healthy' as const,
    tokensUsed24h: 940000,
    costUSD24h: 6.80,
    deployedAt: '2026-07-18T00:00:00Z',
  },
];

export const mockApprovalRequests = [
  {
    id: 'appr-901',
    title: 'High-Risk Production Kubernetes Worker Pool Restart',
    requesterAgentName: 'DevOps & SRE Autonomous Remediation Agent',
    targetType: 'workflow' as const,
    riskScore: 'high' as const,
    status: 'pending' as const,
    requestedAt: '2026-07-21T18:45:00Z',
    detailsJson: '{"targetNode": "k8s-worker-pool-01", "action": "pod_restart", "triggerAlert": "P0 DDoS Anomaly"}',
  },
  {
    id: 'appr-902',
    title: 'Tenant Storage Billing Limit Scaling Request',
    requesterAgentName: 'Executive BI & Financial Insights Agent',
    targetType: 'billing_action' as const,
    riskScore: 'medium' as const,
    status: 'approved' as const,
    requestedAt: '2026-07-21T17:30:00Z',
    detailsJson: '{"targetTenant": "Acme Production Main", "requestedLimitGB": 1000}',
  },
];

export const mockMarketplaceAgents = [
  {
    id: 'mkt-01',
    name: 'Auto-Triage Customer Support Agent',
    publisherName: 'Sathus Platform Official',
    category: 'Customer Support',
    rating: 4.9,
    installationsCount: 1420,
    description: 'Autonomous multi-lingual support agent integrating with Zendesk and Intercom API hooks.',
    priceModel: 'free' as const,
    isInstalled: true,
  },
  {
    id: 'mkt-02',
    name: 'SOC2 & ISO27001 Automated Compliance Auditor',
    publisherName: 'Sathus Security Labs',
    category: 'Security & Audit',
    rating: 5.0,
    installationsCount: 890,
    description: 'Scans PostgreSQL RLS, IAM RBAC permission matrices, and OpenSearch logs for compliance drift.',
    priceModel: 'subscription' as const,
    isInstalled: false,
  },
];

export const mockAgentSecurityPolicies = [
  {
    id: 'pol-sec-01',
    name: 'Zero-Trust Tenant Data Scoping & RLS Policy',
    scope: 'tenant' as const,
    policyType: 'data_access' as const,
    riskScoreThreshold: 'high' as const,
    isEnforced: true,
    blockedAttemptsCount: 42,
  },
  {
    id: 'pol-sec-02',
    name: 'Real-Time PII & Sensitive Credential Masking Engine',
    scope: 'global' as const,
    policyType: 'pii_protection' as const,
    riskScoreThreshold: 'medium' as const,
    isEnforced: true,
    blockedAttemptsCount: 18,
  },
];

export const mockAgentPerformanceAnalytics = [
  {
    agentId: 'agent-bi-101',
    agentName: 'Executive BI & Financial Insights Agent',
    category: 'BI & Analytics',
    taskSuccessRatePercent: 99.8,
    reasoningQualityScore: 4.9,
    businessImpactScore: 94,
    tokenCostUSD24h: 12.40,
    userSatisfactionPercent: 98,
  },
  {
    agentId: 'agent-sre-201',
    agentName: 'DevOps & SRE Autonomous Remediation Agent',
    category: 'DevOps & SRE',
    taskSuccessRatePercent: 99.1,
    reasoningQualityScore: 4.8,
    businessImpactScore: 96,
    tokenCostUSD24h: 6.80,
    userSatisfactionPercent: 97,
  },
];

export const mockAgentLearningFeedback = [
  {
    id: 'fb-001',
    agentId: 'agent-bi-101',
    agentName: 'Executive BI & Financial Insights Agent',
    userFeedback: 'positive' as const,
    comment: 'SQL queries for cohort retention were generated with zero syntax errors.',
    autoOptimizationSuggestion: 'Pre-cache weekly cohort schema metadata to reduce initial prompt length.',
    timestamp: '2026-07-21T18:00:00Z',
  },
];

export const mockAICommandCenterFleetStatus = {
  totalAgentsInFleet: 12,
  activeAgentsCount: 10,
  pausedAgentsCount: 2,
  emergencyStopEngaged: false,
  systemHealthStatus: 'optimal' as const,
  activeWorkerThreadsCount: 4,
};





