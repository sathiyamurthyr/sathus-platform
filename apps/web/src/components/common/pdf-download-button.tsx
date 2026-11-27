'use client';

import * as React from 'react';
import { Download, FileCheck, Mail, User, X, Sparkles, ShieldCheck, ArrowRight, Loader2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PdfDownloadButtonProps {
  title: string;
  slug?: string;
  downloadUrl?: string;
  variant?: 'outline' | 'default' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  buttonText?: string;
}

export function PdfDownloadButton({
  title,
  slug,
  downloadUrl = '/downloads/500-data-engineering-interview-guide-2026.md',
  variant = 'outline',
  size = 'sm',
  className,
  buttonText = 'Download Executive PDF',
}: PdfDownloadButtonProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [leadInfo, setLeadInfo] = React.useState<{ name: string; email: string } | null>(null);

  // Form state
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // Check if lead was previously captured on client mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('sathus_download_lead');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name && parsed?.email) {
          setLeadInfo(parsed);
          setName(parsed.name);
          setEmail(parsed.email);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Escape key listener to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    if (modalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const triggerDownloadAction = () => {
    setDownloading(true);

    // If downloadUrl is present, trigger automatic download of the offline handbook
    if (downloadUrl) {
      try {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = downloadUrl.split('/').pop() || 'data-engineering-interview-guide-2026.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error('File download error:', err);
      }
    }

    // Also trigger browser print dialog for formatted PDF save
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 600);
  };

  const handleButtonClick = () => {
    if (leadInfo?.email && leadInfo?.name) {
      // User has already provided details; trigger download immediately
      triggerDownloadAction();
    } else {
      // Prompt for name and email first
      setError(null);
      setModalOpen(true);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid work or personal email address');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/download-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          resourceTitle: title,
          resourceSlug: slug || '500-data-engineering-interview-questions-answers-2026',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register download');
      }

      const verifiedLead = { name: name.trim(), email: email.trim().toLowerCase() };
      setLeadInfo(verifiedLead);
      try {
        localStorage.setItem('sathus_download_lead', JSON.stringify(verifiedLead));
      } catch {
        // Ignore storage error
      }

      setDownloadSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setDownloadSuccess(false);
        triggerDownloadAction();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        variant={variant}
        size={size}
        className={cn(
          'text-xs font-bold gap-1.5 border-primary/40 hover:bg-primary/10 transition-all shadow-sm',
          className
        )}
        title="Download complete guide and executive PDF"
      >
        {downloading ? (
          <FileCheck className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
        ) : (
          <Download className="h-3.5 w-3.5 text-primary" />
        )}
        <span>{downloading ? 'Preparing PDF...' : buttonText}</span>
      </Button>

      {/* LEAD CAPTURE MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setModalOpen(false)}
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-10 text-slate-900"
              role="dialog"
              aria-modal="true"
              aria-labelledby="download-modal-title"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>

              {downloadSuccess ? (
                /* Success Screen */
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <FileCheck className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-950">Access Unlocked!</h3>
                    <p className="text-xs text-slate-600">
                      Thank you, <strong className="text-slate-900">{name}</strong>. Your download is preparing now...
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#A20A3A]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Launching print / PDF download...</span>
                  </div>
                </div>
              ) : (
                /* Lead Capture Form */
                <div className="space-y-5">
                  {/* Header Badge & Title */}
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#A20A3A]/10 px-3 py-1 text-xs font-bold text-[#A20A3A]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Free Executive Handbook
                    </div>
                    <h3 id="download-modal-title" className="text-xl font-extrabold text-slate-950 leading-tight">
                      Download Complete 2026 Guide & PDF
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Please enter your name and email to immediately unlock and download the complete 500+ interview questions handbook.
                    </p>
                  </div>

                  {/* Resource pill */}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800">
                    <FileText className="h-4 w-4 text-[#A20A3A] shrink-0" />
                    <span className="font-semibold truncate">{title}</span>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmitLead} className="space-y-3.5">
                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-500" />
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Satyamurthy R"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-950 outline-none focus:border-[#A20A3A] focus:ring-1 focus:ring-[#A20A3A] transition-all"
                      />
                    </div>

                    {/* Email input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500" />
                        Work / Personal Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. satya@company.com"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-950 outline-none focus:border-[#A20A3A] focus:ring-1 focus:ring-[#A20A3A] transition-all"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-10 mt-2 text-xs font-bold bg-[#A20A3A] hover:bg-[#85082e] text-white shadow-md gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Verifying & Unlocking...</span>
                        </>
                      ) : (
                        <>
                          <span>Unlock & Download PDF Now</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Trust Footer */}
                  <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>100% Free • No Spam • Instant Direct Download</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
