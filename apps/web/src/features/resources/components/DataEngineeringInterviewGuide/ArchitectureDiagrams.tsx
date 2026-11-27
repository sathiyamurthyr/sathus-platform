'use client';

import React from 'react';

/**
 * High-definition, responsive vector architecture diagrams for Data Engineering concepts.
 * Styled cleanly with modern gradients, dark/light theme support, and clear semantic labels.
 */

export function SparkArchitectureDiagram() {
  return (
    <div className="w-full my-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/90 to-muted/30 p-4 sm:p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Architecture Visual Blueprint 01</span>
          <h4 className="text-base font-bold text-foreground">Apache Spark 3.x / 4.x Distributed Execution & Memory Internals</h4>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-mono font-semibold text-primary">
          Catalyst + Tungsten Engine
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 460"
          className="w-full min-w-[760px] text-foreground select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Grids */}
          <rect width="920" height="460" rx="12" fill="currentColor" fillOpacity="0.02" />

          {/* DRIVER NODE */}
          <rect x="20" y="30" width="260" height="390" rx="10" className="fill-card stroke-primary/50" strokeWidth="2" />
          <rect x="20" y="30" width="260" height="36" rx="10" className="fill-primary/15" />
          <text x="35" y="54" className="fill-foreground font-bold text-xs">SPARK DRIVER PROGRAM</text>
          <text x="210" y="54" className="fill-primary font-mono text-[10px] font-bold">[JVM Process]</text>

          {/* SparkSession */}
          <rect x="35" y="80" width="230" height="50" rx="6" className="fill-background stroke-border" strokeWidth="1" />
          <text x="45" y="100" className="fill-foreground font-semibold text-[11px]">SparkSession / SparkContext</text>
          <text x="45" y="118" className="fill-muted-foreground text-[9px] font-mono">User Code • DataFrame API • SQL Parser</text>

          {/* Catalyst Optimizer Box */}
          <rect x="35" y="142" width="230" height="110" rx="6" className="fill-primary/5 stroke-primary/30" strokeWidth="1" />
          <text x="45" y="160" className="fill-primary font-bold text-[11px]">Catalyst Query Optimizer</text>
          
          <rect x="45" y="170" width="210" height="20" rx="4" className="fill-background stroke-border/70" />
          <text x="52" y="184" className="fill-foreground text-[9px]">1. Unresolved Logical Plan &rarr; Analysis</text>

          <rect x="45" y="195" width="210" height="20" rx="4" className="fill-background stroke-border/70" />
          <text x="52" y="209" className="fill-foreground text-[9px]">2. Optimized Logical Plan (Filter Pushdown)</text>

          <rect x="45" y="220" width="210" height="20" rx="4" className="fill-background stroke-border/70" />
          <text x="52" y="234" className="fill-foreground text-[9px]">3. Physical Plans (Cost-Based Optimizer / CBO)</text>

          {/* DAGScheduler & TaskScheduler */}
          <rect x="35" y="264" width="230" height="70" rx="6" className="fill-background stroke-border" strokeWidth="1" />
          <text x="45" y="284" className="fill-foreground font-semibold text-[11px]">DAGScheduler (Stages)</text>
          <text x="45" y="300" className="fill-muted-foreground text-[9px]">Splits RDD graph at Shuffle boundaries</text>
          <path d="M 45 308 L 255 308" className="stroke-border" strokeWidth="1" />
          <text x="45" y="322" className="fill-foreground font-semibold text-[11px]">TaskScheduler (Tasks to Executors)</text>

          {/* AQE Badge */}
          <rect x="35" y="348" width="230" height="56" rx="6" className="fill-emerald-500/10 stroke-emerald-500/40" strokeWidth="1" />
          <text x="45" y="368" className="fill-emerald-600 dark:fill-emerald-400 font-bold text-[11px]">Adaptive Query Execution (AQE)</text>
          <text x="45" y="384" className="fill-muted-foreground text-[9px]">• Dynamic coalesce • Skewed join handling</text>
          <text x="45" y="396" className="fill-muted-foreground text-[9px]">• Runtime sort-merge to broadcast join switch</text>

          {/* CLUSTER MANAGER (Center) */}
          <rect x="320" y="180" width="130" height="100" rx="8" className="fill-card stroke-amber-500/50" strokeWidth="1.5" />
          <text x="330" y="205" className="fill-amber-600 dark:fill-amber-400 font-bold text-[11px]">CLUSTER MANAGER</text>
          <text x="330" y="222" className="fill-muted-foreground text-[9px] font-mono">Kubernetes</text>
          <text x="330" y="236" className="fill-muted-foreground text-[9px] font-mono">Databricks</text>
          <text x="330" y="250" className="fill-muted-foreground text-[9px] font-mono">YARN / Standalone</text>
          <text x="330" y="268" className="fill-foreground font-semibold text-[9px]">Resource Allocation</text>

          {/* Connections Driver to Cluster Manager */}
          <path d="M 280 230 L 320 230" className="stroke-primary" strokeWidth="2" strokeDasharray="4 2" />
          <polygon points="320,230 312,225 312,235" className="fill-primary" />

          {/* WORKER NODE 1 */}
          <rect x="490" y="30" width="410" height="185" rx="10" className="fill-card stroke-border" strokeWidth="1.5" />
          <rect x="490" y="30" width="410" height="28" rx="10" className="fill-muted/50" />
          <text x="505" y="49" className="fill-foreground font-bold text-xs">WORKER NODE 1 (VM / Pod)</text>
          <text x="780" y="49" className="fill-muted-foreground font-mono text-[10px]">16 Cores • 64GB</text>

          {/* Executor 1 */}
          <rect x="505" y="70" width="380" height="130" rx="8" className="fill-background stroke-primary/30" strokeWidth="1" />
          <text x="520" y="90" className="fill-primary font-bold text-[11px]">Executor 1 [JVM Process]</text>
          
          {/* Memory breakdown */}
          <rect x="520" y="100" width="170" height="42" rx="4" className="fill-primary/10 stroke-primary/20" />
          <text x="528" y="116" className="fill-foreground text-[9px] font-semibold">Execution Memory (Shuffles/Joins)</text>
          <text x="528" y="132" className="fill-muted-foreground text-[8px]">Unified Storage Pool &bull; Tungsten Off-Heap</text>

          <rect x="700" y="100" width="185" height="42" rx="4" className="fill-muted/40 stroke-border" />
          <text x="708" y="116" className="fill-foreground text-[9px] font-semibold">Storage Memory (Cached RDD/DF)</text>
          <text x="708" y="132" className="fill-muted-foreground text-[8px]">LRU Eviction to Disk Spill on Pressure</text>

          {/* Cores/Tasks */}
          <rect x="520" y="152" width="80" height="36" rx="4" className="fill-card border stroke-emerald-500/40" />
          <text x="532" y="167" className="fill-foreground font-mono text-[9px]">Task Slot 1</text>
          <text x="532" y="180" className="fill-emerald-600 text-[8px] font-bold">Running</text>

          <rect x="610" y="152" width="80" height="36" rx="4" className="fill-card border stroke-emerald-500/40" />
          <text x="622" y="167" className="fill-foreground font-mono text-[9px]">Task Slot 2</text>
          <text x="622" y="180" className="fill-emerald-600 text-[8px] font-bold">Running</text>

          <rect x="700" y="152" width="80" height="36" rx="4" className="fill-card border stroke-border" />
          <text x="712" y="167" className="fill-foreground font-mono text-[9px]">Task Slot 3</text>
          <text x="712" y="180" className="fill-muted-foreground text-[8px]">Idle</text>

          <rect x="790" y="152" width="95" height="36" rx="4" className="fill-card border stroke-border" />
          <text x="798" y="167" className="fill-foreground font-mono text-[9px]">BlockManager</text>
          <text x="798" y="180" className="fill-muted-foreground text-[8px]">Shuffle Service</text>

          {/* WORKER NODE 2 */}
          <rect x="490" y="235" width="410" height="185" rx="10" className="fill-card stroke-border" strokeWidth="1.5" />
          <rect x="490" y="235" width="410" height="28" rx="10" className="fill-muted/50" />
          <text x="505" y="254" className="fill-foreground font-bold text-xs">WORKER NODE 2 (VM / Pod)</text>
          <text x="780" y="254" className="fill-muted-foreground font-mono text-[10px]">16 Cores • 64GB</text>

          {/* Executor 2 */}
          <rect x="505" y="275" width="380" height="130" rx="8" className="fill-background stroke-primary/30" strokeWidth="1" />
          <text x="520" y="295" className="fill-primary font-bold text-[11px]">Executor 2 [JVM Process]</text>

          {/* Memory breakdown */}
          <rect x="520" y="305" width="170" height="42" rx="4" className="fill-primary/10 stroke-primary/20" />
          <text x="528" y="321" className="fill-foreground text-[9px] font-semibold">Execution Memory (Shuffles/Joins)</text>
          <text x="528" y="337" className="fill-muted-foreground text-[8px]">Tungsten Binary Memory Management</text>

          <rect x="700" y="305" width="185" height="42" rx="4" className="fill-muted/40 stroke-border" />
          <text x="708" y="321" className="fill-foreground text-[9px] font-semibold">Storage Memory (Cached RDD/DF)</text>
          <text x="708" y="337" className="fill-muted-foreground text-[8px]">Serialized In-Memory Cache</text>

          {/* Cores/Tasks */}
          <rect x="520" y="357" width="80" height="36" rx="4" className="fill-card border stroke-emerald-500/40" />
          <text x="532" y="372" className="fill-foreground font-mono text-[9px]">Task Slot 1</text>
          <text x="532" y="385" className="fill-emerald-600 text-[8px] font-bold">Running</text>

          <rect x="610" y="357" width="80" height="36" rx="4" className="fill-card border stroke-emerald-500/40" />
          <text x="622" y="372" className="fill-foreground font-mono text-[9px]">Task Slot 2</text>
          <text x="622" y="385" className="fill-emerald-600 text-[8px] font-bold">Running</text>

          <rect x="700" y="357" width="185" height="36" rx="4" className="fill-rose-500/10 border stroke-rose-500/30" />
          <text x="708" y="372" className="fill-rose-600 dark:fill-rose-400 font-mono text-[9px]">Shuffle Spill Area</text>
          <text x="708" y="385" className="fill-muted-foreground text-[8px]">Local NVMe Scratch Disk</text>

          {/* SHUFFLE ARROW (Connecting Worker 1 and Worker 2) */}
          <path d="M 680 200 L 680 275" className="stroke-amber-500" strokeWidth="2" strokeDasharray="3 3" />
          <text x="690" y="242" className="fill-amber-600 dark:fill-amber-400 font-bold text-[9px] font-mono">
            SHUFFLE EXCHANGE (Wide Dependency)
          </text>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground">
        <div className="rounded-lg border border-border/60 bg-background/50 p-2.5">
          <strong className="text-foreground block font-semibold mb-0.5">Narrow Transformation</strong>
          Data stays within same partition. No network transfer (e.g. `map`, `filter`).
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-2.5">
          <strong className="text-foreground block font-semibold mb-0.5">Wide Transformation</strong>
          Triggers a Stage Boundary & Shuffle across all worker nodes (e.g. `groupBy`, `join`).
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-2.5">
          <strong className="text-foreground block font-semibold mb-0.5">Adaptive Execution (AQE)</strong>
          Dynamically collapses small post-shuffle partitions and splits skewed keys at runtime.
        </div>
      </div>
    </div>
  );
}

