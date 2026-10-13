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
    status: 'IMPLEMENTED' | 'VERIFIED';
  }>;
}

const frameworks: Framework[] = [
  {
    id: 'zero-trust',
    name: 'Zero-Trust Architecture',
    badge: 'Implemented Controls',
    description: 'Cryptographic identity verification, session isolation, and strict network segmentation across microservices.',
    controls: [
      { code: 'ZT-01', title: 'Logical Access Controls', description: 'mTLS certificate authentication and RBAC session isolation for all microservices.', status: 'IMPLEMENTED' },
      { code: 'ZT-02', title: 'Perimeter & Border Defense', description: 'Web Application Firewall (WAF) with DDoS mitigation and IP rate limiting.', status: 'IMPLEMENTED' },
      { code: 'ZT-03', title: 'Continuous Infrastructure Monitoring', description: 'Telemetry logging with automated alert triggers for anomalous traffic.', status: 'IMPLEMENTED' },
      { code: 'ZT-04', title: 'Change Management & CI/CD Auditing', description: 'Mandatory peer review, static code analysis, and signed Git commit enforcement.', status: 'VERIFIED' },
    ],
  },
  {
    id: 'data-protection',
    name: 'Data Protection & GDPR Sovereignty',
    badge: 'Privacy by Design',
    description: 'EU data residency, automated Right to be Forgotten API deletion, and client-isolated encryption keys.',
    controls: [
      { code: 'DP-01', title: 'Security of Processing', description: 'Pseudonymization and end-to-end data isolation in client cloud regions.', status: 'IMPLEMENTED' },
      { code: 'DP-02', title: 'AES-256 Encryption at Rest & Transit', description: 'Client-managed KMS keys with TLS 1.3 in-flight wire encryption.', status: 'IMPLEMENTED' },
      { code: 'DP-03', title: 'Automated Data Erasure', description: 'Instant API trigger to erase vector embeddings and customer records.', status: 'IMPLEMENTED' },
      { code: 'DP-04', title: 'AI Transparency & Model Auditability', description: 'Explainable RAG citations and deterministic evaluation benchmarks.', status: 'VERIFIED' },
    ],
  },
  {
    id: 'secure-engineering',
    name: 'Secure SDLC & OWASP Standards',
    badge: 'Verified Practices',
    description: 'Application security controls mapped to OWASP Top 10 risks and secure development lifecycles.',
    controls: [
      { code: 'SDLC-01', title: 'Access Control Policy', description: 'Principle of Least Privilege (PoLP) and Just-In-Time (JIT) admin elevation.', status: 'IMPLEMENTED' },
      { code: 'SDLC-02', title: 'Use of Cryptography', description: 'Hardware Security Module (HSM) key management and automated certificate rotation.', status: 'IMPLEMENTED' },
      { code: 'SDLC-03', title: 'Secure Coding Standards', description: 'OWASP Top 10 mitigation and automated static dependency scanning.', status: 'VERIFIED' },
      { code: 'SDLC-04', title: 'Immutable Audit Logging', description: 'Tamper-proof audit logs retaining all access requests with structured telemetry.', status: 'IMPLEMENTED' },
    ],
  },
  {
    id: 'healthcare-interop',
    name: 'Healthcare Standards & ABDM / FHIR',
    badge: 'Schema Standards',
    description: 'HL7 FHIR R4 schema integration, ABDM gateway compatibility, and automated patient data de-identification.',
    controls: [
      { code: 'HL7-01', title: 'Clinical Data De-Identification', description: 'Automated de-identification and tokenization of health data before model ingestion.', status: 'IMPLEMENTED' },
      { code: 'HL7-02', title: 'FHIR R4 Resource Mapping', description: 'Strict validation against HL7 FHIR R4 standard healthcare data schemas.', status: 'VERIFIED' },
      { code: 'HL7-03', title: 'ABDM Health Gateway Integration', description: 'Secure ABHA registration and consent-driven health data exchange protocols.', status: 'IMPLEMENTED' },
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
            <p className="text-xs text-muted-foreground">Interactive verification of Zero-Trust, GDPR, Secure Engineering, and Healthcare Data standards</p>
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
