import { Metadata } from 'next';
import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import { companyConfig } from '@/config/company';
import { Trash2, ShieldCheck, Mail, Clock, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'OH-ID Account Deletion & Data Erasure — OneHealth ID',
  description:
    'Instructions and guidelines for requesting account and personal data deletion for OneHealth ID (OH-ID) mobile and web applications operated by Sathus Technology Private Limited.',
  alternates: {
    canonical: '/oh-id-account-deletion',
  },
  openGraph: {
    title: 'OH-ID Account Deletion — OneHealth ID | Sathus Technology',
    description:
      'Official instructions and submission portal for OneHealth ID (OH-ID) account deletion and data removal requests.',
    url: `${siteConfig.url}/oh-id-account-deletion`,
  },
};

export default function OhIdAccountDeletionPage() {
  return (
    <div className="container mx-auto px-4 pt-3 pb-16 max-w-4xl space-y-8">
      <Breadcrumb
        items={[
          { label: 'Legal', href: '/legal' },
          { label: 'OH-ID Privacy Policy', href: '/oh-id-privacy-policy' },
          { label: 'Account Deletion' },
        ]}
      />

      <SectionIntro
        eyebrow="Google Play & App Store Compliance"
        headingLevel="h1"
        title="OH-ID Account & Data Deletion"
        description="Official account and personal data deletion instructions for OneHealth ID (OH-ID) users, operated by Sathus Technology Private Limited."
      />

      {/* App Identifier Box */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-2">
        <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
          <Trash2 className="h-5 w-5 text-destructive" />
          <span>Application Identification</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Application Name:</strong> OneHealth ID (OH-ID) &bull; <strong>Package ID:</strong>{' '}
          <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-[11px]">com.sathus.ohid</code> &bull;{' '}
          <strong>Developer:</strong> {companyConfig.legalName}
        </p>
      </div>

      <div className="space-y-8 text-xs text-muted-foreground leading-relaxed">
        {/* Step-by-Step Instructions */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-foreground">How to Request Account & Data Deletion</h2>
          <p>
            You can request the deletion of your OH-ID account and associated personal data using either of the two methods below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            {/* Method 1 */}
            <div className="rounded-xl border border-border p-5 bg-card space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                <span>In-App Deletion (Fastest)</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1.5 text-xs text-muted-foreground">
                <li>Open the <strong>OneHealth ID (OH-ID)</strong> app on your device.</li>
                <li>Tap your <strong>Profile Avatar</strong> in the top-right corner.</li>
                <li>Select <strong>Settings</strong> &gt; <strong>Security & Account</strong>.</li>
                <li>Tap <strong>Delete Account & Data</strong>.</li>
                <li>Confirm your request via Biometrics or SMS OTP verification.</li>
              </ol>
              <p className="text-[11px] text-muted-foreground/80 italic">
                Your authentication tokens are immediately invalidated and personal session data is purged.
              </p>
            </div>

            {/* Method 2 */}
            <div className="rounded-xl border border-border p-5 bg-card space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                <span>Web / Email Request</span>
              </div>
              <p className="text-xs text-muted-foreground">
                If you do not have the mobile application installed, you can submit a manual deletion request by sending an email to our Data Protection Desk:
              </p>
              <div className="rounded-lg bg-muted p-3 text-[11px] font-mono space-y-1 text-foreground">
                <p><strong>To:</strong> {companyConfig.email}</p>
                <p><strong>Subject:</strong> OH-ID Account Deletion Request</p>
                <p><strong>Include:</strong> Registered Mobile Number & Full Name</p>
              </div>
              <a
                href={`mailto:${companyConfig.email}?subject=OH-ID%20Account%20Deletion%20Request`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                Click here to launch email draft
              </a>
            </div>
          </div>
        </section>

        {/* Data Scope: Deleted vs Retained */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-foreground">What Data is Deleted vs. Retained</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Permanently Deleted</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                <li>User account credentials and cryptographic authentication keys</li>
                <li>Mobile device push notification tokens</li>
                <li>Profile details, contact information, and user preferences</li>
                <li>Cached offline identity documents on the mobile device</li>
                <li>Marketing and general communication records</li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Retained for Statutory Compliance</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
                <li>
                  <strong>Clinical Records:</strong> Medical prescriptions, doctor notes, and outpatient/inpatient diagnostic records created at partner healthcare facilities.
                </li>
                <li>
                  <strong>Statutory Basis:</strong> The National Medical Commission (NMC) regulations and Indian Clinical Establishments Act mandate healthcare providers to retain medical records for a minimum of 3 years.
                </li>
                <li>
                  <strong>Dissociation:</strong> Your mobile login credentials are dissociated from these institutional medical archives.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Processing Timelines */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Processing Timeline</span>
          </h2>
          <p>
            * <strong>In-App Requests:</strong> Account credentials and session tokens are disabled immediately.
            <br />
            * <strong>Email Requests:</strong> Acknowledged within 48 hours; identity verification and full backend data purge completed within <strong>14 calendar days</strong>.
          </p>
        </section>

        {/* Back Link */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <Link
            href="/oh-id-privacy-policy"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to OH-ID Privacy Policy
          </Link>
          <span className="text-[11px] text-muted-foreground">
            Sathus Technology Private Limited &bull; Chennai, India
          </span>
        </div>
      </div>
    </div>
  );
}
