'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Database,
  Terminal,
  Server,
  Workflow,
  Brain,
  Compass,
  Users,
  Lightbulb,
} from 'lucide-react';
import { SECTIONS_DATA, SectionData, QuestionItem } from './questionsData';
import {
  SparkArchitectureDiagram,
  MedallionLakehouseDiagram,
  StreamingCdcDiagram,
  SqlWindowFunctionDiagram,
  AiFeatureStoreDiagram,
} from './ArchitectureDiagrams';

export function DataEngineeringInterviewGuide() {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({
    1: true,
    8: true,
    86: true,
    161: true,
  });
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filter logic
  const filteredSections = useMemo(() => {
    return SECTIONS_DATA.map((section) => {
      const isSectionMatch = selectedSectionId === 'all' || section.id === selectedSectionId;
      if (!isSectionMatch) {
        return { ...section, questions: [] };
      }

      const matchingQuestions = section.questions.filter((q) => {
        const matchesDifficulty =
          selectedDifficulty === 'all' || q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

        const query = searchQuery.trim().toLowerCase();
        if (!query) return matchesDifficulty;

        const matchesQuery =
          q.id.toString() === query ||
          q.question.toLowerCase().includes(query) ||
          q.shortAnswer.toLowerCase().includes(query) ||
          q.detailedAnswer.toLowerCase().includes(query) ||
          q.relatedTags.some((t) => t.toLowerCase().includes(query));

        return matchesDifficulty && matchesQuery;
      });

      return {
        ...section,
        questions: matchingQuestions,
      };
    }).filter((section) => selectedSectionId === 'all' || section.id === selectedSectionId);
  }, [selectedSectionId, searchQuery, selectedDifficulty]);

  const totalFilteredCount = filteredSections.reduce((acc, sec) => acc + sec.questions.length, 0);

  return (
    <div className="w-full space-y-10 text-foreground selection:bg-primary/20">
      {/* GUIDE HEADER HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-card via-card/95 to-background p-6 sm:p-10 shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Comprehensive 2026 Masterclass
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground font-mono">
              500+ Curated Questions & Answers
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              5 Architecture Blueprints
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            The Complete Data Engineering & Architecture Interview Handbook (2026 Edition)
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From distributed Spark Catalyst mechanics and Databricks Liquid Clustering to log-based CDC streaming,
            dimensional star modeling, and enterprise AI feature pipelines. Includes high-resolution architectural
            diagrams, production code patterns, and interviewer expectations.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
            <div className="rounded-xl border border-border/60 bg-background/50 p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Coverage</span>
              <p className="text-base font-bold text-foreground">8 Core Domains</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Questions</span>
              <p className="text-base font-bold text-primary font-mono">Q1 to Q500</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Visuals</span>
              <p className="text-base font-bold text-foreground">5 High-Res Diagrams</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/50 p-3">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Level</span>
              <p className="text-base font-bold text-emerald-600">Junior to Staff Architect</p>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS (SEARCH & SECTION PILLS) */}
      <div className="sticky top-16 z-20 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-md space-y-3">
        {/* Search input + Difficulty filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search 500+ questions (e.g. 'Liquid Clustering', 'AQE', 'Broadcast Join', 'Watermark', 'SCD Type 2', 'Q88')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-xs sm:text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior Engineer</option>
              <option value="staff/principal">Staff / Principal Architect</option>
            </select>
          </div>
        </div>

        {/* Section Pill Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedSectionId('all')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-bold transition-all ${
              selectedSectionId === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            All Sections (500 Qs)
          </button>
          {SECTIONS_DATA.map((sec, idx) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSectionId(sec.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 font-medium transition-all ${
                selectedSectionId === sec.id
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              Section {idx + 1}: {sec.range}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE FILTER STATUS */}
      {(searchQuery || selectedDifficulty !== 'all' || selectedSectionId !== 'all') && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Showing <strong className="text-foreground">{totalFilteredCount}</strong> matching questions
            {searchQuery && <> for &ldquo;<span className="text-primary">{searchQuery}</span>&rdquo;</>}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('all');
              setSelectedSectionId('all');
            }}
            className="text-primary font-semibold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* SECTIONS RENDERING */}
      <div className="space-y-14">
        {filteredSections.map((sec, secIndex) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-36 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm"
          >
            {/* SECTION HEADER */}
            <div className="border-b border-border/60 pb-5 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-mono font-bold text-primary">
                  {sec.range}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  Part {secIndex + 1} of 8
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                {sec.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {sec.summary}
              </p>

              {/* Topics tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {sec.keyTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-foreground"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* HIGH-YIELD CHEAT SHEET SUMMARY */}
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Lightbulb className="h-4 w-4" />
                <span>Executive Cheat Sheet & Critical Interview Rules</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {sec.cheatSheet.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-border/40 bg-card p-2.5">
                    <strong className="text-foreground block font-semibold mb-0.5">{item.label}</strong>
                    <span className="text-muted-foreground leading-relaxed">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ARCHITECTURE DIAGRAM INJECTION */}
            {sec.diagramType === 'spark' && <SparkArchitectureDiagram />}
            {sec.diagramType === 'lakehouse' && <MedallionLakehouseDiagram />}
            {sec.diagramType === 'streaming' && <StreamingCdcDiagram />}
            {sec.diagramType === 'sql' && <SqlWindowFunctionDiagram />}
            {sec.diagramType === 'aifeatures' && <AiFeatureStoreDiagram />}

            {/* DETAILED QUESTION ACCORDIONS */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Key Interview Questions & Deep Technical Explanations ({sec.questions.length})
                </h4>
              </div>

              {sec.questions.map((q) => {
                const isExpanded = !!expandedQuestions[q.id];

                return (
                  <div
                    key={q.id}
                    className="overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-primary/40 shadow-xs"
                  >
                    {/* Accordion Trigger Header */}
                    <button
                      onClick={() => toggleQuestion(q.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 bg-card/40 hover:bg-card transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                            Q{q.id}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              q.difficulty === 'Junior'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : q.difficulty === 'Mid'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : q.difficulty === 'Senior'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-medium">• {q.category}</span>
                        </div>

                        <h5 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                          {q.question}
                        </h5>

                        {!isExpanded && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {q.shortAnswer}
                          </p>
                        )}
                      </div>

                      <div className="p-1 rounded-md text-muted-foreground hover:text-foreground shrink-0 mt-0.5">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 border-t border-border/60 space-y-5 bg-background text-xs sm:text-sm">
                        {/* Short TL;DR Answer */}
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Direct Executive Summary</span>
                          <p className="text-xs font-semibold text-foreground leading-relaxed">
                            {q.shortAnswer}
                          </p>
                        </div>

                        {/* Detailed In-Depth Breakdown */}
                        <div className="space-y-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Under the Hood / Deep Mechanics
                          </span>
                          <div className="whitespace-pre-line text-muted-foreground leading-relaxed text-xs sm:text-sm font-sans space-y-2">
                            {q.detailedAnswer}
                          </div>
                        </div>

                        {/* Optional Code Snippet */}
                        {q.codeSnippet && (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                              <span className="uppercase font-semibold">{q.codeLanguage || 'Code Example'}</span>
                              <button
                                onClick={() => handleCopyCode(q.id, q.codeSnippet!)}
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                              >
                                {copiedCodeId === q.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-500" /> Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" /> Copy Snippet
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-100 border border-zinc-800 shadow-inner">
                              <pre>{q.codeSnippet}</pre>
                            </div>
                          </div>
                        )}

                        {/* Interviewer Tip Box */}
                        {q.interviewerTip && (
                          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                            <strong className="block font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                              <Sparkles className="h-3.5 w-3.5" />
                              Staff Engineer Interviewer Tip & Trap Alert
                            </strong>
                            <p className="leading-relaxed">{q.interviewerTip}</p>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-border/40">
                          {q.relatedTags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* FULL 500 QUESTIONS DIRECTORY LIST (COLLAPSIBLE MASTER INDEX) */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 space-y-6 shadow-md">
        <div className="space-y-2 border-b border-border pb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Complete 500 Questions Master Catalog</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Complete 500 Interview Questions Reference Index
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Every candidate should be prepared to discuss these 500 questions across Spark internals, Delta Lake ACID
            protocols, SQL window frames, cloud storage encodings, stream watermarks, and system design trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              1. Apache Spark & PySpark (Q1–Q85)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q1–Q15: Spark vs MapReduce, Driver/Executors, DAG Scheduler, Catalyst Phases</li>
              <li>Q16–Q30: Tungsten Engine, Whole-Stage CodeGen, AQE Runtime Optimizations, Caching Storage Levels</li>
              <li>Q31–Q50: Narrow vs Wide Transformations, Coalesce vs Repartition, Broadcast Hash Joins</li>
              <li>Q51–Q70: Sort-Merge Join Mechanics, Data Skew Detection, Key Salting, Driver vs Executor OOM</li>
              <li>Q71–Q85: Window Functions, Islands-and-Gaps, Predicate Pushdown, Schema Evolution</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              2. Databricks & Delta Lake (Q86–Q160)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q86–Q105: Medallion Architecture, _delta_log JSON Commits, Optimistic Concurrency (OCC)</li>
              <li>Q106–Q125: Liquid Clustering vs Z-Order, Deletion Vectors, VACUUM Retention Safety</li>
              <li>Q126–Q145: Auto Loader cloudFiles, DLT Expectations, Unity Catalog 3-Level Namespace</li>
              <li>Q146–Q160: SCD Type 2 Merge, Structured Streaming Checkpoints, Watermarks, Schema Evolution</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              3. SQL & Data Modeling (Q161–Q245)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q161–Q180: Logical Order of Execution, ROW_NUMBER vs RANK vs DENSE_RANK, Top N per Group</li>
              <li>Q181–Q205: SARGable Predicates, Index Seeks vs Scans, Kimball Grain Declaration</li>
              <li>Q206–Q225: Star vs Snowflake vs OBT, Conformed Dimensions, Factless Facts, Junk Dimensions</li>
              <li>Q226–Q245: SCD Types 0-3, Surrogate Keys, Islands and Gaps, User Cohort Retention Analysis</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              4. Warehousing & Storage (Q246–Q310)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q246–Q265: Snowflake Micro-partitioning, BigQuery Dremel, Redshift Distribution Styles</li>
              <li>Q266–Q285: Parquet Row Groups & Page Encoding (RLE/Dictionary), Object Storage Consistency</li>
              <li>Q286–Q310: FinOps Cost Observability, 5 Pillars of Data Observability, Data Mesh Principles</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Workflow className="h-4 w-4 text-primary" />
              5. Ingestion, CDC & Streaming (Q311–Q380)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q311–Q330: Log-Based CDC (Debezium) vs Query CDC, Kafka Partitions & FIFO Ordering</li>
              <li>Q331–Q355: Exactly-Once Semantics, Event Time vs Processing Time, Watermark State Eviction</li>
              <li>Q356–Q380: Apache Airflow DAG Best Practices, Backfills, Dead-Letter Queues, dbt Models</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              6. AI & Modern Pipelines (Q381–Q425)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q381–Q400: Offline vs Online Feature Stores, Training-Serving Skew Prevention</li>
              <li>Q401–Q425: Point-in-Time Correct (AS-OF) Joins, RAG Document Chunking & Vector Sync, Data Contracts</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" />
              7. System Design Scenarios (Q426–Q465)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q426–Q445: Near-Real-Time Clickstream, Financial Ledger Reconciliation, 5TB Daily Batch ETL SLAs</li>
              <li>Q446–Q465: Zero-Downtime DWH Migrations, Multi-Tenant Data Lakehouses, Disaster Recovery (RPO/RTO)</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-3">
            <h5 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              8. Behavioral & Leadership (Q466–Q500)
            </h5>
            <ul className="space-y-1.5 text-muted-foreground list-disc pl-4 leading-relaxed">
              <li>Q466–Q480: STAR Method for Production Outages, Blameless Post-Mortems, Tech Debt vs Feature Velocity</li>
              <li>Q481–Q500: Cross-Team Data Contract Negotiation, Mentoring Engineers, Production Readiness Checklists</li>
            </ul>
          </div>
        </div>
      </div>

      {/* STRATEGY SESSION FOOTER */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-card/90 to-primary/5 p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Accelerate Your Enterprise Data Platform Architecture
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Sathus Technology helps global enterprises modernize legacy data warehouses into high-throughput,
          cost-efficient Delta Lakehouses, real-time Kafka streaming architectures, and enterprise AI feature stores.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book-strategy-session"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
          >
            Schedule Architecture Evaluation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/resources/blog"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-all"
          >
            Explore More Whitepapers
          </Link>
        </div>
      </div>
    </div>
  );
}