export function MedallionLakehouseDiagram() {
  return (
    <div className="w-full my-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/90 to-muted/30 p-4 sm:p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Architecture Visual Blueprint 02</span>
          <h4 className="text-base font-bold text-foreground">Databricks Delta Lake / Apache Iceberg Medallion Lakehouse</h4>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
          ACID • Time Travel • OCC
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 380"
          className="w-full min-w-[760px] text-foreground select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="920" height="380" rx="12" fill="currentColor" fillOpacity="0.02" />

          {/* INGESTION SOURCES */}
          <g transform="translate(15, 30)">
            <rect width="160" height="320" rx="10" className="fill-muted/40 stroke-border" strokeWidth="1.5" />
            <text x="15" y="28" className="fill-foreground font-bold text-xs uppercase tracking-wide">Data Sources</text>

            <rect x="12" y="48" width="136" height="52" rx="6" className="fill-background stroke-border" />
            <text x="20" y="68" className="fill-foreground font-semibold text-[10px]">OLTP Databases</text>
            <text x="20" y="84" className="fill-muted-foreground text-[8px] font-mono">PostgreSQL • MySQL • Oracle</text>
            <text x="20" y="94" className="fill-primary font-mono text-[8px]">WAL / Binlog CDC</text>

            <rect x="12" y="112" width="136" height="52" rx="6" className="fill-background stroke-border" />
            <text x="20" y="132" className="fill-foreground font-semibold text-[10px]">Event Streaming</text>
            <text x="20" y="148" className="fill-muted-foreground text-[8px] font-mono">Kafka • Kinesis • Event Hubs</text>
            <text x="20" y="158" className="fill-emerald-600 text-[8px]">50K+ msg/sec</text>

            <rect x="12" y="176" width="136" height="52" rx="6" className="fill-background stroke-border" />
            <text x="20" y="196" className="fill-foreground font-semibold text-[10px]">Files & Object Storage</text>
            <text x="20" y="212" className="fill-muted-foreground text-[8px] font-mono">S3 • ADLS Gen2 • GCS</text>
            <text x="20" y="222" className="fill-amber-600 text-[8px]">Auto Loader cloudFiles</text>

            <rect x="12" y="240" width="136" height="52" rx="6" className="fill-background stroke-border" />
            <text x="20" y="260" className="fill-foreground font-semibold text-[10px]">SaaS & External APIs</text>
            <text x="20" y="276" className="fill-muted-foreground text-[8px] font-mono">Stripe • Salesforce • REST</text>
            <text x="20" y="286" className="fill-muted-foreground text-[8px]">Webhooks & Pagination</text>
          </g>

          {/* ARROW 1 */}
          <path d="M 180 185 L 215 185" className="stroke-primary" strokeWidth="2.5" />
          <polygon points="215,185 206,180 206,190" className="fill-primary" />

          {/* BRONZE LAYER */}
          <g transform="translate(225, 30)">
            <rect width="200" height="320" rx="10" className="fill-amber-950/20 stroke-amber-500/50" strokeWidth="2" />
            <rect width="200" height="34" rx="10" className="fill-amber-500/20" />
            <text x="14" y="23" className="fill-amber-600 dark:fill-amber-400 font-bold text-xs uppercase tracking-wide">
              BRONZE LAYER (RAW)
            </text>

            <rect x="12" y="46" width="176" height="44" rx="6" className="fill-background stroke-border" />
            <text x="20" y="64" className="fill-foreground font-semibold text-[10px]">Append-Only Raw State</text>
            <text x="20" y="78" className="fill-muted-foreground text-[8px]">Preserves exact producer fidelity</text>

            <rect x="12" y="98" width="176" height="58" rx="6" className="fill-background stroke-border" />
            <text x="20" y="116" className="fill-foreground font-semibold text-[10px]">Audit & CDC Envelope</text>
            <text x="20" y="130" className="fill-muted-foreground text-[8px] font-mono">_rescued_data • ingest_ts</text>
            <text x="20" y="142" className="fill-muted-foreground text-[8px] font-mono">source_file • op_type (C/U/D)</text>

            <rect x="12" y="164" width="176" height="66" rx="6" className="fill-background stroke-border" />
            <text x="20" y="182" className="fill-foreground font-semibold text-[10px]">Storage Structure</text>
            <text x="20" y="196" className="fill-muted-foreground text-[8px] font-mono">part-00000.parquet</text>
            <text x="20" y="208" className="fill-muted-foreground text-[8px] font-mono">_delta_log/00000.json</text>
            <text x="20" y="220" className="fill-amber-600 font-bold text-[8px]">No Data Loss Guarantee</text>

            <rect x="12" y="240" width="176" height="68" rx="6" className="fill-amber-500/10 stroke-amber-500/30" />
            <text x="20" y="258" className="fill-amber-600 dark:fill-amber-400 font-bold text-[10px]">Downstream Contract</text>
            <text x="20" y="274" className="fill-foreground text-[8px]">Source of Truth for Replays,</text>
            <text x="20" y="286" className="fill-foreground text-[8px]">Backfills & Incident Recovery</text>
          </g>

          {/* ARROW 2 */}
          <path d="M 430 185 L 465 185" className="stroke-primary" strokeWidth="2.5" />
          <polygon points="465,185 456,180 456,190" className="fill-primary" />
          <text x="432" y="172" className="fill-primary text-[8px] font-mono font-bold">MERGE / DLT</text>

          {/* SILVER LAYER */}
          <g transform="translate(475, 30)">
            <rect width="200" height="320" rx="10" className="fill-slate-800/10 dark:fill-slate-700/20 stroke-slate-400" strokeWidth="2" />
            <rect width="200" height="34" rx="10" className="fill-slate-400/20" />
            <text x="14" y="23" className="fill-foreground font-bold text-xs uppercase tracking-wide">
              SILVER LAYER (CURATED)
            </text>

            <rect x="12" y="46" width="176" height="54" rx="6" className="fill-background stroke-border" />
            <text x="20" y="64" className="fill-foreground font-semibold text-[10px]">Data Cleansing & Typing</text>
            <text x="20" y="78" className="fill-muted-foreground text-[8px]">Schema enforcement & validation</text>
            <text x="20" y="90" className="fill-emerald-600 font-mono text-[8px]">Expectations: expect_or_drop</text>

            <rect x="12" y="108" width="176" height="56" rx="6" className="fill-background stroke-border" />
            <text x="20" y="126" className="fill-foreground font-semibold text-[10px]">Deduplication & Conformance</text>
            <text x="20" y="140" className="fill-muted-foreground text-[8px]">Idempotent MERGE INTO</text>
            <text x="20" y="152" className="fill-muted-foreground text-[8px]">Timestamp window deduplication</text>

            <rect x="12" y="172" width="176" height="66" rx="6" className="fill-background stroke-border" />
            <text x="20" y="190" className="fill-foreground font-semibold text-[10px]">SCD Type 2 & History</text>
            <text x="20" y="204" className="fill-muted-foreground text-[8px] font-mono">is_current • valid_from • to</text>
            <text x="20" y="216" className="fill-muted-foreground text-[8px]">Delta Change Data Feed (CDF)</text>
            <text x="20" y="228" className="fill-primary font-bold text-[8px]">Deletion Vectors Enabled</text>

            <rect x="12" y="246" width="176" height="62" rx="6" className="fill-muted/40 stroke-border" />
            <text x="20" y="264" className="fill-foreground font-semibold text-[10px]">Query Target</text>
            <text x="20" y="278" className="fill-muted-foreground text-[8px]">Enterprise 360 Entity Store</text>
            <text x="20" y="290" className="fill-muted-foreground text-[8px]">Ad-hoc Analytics & Data Science</text>
          </g>

          {/* ARROW 3 */}
          <path d="M 680 185 L 715 185" className="stroke-primary" strokeWidth="2.5" />
          <polygon points="715,185 706,180 706,190" className="fill-primary" />
          <text x="684" y="172" className="fill-primary text-[8px] font-mono font-bold">AGGREGATE</text>

          {/* GOLD LAYER */}
          <g transform="translate(725, 30)">
            <rect width="180" height="320" rx="10" className="fill-yellow-500/10 stroke-yellow-500/60" strokeWidth="2" />
            <rect width="180" height="34" rx="10" className="fill-yellow-500/20" />
            <text x="14" y="23" className="fill-yellow-600 dark:fill-yellow-400 font-bold text-xs uppercase tracking-wide">
              GOLD (BUSINESS)
            </text>

            <rect x="10" y="46" width="160" height="52" rx="6" className="fill-background stroke-border" />
            <text x="18" y="64" className="fill-foreground font-semibold text-[10px]">Star Schema & Marts</text>
            <text x="18" y="78" className="fill-muted-foreground text-[8px]">Fact Tables & Dimensions</text>
            <text x="18" y="88" className="fill-muted-foreground text-[8px]">One Big Table (OBT)</text>

            <rect x="10" y="106" width="160" height="52" rx="6" className="fill-background stroke-border" />
            <text x="18" y="124" className="fill-foreground font-semibold text-[10px]">Performance Layout</text>
            <text x="18" y="138" className="fill-primary font-mono text-[8px]">Liquid Clustering</text>
            <text x="18" y="148" className="fill-muted-foreground text-[8px]">OPTIMIZE & Z-ORDER</text>

            <rect x="10" y="166" width="160" height="66" rx="6" className="fill-background stroke-border" />
            <text x="18" y="184" className="fill-foreground font-semibold text-[10px]">Downstream Consumers</text>
            <text x="18" y="198" className="fill-emerald-600 font-semibold text-[8px]">&bull; BI Dashboards (PowerBI)</text>
            <text x="18" y="210" className="fill-blue-600 font-semibold text-[8px]">&bull; ML Features / AI Agents</text>
            <text x="18" y="222" className="fill-purple-600 font-semibold text-[8px]">&bull; Executive Financial Reporting</text>

            <rect x="10" y="240" width="160" height="68" rx="6" className="fill-yellow-500/10 stroke-yellow-500/40" />
            <text x="18" y="258" className="fill-yellow-600 dark:fill-yellow-400 font-bold text-[10px]">Governance Guard</text>
            <text x="18" y="272" className="fill-foreground text-[8px]">Unity Catalog / RLS / Masking</text>
            <text x="18" y="284" className="fill-foreground text-[8px]">Sub-second SLA Serving</text>
          </g>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2 text-[10px] text-muted-foreground font-mono">
        <span>&bull; Transaction Log: `_delta_log/` keeps serial commit history</span>
        <span>&bull; Concurrency: Optimistic Concurrency Control (OCC) with atomic multi-file commits</span>
        <span>&bull; Maintenance: Regular `VACUUM` (default 7 days) + `OPTIMIZE` prevents small file degradation</span>
      </div>
    </div>
  );
}

