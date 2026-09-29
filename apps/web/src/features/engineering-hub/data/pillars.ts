import type { HubPillar } from '../types';

export const hubPillars: HubPillar[] = [
  {
    id: 'data-engineering',
    slug: 'data-engineering',
    name: 'Data Engineering & Lakehouses',
    tagline: 'Governed Medallion Lakehouses, Streaming Pipelines & Data Reliability',
    description:
      'Production-grade data pipelines, Delta Lake and Apache Iceberg architectures, Change Data Capture (CDC), zero-loss streaming, and enterprise data quality governance.',
    icon: 'Database',
    featuredQueries: [
      'enterprise data engineering services',
      'medallion lakehouse architecture',
      'delta lake vs apache iceberg',
      'streaming data engineering',
      'data quality observability framework',
    ],
    commercialServiceHref: '/solutions/data-engineering',
    commercialServiceTitle: 'Sathus Data Engineering Services',
    subclusters: [
      { name: 'Core Lakehouse Architecture', description: 'Medallion bronze/silver/gold design, liquid clustering, and compaction.', topicCount: 12 },
      { name: 'Streaming & CDC Pipelines', description: 'Kafka, Debezium, exactly-once semantics, and micro-batch optimization.', topicCount: 10 },
      { name: 'Data Governance & Observability', description: 'Automated data lineage, Great Expectations, Soda Core, and schema evolution.', topicCount: 13 },
    ],
  },
  {
    id: 'big-data',
    slug: 'big-data',
    name: 'Big Data & Distributed Systems',
    tagline: 'High-Throughput Spark Clusters, Flink Stream Processing & Memory Optimization',
    description:
      'Distributed computing architecture, Apache Spark and PySpark performance tuning, shuffle optimization, Apache Flink stateful streams, and Kafka cluster topology.',
    icon: 'Cpu',
    featuredQueries: [
      'apache spark consulting',
      'pyspark memory tuning oom',
      'spark adaptive query execution aqe',
      'apache flink stateful streaming',
      'kafka cluster sizing guide',
    ],
    commercialServiceHref: '/solutions/data-platform-modernization',
    commercialServiceTitle: 'Big Data Platform Engineering',
    subclusters: [
      { name: 'Apache Spark & PySpark', description: 'Driver/executor memory tuning, broadcast joins, and vectorized UDFs.', topicCount: 16 },
      { name: 'Real-Time Streaming Systems', description: 'Flink event time, RocksDB state backend, and Kafka consumer lag auto-scaling.', topicCount: 11 },
      { name: 'Distributed Storage & Serialization', description: 'Parquet, ORC, Avro, and object storage network throughput tuning.', topicCount: 8 },
    ],
  },
  {
    id: 'data-analytics',
    slug: 'data-analytics',
    name: 'Data Analytics, BI & Warehousing',
    tagline: 'Sub-Second Analytical Dashboards, Semantic Layers & Dimensional Modeling',
    description:
      'Cloud data warehouse architecture across Snowflake, BigQuery, and ClickHouse, Kimball dimensional modeling, unified semantic layers, and embedded SaaS analytics.',
    icon: 'BarChart3',
    featuredQueries: [
      'business intelligence consulting',
      'snowflake cost optimization',
      'sub second dashboard query latency',
      'kimball dimensional modeling 2026',
      'enterprise semantic layer cube dbt',
    ],
    commercialServiceHref: '/solutions/data-engineering',
    commercialServiceTitle: 'Enterprise Analytics Advisory',
    subclusters: [
      { name: 'Modern Data Warehousing', description: 'Snowflake micro-partitions, BigQuery slots, and ClickHouse MergeTree engines.', topicCount: 11 },
      { name: 'Semantic Layers & Modeling', description: 'dbt production modeling, Cube metrics stores, and Data Vault 2.0.', topicCount: 10 },
      { name: 'Enterprise Dashboards & BI', description: 'Power BI composite models, Tableau concurrency, and embedded multi-tenant analytics.', topicCount: 9 },
    ],
  },
  {
    id: 'cloud-data-engineering',
    slug: 'cloud-data-engineering',
    name: 'Cloud Data Engineering (AWS & Azure)',
    tagline: 'Enterprise Databricks Unity Catalog, ADF, Synapse & Multi-Cloud Infrastructure',
    description:
      'Production cloud data architectures on AWS and Azure, Databricks Unity Catalog governance, Auto Loader ingestion, private endpoints, and Terraform infrastructure as code.',
    icon: 'Cloud',
    featuredQueries: [
      'cloud data engineering consulting',
      'databricks unity catalog guide',
      'azure modern data platform architecture',
      'aws data lakehouse reference architecture',
      'databricks photon performance benchmarks',
    ],
    commercialServiceHref: '/solutions/cloud-engineering',
    commercialServiceTitle: 'Cloud Data Engineering Practice',
    subclusters: [
      { name: 'Databricks Enterprise Platform', description: 'Unity Catalog RBAC, Delta Live Tables, and Photon engine optimization.', topicCount: 15 },
      { name: 'AWS Cloud Data Services', description: 'S3 security hardening, Lake Formation, Glue, EMR, and Redshift Serverless.', topicCount: 13 },
      { name: 'Microsoft Azure Data Stack', description: 'ADLS Gen2 ACLs, Data Factory vs Databricks, Synapse, and Microsoft Purview.', topicCount: 12 },
    ],
  },
  {
    id: 'healthcare-life-sciences',
    slug: 'healthcare-life-sciences',
    name: 'Healthcare Data & Interoperability',
    tagline: 'Streaming FHIR R4 Lakehouses, HIPAA Compliance & Clinical NLP Pipelines',
    description:
      'HIPAA-compliant healthcare data platforms, FHIR R4 / HL7 v2 real-time streaming, Master Patient Index (MPI) probabilistic record linkage, OMOP CDM harmonization, and PHI de-identification.',
    icon: 'HeartPulse',
    featuredQueries: [
      'healthcare data engineering services',
      'fhir r4 streaming lakehouse',
      'hipaa compliant data architecture',
      'master patient index record linkage',
      'omop cdm data transformation',
    ],
    commercialServiceHref: '/industries/healthcare',
    commercialServiceTitle: 'Healthcare Data Engineering Practice',
    subclusters: [
      { name: 'FHIR & Interoperability', description: 'Streaming FHIR bundles, PySpark JSON flattening, USCDI v3/v4 compliance.', topicCount: 14 },
      { name: 'Clinical Data Platforms', description: 'OMOP CDM harmonization, SNOMED-CT / LOINC mapping, and claims EDI 837/835.', topicCount: 12 },
      { name: 'Compliance & Security', description: 'HIPAA Safe Harbor PHI masking, Presidio integration, and BAA architecture.', topicCount: 9 },
    ],
  },
  {
    id: 'life-sciences-data',
    slug: 'life-sciences-data',
    name: 'Life Sciences, Clinical Trials & GxP',
    tagline: 'FDA 21 CFR Part 11 Validated Lakehouses, Multi-Omics & CDISC Automation',
    description:
      'Validated cloud data platforms for biopharma, CDISC SDTM/ADaM pipeline automation, multi-omics data integration, VCF variant processing, and GxP immutable audit trail engineering.',
    icon: 'Dna',
    featuredQueries: [
      'life sciences data engineering services',
      '21 cfr part 11 validated lakehouse',
      'cdisc sdtm adam data automation',
      'multi omics data pipeline architecture',
      'genomic variant vcf delta lake',
    ],
    commercialServiceHref: '/industries/life-sciences',
    commercialServiceTitle: 'Life Sciences Engineering Practice',
    subclusters: [
      { name: 'Regulatory & GxP Validation', description: '21 CFR Part 11 validation, immutable audit trails, and CSA frameworks.', topicCount: 12 },
      { name: 'Clinical Trial Data Systems', description: 'EDC Medidata/Veeva ingestion, CDISC SDTM/ADaM automation, and RWE cohorts.', topicCount: 12 },
      { name: 'Bioinformatics & Multi-Omics', description: 'VCF variant calling pipelines, Nextflow AWS Batch, and single-cell RNA-seq.', topicCount: 11 },
    ],
  },
  {
    id: 'ontology-knowledge-graph',
    slug: 'ontology-knowledge-graph',
    name: 'Ontology Engineering & Knowledge Graphs',
    tagline: 'Enterprise Semantic Graphs, GraphRAG & Entity Disambiguation',
    description:
      'Semantic data architecture, domain ontology engineering with OWL/SKOS, GraphRAG combining vector databases with Neo4j/Neptune, entity resolution, and biomedical terminology integration.',
    icon: 'Network',
    featuredQueries: [
      'ontology engineering consulting',
      'enterprise knowledge graph architecture',
      'graphrag zero hallucination',
      'triplestore vs labeled property graph',
      'biomedical knowledge graphs pubmed',
    ],
    commercialServiceHref: '/solutions/rag-solutions',
    commercialServiceTitle: 'Knowledge Graph & GraphRAG Advisory',
    subclusters: [
      { name: 'Semantic Modeling & Ontologies', description: 'OWL, SKOS, Protégé, SHACL validation, and ontology reconciliation.', topicCount: 11 },
      { name: 'Graph Architecture & Engines', description: 'Neo4j, Amazon Neptune, SPARQL vs Cypher, and distributed graph traversal.', topicCount: 10 },
      { name: 'GraphRAG & AI Grounding', description: 'Hybrid dense vector + entity graph grounding to eliminate LLM hallucinations.', topicCount: 9 },
    ],
  },
  {
    id: 'document-intelligence',
    slug: 'document-intelligence',
    name: 'Document Intelligence & Medical AI',
    tagline: 'High-Accuracy Medical OCR, LayoutLM Extraction & Regulatory Document AI',
    description:
      'Intelligent Document Processing (IDP), multi-column table extraction from complex scientific and medical PDFs, LayoutLM and vision LLMs, eCTD regulatory parsing, and automated PHI redaction.',
    icon: 'FileText',
    featuredQueries: [
      'intelligent document processing services',
      'medical pdf extraction pipeline python',
      'table extraction complex scientific pdf',
      'regulatory document processing ai',
      'ocr vs native pdf vision llms benchmark',
    ],
    commercialServiceHref: '/solutions/ai-engineering',
    commercialServiceTitle: 'Document Intelligence Practice',
    subclusters: [
      { name: 'Document Extraction Pipelines', description: 'Python LayoutLMv3, Tesseract OCR, multi-column parsing, and table recovery.', topicCount: 13 },
      { name: 'Clinical & Regulatory Document AI', description: 'eCTD regulatory module parsing, pathology report NER, and protocol extraction.', topicCount: 12 },
      { name: 'Validation & Evaluation', description: 'Human-in-the-loop (HITL) routing, CER/WER accuracy testing, and PHI blackout.', topicCount: 10 },
    ],
  },
  {
    id: 'technologies',
    slug: 'technologies',
    name: 'Technologies & Sathus Engineering Library',
    tagline: 'Production Code Blueprints, Reference Architectures & Technical Glossaries',
    description:
      'Deep dive technology profiles (Databricks, Spark, AWS, Azure, Kafka, dbt), end-to-end architecture diagrams, production implementation templates, and comprehensive technical glossaries.',
    icon: 'BookOpen',
    featuredQueries: [
      'databricks consulting partner',
      'production pyspark framework code',
      'enterprise data lakehouse blueprint diagram',
      'healthcare informatics glossary',
      'book data architecture strategy session',
    ],
    commercialServiceHref: '/book-strategy-session',
    commercialServiceTitle: 'Book Data Strategy Session',
    subclusters: [
      { name: 'Enterprise Technology Profiles', description: 'Databricks, Apache Spark, Kafka, AWS, Azure, Snowflake, and dbt.', topicCount: 11 },
      { name: 'Master Architecture Blueprints', description: 'Full-stack enterprise diagrams, multi-tenant SaaS, and event-driven lakehouses.', topicCount: 8 },
      { name: 'Implementation Blueprints & Glossaries', description: 'Production code templates, CI/CD pipelines, and A-Z technical dictionaries.', topicCount: 26 },
    ],
  },
];

export function getHubPillars(): HubPillar[] {
  return hubPillars;
}

export function getHubPillarBySlug(slug: string): HubPillar | undefined {
  return hubPillars.find((p) => p.slug === slug);
}
