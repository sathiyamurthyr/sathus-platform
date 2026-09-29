import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd, TechArticleJsonLd } from '@/components/seo/json-ld';
import { SparkMemoryCalculator } from '@/features/engineering-hub/components';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { ArrowLeft, BookOpen, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Spark Executor Memory & Partition Sizing Calculator — Sathus Engineering Hub',
  description:
    'Free production Spark sizing calculator. Calculate optimal spark.executor.memory, spark.executor.memoryOverhead for PySpark / PyArrow, and target partition counts to prevent OOM errors and disk spills.',
  path: '/engineering-hub/tools/spark-memory-calculator',
  keywords: [
    'spark executor memory calculator',
    'pyspark memory overhead sizing',
    'spark partition sizing calculator',
    'fix spark oom exit code 137',
    'container killed by yarn memory limits',
  ],
});

export default function SparkMemoryCalculatorPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Engineering Hub', url: '/engineering-hub' },
    { name: 'Interactive Tools', url: '/engineering-hub/tools' },
    { name: 'Spark Memory Calculator', url: '/engineering-hub/tools/spark-memory-calculator' },
  ];

  return (
    <>
      <TechArticleJsonLd
        headline="Spark Executor Memory & Partition Sizing Calculator"
        description="Interactive calculator for determining Apache Spark JVM executor heap, off-heap memoryOverhead, and target shuffle partition sizing."
        url="/engineering-hub/tools/spark-memory-calculator"
        datePublished="2026-09-29"
        authorName="Elena Rostova"
        proficiencyLevel="Expert"
        dependencies="Apache Spark 3.4+, PySpark, YARN, Kubernetes"
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="container mx-auto px-4 py-8 space-y-10 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Engineering Hub', href: '/engineering-hub' },
              { label: 'Interactive Tools', href: '/engineering-hub/tools' },
              { label: 'Spark Memory Calculator' },
            ]}
          />
          <Link
            href="/engineering-hub/big-data/pyspark-oom-driver-vs-executor-memory"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Read Full Triage Guide: PySpark OOM Driver vs Executor Memory
          </Link>
        </div>

        <SparkMemoryCalculator />

        {/* Supporting Technical Explanations */}
        <section className="rounded-2xl border border-border/60 bg-card/60 p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            How the Sathus Memory Sizing Formulas Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-muted-foreground leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">1. Core Capping (4-5 Cores)</h3>
              <p>
                Assigning more than 5 cores to an executor leads to severe JVM stop-the-world garbage collection pauses. Keeping executor cores at 4 maximizes multi-threading while keeping GC pauses under 200ms.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">2. PySpark Off-Heap Sizing</h3>
              <p>
                PySpark delegates DataFrame transformations to Python worker processes (PyArrow C++ memory, Pandas UDFs). These run outside the JVM. Without 20-25% memoryOverhead, YARN or K8s cgroups will send SIGKILL (Exit code 137).
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">3. 128MB Partition Rule</h3>
              <p>
                Spark tasks achieve optimal throughput when processing 100MB to 200MB per partition. Smaller partitions create metadata scheduling overhead; larger partitions (&gt;2GB) crash the Spark internal ByteBuffer limit.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
