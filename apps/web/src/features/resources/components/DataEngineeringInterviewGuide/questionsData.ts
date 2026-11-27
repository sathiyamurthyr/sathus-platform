export interface QuestionItem {
  id: number;
  question: string;
  category: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff/Principal';
  shortAnswer: string;
  detailedAnswer: string;
  codeSnippet?: string;
  codeLanguage?: string;
  interviewerTip?: string;
  relatedTags: string[];
}

export interface SectionData {
  id: string;
  title: string;
  range: string;
  summary: string;
  keyTopics: string[];
  diagramType?: 'spark' | 'lakehouse' | 'streaming' | 'sql' | 'aifeatures';
  cheatSheet: Array<{ label: string; value: string }>;
  questions: QuestionItem[];
}

export const SECTIONS_DATA: SectionData[] = [
  {
    id: 'section-1',
    title: 'Section 1: Apache Spark & PySpark Architecture, Internals & Transformations',
    range: 'Q1–Q85',
    summary: 'Master distributed execution, Catalyst optimizer stages, Tungsten off-heap memory, Adaptive Query Execution (AQE), narrow vs wide shuffle boundaries, and production skew mitigation.',
    diagramType: 'spark',
    keyTopics: ['Catalyst & Tungsten', 'AQE & Skew Joins', 'Shuffle Internals', 'Driver vs Executor OOM', 'Window Functions & Salting'],
    cheatSheet: [
      { label: 'Default Shuffle Partitions', value: 'spark.sql.shuffle.partitions = 200 (Tune to 2-4x total cluster cores or ~150MB per partition)' },
      { label: 'Auto Broadcast Threshold', value: 'spark.sql.autoBroadcastJoinThreshold = 10MB (Increase to 50-100MB for fast map-side joins)' },
      { label: 'Coalesce vs Repartition', value: 'coalesce() avoids shuffle (reduces partitions only); repartition() forces full network shuffle across all executors' },
      { label: 'Salting Formula', value: 'salted_key = concat(key, "_", floor(rand() * N)) & replicate dimension table N times to dissolve skewed hotspots' },
    ],
    questions: [
      {
        id: 1,
        question: 'What is Apache Spark, and why did it become popular compared to Hadoop MapReduce?',
        category: 'Spark Core',
        difficulty: 'Junior',
        shortAnswer: 'Spark is an open-source distributed unified compute engine that achieves 10x-100x faster execution than MapReduce by keeping intermediate computations in-memory and organizing pipelines via Directed Acyclic Graphs (DAGs).',
        detailedAnswer: `Hadoop MapReduce was fundamentally tied to physical disk I/O: every map task wrote to local disk, and every reduce task read from network and wrote back to HDFS. For iterative workloads (machine learning, multi-step ETL, graph traversal), MapReduce spent 80%+ of its runtime on serialization, deserialization, and disk I/O.

Apache Spark revolutionized distributed processing through three core innovations:
1. In-Memory Resilient Distributed Datasets (RDDs): Computations stay in RAM between pipeline stages rather than round-tripping to persistent storage.
2. Lazy Evaluation & DAG Scheduler: Instead of executing line-by-line, Spark constructs a logical Directed Acyclic Graph (DAG) and optimizes the entire execution plan before touching data.
3. Unified Ecosystem: Provides native SQL, streaming (Structured Streaming), ML (MLlib), and graph compute (GraphX) on the same unified compute layer.`,
        interviewerTip: 'Highlight that Spark separates compute from storage, whereas MapReduce tightly coupled compute with HDFS datanodes.',
        relatedTags: ['Spark', 'MapReduce', 'Hadoop', 'Distributed Computing'],
      },
      {
        id: 2,
        question: 'Explain the high-level architecture of a Spark application (Driver, Executors, Cluster Manager, Tasks, Stages, Jobs).',
        category: 'Spark Core',
        difficulty: 'Mid',
        shortAnswer: 'A Spark application consists of a Driver (coordinator/planner), a Cluster Manager (resource allocator), and multiple Worker Nodes hosting Executors that execute Tasks grouped into Stages within a Job.',
        detailedAnswer: `The hierarchy of execution inside Apache Spark operates as follows:
- Driver: The central coordinator process running the main() method. It initializes the SparkSession, translates user code into logical and physical plans via Catalyst, constructs the DAG, schedules tasks, and coordinates fault tolerance.
- Cluster Manager: The resource manager (Kubernetes, Databricks, YARN, or Standalone) that provisions executor pods/containers across the physical cluster.
- Executors: Worker JVM processes launched on cluster nodes that keep data cached in memory/disk and execute tasks assigned by the TaskScheduler.
- Jobs: Triggered whenever an Action (e.g. .collect(), .count(), .write()) is called in user code.
- Stages: Boundaries created whenever a Wide Dependency (Shuffle) is encountered (e.g. groupBy, join, distinct). Stages run sequentially or in parallel depending on the DAG.
- Tasks: The smallest atomic unit of work in Spark. One task processes exactly one partition of data on a single executor core thread.`,
        interviewerTip: 'Mention that a single executor can run multiple concurrent tasks depending on the number of executor cores configured (spark.executor.cores, typically 4-5 cores per executor).',
        relatedTags: ['Driver', 'Executor', 'DAGScheduler', 'Cluster Manager'],
      },
      {
        id: 8,
        question: 'What is the difference between Narrow Transformations and Wide Transformations?',
        category: 'Spark Transformations',
        difficulty: 'Mid',
        shortAnswer: 'Narrow transformations compute each output partition from exactly one input partition without network shuffling; wide transformations require data from multiple partitions across the network, forcing a shuffle stage boundary.',
        detailedAnswer: `Understanding this distinction is the single most critical performance concept in Apache Spark:

1. Narrow Transformations (Zero Network Shuffle):
- Each partition of the parent RDD is used by at most one partition of the child RDD.
- Execution happens entirely in-place on the local worker memory/disk.
- Operations: select(), filter(), withColumn(), drop(), map(), flatMap().
- Multiple narrow transformations are pipelined together into Whole-Stage Code Generation inside a single stage.

2. Wide Transformations (Network Shuffle Required):
- Multiple child partitions depend on data from multiple parent partitions.
- Spark must partition, sort, spill to local scratch disk, and transfer data across the network to destination executors.
- Operations: groupBy(), distinct(), join() (sort-merge), repartition(), reduceByKey(), window functions.
- Every wide transformation introduces a Stage Boundary in the Spark UI.`,
        codeSnippet: `# Narrow: Pipelined in memory without shuffle
df_clean = df.filter(df["status"] == "ACTIVE").select("user_id", "amount")

# Wide: Triggers shuffle exchange & stage boundary
df_grouped = df_clean.groupBy("user_id").agg({"amount": "sum"})`,
        codeLanguage: 'python',
        interviewerTip: 'Watch out: coalesce(n) is narrow when decreasing partitions without reordering; repartition(n) is always wide.',
        relatedTags: ['Narrow vs Wide', 'Shuffle', 'Stage Boundary', 'Transformations'],
      },
      {
        id: 15,
        question: 'What is the Catalyst Optimizer? Explain its phases (Analysis, Logical Optimization, Physical Planning, Code Generation).',
        category: 'Spark Internals',
        difficulty: 'Senior',
        shortAnswer: 'Catalyst is Spark SQL’s extensible query optimization framework that takes an abstract syntax tree of a query and progressively converts it into optimized JVM bytecode through four structured phases.',
        detailedAnswer: `The 4 Phases of the Catalyst Optimizer:
1. Analysis: Resolves unresolved column names and table identifiers against the Catalog (Hive Metastore, Unity Catalog, or in-memory session catalog). Converts the AST into a Resolved Logical Plan.
2. Logical Optimization: Applies standard relational algebraic rule transformations:
   - Predicate Pushdown: Pushes filter() operations as close to the storage source (Parquet/Delta) as possible.
   - Column Pruning (Projection Pushdown): Drops unused columns so they are never read into memory.
   - Constant Folding: Computes static expressions (e.g. 1 + 1 &rarr; 2) ahead of runtime.
   - Null propagation and Boolean simplifications.
3. Physical Planning: Generates multiple physical execution candidates and chooses the lowest-cost plan using Cost-Based Optimization (CBO) (e.g., choosing Broadcast Hash Join over Sort-Merge Join based on table size statistics).
4. Whole-Stage Code Generation (Tungsten): Compiles the entire physical query pipeline into optimized Java bytecode (Janino compiler), collapsing multiple iterator stages into a single flat Java while-loop that runs at bare-metal CPU speed.`,
        interviewerTip: 'Mention that Catalyst operates on expressions and trees using Scala pattern matching, allowing custom optimization rules to be injected.',
        relatedTags: ['Catalyst', 'Predicate Pushdown', 'Projection Pruning', 'Physical Plan'],
      },
      {
        id: 18,
        question: 'What is Adaptive Query Execution (AQE), and what optimizations does it perform at runtime?',
        category: 'Spark Optimization',
        difficulty: 'Senior',
        shortAnswer: 'AQE (enabled by default in Spark 3.x via spark.sql.adaptive.enabled=true) re-optimizes the physical execution plan between shuffle stage boundaries based on actual runtime partition statistics.',
        detailedAnswer: `Prior to Spark 3.0, physical planning was purely static based on catalog statistics that were often missing or outdated. With Adaptive Query Execution (AQE), Spark captures concrete stage shuffle statistics at runtime and executes three major optimizations:

1. Dynamically Coalescing Shuffle Partitions:
   - If spark.sql.shuffle.partitions is set to 200, but the filtered data is only 5 MB, static Spark would produce 200 tiny files.
   - AQE automatically merges adjacent small post-shuffle partitions into target-sized partitions (default 64MB - 128MB).
2. Dynamically Switching Join Strategies:
   - If a table was estimated at 1 GB statically, but after filtering only 8 MB remains, AQE dynamically switches a costly Sort-Merge Join into a lightning-fast Broadcast Hash Join at runtime without user intervention.
3. Dynamically Handling Data Skew in Joins:
   - When a specific key (e.g., NULL or a viral tenant) causes one partition to be 10x larger than others, AQE detects the skew and automatically splits the skewed partition into multiple sub-partitions, joining each against the replicated matching rows of the other side.`,
        codeSnippet: `# Enabling AQE parameters
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionThresholdInBytes", "268435456") # 256MB`,
        codeLanguage: 'python',
        interviewerTip: 'Be prepared to explain why AQE cannot optimize the very first stage of a job: it relies on materialized shuffle files between stages to calculate runtime statistics.',
        relatedTags: ['AQE', 'Adaptive Query Execution', 'Skew Join', 'Coalesce'],
      },
      {
        id: 54,
        question: 'What is Data Skew in Spark, how do you detect it in the Spark UI, and how do you resolve it?',
        category: 'Performance Tuning',
        difficulty: 'Senior',
        shortAnswer: 'Data skew occurs when data is distributed unevenly across partitions, causing 99% of tasks to finish in seconds while a single straggler task runs for hours on a massive partition.',
        detailedAnswer: `Detection in Spark UI:
- Open the Stages tab and inspect the Task Duration and Shuffle Read Size distribution table (Min, 25th percentile, Median, 75th percentile, Max).
- If the 75th percentile task time is 2 seconds, but the Max task time is 45 minutes, you have severe data skew.
- Look at the Event Timeline: one executor core is pegged at 100% while all other executors sit idle waiting for the stage to end.

Techniques to Resolve Data Skew:
1. Enable AQE Skew Join (Spark 3+): spark.sql.adaptive.skewJoin.enabled=true automatically handles moderate skew.
2. Salting the Skewed Key (Manual Salting):
   - Add a randomized suffix (0 to N-1) to the skewed join key on the large table.
   - Explode the small dimension table by replicating each row N times with suffixes (0 to N-1).
   - Join on the salted key so data hashes across N distinct partitions evenly.
3. Pre-filtering Null or Dummy Keys:
   - If skew is caused by nulls (e.g., transactions without a customer_id), filter out nulls first, perform the join on clean records, and union the null rows back afterwards.
4. Broadcast Join:
   - If one of the tables is under broadcast threshold (or can be filtered down), broadcast it with broadcast(dim_df) to eliminate the shuffle entirely.`,
        codeSnippet: `# Key Salting in PySpark
from pyspark.sql.functions import concat, lit, floor, rand, explode, array

SALT_FACTOR = 8

# 1. Salt the large skewed table
df_large_salted = df_large.withColumn(
    "salted_key", 
    concat(col("skewed_key"), lit("_"), floor(rand() * SALT_FACTOR))
)

# 2. Replicate the lookup table across all salt values
salt_array = array([lit(i) for i in range(SALT_FACTOR)])
df_dim_replicated = df_dim.withColumn("salt", explode(salt_array)) \\
                          .withColumn("salted_key", concat(col("key"), lit("_"), col("salt")))

# 3. Join on the evenly distributed salted key
result = df_large_salted.join(df_dim_replicated, on="salted_key", how="inner")`,
        codeLanguage: 'python',
        interviewerTip: 'Interviewers love asking candidates to walk through the salting math on a whiteboard or shared editor. Know how to explode the dimension side!',
        relatedTags: ['Data Skew', 'Salting', 'Straggler Tasks', 'Spark UI'],
      },
      {
        id: 57,
        question: 'What causes Out-Of-Memory (OOM) errors in Spark (Driver OOM vs. Executor OOM), and how do you fix each?',
        category: 'Performance Tuning',
        difficulty: 'Senior',
        shortAnswer: 'Driver OOM is caused by pulling too much data back to the single master JVM; Executor OOM is caused by memory skew, expensive aggregations, broadcast overflows, or insufficient off-heap memory.',
        detailedAnswer: `Driver Out-Of-Memory (java.lang.OutOfMemoryError: Java heap space):
- Root Causes:
  1. Calling .collect(), .toPandas(), or .take(1000000) on a large DataFrame.
  2. Broadcasting a table that exceeds driver memory threshold during serialization.
  3. Generating a massive DAG with thousands of recursive steps without checkpointing.
- Fixes:
  - Replace .collect() with .write.parquet() directly to cloud storage.
  - Increase driver memory (--driver-memory 16g).
  - Truncate lineage using df.checkpoint() or df.localCheckpoint().

Executor Out-Of-Memory:
- Root Causes:
  1. Data Skew: A single task receives 10 GB of data while executor heap is only 8 GB.
  2. High Concurrency per Executor: spark.executor.cores set too high (e.g. 16 cores sharing 16GB RAM = 1GB/task).
  3. Memory Overhead Spill: Python UDFs running in Py4J worker processes eating native memory.
- Fixes:
  - Increase memory overhead: spark.executor.memoryOverhead (default is max(384MB, 10% of executor memory); increase to 20-30% for Python UDFs/heavy C libraries).
  - Use 4 to 5 cores per executor (golden rule for HDFS/S3 I/O throughput) with 16GB-24GB RAM.
  - Repartition data to increase parallelism and reduce individual partition byte size.`,
        interviewerTip: 'Always distinguish between on-heap JVM memory issues and container-level cgroup kills (YARN exit code 137 / K8s OOMKilled) which indicate off-heap or overhead memory exhaustion.',
        relatedTags: ['OOM', 'Driver Memory', 'Executor Memory', 'Memory Overhead', 'Exit Code 137'],
      },
    ],
  },
  {
    id: 'section-2',
    title: 'Section 2: Databricks, Delta Lake, Lakehouse & Table Formats',
    range: 'Q86–Q160',
    summary: 'Master Delta Lake transaction logs, ACID atomicity, Medallion layer boundaries, Liquid Clustering vs Z-Order, Deletion Vectors, Auto Loader, Unity Catalog governance, and Structured Streaming watermarks.',
    diagramType: 'lakehouse',
    keyTopics: ['_delta_log & OCC', 'Medallion Architecture', 'Liquid Clustering', 'Deletion Vectors', 'Unity Catalog', 'Auto Loader'],
    cheatSheet: [
      { label: 'Delta Log Checkpoints', value: 'Every 10 commits, Delta composes a .checkpoint.parquet file aggregating all preceding JSON commits for fast state recovery' },
      { label: 'Liquid Clustering', value: 'CLUSTER BY (col1, col2) replaces static partitioning; eliminates partition skew and adapts without data rewrites' },
      { label: 'Deletion Vectors', value: 'Soft-deletes rows in-place using bitmap roaring files; eliminates expensive copy-on-write Parquet file rewrites on UPDATE/DELETE' },
      { label: 'VACUUM Default', value: '7 days retention interval. Running VACUUM 0 hours can corrupt concurrent streaming queries or break Time Travel' },
    ],
    questions: [
      {
        id: 86,
        question: 'What is a Data Lakehouse, and how does it combine benefits of data lakes and data warehouses?',
        category: 'Lakehouse Architecture',
        difficulty: 'Junior',
        shortAnswer: 'A Data Lakehouse is a modern data management architecture that implements data warehouse features (ACID transactions, schema enforcement, governance, low-latency indexing) directly on low-cost, open-format cloud object storage (Parquet).',
        detailedAnswer: `Traditionally, enterprise data architectures were split into two separate silos:
1. Data Lakes (S3, ADLS, HDFS): Cheap, scalable storage for raw structured, semi-structured, and unstructured data. However, they suffered from lack of ACID transactions, dirty reads, small file problems, and zero governance.
2. Data Warehouses (Snowflake, Teradata, Redshift): Fast, reliable, ACID compliant with rich SQL semantics. However, they are expensive, lock data into proprietary storage formats, and cannot natively store or process unstructured video/audio/LLM data.

The Lakehouse Architecture unifies both worlds using open table formats (Delta Lake, Apache Iceberg, Apache Hudi):
- Single Source of Truth: Store data once in open Parquet format on cloud object storage.
- Transaction Log Layer: Adds ACID guarantees, time travel, concurrent reader isolation, and upsert/merge capabilities.
- Direct Engine Interoperability: The exact same Parquet files can be queried by Spark, Databricks SQL, Trino, Flink, and Python ML runtimes without costly data replication.`,
        interviewerTip: 'Emphasize that Lakehouses eliminate redundant ETL pipelines between raw data lakes and analytical warehouses.',
        relatedTags: ['Lakehouse', 'Data Lake', 'Data Warehouse', 'Delta Lake', 'Iceberg'],
      },
      {
        id: 88,
        question: 'What is Delta Lake, and what role does the _delta_log (transaction log) play?',
        category: 'Delta Lake Internals',
        difficulty: 'Mid',
        shortAnswer: 'Delta Lake is an open-source storage layer that brings ACID transactions to object storage. The _delta_log directory is an ordered, append-only record of every change made to the table.',
        detailedAnswer: `In standard Parquet tables, readers determine table state by listing files in the storage bucket. On cloud object stores (S3, ADLS), directory listing is slow, eventually consistent, and vulnerable to reading half-written files.

In Delta Lake:
1. Ordered JSON Commits: Every write (INSERT, UPDATE, DELETE) creates a new commit file: _delta_log/00000000000000000000.json, 00000000000000000001.json, etc.
2. Atomic Commit Protocol: A commit specifies exact files added and removed. Readers only read files explicitly referenced in the transaction log. If a writer fails mid-execution, its orphaned Parquet files are never referenced in the log, preserving atomicity.
3. Checkpoint Files (.checkpoint.parquet): Every 10 commits, Delta writes a consolidated checkpoint in Parquet format. Readers only parse the latest checkpoint plus subsequent JSON files, avoiding reading thousands of historical commit files.
4. Concurrency Control: Uses Optimistic Concurrency Control (OCC). If two writers attempt to commit at the same version, Delta validates whether their affected files overlap. If disjoint, the second writer automatically re-bases and commits.`,
        interviewerTip: 'Be ready to explain how Time Travel works: Delta simply reconstructs the table state up to the specific JSON commit timestamp requested.',
        relatedTags: ['_delta_log', 'ACID', 'Transaction Log', 'OCC'],
      },
      {
        id: 97,
        question: 'What is Liquid Clustering in Delta Lake, and how does it differ from traditional partitioning and Z-ORDER?',
        category: 'Delta Lake Performance',
        difficulty: 'Senior',
        shortAnswer: 'Liquid Clustering (CLUSTER BY) is a next-generation data layout optimization in Delta Lake that dynamically clusters data incrementally without static partition boundaries or expensive full-table Z-Order rewrites.',
        detailedAnswer: `Limitations of Traditional Partitioning and Z-Order:
- Traditional Hive Partitioning creates physical directory folders for every distinct partition value. If you partition by a column with high cardinality (e.g. customer_id or date), you trigger the "small files problem" and massive metadata overhead.
- Partition Evolution is rigid: changing partition columns requires rewriting the entire historical dataset.
- Z-ORDER clustering was expensive: whenever new data arrived, re-running OPTIMIZE ZORDER required re-sorting and rewriting entire partitions.

How Liquid Clustering (CLUSTER BY) Solves This:
1. No Directory Hierarchy: All files reside flat in the table directory. Clustering is managed purely through file-level metadata and Hilbert-curve clustering.
2. Incremental Clustering: Running OPTIMIZE on a liquid-clustered table only clusters newly arrived unclustered files, reducing write cost and runtime by up to 80%.
3. Flexible Schema Evolution: You can change cluster keys anytime using ALTER TABLE ... CLUSTER BY (...) without rewriting old files; future writes and optimizations simply adopt the new keys.
4. Multi-Column Pruning: Supports multiple high-cardinality keys concurrently (e.g., CLUSTER BY (tenant_id, event_date)).`,
        codeSnippet: `-- Enabling Liquid Clustering in Databricks / Delta Lake 3.x
CREATE TABLE gold_sales_orders (
  order_id STRING,
  tenant_id STRING,
  order_timestamp TIMESTAMP,
  customer_id STRING,
  total_amount DECIMAL(18, 2)
)
USING DELTA
CLUSTER BY (tenant_id, order_timestamp);

-- Incremental optimization runs fast without rewriting entire dataset
OPTIMIZE gold_sales_orders;`,
        codeLanguage: 'sql',
        interviewerTip: 'Liquid Clustering is the default recommendation in modern Databricks. Never recommend Hive-style partitioning on columns with cardinality > 1,000.',
        relatedTags: ['Liquid Clustering', 'Z-ORDER', 'Partitioning', 'Delta Lake 3.x'],
      },
      {
        id: 104,
        question: 'What is idempotency in data pipelines, and how do you achieve it in Delta Lake using MERGE INTO?',
        category: 'Data Pipeline Design',
        difficulty: 'Mid',
        shortAnswer: 'Idempotency means running a pipeline multiple times with the exact same input produces the exact same final state without duplicate records or corrupted totals.',
        detailedAnswer: `Why Idempotency Matters:
Distributed data pipelines inevitably encounter network drops, spot instance revocations, or downstream timeout retries. If a pipeline uses blind append mode (df.write.mode("append")), re-running a failed job produces duplicate data.

How MERGE INTO Delivers Idempotency:
Delta Lake’s MERGE INTO executes an atomic upsert: matching records are updated in-place, and new records are inserted.

Key Guidelines for Robust Production MERGE INTO:
1. Deterministic Source: The source dataset must be deduplicated on its primary key before executing the merge; otherwise, Spark throws an error: "Cannot perform Merge as multiple source rows matched the same target row".
2. Partition Pruning on Target: Include the partition column in the merge condition (ON target.date = source.date AND target.id = source.id) so Spark only scans relevant target files.
3. Soft Deletes Handling: Accommodate CDC deletes by combining WHEN MATCHED AND source.op = 'd' THEN DELETE.`,
        codeSnippet: `-- Production Idempotent Delta Merge with CDC Operations
MERGE INTO silver_customers AS target
USING (
  -- Ensure unique records per customer_id by taking latest timestamp
  SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY cdc_timestamp DESC) as rn
    FROM bronze_customer_cdc_stream
  ) WHERE rn = 1
) AS source
ON target.customer_id = source.customer_id
WHEN MATCHED AND source.is_deleted = true THEN
  DELETE
WHEN MATCHED AND source.cdc_timestamp > target.last_updated_at THEN
  UPDATE SET
    target.customer_name = source.customer_name,
    target.email = source.email,
    target.last_updated_at = source.cdc_timestamp
WHEN NOT MATCHED AND source.is_deleted = false THEN
  INSERT (customer_id, customer_name, email, created_at, last_updated_at)
  VALUES (source.customer_id, source.customer_name, source.email, source.cdc_timestamp, source.cdc_timestamp);`,
        codeLanguage: 'sql',
        interviewerTip: 'Mention that since Delta 2.2+, Deletion Vectors accelerate MERGE by marking deleted or modified rows in bitmap vectors rather than rewriting entire 500MB Parquet files.',
        relatedTags: ['Idempotency', 'MERGE INTO', 'CDC', 'Deletion Vectors'],
      },
      {
        id: 119,
        question: 'What is Unity Catalog in Databricks, and what governance capabilities does it provide?',
        category: 'Governance & Security',
        difficulty: 'Senior',
        shortAnswer: 'Unity Catalog is Databricks’ unified, multi-workspace governance solution for data and AI assets across multiple clouds, providing centralized access control, auditing, column/row security, and automated lineage.',
        detailedAnswer: `Before Unity Catalog, permissions were managed per-workspace via Hive Metastore tables or cloud IAM policies, leading to permission drift across dev, staging, and production workspaces.

Core Architectural Pillars of Unity Catalog:
1. Three-Level Namespace: Replaces legacy two-level database.table with catalog.schema.table:
   - catalog: Represents the environment or business domain (e.g. prod_fintech, dev_marketing).
   - schema (database): Logical group of tables and views.
   - table/volume/model: The physical asset.
2. Multi-Cloud & Cross-Workspace: A single Unity Catalog metastore binds to multiple Databricks workspaces across AWS, Azure, and GCP.
3. Fine-Grained Access Control: Standard ANSI SQL GRANT/REVOKE syntax combined with Row Filters and Column Masks for dynamic PII redaction without creating duplicate views.
4. Automated End-to-End Lineage: Captures table-level and column-level lineage automatically across SQL queries, Python notebooks, Delta Live Tables, and ML models down to dashboard consumers.
5. Volumes for Non-Tabular Data: Governs unstructured data (images, PDFs, audio for AI RAG) with identical RBAC security policies.`,
        interviewerTip: 'Be sure to mention that Unity Catalog also governs registered MLflow models and feature store tables, not just SQL tables.',
        relatedTags: ['Unity Catalog', 'Governance', 'Lineage', 'Row Filters', 'Column Masking'],
      },
    ],
  },
  {
    id: 'section-3',
    title: 'Section 3: SQL, Query Optimization & Data Modeling',
    range: 'Q161–Q245',
    summary: 'Master logical query order, SARGable predicates, window frame mechanics (ROWS vs RANGE), dimensional modeling (Star vs Snowflake vs OBT), SCD Types 1-3, and islands-and-gaps sessionization.',
    diagramType: 'sql',
    keyTopics: ['Logical Query Order', 'ROWS vs RANGE Frame', 'Star Schema & Grain', 'SCD Type 2 Modeling', 'Islands and Gaps', 'SARGability'],
    cheatSheet: [
      { label: 'Logical Order of Execution', value: 'FROM/JOIN &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; WINDOW OVER() &rarr; SELECT &rarr; DISTINCT &rarr; QUALIFY &rarr; ORDER BY &rarr; LIMIT' },
      { label: 'ROWS vs RANGE', value: 'ROWS treats physical row offsets strictly; RANGE treats duplicate ORDER BY values as a single tied peer group' },
      { label: 'SCD Type 2 Columns', value: 'surrogate_key (PK), natural_key, effective_start_date, effective_end_date, is_current (boolean), row_hash' },
      { label: 'Non-SARGable Anti-pattern', value: 'WHERE YEAR(order_date) = 2026 breaks index pruning. Rewrite to SARGable: WHERE order_date >= "2026-01-01" AND order_date < "2027-01-01"' },
    ],
    questions: [
      {
        id: 161,
        question: 'Explain the logical query processing order in SQL.',
        category: 'SQL Optimization',
        difficulty: 'Junior',
        shortAnswer: 'SQL does not execute top-to-bottom as written. It evaluates FROM & JOINs first, filters rows with WHERE, aggregates with GROUP BY, filters groups with HAVING, calculates WINDOW functions, processes SELECT expressions, applies QUALIFY, executes DISTINCT, sorts with ORDER BY, and limits with LIMIT.',
        detailedAnswer: `The logical order of query processing is the foundation of SQL tuning:
1. FROM & JOIN: Determines the base tables and Cartesian product, applying ON conditions to match records.
2. WHERE: Evaluates SARGable predicates to filter out non-qualifying individual rows BEFORE grouping.
3. GROUP BY: Collapses remaining rows into groups based on specified grouping columns.
4. HAVING: Filters the aggregated groups (evaluates aggregate functions like HAVING count(*) > 1).
5. WINDOW (OVER): Computes analytic window functions (ROW_NUMBER, SUM() OVER) across partition frames.
6. SELECT: Evaluates expressions, column projections, and user aliases.
7. QUALIFY: (In modern engines like Databricks, Snowflake, BigQuery) Filters window function results directly without requiring a nested CTE subquery!
8. DISTINCT: Deduplicates identical output tuples.
9. ORDER BY: Sorts the final result set. (Can use SELECT aliases because SELECT was evaluated in step 6).
10. LIMIT / OFFSET: Restricts the total number of returned rows.`,
        interviewerTip: 'Common interview trap: Why cannot WHERE use a column alias defined in SELECT? Because WHERE runs at step 2, while SELECT expressions are not evaluated until step 6!',
        relatedTags: ['Logical Query Order', 'SQL Evaluation', 'QUALIFY', 'WHERE vs HAVING'],
      },
      {
        id: 178,
        question: 'Compare ROW_NUMBER(), RANK(), and DENSE_RANK() on a dataset with ties.',
        category: 'SQL Window Functions',
        difficulty: 'Junior',
        shortAnswer: 'ROW_NUMBER() generates sequential integers without gaps regardless of ties; RANK() assigns the same rank to ties and skips subsequent numbers; DENSE_RANK() assigns the same rank to ties but does NOT skip subsequent numbers.',
        detailedAnswer: `Consider a department where salaries are: [100k, 90k, 90k, 80k]:
- ROW_NUMBER(): Assigns [1, 2, 3, 4]. Ties are broken arbitrarily based on physical row order.
- RANK(): Assigns [1, 2, 2, 4]. Both 90k earners tie for 2nd place. The next rank skips 3 and assigns 4.
- DENSE_RANK(): Assigns [1, 2, 2, 3]. Both 90k earners tie for 2nd place. The next rank continues consecutively with 3 without gaps.

When to Use Which:
- Use ROW_NUMBER() when you need strictly unique records (e.g., deduplication: WHERE rn = 1).
- Use DENSE_RANK() when you need "Top N" distinct values (e.g., finding the 2nd highest salary: WHERE rk = 2, so all employees earning that exact 2nd highest salary are included).
- Use RANK() for official leaderboard rankings where skipped positions are statistically mandatory.`,
        codeSnippet: `-- Finding the 2nd highest salary per department safely with ties
WITH ranked_salaries AS (
  SELECT 
    employee_id, 
    department_id, 
    salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank
  FROM employees
)
SELECT * FROM ranked_salaries WHERE salary_rank = 2;`,
        codeLanguage: 'sql',
        interviewerTip: 'Showcase modern SQL: In Databricks SQL and Snowflake, you can use QUALIFY DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) = 2 without writing a CTE!',
        relatedTags: ['ROW_NUMBER', 'RANK', 'DENSE_RANK', 'Window Functions'],
      },
      {
        id: 194,
        question: 'How do you solve "islands and gaps" problems (grouping contiguous sessions or streaks) in SQL?',
        category: 'Advanced SQL',
        difficulty: 'Senior',
        shortAnswer: 'The canonical solution calculates the difference between an unbroken sequential ROW_NUMBER() and the physical sequence value/date; this difference remains constant for contiguous rows, creating a unique group identifier.',
        detailedAnswer: `The "Islands and Gaps" problem is an industry benchmark test for senior data engineers.
Example Scenario: Find consecutive login streaks for active users.

The Two-Window Technique:
1. Order login dates chronologically per user.
2. Generate an unbroken sequential integer using ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date).
3. Subtract the sequential integer (in days) from the actual login_date:
   grp = login_date - INTERVAL rn DAYS
4. For consecutive days, both login_date and rn increase by 1, so (login_date - rn) remains invariant!
5. When a gap occurs (e.g. user skips 3 days), the difference jumps to a new constant value.
6. Simply GROUP BY user_id, grp and calculate count(*) as the streak length!`,
        codeSnippet: `-- Finding consecutive active user login streaks
WITH ordered_logins AS (
  SELECT DISTINCT user_id, CAST(login_time AS DATE) as login_date
  FROM user_activity_logs
),
grouped_streaks AS (
  SELECT 
    user_id,
    login_date,
    -- Date - row_number difference creates island group ID
    DATE_SUB(login_date, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date)) as streak_group
  FROM ordered_logins
)
SELECT 
  user_id,
  MIN(login_date) as streak_start,
  MAX(login_date) as streak_end,
  COUNT(*) as consecutive_days
FROM grouped_streaks
GROUP BY user_id, streak_group
HAVING COUNT(*) >= 3
ORDER BY consecutive_days DESC;`,
        codeLanguage: 'sql',
        interviewerTip: 'Highlight the DISTINCT step on login_date first; multiple logins on the same calendar day must be collapsed to avoid breaking the row_number delta.',
        relatedTags: ['Islands and Gaps', 'Window Functions', 'Streaks', 'Sessionization'],
      },
      {
        id: 205,
        question: 'What is Dimensional Modeling (Kimball methodology), and what are Fact vs. Dimension tables?',
        category: 'Data Modeling',
        difficulty: 'Mid',
        shortAnswer: 'Kimball dimensional modeling structures analytical data into measurable numerical Fact tables surrounded by descriptive textual Dimension tables to optimize for business query simplicity and fast OLAP joins.',
        detailedAnswer: `Core Components of Kimball Modeling:
1. The Four-Step Design Process:
   - Step 1: Select the Business Process (e.g. retail order checkout).
   - Step 2: Declare the Grain (e.g. one row per individual line item on a customer order).
   - Step 3: Identify the Dimensions (e.g. Customer, Date, Product, Store, Promotion).
   - Step 4: Identify the Facts (e.g. quantity_sold, gross_amount, discount_amount, tax_amount).

2. Fact Tables (Measurements):
   - Contain numeric, additive metrics and foreign keys referencing dimensions.
   - Types of Fact Tables:
     - Transaction Fact: Records a discrete event at an instant in time (e.g., purchase swipe).
     - Periodic Snapshot Fact: Captures status at recurring intervals (e.g., end-of-month bank account balance).
     - Accumulating Snapshot Fact: Tracks milestones across an order fulfillment lifecycle (order placed &rarr; picked &rarr; shipped &rarr; delivered).

3. Dimension Tables (Context):
   - Contain rich, textual context used for filtering (WHERE), grouping (GROUP BY), and labeling reports.
   - Conformed Dimensions: Shared across multiple fact tables (e.g. dim_date, dim_customer), ensuring revenue in sales matches revenue in finance reports.`,
        interviewerTip: 'Always stress Step 2: Never pick facts or dimensions before explicitly declaring the grain. Declaring grain prevents accidental double-counting fan-outs.',
        relatedTags: ['Kimball', 'Fact Table', 'Dimension Table', 'Star Schema', 'Grain'],
      },
      {
        id: 215,
        question: 'Explain Slowly Changing Dimensions (SCD) Types 0, 1, 2, and 3 with real-world examples.',
        category: 'Data Modeling',
        difficulty: 'Senior',
        shortAnswer: 'SCD Type 0 retains original fixed values; Type 1 overwrites old values without history; Type 2 inserts a new row with valid date ranges to preserve full historical changes; Type 3 adds a previous_value column.',
        detailedAnswer: `Slowly Changing Dimensions (SCD) govern how historical attribute changes in dimension tables are preserved:

1. SCD Type 0 (Fixed / Retain Original):
   - Definition: Attributes that must never change once recorded.
   - Example: customer_date_of_birth, original_account_open_date.
   
2. SCD Type 1 (Overwrite / No History):
   - Definition: Updates the row in-place. Past history is lost.
   - Example: Correcting a misspelled customer name or typo in phone number.
   - Pitfall: Prior reports re-run today will reflect the new value rather than historical state.

3. SCD Type 2 (Add New Row / Full Historical Fidelity):
   - Definition: When an attribute changes, the existing record is closed (is_current = false, effective_end_date = CURRENT_TIMESTAMP), and a brand-new row is inserted with a new surrogate key.
   - Example: Customer moves from California to New York. Orders made while living in California must attribute to California tax and regional sales!
   - Key Schema Columns:
     - customer_sk: BIGINT GENERATED ALWAYS AS IDENTITY (Surrogate Key)
     - customer_id: 'CUST-1001' (Natural / Business Key)
     - state: 'NY'
     - valid_from: '2026-06-01'
     - valid_to: '9999-12-31'
     - is_current: TRUE

4. SCD Type 3 (Add New Column / Limited History):
   - Definition: Adds previous_state alongside current_state in the same row.
   - Limitation: Can only track a single past transition; cannot handle 4 consecutive moves.`,
        interviewerTip: 'Be ready to explain how to join facts to an SCD Type 2 dimension: fact.order_date BETWEEN dim.valid_from AND dim.valid_to AND fact.customer_id = dim.customer_id.',
        relatedTags: ['SCD Type 2', 'Slowly Changing Dimensions', 'Surrogate Key', 'Data Warehouse'],
      },
    ],
  },
  {
    id: 'section-4',
    title: 'Section 4: Data Warehousing, Cloud Platforms & Storage Internals',
    range: 'Q246–Q310',
    summary: 'Master cloud MPP data warehouses (Snowflake, BigQuery, Redshift), Parquet columnar storage encoding (RLE, Snappy), object storage consistency, FinOps cost observability, and data observability pillars.',
    diagramType: 'lakehouse',
    keyTopics: ['Snowflake vs BigQuery vs Redshift', 'Parquet File Layout', 'FinOps & Cost Tuning', 'Data Observability', 'Data Mesh Principles'],
    cheatSheet: [
      { label: 'Parquet File Layout', value: 'Magic bytes &rarr; Row Groups (typically 128MB-512MB) &rarr; Column Chunks &rarr; Data Pages (Dictionary & RLE encoded) &rarr; File Footer Metadata (Min/Max statistics)' },
      { label: 'Data Observability Pillars', value: '1. Freshness (SLA delays) • 2. Volume (Row drops/spikes) • 3. Schema (Drift) • 4. Distribution (Nulls/Outliers) • 5. Lineage' },
      { label: 'Snowflake Virtual Warehouses', value: 'Multi-cluster shared-data: decouple compute from centralized storage. Sizing doubles compute cost and performance per tier (XS &rarr; S &rarr; M &rarr; L)' },
      { label: 'Egress Cost Trap', value: 'Transferring data across cloud regions or out of AWS/GCP to third-party tools incurs heavy egress bandwidth charges. Colocate compute in same region.' },
    ],
    questions: [
      {
        id: 255,
        question: 'Compare row-oriented storage vs. columnar storage (Parquet, ORC) for OLTP vs. OLAP workloads.',
        category: 'Storage Internals',
        difficulty: 'Junior',
        shortAnswer: 'Row-oriented storage (PostgreSQL, MySQL) stores entire records contiguously, making single-record inserts and lookups fast for OLTP; columnar storage (Parquet) stores values of the same column contiguously, enabling massive compression and column pruning for OLAP analytics.',
        detailedAnswer: `Row-Oriented Format (OLTP):
- Layout: [Row1: ID, Name, Age, Balance], [Row2: ID, Name, Age, Balance]
- Ideal For: High-frequency single-row transactions (e.g., SELECT * FROM users WHERE id = 42).
- Bottleneck in Analytics: If you run SELECT AVG(salary) FROM employees on 1 billion rows, the engine must read every employee's name, address, and biography from disk just to sum the salary column!

Columnar Format (OLAP - Parquet / ORC):
- Layout: [IDs...], [Names...], [Ages...], [Balances...]
- Ideal For: Analytical aggregation queries scanning billions of rows across a few columns.
- Benefits:
  1. Projection Pushdown (Column Pruning): If query only references 3 out of 100 columns, 97% of physical I/O is skipped completely.
  2. Extreme Compression: Adjacent values in the same column share identical data types and repetitive values, enabling Dictionary Encoding, Run-Length Encoding (RLE), and Bit Packing with Snappy/ZSTD.
  3. Min/Max Statistics Pruning: Parquet footers store min/max values per row group, allowing entire row groups to be skipped without reading data pages.`,
        interviewerTip: 'Never store raw unstructured JSON in uncompressed CSV for analytics. Parquet delivers 5x-10x storage savings and 50x query speedups.',
        relatedTags: ['Parquet', 'Columnar Storage', 'OLAP vs OLTP', 'Row Groups'],
      },
      {
        id: 275,
        question: 'What is a Data Mesh? What are its four core principles, and when is it suitable?',
        category: 'Enterprise Architecture',
        difficulty: 'Senior',
        shortAnswer: 'Data Mesh is a decentralized socio-technical architectural paradigm that shifts analytical data ownership from a centralized data engineering team to autonomous, domain-oriented product teams.',
        detailedAnswer: `Zhamak Dehghani formulated the 4 Core Principles of Data Mesh:
1. Domain-Oriented Decentralized Data Ownership:
   - The teams producing and managing business applications (e.g. Checkout Team, Inventory Team) own the analytical datasets for their domain, rather than throwing raw database dumps over the wall to an overburdened central data team.
2. Data as a Product:
   - Domain teams treat their analytical datasets like external customer products: discoverable, addressable, trustworthy, self-describing, and backed by explicit Service Level Objectives (SLOs) and data contracts.
3. Self-Serve Data Platform:
   - A central platform engineering team provides automated infrastructure abstractions (provisioning storage, compute, access control, and CI/CD pipelines) so domain engineers do not need to reinvent distributed storage wheels.
4. Federated Computational Governance:
   - Global policies (GDPR compliance, access control, data quality standards, encryption) are automated programmatically across all domains while allowing local autonomy in implementation.

When is Data Mesh Appropriate?
- Large enterprise organizations with 10+ cross-functional product domains where a central data team has become a ticket-driven bottleneck.
- For small/medium startups (< 50 engineers), Data Mesh is an over-engineered anti-pattern; stick with a unified, centralized lakehouse.`,
        interviewerTip: 'Be clear that Data Mesh is an organizational architecture, not a specific tool or software product.',
        relatedTags: ['Data Mesh', 'Data as a Product', 'Governance', 'Decentralized Architecture'],
      },
    ],
  },
  {
    id: 'section-5',
    title: 'Section 5: Ingestion, CDC, Streaming & Workflow Orchestration',
    range: 'Q311–Q380',
    summary: 'Master log-based Change Data Capture (Debezium), Kafka partitioning and consumer offsets, watermarking in Structured Streaming, Apache Airflow vs Dagster DAG orchestration, and backpressure management.',
    diagramType: 'streaming',
    keyTopics: ['Log-Based CDC vs Query Ingestion', 'Kafka Partition Ordering', 'Watermarks & Late Data', 'Airflow Orchestration', 'Idempotent Backfills'],
    cheatSheet: [
      { label: 'Log-based CDC Advantage', value: 'Reads WAL/Binlog directly; captures hard deletes, adds 0 query load to operational DB, and never misses rapid updates' },
      { label: 'Kafka Ordering Guarantee', value: 'Kafka ONLY guarantees ordering WITHIN a partition, never across partitions. Use consistent partition keys (e.g. order_id)!' },
      { label: 'Airflow Anti-pattern', value: 'Never run heavy data processing (Pandas dataframe transforms) on Airflow worker nodes. Delegate heavy compute to Spark, Databricks, or dbt' },
      { label: 'Watermark Formula', value: 'Watermark = max(event_time) - delay_threshold. State for keys older than watermark is safely evicted from memory' },
    ],
    questions: [
      {
        id: 302,
        question: 'What is Change Data Capture (CDC), and why is log-based CDC preferred over query-based CDC?',
        category: 'Ingestion & CDC',
        difficulty: 'Mid',
        shortAnswer: 'Change Data Capture (CDC) identifies and delivers changes made to database tables. Log-based CDC reads the database transaction log directly, capturing all inserts, updates, and hard deletes with zero query load on the primary operational database.',
        detailedAnswer: `Query-Based CDC (SELECT ... WHERE updated_at > last_watermark):
- Major Flaws:
  1. Cannot Capture Hard Deletes: If a row is deleted (DELETE FROM users WHERE id = 10), it vanishes from the table. A query-based filter will never see it!
  2. Database Overhead: Running recurrent queries on large tables puts lock and I/O pressure on primary OLTP databases.
  3. Missed Intermediate Updates: If a row updates three times between polling intervals, query-based CDC only captures the final state, losing the state transition history.
  4. Clock Skew & Transactions: Transactions committed slightly out of order with earlier timestamps can be missed.

Log-Based CDC (Debezium / AWS DMS / Fivetran):
- Architecture: Hooks into the engine’s internal write-ahead log (PostgreSQL WAL, MySQL Binlog, Oracle Redo Log).
- Advantages:
  1. Captures Hard Deletes: The log records the physical delete operation.
  2. Captures Every Intermediate Transition: Full event sequence preserved.
  3. Sub-Second Latency: Events stream to Kafka the millisecond they are committed.
  4. Zero Query Footprint: Does not scan tables or acquire database read locks.`,
        interviewerTip: 'Mention that log-based CDC provides the exact "before" and "after" state of the modified row, essential for auditability.',
        relatedTags: ['CDC', 'Debezium', 'Kafka Connect', 'Write-Ahead Log'],
      },
      {
        id: 314,
        question: 'Why is ordering in Kafka guaranteed only within a partition, and how do you maintain event ordering?',
        category: 'Event Streaming',
        difficulty: 'Mid',
        shortAnswer: 'Kafka appends events to partition logs in strict sequence; because partitions run independently on different broker threads across the cluster, total ordering across an entire multi-partition topic is impossible without bottlenecking throughput.',
        detailedAnswer: `How Kafka Partitioning Works:
- A Kafka topic is divided into $N$ parallel partitions to scale consumer throughput.
- Within an individual partition, Kafka guarantees strict FIFO ordering: every message receives a monotonically increasing offset.
- Across multiple partitions, there is no global clock or synchronization; consumers process partitions independently.

How to Maintain Strict Entity Ordering:
- When publishing events, assign a meaningful Record Key (e.g., customer_id or order_id).
- Kafka’s default partitioner hashes the key: hash(key) % num_partitions.
- All events for the same customer_id are guaranteed to land on the exact same partition in strict chronological order!
- Warning: If you change the number of partitions on an existing topic, the hash modulo changes, and future customer events may land on a different partition, breaking historical ordering.`,
        interviewerTip: 'Be prepared to explain what happens when a key is null: Kafka uses round-robin / sticky partitioning, distributing records evenly with zero ordering guarantees.',
        relatedTags: ['Kafka', 'Partition Key', 'Offsets', 'FIFO Ordering'],
      },
      {
        id: 322,
        question: 'Explain watermarking in streaming engines and how it controls late data tolerance and state cleanup.',
        category: 'Structured Streaming',
        difficulty: 'Senior',
        shortAnswer: 'A watermark is a dynamic event-time threshold that tells the streaming engine how long to wait for delayed or out-of-order events before closing stateful aggregation windows and evicting state from memory.',
        detailedAnswer: `Why Streaming State Becomes Dangerous:
In streaming aggregations (e.g. 10-minute tumbling count of user clicks), the engine must maintain a running sum in an in-memory state store (RocksDB or HDFS-backed state). Without watermarking, the engine would have to hold memory for every user session indefinitely, because an event from 3 months ago could theoretically arrive tomorrow. This causes an inevitable Out-Of-Memory crash!

How Watermarking Resolves This:
1. You define a delay tolerance threshold: .withWatermark("event_time", "10 minutes").
2. The engine tracks the maximum event_time observed so far across all input data: max_event_time.
3. The Watermark timestamp is calculated dynamically: Watermark = max_event_time - 10 minutes.
4. Any incoming event with an event_time older than the Watermark is discarded as "too late" and dropped.
5. All completed aggregation windows ending before the Watermark timestamp are committed to the sink and purged from the state store, guaranteeing bounded memory usage.`,
        codeSnippet: `# Structured Streaming Watermark & Window Aggregation
from pyspark.sql.functions import window, col

windowed_counts = df_stream \\
    .withWatermark("event_time", "15 minutes") \\
    .groupBy(
        window(col("event_time"), "10 minutes", "5 minutes"), # 10m sliding window every 5m
        col("device_type")
    ) \\
    .count()`,
        codeLanguage: 'python',
        interviewerTip: 'Crucial distinction: Watermarks are evaluated in Event Time (when user took action), NOT Processing Time (when server CPU ingested event).',
        relatedTags: ['Watermark', 'Structured Streaming', 'State Store', 'RocksDB'],
      },
    ],
  },
  {
    id: 'section-6',
    title: 'Section 6: Data Engineering for AI, Vector/Feature Pipelines & Modern Trends',
    range: 'Q381–Q425',
    summary: 'Master offline vs online Feature Stores, point-in-time time-travel joins, zero training-serving skew, document chunking & vector embedding pipelines, and enterprise data contracts for RAG.',
    diagramType: 'aifeatures',
    keyTopics: ['Feature Store Architecture', 'Training-Serving Skew', 'Point-in-Time Correctness', 'RAG Embedding Pipelines', 'Semantic Layers'],
    cheatSheet: [
      { label: 'Training-Serving Skew', value: 'Discrepancy between feature values during training vs live inference. Fix: Define feature transformations ONCE in a single repository' },
      { label: 'Point-in-Time Join (AS-OF)', value: 'Ensures feature values joined to an ML label reflect the state at the exact moment the prediction happened, preventing future data leakage' },
      { label: 'Vector Sync Trap', value: 'When source documents update in the lakehouse, vector index embeddings must be updated atomically using change data feed to prevent stale RAG hallucinations' },
    ],
    questions: [
      {
        id: 383,
        question: 'What is a Feature Store, and how does it solve training-serving skew?',
        category: 'AI Data Engineering',
        difficulty: 'Senior',
        shortAnswer: 'A Feature Store is a centralized data platform service that manages the definition, computation, storage, and serving of machine learning features across dual storage paths: an offline store for training and an online store for low-latency inference.',
        detailedAnswer: `The Two Major Problems in Enterprise ML Pipelines:
1. Training-Serving Skew:
   - Data scientists engineer features in Python notebooks (e.g., rolling average spend).
   - Software engineers reimplement the exact same logic in Java/Go for production web services.
   - Tiny discrepancies in timezones, null handling, or rounding logic cause production model accuracy to plummet.
2. Feature Duplication & Redundant Compute: Multiple teams write isolated pipelines computing the exact same customer features.

How a Feature Store Resolves This:
- Unified Feature Definition: Features are defined once as code (SQL/PySpark) in a version-controlled repository.
- Dual Storage Architecture:
  1. Offline Feature Store (Delta Lake / BigQuery): Stores years of historical features in Parquet. Used for generating large-scale training datasets with point-in-time correctness.
  2. Online Feature Store (Redis / DynamoDB / Bigtable): Stores only the latest feature snapshot per entity with sub-10ms key-value latency for live model scoring.
- Synchronized Pipeline: A single batch or streaming job writes to both the offline lakehouse and online key-value store simultaneously.`,
        interviewerTip: 'Mention popular open-source and managed solutions: Feast, Hopsworks, Databricks Feature Store, AWS SageMaker Feature Store.',
        relatedTags: ['Feature Store', 'Training-Serving Skew', 'Machine Learning', 'Redis'],
      },
      {
        id: 384,
        question: 'Explain point-in-time correctness (time-travel joins) when generating ML training datasets.',
        category: 'AI Data Engineering',
        difficulty: 'Staff/Principal',
        shortAnswer: 'Point-in-time correctness ensures that when joining historical labels to features, the features reflect the exact state known prior to the label timestamp, preventing data leakage from the future.',
        detailedAnswer: `The Concept of Data Leakage (Looking into the Future):
Imagine training a fraud detection model on transactions from October 1st, 2025.
If you simply join the transactions table to your current customer table (which shows the customer's total spend as of today, November 2026), your model will "see into the future" during training. In production, however, when a new transaction occurs, future spend is unknown, causing the model to fail miserably.

How Point-in-Time (AS-OF) Joins Work:
- Each event or label has a timestamp $T_{event}$.
- Each feature snapshot has an effective timestamp $T_{feature}$.
- The time-travel join guarantees that:
  $T_{feature} \le T_{event}$
  and takes the latest feature record that satisfies this inequality.
- This replicates the exact operational reality the model will encounter when executing live predictions.`,
        codeSnippet: `-- Conceptual Point-in-Time Feature Lookup
SELECT 
  t.transaction_id,
  t.customer_id,
  t.transaction_timestamp,
  t.amount,
  f.rolling_30d_spend,
  f.risk_score
FROM transactions t
JOIN customer_features_history f
  ON t.customer_id = f.customer_id
  AND f.valid_from <= t.transaction_timestamp
  AND f.valid_to > t.transaction_timestamp;`,
        codeLanguage: 'sql',
        interviewerTip: 'Emphasize that SCD Type 2 tables in a Delta Lakehouse or Iceberg table natively enable point-in-time joins via valid_from and valid_to timestamps.',
        relatedTags: ['Point-in-Time Join', 'Data Leakage', 'Feature Store', 'Time Travel'],
      },
    ],
  },
  {
    id: 'section-7',
    title: 'Section 7: End-to-End System Design & Scenario Prompts',
    range: 'Q426–Q465',
    summary: 'Master full-scale architecture interviews: Near-real-time clickstream ingestion, sub-minute CDC pipelines, 5TB daily batch ETL SLAs, zero-downtime Teradata migrations, and multi-tenant lakehouses.',
    diagramType: 'streaming',
    keyTopics: ['System Design Framework', 'Clickstream Analytics', 'Financial Reconciliation', 'Legacy DWH Migration', 'Disaster Recovery (RPO/RTO)'],
    cheatSheet: [
      { label: '5-Step System Design Formula', value: '1. Requirements & Scale Estimation (Throughput/SLA) &bull; 2. High-Level Architecture &bull; 3. Storage & Schema Modeling &bull; 4. Deep Dive & Bottlenecks &bull; 5. Failure Modes & Fault Tolerance' },
      { label: 'Throughput Math', value: '100M events/day &divide; 86,400s &approx; 1,160 events/sec. Peak = 3x &approx; 3,500 events/sec. At 1KB/event = 3.5 MB/sec &rarr; 2-4 Kafka partitions suffice' },
      { label: 'RPO vs RTO', value: 'RPO (Recovery Point Objective): Max allowable data loss in time. RTO (Recovery Time Objective): Max allowable downtime before platform is restored' },
    ],
    questions: [
      {
        id: 426,
        question: 'Design a near-real-time clickstream and user activity analytics pipeline for an e-commerce platform.',
        category: 'System Design',
        difficulty: 'Staff/Principal',
        shortAnswer: 'Ingest events via edge API gateways into an Apache Kafka event bus; process with Spark Structured Streaming / Flink for 5-minute sessionization with watermarks; store raw in Delta Bronze and aggregated metrics in Gold for sub-second dashboard serving.',
        detailedAnswer: `Step 1: Functional & Non-Functional Requirements:
- Scale: 50,000 events/sec peak, ~500 GB/day.
- Latency: Sub-1-minute freshness for live merchant dashboards; historical ad-hoc queries up to 3 years.
- Guarantees: At-least-once ingestion, exactly-once analytics output, idempotent writes.

Step 2: Component Architecture:
1. Event Collection: Mobile/Web SDKs post to CloudFlare / AWS API Gateway with edge rate limiting.
2. Ingestion Buffer: Apache Kafka / AWS Kinesis with 16 partitions (partitioned by user_id to ensure session ordering).
3. Stream Processing Layer: Spark Structured Streaming / Apache Flink:
   - Ingests from Kafka with withWatermark("timestamp", "10 minutes").
   - Sessionizes click events with 30-minute inactivity timeout.
   - Computes rolling metrics: cart-abandonment rate, product view count, conversion funnel.
4. Storage Layer (Medallion Lakehouse):
   - Bronze: Raw JSON payload appended directly to Delta Lake for auditing and machine learning retraining.
   - Silver: Enriched and validated user activity table with user geo-IP and device metadata.
   - Gold: Pre-aggregated hourly/daily marts clustered by CLUSTER BY (merchant_id, date).
5. Serving Layer:
   - Fast sub-second serving via Databricks SQL Serverless or ClickHouse / StarRocks for BI dashboards.`,
        interviewerTip: 'Always conclude your system design by proactively walking through 3 failure scenarios: (1) Kafka broker failure, (2) sudden 10x traffic spike, and (3) late-arriving events.',
        relatedTags: ['System Design', 'Clickstream', 'Kafka', 'Sessionization', 'Medallion'],
      },
    ],
  },
  {
    id: 'section-8',
    title: 'Section 8: Behavioral, Ownership & Leadership Questions',
    range: 'Q466–Q500',
    summary: 'Master the STAR framework (Situation, Task, Action, Result) for behavioral data leadership: production outages, tech debt pushback, cross-functional SLA negotiations, and mentoring.',
    keyTopics: ['STAR Framework', 'Post-Mortem & Blameless RCA', 'Technical Debt vs Velocity', 'Data Contract Negotiation', 'Engineering Leadership'],
    cheatSheet: [
      { label: 'STAR Method', value: 'Situation (Context/Scale) &rarr; Task (The Challenge) &rarr; Action (Your specific technical & leadership actions) &rarr; Result (Quantifiable business/performance outcome)' },
      { label: 'Key Metrics to Mention', value: 'Pipeline runtime reduction (e.g., 6 hours to 45 mins), compute cost savings ($12,000/mo), SLA breach drop (99.9% uptime), data freshness improvement' },
    ],
    questions: [
      {
        id: 466,
        question: 'Tell me about a time a data pipeline you owned failed in production—how did you resolve it and prevent recurrence?',
        category: 'Behavioral & Leadership',
        difficulty: 'Senior',
        shortAnswer: 'Use the STAR method: describe a critical failure (e.g. silent schema change or OOM during peak traffic), immediate triage and mitigation actions, and long-term automated prevention (contract tests, dead-letter queues, alerting).',
        detailedAnswer: `Example Model Response:
- Situation: During Black Friday weekend, our core financial reconciliation pipeline processing $15M in daily transactions failed at 2:00 AM, threatening the 8:00 AM executive audit SLA.
- Task: As the on-call senior data engineer, I had to identify the root cause, restore processing without duplicating financial ledger entries, and ensure downstream reports were accurate before market open.
- Action:
  1. Triage: Inspected Spark UI and noticed the driver had killed a job due to an executor OOM error caused by an unprecedented 8x spike in guest checkout transactions on a single merchant ID (severe data skew).
  2. Immediate Fix: Reconfigured the job to enable Adaptive Query Execution (AQE) skew join and increased executor memory overhead from 10% to 25%, successfully completing the run by 4:30 AM.
  3. Prevention & Post-Mortem: Authored a blameless Post-Mortem with three permanent remediation items:
     - Implemented dynamic key salting on the payment merchant join.
     - Added automated Great Expectations validation rules upstream to catch anomalous transaction batch volume.
     - Created a Databricks Workflow automated retry policy with PagerDuty escalation alerts.
- Result: The pipeline never breached SLA again, and runtime dropped from 3 hours to 42 minutes even under sustained holiday peak traffic.`,
        interviewerTip: 'Never blame another team or upstream vendor. Senior engineers take extreme ownership, focus on blameless post-mortems, and build systems that fail gracefully.',
        relatedTags: ['Behavioral', 'STAR Method', 'Post-Mortem', 'Outage Recovery', 'Ownership'],
      },
    ],
  },
];
