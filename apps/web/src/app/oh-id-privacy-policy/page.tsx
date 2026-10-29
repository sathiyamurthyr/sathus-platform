import { Metadata } from 'next';
import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import { companyConfig } from '@/config/company';
import { ShieldCheck, Lock, Hospital, UserCheck, AlertCircle, FileText, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'OH-ID Privacy Policy — OneHealth ID',
  description:
    'Privacy Policy for OH-ID (One Health ID) operated by Sathus Technology Private Limited, covering patient, doctor, and healthcare data protection.',
  alternates: {
    canonical: '/oh-id-privacy-policy',
  },
  openGraph: {
    title: 'OH-ID Privacy Policy — OneHealth ID | Sathus Technology',
    description:
      'How OH-ID collects, protects, processes, and manages personal and healthcare information across our digital health platform.',
    url: `${siteConfig.url}/oh-id-privacy-policy`,
  },
};

export default function OhIdPrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 pt-3 pb-16 max-w-4xl space-y-8">
      <Breadcrumb
        items={[
          { label: 'Legal', href: '/legal' },
          { label: 'OH-ID Privacy Policy' },
        ]}
      />

      <SectionIntro
        eyebrow="Healthcare Data Protection & Privacy"
        headingLevel="h1"
        title="OH-ID Privacy Policy"
        description="Effective Date: October 29, 2026 | Last Updated: October 29, 2026. This policy governs how Sathus Technology Private Limited processes and safeguards personal and healthcare data across the OH-ID platform."
      />

      {/* Quick Summary Card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <ShieldCheck className="h-5 w-5" />
          <span>Patient-First Privacy & Zero-Knowledge Architecture</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          OH-ID is engineered to give patients and authorized healthcare providers secure, controlled access to health
          identities and hospital workflows. We never sell your personal information, train public AI models on clinical
          data, or share records between hospitals without explicit authorization.
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-xs text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">1</span>
            Who Operates OH-ID?
          </h2>
          <p>
            OH-ID (One Health ID) is operated by <strong className="text-foreground">Sathus Technology Private Limited</strong> (“Sathus”, “we”, “us” or “our”).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-border p-4 bg-card not-prose">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Company Details</span>
              <p className="text-xs text-foreground font-medium">{companyConfig.legalName}</p>
              <p className="text-xs text-muted-foreground">Website: <a href={companyConfig.website} className="text-primary hover:underline">{companyConfig.website}</a></p>
              <p className="text-xs text-muted-foreground">Privacy Desk: <a href={`mailto:${companyConfig.email}`} className="text-primary hover:underline">{companyConfig.email}</a></p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Registered Office</span>
              <p className="text-xs text-muted-foreground leading-normal">{companyConfig.address.formatted}</p>
            </div>
          </div>
          <p>
            The organisation responsible for a particular medical record may depend on the service and relationship involved. For example, a hospital independently determines how clinical records are created, maintained, and used for direct healthcare delivery. Where Sathus processes records on behalf of a partner hospital, the hospital acts as the Data Fiduciary/Controller and Sathus operates as the Data Processor under strict contractual safeguards.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">2</span>
            Scope of this Policy
          </h2>
          <p>
            This policy applies to OH-ID’s website, web application, mobile applications (iOS and Android), and associated cloud services operated by Sathus.
          </p>
          <p>
            It covers information relating to patients, doctors, hospital administrators, reception desk staff, lab personnel, healthcare organisation representatives, and individuals communicating with our support desk.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">3</span>
            Information We May Process
          </h2>
          <p>
            The information collected depends on the specific features used, your role, and the participating hospital’s clinical modules. We strictly observe data minimisation:
          </p>
          <div className="space-y-4 mt-2">
            <div className="rounded-lg border border-border p-4 bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-1">3.1 Identity and Contact Information</h3>
              <p className="text-xs text-muted-foreground">
                Name, age, date of birth, gender, mobile phone number, email address, account identifiers, authentication credentials, cryptographic session keys, and verification details. Verification codes and auth tokens are hashed and encrypted; they are never exposed in application logs.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-1">3.2 Healthcare-Related Information</h3>
              <p className="text-xs text-muted-foreground">
                Patient health identifiers, hospital registration numbers, appointment schedules, outpatient (OPD) queue allocations, clinical history, vital measurements, prescriptions, consultation notes, and uploaded diagnostic files. Healthcare data is treated as sensitive personal data with strict role-based access controls (RBAC).
              </p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-1">3.3 Organisation and Professional Information</h3>
              <p className="text-xs text-muted-foreground">
                Healthcare facility details, clinical establishment registration numbers, official addresses, doctor medical council registration IDs, staff roles, and administrative permissions.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-1">3.4 QR Codes & Zero-Knowledge Verification</h3>
              <p className="text-xs text-muted-foreground">
                OH-ID employs dynamic QR codes for secure patient identification and intake. <strong>Scanning a QR code does not grant unrestricted access to medical records.</strong> Access to clinical data requires authenticated, active clinical duty validation and patient authorization.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-1">3.5 Device, Technical & Security Information</h3>
              <p className="text-xs text-muted-foreground">
                IP address, connection logs, device model, operating system version, mobile app build numbers, security event logs, and audit entries required to prevent fraud and ensure platform reliability.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card/50">
              <h3 className="text-sm font-semibold text-foreground mb-1">3.6 Camera & Biometric Permissions</h3>
              <p className="text-xs text-muted-foreground">
                <strong>Camera:</strong> Used exclusively in the mobile app to scan patient QR passes or capture physical documents/prescriptions for upload. Camera access is transient and does not record continuous video.
                <br />
                <strong>Biometrics:</strong> Face ID and Fingerprint authentication leverage local hardware secure enclaves (iOS LocalAuthentication / Android BiometricPrompt). Raw biometric vectors remain on your device and are never sent to Sathus servers.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">4</span>
            Why We Process Information
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
            <li>To provision, authenticate, and administer patient and clinical staff accounts.</li>
            <li>To verify mobile numbers via OTP and validate professional hospital credentials.</li>
            <li>To facilitate OPD token allocation, hospital appointment queues, and intake workflows.</li>
            <li>To empower authorized clinical documentation, e-prescriptions, and diagnostic record access.</li>
            <li>To facilitate QR-based identification and emergency health summary verification.</li>
            <li>To protect user accounts against unauthorized access, credential stuffing, and session hijacking.</li>
            <li>To maintain immutable audit logs in compliance with healthcare regulations.</li>
            <li>To send critical operational notifications (e.g., appointment confirmations, queue alerts).</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">5</span>
            Consent and Your Choices
          </h2>
          <p>
            Where processing relies on consent, consent is obtained in an explicit, informed manner. You may withdraw consent for optional features at any time via your account settings or by contacting <a href={`mailto:${companyConfig.email}`} className="text-primary hover:underline">{companyConfig.email}</a>.
          </p>
          <p>
            Withdrawing consent does not invalidate lawful processing carried out prior to withdrawal, nor does it override statutory obligations to maintain patient medical records under healthcare establishment regulations.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">6</span>
            Who Can Access Information?
          </h2>
          <p>
            Information is strictly compartmentalized based on verified organizational roles:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
            <li><strong>Patients:</strong> Access their own profile, past appointments, active prescriptions, and shared health records.</li>
            <li><strong>Treating Doctors:</strong> Access clinical history and current vitals for patients under their active consultation or admitted care.</li>
            <li><strong>Hospital Reception & Billing:</strong> Access demographic and appointment scheduling data; restricted from confidential doctor consultation notes.</li>
            <li><strong>Sathus Infrastructure Engineers:</strong> Strict, audited access restricted to encrypted database infrastructure for maintenance and incident resolution.</li>
            <li><strong>No Inter-Hospital Data Leaks:</strong> Hospital instances are logically isolated. One hospital cannot view records from another hospital without explicit, authenticated consent protocols.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">7</span>
            Service Providers and Subprocessors
          </h2>
          <p>
            We partner with enterprise-grade cloud providers for infrastructure, transactional SMS/email delivery, and secure storage. All service providers operate under stringent Business Associate or Data Processing Agreements adhering to ISO 27001, SOC 2, and Indian DPDP guidelines.
          </p>
          <p>
            <strong>Zero AI Data Retention:</strong> Where document OCR or machine intelligence is employed for clinical intake, data is processed in private enterprise runtime containers with strict zero-data-retention; client data is never utilized to train third-party machine learning models.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">8</span>
            Data Storage & International Processing
          </h2>
          <p>
            Primary databases and patient health repositories are maintained in secure data centre facilities located within <strong className="text-foreground">India</strong>, adhering to national health data residency mandates and the Digital Personal Data Protection Act (DPDP) 2023. Any cross-border infrastructure integrations are safeguarded through end-to-end encryption and contractual protections.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">9</span>
            Security Safeguards
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
            <li><strong>Encryption in Transit:</strong> TLS 1.3 enforced across all web and mobile endpoints.</li>
            <li><strong>Encryption at Rest:</strong> Database records, patient identifiers, and medical files encrypted with AES-256.</li>
            <li><strong>Access Controls:</strong> Multi-factor authentication (MFA) and fine-grained Role-Based Access Controls (RBAC).</li>
            <li><strong>Audit Logging:</strong> Immutable audit logs for all clinical file access, modifications, and administrative exports.</li>
            <li><strong>Periodic Audits:</strong> Automated vulnerability scanning, static application security testing (SAST), and penetration testing.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">10</span>
            Retention of Information
          </h2>
          <p>
            Information is retained only for the duration necessary to satisfy the purpose of collection or statutory compliance:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
            <li><strong>User Account Details:</strong> Retained while your account is active.</li>
            <li><strong>Clinical & Hospital Records:</strong> Retained in alignment with National Medical Commission (NMC) regulations and hospital recordkeeping laws (typically a minimum of 3 years from consultation date).</li>
            <li><strong>Security & Authentication Logs:</strong> Retained for a minimum of 180 days to support incident analysis and compliance verification.</li>
          </ul>
        </section>

        {/* Section 11 - Account Deletion */}
        <section className="space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 not-prose">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-destructive/10 text-destructive text-xs font-mono">11</span>
            Account Deletion & Data Erasure
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Eligible users have the right to request deletion of their OH-ID account and associated personal data at any time.
          </p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>
              <strong>In-App Deletion:</strong> You can submit a deletion request directly within the OH-ID mobile application under <em>Settings &gt; Security &gt; Delete Account</em>.
            </p>
            <p>
              <strong>Web Deletion Portal:</strong> You can also submit an online account erasure request via our dedicated deletion portal:
            </p>
            <div className="pt-2">
              <Link
                href="/oh-id-account-deletion"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors"
              >
                Go to OH-ID Account Deletion Page
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="pt-2 text-[11px] text-muted-foreground italic">
              * Note: Deleting an OH-ID user account removes your mobile login credentials and personal app settings. Inpatient/outpatient medical records created during treatment at hospitals remain subject to hospital statutory retention mandates under applicable medical council regulations.
            </p>
          </div>
        </section>

        {/* Section 12 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">12</span>
            Children's Information
          </h2>
          <p>
            OH-ID supports pediatric healthcare management through parent or legal guardian accounts. Accounts or clinical files for minors (under 18 years) must be initiated and overseen by an authorized parent or guardian in compliance with DPDP Act requirements.
          </p>
        </section>

        {/* Section 13 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">13</span>
            Cookies and Tracking Technologies
          </h2>
          <p>
            OH-ID web services use essential cookies strictly required for secure user authentication, CSRF protection, and session maintenance. We do not use third-party behavioral tracking or advertising cookies.
          </p>
        </section>

        {/* Section 14 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">14</span>
            Your Privacy Rights and Complaints
          </h2>
          <p>
            Subject to applicable law, you have the right to request access to, correction of, or deletion of your personal data, and to lodge a grievance:
          </p>
          <div className="rounded-lg border border-border p-4 bg-card not-prose space-y-1 text-xs">
            <p className="font-semibold text-foreground">Data Protection & Grievance Desk</p>
            <p className="text-muted-foreground">Email: <a href={`mailto:${companyConfig.email}?subject=OH-ID%20Privacy%20Request`} className="text-primary hover:underline">{companyConfig.email}</a></p>
            <p className="text-muted-foreground">Subject Line: <code className="text-foreground bg-muted px-1 py-0.5 rounded text-[11px]">OH-ID Privacy Request</code></p>
            <p className="text-[11px] text-muted-foreground pt-1">
              Please include sufficient information to verify your account identity. Do not transmit passwords, one-time passwords, or unredacted financial information via email.
            </p>
          </div>
        </section>

        {/* Section 15 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">15</span>
            Changes to this Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect operational, legal, or regulatory updates. Any material updates will be communicated through prominent notifications within the OH-ID application or on our website.
          </p>
        </section>

        {/* Section 16 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground text-xs font-mono">16</span>
            Contact Us
          </h2>
          <p>
            For privacy questions, verification requests, or complaints concerning OH-ID:
          </p>
          <div className="rounded-lg border border-border p-4 bg-card not-prose space-y-1 text-xs">
            <p className="font-bold text-foreground">{companyConfig.legalName}</p>
            <p className="text-muted-foreground">Website: <a href={companyConfig.website} className="text-primary hover:underline">{companyConfig.website}</a></p>
            <p className="text-muted-foreground">Email: <a href={`mailto:${companyConfig.email}`} className="text-primary hover:underline">{companyConfig.email}</a></p>
            <p className="text-muted-foreground">Registered Address: {companyConfig.address.formatted}</p>
            <p className="text-muted-foreground">Branch Office: {companyConfig.branchOffice.formatted}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
