'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle, X, Send, Bot, User,
  Minimize2, Maximize2, RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'lead-form' | 'lead-success';
  originalQuery?: string;
}

const HIGH_INTENT_KEYWORDS = [
  'pricing', 'price', 'cost', 'budget', 'quote', 'proposal', 
  'demo', 'trial', 'book', 'consult', 'schedule', 'meeting', 
  'talk to', 'speak to', 'connect', 'hire', 'engage', 'retainer', 'scope'
];

// Sathus AI knowledge base for simulated responses
const SATHUS_KB: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['ai', 'agent', 'swarm', 'mcp', 'model context'],
    response: `Sathus builds **production-grade AI Agent Swarms** using Model Context Protocol (MCP). Our agentic systems feature:

• **Zero-hallucination guardrails** (< 0.01% error rate)
• Multi-agent orchestration with sandboxed tool execution
• Human-in-the-loop approval workflows
• Full audit trail and SOC 2 compliance

Want to see a live demo? Visit [/products](/products) or book a strategy session.`,
  },
  {
    keywords: ['data', 'lakehouse', 'pipeline', 'etl', 'streaming', 'delta', 'databricks'],
    response: `Our **Data Lakehouse & Streaming Platform** engineering delivers:

• Sub-2 second data freshness with Kafka + Debezium CDC
• Medallion Architecture on Delta Lake / Apache Iceberg
• **70% TCO reduction** vs legacy Oracle/Teradata
• dbt lineage, Great Expectations quality gates

Explore our [Data Engineering solutions](/solutions/data-engineering).`,
  },
  {
    keywords: ['rag', 'retrieval', 'vector', 'embedding', 'search', 'knowledge'],
    response: `Sathus Enterprise RAG Systems achieve **98%+ retrieval precision** with:

• Hybrid BM25 + vector search (pgvector / Qdrant)
• Semantic reranking with cross-encoders
• RBAC permission filtering before LLM injection
• GraphRAG for relationship-aware knowledge graphs

Learn more at [/solutions/rag-solutions](/solutions/rag-solutions).`,
  },
  {
    keywords: ['cloud', 'aws', 'azure', 'kubernetes', 'terraform', 'devops', 'infrastructure'],
    response: `Our **Cloud Engineering practice** delivers:

• 99.99% uptime with Kubernetes GitOps on AWS / Azure
• Terraform IaC with automated FinOps cost governance
• **40% cloud cost reduction** through right-sizing
• Zero-downtime migration paths for legacy estates

See our [Cloud Engineering solutions](/solutions/cloud-engineering).`,
  },
  {
    keywords: ['security', 'compliance', 'soc2', 'hipaa', 'gdpr', 'iso', 'audit'],
    response: `Sathus is **compliance-by-design** across all engagements:

• **SOC 2 Type II** audited annually
• **HIPAA / HITECH** for healthcare AI platforms
• **ISO/IEC 27001:2022** certified ISMS
• **GDPR** EU data residency & right-to-erasure
• Zero-trust mTLS and AES-256-GCM encryption

Explore our full [Compliance Matrix](/trust/compliance).`,
  },
  {
    keywords: ['price', 'cost', 'pricing', 'budget', 'roi', 'tco'],
    response: `Our engagements are scoped to deliver measurable ROI. Typical outcomes include:

• **42% cloud infrastructure cost reduction**
• **$35k+ engineering productivity gain** per developer per year
• Payback period under **3 months** for mid-market teams

Use our [ROI Calculator](/company/why-sathus) to estimate your savings, or [book a strategy session](/book-strategy-session) for a custom quote.`,
  },
  {
    keywords: ['api', 'fastapi', 'microservice', 'openapi', 'backend', 'python'],
    response: `Sathus API Engineering delivers **50k+ RPS** microservices:

• Async-first **FastAPI** with Pydantic v2 validation
• OpenAPI 3.0 auto-generated documentation
• Sub-5ms P99 latency with Redis rate limiting
• Async SQLAlchemy with connection pooling

Try our live [API Playground](/solutions) to see sub-10ms responses.`,
  },
  {
    keywords: ['product', 'svora', 'memomes', 'sathus ai', 'platform'],
    response: `Sathus builds enterprise software products:

• **Sathus AI** — Autonomous AI agent orchestration platform
• **Memomes Cloud** — Enterprise knowledge management system
• **SocialHub MCP** — Social media management with AI automation
• **OneHealthID** — Healthcare identity and compliance platform

Explore all products at [/products](/products).`,
  },
  {
    keywords: ['case study', 'client', 'example', 'project', 'success'],
    response: `Our case studies demonstrate real enterprise impact:

• **Financial Services**: 52,000 msg/sec CDC streaming with < 2s data freshness
• **Healthcare**: HIPAA-compliant AI agent achieving 98.7% clinical accuracy
• **Fintech**: Zero-downtime migration from Oracle to Databricks, 70% TCO cut

Browse all [case studies](/case-studies) for detailed architecture breakdowns.`,
  },
  {
    keywords: ['contact', 'talk', 'consult', 'meeting', 'session', 'engineer', 'book', 'demo'],
    response: `Ready to speak with our **Principal Engineers**?

**Book a Free 30-minute Strategy Session:**
[→ Book Strategy Session](/book-strategy-session)

Or reach us directly:
📧 hello@sathus.in
🌐 [sathus.in](https://sathus.in)

We respond to all enterprise inquiries within **< 24 hours**.`,
  },
];