export function StreamingCdcDiagram() {
  return (
    <div className="w-full my-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/90 to-muted/30 p-4 sm:p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Architecture Visual Blueprint 03</span>
          <h4 className="text-base font-bold text-foreground">Real-Time Event Streaming, Debezium CDC & Watermark Mechanics</h4>
        </div>
        <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-mono font-semibold text-blue-600 dark:text-blue-400">
          Sub-Minute Latency &bull; Exactly-Once
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 320"
          className="w-full min-w-[760px] text-foreground select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="920" height="320" rx="12" fill="currentColor" fillOpacity="0.02" />

          {/* 1. TRANSACTION LOG */}
          <g transform="translate(20, 40)">
            <rect width="160" height="240" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
            <text x="15" y="25" className="fill-foreground font-bold text-xs">OLTP DATABASE</text>
            <text x="15" y="40" className="fill-muted-foreground text-[9px] font-mono">Postgres / MySQL</text>

            <rect x="12" y="55" width="136" height="40" rx="4" className="fill-primary/10 stroke-primary/30" />
            <text x="20" y="72" className="fill-foreground font-semibold text-[9px]">Transactions (ACID)</text>
            <text x="20" y="86" className="fill-muted-foreground text-[8px]">INSERT / UPDATE / DELETE</text>

            <rect x="12" y="105" width="136" height="115" rx="4" className="fill-background stroke-primary/50" />
            <text x="20" y="125" className="fill-primary font-bold text-[10px]">WAL / Binlog</text>
            <text x="20" y="142" className="fill-foreground text-[8px] font-mono">[LSN 101] INSERT id=1</text>
            <text x="20" y="158" className="fill-foreground text-[8px] font-mono">[LSN 102] UPDATE id=1</text>
            <text x="20" y="174" className="fill-foreground text-[8px] font-mono">[LSN 103] DELETE id=2</text>
            <text x="20" y="195" className="fill-emerald-600 text-[8px] font-semibold">&bull; Zero query overhead on DB</text>
            <text x="20" y="207" className="fill-emerald-600 text-[8px] font-semibold">&bull; Catches hard deletes</text>
          </g>

          {/* ARROW */}
          <path d="M 185 160 L 220 160" className="stroke-primary" strokeWidth="2" />
          <polygon points="220,160 212,155 212,165" className="fill-primary" />

          {/* 2. DEBEZIUM CONNECTOR */}
          <g transform="translate(225, 60)">
            <rect width="130" height="200" rx="8" className="fill-card stroke-blue-500/50" strokeWidth="1.5" />
            <text x="12" y="25" className="fill-blue-600 dark:fill-blue-400 font-bold text-xs">DEBEZIUM</text>
            <text x="12" y="40" className="fill-muted-foreground text-[9px] font-mono">Kafka Connect</text>

            <rect x="10" y="55" width="110" height="130" rx="4" className="fill-background stroke-border" />
            <text x="16" y="74" className="fill-foreground font-semibold text-[9px]">CDC Envelope:</text>
            <text x="16" y="92" className="fill-muted-foreground font-mono text-[8px]">"before": {"{...}"}</text>
            <text x="16" y="106" className="fill-muted-foreground font-mono text-[8px]">"after": {"{...}"}</text>
            <text x="16" y="120" className="fill-muted-foreground font-mono text-[8px]">"op": "u",</text>
            <text x="16" y="134" className="fill-muted-foreground font-mono text-[8px]">"ts_ms": 1718000</text>
            <text x="16" y="152" className="fill-primary font-bold text-[8px]">Schema Registry</text>
            <text x="16" y="166" className="fill-muted-foreground text-[8px]">Avro / JSON Schema</text>
          </g>

          {/* ARROW */}
          <path d="M 360 160 L 395 160" className="stroke-primary" strokeWidth="2" />
          <polygon points="395,160 387,155 387,165" className="fill-primary" />

          {/* 3. KAFKA BROKERS & PARTITIONS */}
          <g transform="translate(400, 40)">
            <rect width="180" height="240" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
            <text x="15" y="25" className="fill-foreground font-bold text-xs">APACHE KAFKA TOPIC</text>
            <text x="15" y="40" className="fill-muted-foreground text-[9px] font-mono">orders.cdc (Partitioned by Key)</text>

            {/* Partition 0 */}
            <rect x="12" y="55" width="156" height="46" rx="4" className="fill-primary/5 stroke-primary/30" />
            <text x="18" y="70" className="fill-foreground font-mono text-[9px] font-semibold">Partition 0 (Key: A-H)</text>
            <text x="18" y="85" className="fill-muted-foreground font-mono text-[8px]">Offset: [0] &bull; [1] &bull; [2] &bull; [3]...</text>
            <text x="18" y="95" className="fill-emerald-600 font-mono text-[7px]">Ordered per Partition Key</text>

            {/* Partition 1 */}
            <rect x="12" y="108" width="156" height="46" rx="4" className="fill-primary/5 stroke-primary/30" />
            <text x="18" y="123" className="fill-foreground font-mono text-[9px] font-semibold">Partition 1 (Key: I-P)</text>
            <text x="18" y="138" className="fill-muted-foreground font-mono text-[8px]">Offset: [0] &bull; [1] &bull; [2] &bull; [3]...</text>

            {/* Partition 2 */}
            <rect x="12" y="161" width="156" height="46" rx="4" className="fill-primary/5 stroke-primary/30" />
            <text x="18" y="176" className="fill-foreground font-mono text-[9px] font-semibold">Partition 2 (Key: Q-Z)</text>
            <text x="18" y="191" className="fill-muted-foreground font-mono text-[8px]">Offset: [0] &bull; [1] &bull; [2] &bull; [3]...</text>

            <text x="15" y="224" className="fill-muted-foreground text-[8px]">&bull; Replay Retention: 7 Days</text>
          </g>

          {/* ARROW */}
          <path d="M 585 160 L 620 160" className="stroke-primary" strokeWidth="2" />
          <polygon points="620,160 612,155 612,165" className="fill-primary" />

          {/* 4. STREAMING ENGINE */}
          <g transform="translate(625, 40)">
            <rect width="275" height="240" rx="8" className="fill-card stroke-emerald-500/50" strokeWidth="1.5" />
            <text x="15" y="25" className="fill-emerald-600 dark:fill-emerald-400 font-bold text-xs">
              SPARK STRUCTURED STREAMING / FLINK
            </text>
            <text x="15" y="40" className="fill-muted-foreground text-[9px] font-mono">Micro-Batch / Continuous Ingestion</text>

            <rect x="12" y="55" width="250" height="52" rx="4" className="fill-background stroke-border" />
            <text x="18" y="72" className="fill-foreground font-semibold text-[9px]">Event-Time Watermark Bound</text>
            <text x="18" y="86" className="fill-muted-foreground text-[8px] font-mono">
              withWatermark("event_time", "10 minutes")
            </text>
            <text x="18" y="98" className="fill-amber-600 text-[8px]">Drops late events beyond threshold & frees state</text>

            <rect x="12" y="114" width="250" height="52" rx="4" className="fill-background stroke-border" />
            <text x="18" y="131" className="fill-foreground font-semibold text-[9px]">Stateful Deduplication</text>
            <text x="18" y="145" className="fill-muted-foreground text-[8px] font-mono">
              dropDuplicates(["order_id", "event_time"])
            </text>
            <text x="18" y="157" className="fill-muted-foreground text-[8px]">Guarantees Exactly-Once idempotent output</text>

            <rect x="12" y="173" width="250" height="55" rx="4" className="fill-emerald-500/10 stroke-emerald-500/30" />
            <text x="18" y="191" className="fill-emerald-600 dark:fill-emerald-400 font-bold text-[9px]">
              Sink: foreachBatch &rarr; Delta MERGE INTO
            </text>
            <text x="18" y="205" className="fill-foreground text-[8px]">
              WHEN MATCHED AND cdc.op = 'd' THEN DELETE
            </text>
            <text x="18" y="217" className="fill-foreground text-[8px]">
              WHEN MATCHED THEN UPDATE &bull; WHEN NOT MATCHED THEN INSERT
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-muted-foreground">
        <div className="rounded-lg border border-border/60 bg-background/50 p-2.5">
          <strong className="text-foreground block font-semibold mb-0.5">Watermark Mechanics</strong>
          A moving timestamp boundary (`max(event_time) - delayThreshold`). Events older than watermark are dropped, preventing memory leaks in state stores.
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-2.5">
          <strong className="text-foreground block font-semibold mb-0.5">End-to-End Exactly-Once</strong>
          Requires three components: (1) Replayable source (Kafka offsets), (2) Deterministic processing, (3) Idempotent sink or 2-phase commit (Delta Lake transaction log).
        </div>
      </div>
    </div>
  );
}

