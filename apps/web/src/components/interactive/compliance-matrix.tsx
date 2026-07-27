'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, CheckCircle2, FileCheck, Lock, Award, Shield, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Framework {
  id: string;
  name: string;
  badge: string;
  description: string;
  controls: Array<{
    code: string;
    title: string;
    description: string;
    status: 'PASSED' | 'AUDITED';
  }>;
}

const frameworks: Framework[] = [
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    badge: 'Audited Annually',
    description: 'Trust Services Criteria covering Security, Availability, Processing Integrity, and Confidentiality.',
    controls: [
      { code: 'CC6.1', title: 'Logical Access Controls', description: 'mTLS certificate authentication and RBAC session isolation for all microservices.', status: 'PASSED' },
      { code: 'CC6.6', title: 'Perimeter & Border Defense', description: 'Web Application Firewall (WAF) with DDoS mitigation and IP rate limiting.', status: 'PASSED' },
      { code: 'CC7.2', title: 'Continuous Infrastructure Monitoring', description: 'Sub-second telemetry logging with automated alert triggers for anomalous traffic.', status: 'PASSED' },
      { code: 'CC8.1', title: 'Change Management & CI/CD Auditing', description: 'Mandatory peer review, static code analysis, and signed Git commit enforcement.', status: 'PASSED' },
    ],
  },
  {
    id: 'hipaa',
    name: 'HIPAA & HITECH',
    badge: 'Healthcare Compliant',
    description: 'Protected Health Information (PHI) encryption, BAA agreements, and zero-retention AI pipelines.',
    controls: [
      { code: '164.312(a)', title: 'PHI Access Control & Tokenization', description: 'De-identification and tokenization of health data before model ingestion.', status: 'PASSED' },
      { code: '164.312(e)', title: 'AES-256 Encryption at Rest & Transit', description: 'Customer-managed KMS keys with TLS 1.3 in-flight wire encryption.', status: 'PASSED' },
      { code: '164.312(b)', title: 'Immutable Audit Logging', description: 'Tamper-proof audit logs retaining all access requests for 7+ years.', status: 'PASSED' },
    ],
  },
  {
    id: 'iso27001',
    name: 'ISO / IEC 27001:2022',
    badge: 'Globally Certified',
    description: 'International standard for Information Security Management Systems (ISMS).',
    controls: [
      { code: 'A.5.15', title: 'Access Control Policy', description: 'Principle of Least Privilege (PoLP) and Just-In-Time (JIT) admin elevation.', status: 'PASSED' },
      { code: 'A.8.24', title: 'Use of Cryptography', description: 'Hardware Security Module (HSM) key management and automated certificate rotation.', status: 'PASSED' },
      { code: 'A.8.28', title: 'Secure Coding Standards', description: 'OWASP Top 10 mitigation and automated static dependency scanning.', status: 'PASSED' },
    ],
  },
  {
    id: 'gdpr',
    name: 'GDPR & EU AI Act',
    badge: 'EU Data Sovereignty',
    description: 'EU data residency, Right to be Forgotten data deletion, and AI transparency controls.',
    controls: [
      { code: 'Art. 32', title: 'Security of Processing', description: 'Pseudonymization and end-to-end data isolation in EU cloud regions.', status: 'PASSED' },
      { code: 'Art. 17', title: 'Automated Data Erasure', description: 'Instant API trigger to erase vector embeddings and customer records.', status: 'PASSED' },
      { code: 'AI Act-T4', title: 'AI Transparency & Model Auditability', description: 'Explainable RAG citations and deterministic evaluation benchmarks.', status: 'PASSED' },
    ],
  },
];

export function ComplianceMatrix() {
  const [activeFramework, setActiveFramework] = React.useState<Framework>(frameworks[0]);
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadPackage = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 600);
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-card p-6 md:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Enterprise Security & Compliance Matrix</h3>
            <p className="text-xs text-muted-foreground">Interactive verification of SOC 2, HIPAA, ISO 27001, and GDPR controls</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleDownloadPackage}
            disabled={downloading}
            className="h-8 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-md"
          >
            <Download className="h-3.5 w-3.5" />
            {downloading ? 'Preparing Package...' : 'Download Audit Evidence Package'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {frameworks.map((fw) => {
          const isActive = activeFramework.id === fw.id;
          return (
            <button
              key={fw.id}
              onClick={() => setActiveFramework(fw)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/40'
                  : 'border-border bg-background hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-foreground">{fw.name}</span>
                {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
              </div>
              <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                {fw.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <div className="bg-background/60 p-4 rounded-xl border border-border flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-foreground">{activeFramework.name} Framework Specification</div>
          <p className="text-xs text-muted-foreground mt-0.5">{activeFramework.description}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-mono font-bold text-emerald-500">100% Passed</span>
          <span className="block text-[10px] text-muted-foreground">0 Deficiencies Found</span>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeFramework.controls.map((control) => (
          <motion.div
            key={control.code}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors space-y-1.5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                {control.code}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                {control.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-foreground">{control.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{control.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