const SUGGESTED_PROMPTS = [
  'How does your AI agent platform work?',
  'What is your RAG architecture?',
  'Show me compliance certifications',
];

function getResponse(query: string): string {
  const lower = query.toLowerCase();
  for (const kb of SATHUS_KB) {
    if (kb.keywords.some((kw) => lower.includes(kw))) {
      return kb.response;
    }
  }
  return `Great question! Our engineering team specializes in **AI, Data, Cloud, and Enterprise Platform** engineering.

Here are some things I can help you with:
• AI Agents & MCP development
• Data Lakehouse & streaming pipelines
• Cloud modernization & Kubernetes
• Enterprise RAG & knowledge systems
• Compliance (SOC 2, HIPAA, ISO 27001)

Or you can [book a strategy session](/book-strategy-session) to speak directly with a principal engineer.`;
}

function MarkdownText({ text }: { text: string }) {
  const parts = text.split('\n').map((line, i) => {
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links
    line = line.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary underline underline-offset-2 hover:opacity-80">$1</a>'
    );
    // Bullets — use a small styled dot
    if (line.startsWith('• ') || line.startsWith('* ')) {
      return (
        <div key={i} className="flex gap-2 mt-0.5 items-start">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span className="text-xs leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: line.replace(/^[•*]\s/, '') }} />
        </div>
      );
    }
    if (!line.trim()) return <div key={i} className="h-1" />;
    return <div key={i} className="text-xs leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: line }} />;
  });
  return <div className="space-y-0.5">{parts}</div>;
}

function LeadFormMessage({ 
  messageId, 
  originalQuery, 
  onSuccess 
}: { 
  messageId: string;
  originalQuery: string;
  onSuccess: (id: string) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    const formData = new FormData(e.currentTarget);
    const fullName = (formData.get('name') as string).trim();
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;

    const parts = fullName.split(' ');
    const firstName = parts[0] || '-';
    const lastName = parts.slice(1).join(' ') || '-';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          company,
          jobTitle: "Chat Lead",
          country: "Other",
          industry: "Other",
          companySize: "1-10",
          message: `Lead captured via AI Chat Bot. Original query: ${originalQuery}`,
          consent: true,
          inquiryType: "strategy-session"
        })
      });

      if (!res.ok) throw new Error('Failed to submit');
      
      onSuccess(messageId);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-xs text-red-400 mt-2 bg-red-950/60 p-2.5 rounded-lg border border-red-500/30">
        Something went wrong. Please <a href="/book-strategy-session" className="underline font-medium hover:text-red-300">book a session here</a>.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/80">
      <input 
        required 
        name="name" 
        placeholder="Full Name" 
        className="h-8 text-xs border border-border bg-background rounded-lg px-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground" 
      />
      <input 
        required 
        type="email" 
        name="email" 
        placeholder="Work Email" 
        className="h-8 text-xs border border-border bg-background rounded-lg px-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground" 
      />
      <input 
        required 
        name="company" 
        placeholder="Company Name" 
        className="h-8 text-xs border border-border bg-background rounded-lg px-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground" 
      />
      <Button 
        type="submit" 
        disabled={loading} 
        size="sm" 
        className="w-full h-8 text-xs font-bold mt-1 shadow-md"
      >
        {loading ? 'Submitting...' : 'Request Strategy Session'}
      </Button>
    </form>
  );
}