export function SqlWindowFunctionDiagram() {
  return (
    <div className="w-full my-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/90 to-muted/30 p-4 sm:p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Architecture Visual Blueprint 04</span>
          <h4 className="text-base font-bold text-foreground">SQL Logical Execution Order & Window Function Frame Mechanics</h4>
        </div>
        <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-mono font-semibold text-purple-600 dark:text-purple-400">
          Query Optimizer Internal Pipeline
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 280"
          className="w-full min-w-[760px] text-foreground select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="920" height="280" rx="12" fill="currentColor" fillOpacity="0.02" />

          {/* PIPELINE STAGES */}
          {/* 1. FROM & JOIN */}
          <rect x="20" y="30" width="100" height="50" rx="6" className="fill-primary/10 stroke-primary/40" />
          <text x="32" y="50" className="fill-primary font-bold text-[10px]">1. FROM</text>
          <text x="32" y="65" className="fill-foreground text-[8px] font-mono">& JOIN</text>

          <path d="M 120 55 L 140 55" className="stroke-primary" strokeWidth="2" />

          {/* 2. WHERE */}
          <rect x="140" y="30" width="100" height="50" rx="6" className="fill-primary/10 stroke-primary/40" />
          <text x="152" y="50" className="fill-primary font-bold text-[10px]">2. WHERE</text>
          <text x="152" y="65" className="fill-muted-foreground text-[8px]">Row Filters</text>

          <path d="M 240 55 L 260 55" className="stroke-primary" strokeWidth="2" />

          {/* 3. GROUP BY */}
          <rect x="260" y="30" width="110" height="50" rx="6" className="fill-primary/10 stroke-primary/40" />
          <text x="272" y="50" className="fill-primary font-bold text-[10px]">3. GROUP BY</text>
          <text x="272" y="65" className="fill-muted-foreground text-[8px]">Aggregation</text>

          <path d="M 370 55 L 390 55" className="stroke-primary" strokeWidth="2" />

          {/* 4. HAVING */}
          <rect x="390" y="30" width="105" height="50" rx="6" className="fill-primary/10 stroke-primary/40" />
          <text x="402" y="50" className="fill-primary font-bold text-[10px]">4. HAVING</text>
          <text x="402" y="65" className="fill-muted-foreground text-[8px]">Group Filters</text>

          <path d="M 495 55 L 515 55" className="stroke-primary" strokeWidth="2" />

          {/* 5. WINDOW */}
          <rect x="515" y="30" width="115" height="50" rx="6" className="fill-purple-500/15 stroke-purple-500/50" strokeWidth="1.5" />
          <text x="525" y="50" className="fill-purple-600 dark:fill-purple-400 font-bold text-[10px]">5. OVER()</text>
          <text x="525" y="65" className="fill-foreground font-semibold text-[8px]">Window Framing</text>

          <path d="M 630 55 L 650 55" className="stroke-primary" strokeWidth="2" />

          {/* 6. SELECT */}
          <rect x="650" y="30" width="95" height="50" rx="6" className="fill-primary/10 stroke-primary/40" />
          <text x="660" y="50" className="fill-primary font-bold text-[10px]">6. SELECT</text>
          <text x="660" y="65" className="fill-muted-foreground text-[8px]">Expressions</text>

          <path d="M 745 55 L 765 55" className="stroke-primary" strokeWidth="2" />

          {/* 7. QUALIFY / ORDER */}
          <rect x="765" y="30" width="135" height="50" rx="6" className="fill-emerald-500/10 stroke-emerald-500/40" />
          <text x="775" y="50" className="fill-emerald-600 dark:fill-emerald-400 font-bold text-[10px]">7. QUALIFY / ORDER</text>
          <text x="775" y="65" className="fill-muted-foreground text-[8px]">Window Filter & Limit</text>

          {/* COMPARISON TABLE OF ROW_NUMBER vs RANK vs DENSE_RANK */}
          <g transform="translate(20, 105)">
            <rect width="880" height="150" rx="8" className="fill-card stroke-border" strokeWidth="1" />
            
            {/* Header row */}
            <rect width="880" height="28" rx="8" className="fill-muted/60" />
            <text x="25" y="19" className="fill-foreground font-bold text-[10px]">EMPLOYEE</text>
            <text x="140" y="19" className="fill-foreground font-bold text-[10px]">DEPT</text>
            <text x="230" y="19" className="fill-foreground font-bold text-[10px]">SALARY</text>
            <text x="340" y="19" className="fill-primary font-bold text-[10px]">ROW_NUMBER()</text>
            <text x="490" y="19" className="fill-amber-600 font-bold text-[10px]">RANK()</text>
            <text x="640" y="19" className="fill-emerald-600 font-bold text-[10px]">DENSE_RANK()</text>
            <text x="790" y="19" className="fill-purple-600 font-bold text-[10px]">FRAME BEHAVIOR</text>

            {/* Row 1 */}
            <text x="25" y="48" className="fill-foreground font-semibold text-[10px]">Sathish</text>
            <text x="140" y="48" className="fill-muted-foreground text-[10px]">Data</text>
            <text x="230" y="48" className="fill-foreground font-mono font-bold text-[10px]">&#8377;180,000</text>
            <text x="350" y="48" className="fill-primary font-mono font-bold text-[10px]">1</text>
            <text x="500" y="48" className="fill-amber-600 font-mono font-bold text-[10px]">1</text>
            <text x="650" y="48" className="fill-emerald-600 font-mono font-bold text-[10px]">1</text>
            <text x="790" y="48" className="fill-muted-foreground text-[9px]">Unambiguous Leader</text>

            {/* Row 2 (Tie) */}
            <text x="25" y="74" className="fill-foreground font-semibold text-[10px]">Anita</text>
            <text x="140" y="74" className="fill-muted-foreground text-[10px]">Data</text>
            <text x="230" y="74" className="fill-amber-600 font-mono font-bold text-[10px]">&#8377;150,000 [TIE]</text>
            <text x="350" y="74" className="fill-primary font-mono font-bold text-[10px]">2</text>
            <text x="500" y="74" className="fill-amber-600 font-mono font-bold text-[10px]">2</text>
            <text x="650" y="74" className="fill-emerald-600 font-mono font-bold text-[10px]">2</text>
            <text x="790" y="74" className="fill-amber-600 text-[9px]">Tied value at 2nd place</text>

            {/* Row 3 (Tie) */}
            <text x="25" y="100" className="fill-foreground font-semibold text-[10px]">Marcus</text>
            <text x="140" y="100" className="fill-muted-foreground text-[10px]">Data</text>
            <text x="230" y="100" className="fill-amber-600 font-mono font-bold text-[10px]">&#8377;150,000 [TIE]</text>
            <text x="350" y="100" className="fill-primary font-mono font-bold text-[10px]">3</text>
            <text x="500" y="100" className="fill-amber-600 font-mono font-bold text-[10px]">2</text>
            <text x="650" y="100" className="fill-emerald-600 font-mono font-bold text-[10px]">2</text>
            <text x="790" y="100" className="fill-amber-600 text-[9px]">ROW_NUMBER breaks ties arbitrarily</text>

            {/* Row 4 (Post Tie) */}
            <text x="25" y="126" className="fill-foreground font-semibold text-[10px]">Elena</text>
            <text x="140" y="126" className="fill-muted-foreground text-[10px]">Data</text>
            <text x="230" y="126" className="fill-foreground font-mono font-bold text-[10px]">&#8377;130,000</text>
            <text x="350" y="126" className="fill-primary font-mono font-bold text-[10px]">4</text>
            <text x="500" y="126" className="fill-rose-600 font-mono font-bold text-[10px]">4 (Skips 3!)</text>
            <text x="650" y="126" className="fill-emerald-600 font-mono font-bold text-[10px]">3 (No Gap!)</text>
            <text x="790" y="126" className="fill-emerald-600 text-[9px]">DENSE_RANK preserves consecutive order</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export function AiFeatureStoreDiagram() {
  return (
    <div className="w-full my-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/90 to-muted/30 p-4 sm:p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Architecture Visual Blueprint 05</span>
          <h4 className="text-base font-bold text-foreground">Dual-Path Enterprise Feature Store & AI Agent Grounding Architecture</h4>
        </div>
        <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400">
          Zero Training-Serving Skew
        </span>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 920 300"
          className="w-full min-w-[760px] text-foreground select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="920" height="300" rx="12" fill="currentColor" fillOpacity="0.02" />

          {/* Unified Feature Transformation Definition */}
          <rect x="20" y="105" width="220" height="90" rx="8" className="fill-card stroke-primary/50" strokeWidth="1.5" />
          <text x="32" y="128" className="fill-primary font-bold text-xs">UNIFIED FEATURE DEFINITION</text>
          <text x="32" y="145" className="fill-muted-foreground text-[9px] font-mono">Single Git Repo • PySpark / SQL</text>
          <text x="32" y="160" className="fill-foreground text-[9px]">• rolling_30d_spend</text>
          <text x="32" y="174" className="fill-foreground text-[9px]">• fraud_risk_score</text>
          <text x="32" y="188" className="fill-foreground text-[9px]">• user_embedding_vector</text>

          {/* Branch Up: Offline Batch Store */}
          <path d="M 240 135 L 300 70 L 330 70" className="stroke-primary" strokeWidth="2" />
          <polygon points="330,70 322,65 322,75" className="fill-primary" />

          <g transform="translate(330, 25)">
            <rect width="260" height="90" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
            <text x="14" y="22" className="fill-foreground font-bold text-xs">OFFLINE STORE (LAKEHOUSE)</text>
            <text x="14" y="38" className="fill-muted-foreground font-mono text-[9px]">Delta Lake / Iceberg on S3 / ADLS</text>
            <text x="14" y="55" className="fill-muted-foreground text-[9px]">&bull; Terabytes / Petabytes historical features</text>
            <text x="14" y="70" className="fill-emerald-600 font-bold text-[9px]">&bull; Point-in-Time Correct (Time-Travel Joins)</text>
            <text x="14" y="84" className="fill-primary text-[8px]">Output: Model Training Data & Offline Evaluation</text>
          </g>

          {/* Branch Down: Online Low-Latency Store */}
          <path d="M 240 165 L 300 230 L 330 230" className="stroke-primary" strokeWidth="2" />
          <polygon points="330,230 322,225 322,235" className="fill-primary" />

          <g transform="translate(330, 185)">
            <rect width="260" height="90" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
            <text x="14" y="22" className="fill-foreground font-bold text-xs">ONLINE STORE (LOW-LATENCY)</text>
            <text x="14" y="38" className="fill-muted-foreground font-mono text-[9px]">Redis Cluster / DynamoDB / pgvector</text>
            <text x="14" y="55" className="fill-muted-foreground text-[9px]">&bull; Sub-10ms key-value lookup (user_id &rarr; vector)</text>
            <text x="14" y="70" className="fill-emerald-600 font-bold text-[9px]">&bull; Synchronized via Streaming CDC</text>
            <text x="14" y="84" className="fill-primary text-[8px]">Output: Real-Time Inference & AI Agent Tools</text>
          </g>

          {/* RIGHT: MODEL / AGENT INGESTION */}
          <path d="M 590 70 L 670 120" className="stroke-border" strokeWidth="2" />
          <path d="M 590 230 L 670 180" className="stroke-border" strokeWidth="2" />

          <g transform="translate(670, 75)">
            <rect width="230" height="150" rx="8" className="fill-card stroke-rose-500/40" strokeWidth="1.5" />
            <text x="14" y="25" className="fill-rose-600 dark:fill-rose-400 font-bold text-xs">
              AI AGENTS & ML SERVING
            </text>
            <text x="14" y="42" className="fill-muted-foreground font-mono text-[9px]">Inference Time & Evaluation</text>

            <rect x="12" y="52" width="206" height="40" rx="4" className="fill-background stroke-border" />
            <text x="18" y="68" className="fill-foreground font-semibold text-[9px]">Zero Training-Serving Skew</text>
            <text x="18" y="82" className="fill-muted-foreground text-[8px]">Identical feature logic in training and live agent inference</text>

            <rect x="12" y="98" width="206" height="40" rx="4" className="fill-emerald-500/10 stroke-emerald-500/30" />
            <text x="18" y="114" className="fill-emerald-600 dark:fill-emerald-400 font-bold text-[9px]">RAG Grounding & Tool Call</text>
            <text x="18" y="128" className="fill-foreground text-[8px]">Hybrid Vector Search + Fresh Lakehouse Attributes</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