export function AiChatBot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm **Sathus AI Assistant** — your guide to enterprise AI, data, and cloud engineering.\n\nAsk me about our solutions, products, compliance certifications, or how we can help your platform.`,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasShownLeadForm = React.useRef(false);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isOpen]);

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getResponse(content),
        timestamp: new Date(),
        type: 'text',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);
      if (!isOpen) setUnread((u) => u + 1);

      const lowerQuery = content.toLowerCase();
      const isHighIntent = HIGH_INTENT_KEYWORDS.some(kw => lowerQuery.includes(kw));

      if (isHighIntent && !hasShownLeadForm.current) {
        hasShownLeadForm.current = true;
        
        setIsLoading(true);
        setTimeout(() => {
          const leadMsg: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `Would you like to connect with a Sathus engineer directly? I can help capture your details for a **strategy session**.`,
            timestamp: new Date(),
            type: 'lead-form',
            originalQuery: content,
          };
          setMessages(prev => [...prev, leadMsg]);
          setIsLoading(false);
          if (!isOpen) setUnread(u => u + 1);
        }, 1200);
      }
    }, 800 + Math.random() * 400);
  };

  const handleReset = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: `Hello! I'm **Sathus AI Assistant**. How can I help you today?`,
        timestamp: new Date(),
        type: 'text',
      },
    ]);
    hasShownLeadForm.current = false;
  };

  const handleLeadSuccess = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, type: 'lead-success', content: 'Thank you! Your details have been captured. A Sathus engineer will reach out to you shortly to schedule your strategy session.' } : msg
    ));
  };

  // Panel height: clamp between 400px and 75vh
  const panelHeight = isMinimized ? '56px' : 'min(530px, calc(100vh - 110px))';

  return (
    // High z-index z-[9999] so floating chat box is 100% opaque and sits cleanly above all page elements
    <div className="fixed bottom-6 right-20 z-[9999] flex flex-col items-end gap-3 pointer-events-auto">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="w-[340px] sm:w-[390px] rounded-2xl border border-[#40202C] bg-[#0D0B10] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ring-1 ring-white/10 opacity-100"
            style={{ height: panelHeight }}
          >
            {/* Solid Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-tight">Sathus AI Assistant</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/80 mt-0.5 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online — Enterprise AI Expert
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={handleReset}
                  className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Container — SOLID 100% OPAQUE DARK BACKGROUND */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0D0B10] border-b border-[#331C28] opacity-100">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          msg.role === 'assistant'
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-[#1A1418] text-white border border-[#40202C]'
                        }`}
                      >
                        {msg.role === 'assistant' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                      </div>
                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-md opacity-100 ${
                          msg.role === 'assistant'
                            ? 'bg-[#1A1418] border border-[#40202C] text-white rounded-tl-xs'
                            : 'bg-primary text-primary-foreground font-medium rounded-tr-xs'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <>
                            {msg.type === 'lead-success' ? (
                              <div className="flex flex-col gap-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-400 mb-1">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Session Requested
                                </div>
                                <MarkdownText text={msg.content} />
                              </div>
                            ) : (
                              <MarkdownText text={msg.content} />
                            )}
                            {msg.type === 'lead-form' && (
                              <LeadFormMessage 
                                messageId={msg.id} 
                                originalQuery={msg.originalQuery || ''} 
                                onSuccess={handleLeadSuccess} 
                              />
                            )}
                          </>
                        ) : (
                          <p className="text-xs leading-relaxed">{msg.content}</p>
                        )}
                        <div className={`text-[9px] mt-1 ${msg.role === 'assistant' ? 'text-zinc-400' : 'text-primary-foreground/70'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="bg-[#1A1418] border border-[#40202C] rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '160ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '320ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Prompt Chips — SOLID 100% OPAQUE BACKGROUND */}
                {messages.length === 1 && (
                  <div className="px-3 py-2 flex flex-wrap gap-1.5 bg-[#0D0B10] border-b border-[#331C28] opacity-100">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => handleSend(p)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[#40202C] bg-[#1A1418] hover:border-primary hover:bg-primary/20 transition-all text-white shrink-0 shadow-sm"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area — SOLID 100% OPAQUE BACKGROUND */}
                <div className="p-3 bg-[#0D0B10] border-t border-[#331C28] flex items-center gap-2 shrink-0 opacity-100">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask about AI, data, cloud..."
                    className="flex-1 text-xs bg-[#1A1418] border border-[#40202C] rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder:text-zinc-500"
                  />
                  <Button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-9 w-9 rounded-xl shrink-0 shadow font-bold"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setUnread(0);
        }}
        className="relative h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center ring-2 ring-primary/20"
        aria-label="Open AI Chat Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread Badge */}
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
          >
            {unread}
          </motion.span>
        )}

        {/* Ping Ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
