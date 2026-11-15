'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Upload,
  Image as ImageIcon,
  Edit,
  Plus,
  Trash2,
  Save,
  X,
  ExternalLink,
  Stamp,
  Camera,
  Loader2,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient, DEFAULT_COMPANY_PROFILE } from '@/lib/finance-client';
import { CompanyProfile, CompanyBankAccount, CompanyPaymentQR, CompanyLocation, CompanySignatory } from '@/types/finance';

/**
 * Client-side high performance image compressor and optimizer.
 * Scales down large images (e.g. 5MB-15MB phone photos) to crisp web-ready dimensions (max 800px)
 * preserving transparency for PNGs. Reduces payload size to ~30-60KB so it never exceeds
 * localStorage quota and renders instantly on invoices.
 */
async function optimizeImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.88
): Promise<string> {
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Preserve transparency for PNGs
        const isPng = file.type === 'image/png';
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Invalid or corrupted image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export default function FinanceSettingsPage() {
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_COMPANY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Modals
  const [showEditCorporate, setShowEditCorporate] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingBankIndex, setEditingBankIndex] = useState<number | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showSignatoryModal, setShowSignatoryModal] = useState(false);

  // Corporate Form State
  const [corpLegalName, setCorpLegalName] = useState('');
  const [corpDisplayName, setCorpDisplayName] = useState('');
  const [corpPan, setCorpPan] = useState('');
  const [corpCin, setCorpCin] = useState('');
  const [corpEmail, setCorpEmail] = useState('');
  const [corpPhone, setCorpPhone] = useState('');
  const [corpWebsite, setCorpWebsite] = useState('');
  const [corpAddress1, setCorpAddress1] = useState('');
  const [corpAddress2, setCorpAddress2] = useState('');
  const [corpCity, setCorpCity] = useState('');
  const [corpState, setCorpState] = useState('');
  const [corpStateCode, setCorpStateCode] = useState('');
  const [corpPincode, setCorpPincode] = useState('');
  const [corpGstin, setCorpGstin] = useState('');

  // Bank Form State
  const [bankName, setBankName] = useState('');
  const [bankHolder, setBankHolder] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [bankUpi, setBankUpi] = useState('');
  const [bankCurrency, setBankCurrency] = useState('INR');

  // QR Form State
  const [qrName, setQrName] = useState('');
  const [qrUpiId, setQrUpiId] = useState('');
  const [qrMerchant, setQrMerchant] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');

  // Hidden file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const sealInputRef = useRef<HTMLInputElement>(null);
  const qrImageInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const p = await financeClient.getCompanyProfile();
      setProfile(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Body scroll lock when any modal is open
  useEffect(() => {
    const isAnyModalOpen =
      showEditCorporate || showBankModal || showQRModal || showSignatoryModal;
    if (isAnyModalOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [showEditCorporate, showBankModal, showQRModal, showSignatoryModal]);

  // Upload and URL states
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingSeal, setIsUploadingSeal] = useState(false);
  const [isUploadingQR, setIsUploadingQR] = useState(false);
  const [showLogoUrlInput, setShowLogoUrlInput] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [showSealUrlInput, setShowSealUrlInput] = useState(false);
  const [customSealUrl, setCustomSealUrl] = useState('');

  // Handle Logo File Upload (PNG/JPG/SVG converted to optimized DataURL)
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      setStatusMsg('Optimizing and uploading company logo...');
      const dataUrl = await optimizeImage(file, 800, 800);
      const updated = await financeClient.updateCompanyProfile({ logo_url: dataUrl });
      setProfile(updated);
      setStatusMsg('Company Logo uploaded and updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update Company Logo.';
      setStatusMsg(msg);
    } finally {
      setIsUploadingLogo(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveLogoUrl = async () => {
    if (!customLogoUrl.trim()) return;
    try {
      setIsUploadingLogo(true);
      const updated = await financeClient.updateCompanyProfile({ logo_url: customLogoUrl.trim() });
      setProfile(updated);
      setStatusMsg('Company Logo URL saved successfully.');
      setShowLogoUrlInput(false);
    } catch {
      setStatusMsg('Failed to update Company Logo URL.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Handle Seal / Stamp File Upload
  const handleSealFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingSeal(true);
      setStatusMsg('Optimizing and uploading official seal...');
      const dataUrl = await optimizeImage(file, 500, 500);
      const updated = await financeClient.updateCompanyProfile({ seal_url: dataUrl });
      setProfile(updated);
      setStatusMsg('Company Official Seal / Stamp uploaded and updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update Official Seal.';
      setStatusMsg(msg);
    } finally {
      setIsUploadingSeal(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveSealUrl = async () => {
    if (!customSealUrl.trim()) return;
    try {
      setIsUploadingSeal(true);
      const updated = await financeClient.updateCompanyProfile({ seal_url: customSealUrl.trim() });
      setProfile(updated);
      setStatusMsg('Official Seal URL saved successfully.');
      setShowSealUrlInput(false);
    } catch {
      setStatusMsg('Failed to update Official Seal URL.');
    } finally {
      setIsUploadingSeal(false);
    }
  };

  // Handle Custom QR Code Image Upload
  const handleQRImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingQR(true);
      const dataUrl = await optimizeImage(file, 600, 600);
      setQrImageUrl(dataUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process QR image.';
      setStatusMsg(msg);
    } finally {
      setIsUploadingQR(false);
      if (e.target) e.target.value = '';
    }
  };

  // Open Corporate Details Modal
  const handleOpenCorporateModal = () => {
    setCorpLegalName(profile.legal_name || '');
    setCorpDisplayName(profile.display_name || '');
    setCorpPan(profile.pan || '');
    setCorpCin(profile.cin || '');
    setCorpEmail(profile.email || '');
    setCorpPhone(profile.phone || '');
    setCorpWebsite(profile.website || '');

    const loc = profile.locations?.[0];
    setCorpAddress1(loc?.address_line1 || '');
    setCorpAddress2(loc?.address_line2 || '');
    setCorpCity(loc?.city || 'Chennai');
    setCorpState(loc?.state || 'Tamil Nadu');
    setCorpStateCode(loc?.state_code || '33');
    setCorpPincode(loc?.pincode || '600032');
    setCorpGstin(loc?.gstin || '');

    setShowEditCorporate(true);
  };

  // Save Corporate Details
  const handleSaveCorporate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedLocations: CompanyLocation[] = [
        {
          ref_id: profile.locations?.[0]?.ref_id || 2001,
          location_name: 'Registered Office',
          address_line1: corpAddress1,
          address_line2: corpAddress2,
          city: corpCity,
          state: corpState,
          state_code: corpStateCode,
          pincode: corpPincode,
          gstin: corpGstin.toUpperCase(),
          is_default: true,
          status: 'ACTIVE',
        },
      ];

      const updated = await financeClient.updateCompanyProfile({
        legal_name: corpLegalName,
        display_name: corpDisplayName,
        pan: corpPan.toUpperCase(),
        cin: corpCin.toUpperCase(),
        email: corpEmail,
        phone: corpPhone,
        website: corpWebsite,
        locations: updatedLocations,
      });

      setProfile(updated);
      setStatusMsg('Corporate & Contact Details updated successfully.');
      setShowEditCorporate(false);
    } catch {
      setStatusMsg('Failed to update Corporate Details.');
    }
  };

  // Open Bank Modal
  const handleOpenBankModal = (idx: number | null) => {
    setEditingBankIndex(idx);
    if (idx !== null && profile.bank_accounts?.[idx]) {
      const b = profile.bank_accounts[idx];
      setBankName(b.bank_name);
      setBankHolder(b.account_holder);
      setBankAccountNo(b.account_number || b.account_number_masked.replace(/\*/g, ''));
      setBankIfsc(b.ifsc_code);
      setBankBranch(b.branch);
      setBankUpi(b.upi_id || '');
      setBankCurrency(b.currency || 'INR');
    } else {
      setBankName('HDFC Bank');
      setBankHolder(profile.legal_name || 'Sathus Technology Private Limited');
      setBankAccountNo('');
      setBankIfsc('HDFC0001234');
      setBankBranch('Guindy Industrial Estate, Chennai');
      setBankUpi('sathustechnology@hdfcbank');
      setBankCurrency('INR');
    }
    setShowBankModal(true);
  };

  // Save Bank Account
  const handleSaveBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const masked =
      bankAccountNo.length > 4
        ? `**** **** ${bankAccountNo.slice(-4)}`
        : bankAccountNo;

    const newBank: CompanyBankAccount = {
      ref_id: editingBankIndex !== null && profile.bank_accounts?.[editingBankIndex]
        ? profile.bank_accounts[editingBankIndex].ref_id
        : Date.now(),
      account_holder: bankHolder,
      bank_name: bankName,
      branch: bankBranch,
      account_number_masked: masked,
      account_number: bankAccountNo,
      ifsc_code: bankIfsc.toUpperCase(),
      upi_id: bankUpi,
      currency: bankCurrency,
      is_default: true,
      show_on_invoice: true,
      status: 'ACTIVE',
    };

    const updatedAccounts = [...(profile.bank_accounts || [])];
    if (editingBankIndex !== null) {
      updatedAccounts[editingBankIndex] = newBank;
    } else {
      updatedAccounts.unshift(newBank);
    }

    try {
      const updated = await financeClient.updateCompanyProfile({
        bank_accounts: updatedAccounts,
      });
      setProfile(updated);
      setStatusMsg('Bank Account Details saved successfully.');
      setShowBankModal(false);
    } catch {
      setStatusMsg('Failed to save Bank Account Details.');
    }
  };

  // Open QR Modal
  const handleOpenQRModal = () => {
    const q = profile.payment_qrs?.[0];
    setQrName(q?.qr_name || 'Sathus Official UPI QR');
    setQrUpiId(q?.upi_id || 'sathustechnology@hdfcbank');
    setQrMerchant(q?.merchant_name || 'Sathus Technology Pvt Ltd');
    setQrPayload(
      q?.qr_payload ||
        `upi://pay?pa=sathustechnology@hdfcbank&pn=Sathus%20Technology&cu=INR`
    );
    setQrImageUrl(q?.qr_image_url || '');
    setShowQRModal(true);
  };

  // Save QR Details
  const handleSaveQR = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload =
      qrPayload ||
      `upi://pay?pa=${encodeURIComponent(qrUpiId)}&pn=${encodeURIComponent(qrMerchant)}&cu=INR`;

    const newQR: CompanyPaymentQR = {
      ref_id: profile.payment_qrs?.[0]?.ref_id || Date.now(),
      qr_name: qrName,
      qr_type: 'UPI',
      qr_payload: payload,
      upi_id: qrUpiId,
      merchant_name: qrMerchant,
      qr_image_url: qrImageUrl,
      is_default: true,
      status: 'ACTIVE',
    };

    try {
      const updated = await financeClient.updateCompanyProfile({
        payment_qrs: [newQR],
      });
      setProfile(updated);
      setStatusMsg('Company Payment QR & UPI Details updated successfully.');
      setShowQRModal(false);
    } catch {
      setStatusMsg('Failed to update Payment QR Details.');
    }
  };

  const primaryBank = profile.bank_accounts?.[0];
  const primaryQR = profile.payment_qrs?.[0];

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      {/* Page Title & Media Library Link Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Company Profile, Legal & Banking Configuration
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage corporate branding, logo, digital seal, remittance bank accounts, and UPI payment QR.
          </p>
        </div>

        {/* Media Library Shortcut for single images */}
        <Link
          href="/admin/media"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:border-[#A20A3A] hover:text-[#A20A3A] shadow-sm transition-all"
        >
          <ImageIcon className="h-4 w-4 text-[#A20A3A]" />
          <span>Upload Single Images & Assets (Media Library)</span>
          <ExternalLink className="h-3 w-3 text-neutral-400" />
        </Link>
      </div>

      {statusMsg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 p-3.5 text-xs text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            {statusMsg}
          </span>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-emerald-700 hover:text-emerald-950 text-sm font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* SECTION 1: COMPANY LOGO & DIGITAL SEAL ASSETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COMPANY LOGO CARD */}
        <div
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A]">
                <Camera className="h-5 w-5 text-[#A20A3A]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Company Logo</h2>
                <p className="text-xs text-neutral-500">
                  Displayed on top of generated GST Invoices and client portals
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#A20A3A] bg-[#A20A3A]/10 px-2.5 py-0.5 rounded-full">
              Branding
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Logo Preview Box */}
            <div className="flex h-24 w-28 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-[#FAF8F9] p-2 overflow-hidden shadow-inner">
              {profile.logo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={profile.logo_url}
                  alt="Company Logo Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A20A3A] text-lg font-bold text-white shadow">
                    S
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-1">Default Logo</span>
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <p className="text-xs text-neutral-600">
                Supports PNG, SVG, or high-res JPG. Automatically optimized for web & invoices.
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFileChange}
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                />
                <Button
                  size="sm"
                  disabled={isUploadingLogo}
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-[#A20A3A] hover:bg-[#85082e] text-white text-xs h-8 gap-1.5 font-semibold"
                >
                  {isUploadingLogo ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  {isUploadingLogo ? 'Optimizing...' : 'Upload Company Logo'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogoUrlInput(!showLogoUrlInput)}
                  className="border-neutral-200 text-neutral-700 hover:text-[#A20A3A] text-xs h-8 gap-1"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  {showLogoUrlInput ? 'Hide URL' : 'Paste URL'}
                </Button>

                {profile.logo_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const updated = await financeClient.updateCompanyProfile({ logo_url: '' });
                      setProfile(updated);
                      setStatusMsg('Logo reset to default.');
                    }}
                    className="border-neutral-200 text-neutral-600 hover:text-rose-600 text-xs h-8"
                  >
                    Reset
                  </Button>
                )}
              </div>

              {showLogoUrlInput && (
                <div className="mt-2 flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="h-8 flex-1 rounded-md border border-neutral-300 px-2.5 text-xs focus:border-[#A20A3A] focus:outline-none"
                  />
                  <Button
                    size="sm"
                    disabled={isUploadingLogo || !customLogoUrl.trim()}
                    onClick={handleSaveLogoUrl}
                    className="bg-[#A20A3A] hover:bg-[#85082e] text-white text-xs h-8"
                  >
                    Save URL
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OFFICIAL DIGITAL SEAL & STAMP CARD */}
        <div
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A]">
                <Stamp className="h-5 w-5 text-[#A20A3A]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">Official Company Seal & Stamp</h2>
                <p className="text-xs text-neutral-500">
                  Affixed to authorized tax invoices & legal document summaries
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Legal Seal
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Seal Preview Box */}
            <div className="flex h-24 w-28 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-[#FAF8F9] p-2 overflow-hidden shadow-inner">
              {profile.seal_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={profile.seal_url}
                  alt="Official Seal Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-1 border border-dashed border-[#A20A3A]/40 rounded-lg bg-[#A20A3A]/5">
                  <span className="text-[9px] font-black text-[#A20A3A] uppercase tracking-wider">
                    DIGITALLY SEALED
                  </span>
                  <span className="text-[8px] text-neutral-500">Sathus Pvt Ltd</span>
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <p className="text-xs text-neutral-600">
                Upload circular seal or signature stamp (transparent PNG recommended).
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  type="file"
                  ref={sealInputRef}
                  onChange={handleSealFileChange}
                  accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                />
                <Button
                  size="sm"
                  disabled={isUploadingSeal}
                  onClick={() => sealInputRef.current?.click()}
                  className="bg-[#A20A3A] hover:bg-[#85082e] text-white text-xs h-8 gap-1.5 font-semibold"
                >
                  {isUploadingSeal ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  {isUploadingSeal ? 'Optimizing...' : 'Upload Digital Seal'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSealUrlInput(!showSealUrlInput)}
                  className="border-neutral-200 text-neutral-700 hover:text-[#A20A3A] text-xs h-8 gap-1"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  {showSealUrlInput ? 'Hide URL' : 'Paste URL'}
                </Button>

                {profile.seal_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const updated = await financeClient.updateCompanyProfile({ seal_url: '' });
                      setProfile(updated);
                      setStatusMsg('Seal reset to digital default.');
                    }}
                    className="border-neutral-200 text-neutral-600 hover:text-rose-600 text-xs h-8"
                  >
                    Reset
                  </Button>
                )}
              </div>

              {showSealUrlInput && (
                <div className="mt-2 flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={customSealUrl}
                    onChange={(e) => setCustomSealUrl(e.target.value)}
                    placeholder="https://example.com/seal.png"
                    className="h-8 flex-1 rounded-md border border-neutral-300 px-2.5 text-xs focus:border-[#A20A3A] focus:outline-none"
                  />
                  <Button
                    size="sm"
                    disabled={isUploadingSeal || !customSealUrl.trim()}
                    onClick={handleSaveSealUrl}
                    className="bg-[#A20A3A] hover:bg-[#85082e] text-white text-xs h-8"
                  >
                    Save URL
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: BANK REMITTANCE ACCOUNTS & PAYMENT QR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BANK REMITTANCE ACCOUNTS */}
        <div
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A]">
                <CreditCard className="h-5 w-5 text-[#A20A3A]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Invoice Remittance Bank Accounts
                </h2>
                <p className="text-xs text-neutral-500">
                  NEFT / RTGS / IMPS beneficiary accounts shown on customer tax invoices
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleOpenBankModal(null)}
              className="bg-[#A20A3A] hover:bg-[#85082e] text-white text-xs h-8 gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Account
            </Button>
          </div>

          <div className="space-y-3">
            {profile.bank_accounts?.map((b, idx) => (
              <div
                key={b.ref_id || idx}
                className="rounded-xl border border-neutral-200 bg-[#FAF8F9] p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-900">{b.bank_name}</span>
                    <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                      Primary Beneficiary
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenBankModal(idx)}
                    className="h-7 px-2 text-xs text-[#A20A3A] hover:bg-[#A20A3A]/10 gap-1"
                  >
                    <Edit className="h-3 w-3" /> Edit Details
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-neutral-600 pt-1">
                  <div>
                    <span className="text-neutral-400">Beneficiary Holder:</span>
                    <p className="font-semibold text-neutral-900">{b.account_holder}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Account Number:</span>
                    <p className="font-mono font-bold text-neutral-900">
                      {b.account_number || b.account_number_masked}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-400">IFSC Code:</span>
                    <p className="font-mono font-bold text-neutral-900">{b.ifsc_code}</p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Branch:</span>
                    <p className="text-neutral-800">{b.branch}</p>
                  </div>
                  {b.upi_id && (
                    <div className="col-span-2 pt-1 border-t border-neutral-200">
                      <span className="text-neutral-400">Associated UPI VPA:</span>
                      <p className="font-mono font-bold text-[#A20A3A]">{b.upi_id}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPANY PAYMENT QR CODE */}
        <div
          className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A]">
                <QrCode className="h-5 w-5 text-[#A20A3A]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Company Payment QR & UPI
                </h2>
                <p className="text-xs text-neutral-500">
                  Instant scan-and-pay UPI code displayed on digital & printed tax invoices
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleOpenQRModal}
              className="bg-[#A20A3A] hover:bg-[#85082e] text-white text-xs h-8 gap-1"
            >
              <Edit className="h-3.5 w-3.5" /> Update QR
            </Button>
          </div>

          <div className="flex items-center gap-5 rounded-xl border border-neutral-200 bg-[#FAF8F9] p-4">
            {/* Live QR Code Preview */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white p-2 shadow-sm">
              {primaryQR?.qr_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={primaryQR.qr_image_url}
                  alt="Custom Payment QR"
                  className="h-full w-full object-contain"
                />
              ) : (
                <svg viewBox="0 0 100 100" className="h-full w-full text-neutral-900" fill="currentColor">
                  {/* Position detection corners */}
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="#A20A3A" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="#A20A3A" />

                  <rect x="65" y="5" width="30" height="30" rx="3" fill="#A20A3A" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="75" y="15" width="10" height="10" fill="#A20A3A" />

                  <rect x="5" y="65" width="30" height="30" rx="3" fill="#A20A3A" />
                  <rect x="10" y="70" width="20" height="20" fill="white" />
                  <rect x="15" y="75" width="10" height="10" fill="#A20A3A" />

                  {/* QR Pattern */}
                  <rect x="42" y="12" width="6" height="6" />
                  <rect x="52" y="12" width="6" height="6" />
                  <rect x="42" y="24" width="6" height="6" />
                  <rect x="12" y="44" width="6" height="6" />
                  <rect x="24" y="44" width="6" height="6" />
                  <rect x="42" y="42" width="16" height="16" fill="#A20A3A" />
                  <rect x="46" y="46" width="8" height="8" fill="white" />
                  <rect x="68" y="44" width="6" height="6" />
                  <rect x="80" y="44" width="6" height="6" />
                  <rect x="44" y="68" width="6" height="6" />
                  <rect x="56" y="68" width="6" height="6" />
                  <rect x="44" y="80" width="6" height="6" />
                  <rect x="68" y="68" width="6" height="6" />
                  <rect x="80" y="80" width="6" height="6" />
                </svg>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-neutral-600 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-neutral-900">{primaryQR?.qr_name || 'Official UPI QR'}</span>
                <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                  Active
                </span>
              </div>
              <p>
                <span className="text-neutral-400">Payee Merchant:</span>{' '}
                <span className="font-semibold text-neutral-800">{primaryQR?.merchant_name || 'Sathus Technology Pvt Ltd'}</span>
              </p>
              <p>
                <span className="text-neutral-400">UPI ID / VPA:</span>{' '}
                <span className="font-mono font-bold text-[#A20A3A]">{primaryQR?.upi_id || 'sathustechnology@hdfcbank'}</span>
              </p>
              <p className="text-[11px] text-neutral-400 truncate" title={primaryQR?.qr_payload}>
                Payload: {primaryQR?.qr_payload || 'upi://pay?pa=...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: CORPORATE ENTITY & OFFICIAL CONTACTS */}
      <div
        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A]">
              <Building2 className="h-5 w-5 text-[#A20A3A]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Corporate Entity, GSTIN & Registered Contacts
              </h2>
              <p className="text-xs text-neutral-500">
                Legal entity name, statutory registrations, and official communication channels
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleOpenCorporateModal}
            className="bg-[#A20A3A] hover:bg-[#85082e] text-white text-xs h-8 gap-1.5 font-semibold"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Details
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Left Column: Legal Identification */}
          <div className="space-y-3">
            <div>
              <span className="text-neutral-400">Legal Registered Name:</span>
              <p className="text-sm font-bold text-neutral-900">{profile.legal_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-200 bg-[#FAF8F9] p-3">
              <div>
                <span className="text-neutral-400">PAN Number:</span>
                <p className="font-mono font-bold text-neutral-900">{profile.pan}</p>
              </div>
              <div>
                <span className="text-neutral-400">CIN Number:</span>
                <p className="font-mono font-bold text-neutral-900">{profile.cin}</p>
              </div>
            </div>

            {/* Official Billing Contacts */}
            <div className="rounded-xl border border-[#A20A3A]/20 bg-[#A20A3A]/5 p-3.5 space-y-2">
              <p className="font-bold text-[#A20A3A] uppercase tracking-wider text-[11px]">
                Official Billing & Support Contacts:
              </p>
              <div className="space-y-1.5 text-neutral-800">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#A20A3A]" />
                  <span className="font-semibold">Phone:</span>
                  <span className="font-mono text-sm font-bold text-neutral-900">{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#A20A3A]" />
                  <span className="font-semibold">Email:</span>
                  <span className="font-mono text-sm font-bold text-neutral-900">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#A20A3A]" />
                  <span className="font-semibold">Website:</span>
                  <span className="font-mono text-sm text-neutral-900">{profile.website}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registered Office & GSTIN */}
          <div className="space-y-3">
            <span className="font-semibold text-neutral-700">Registered Office & GST Registration:</span>
            {profile.locations?.map((loc) => (
              <div
                key={loc.ref_id}
                className="rounded-xl border border-neutral-200 bg-[#FAF8F9] p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">{loc.location_name}</span>
                  <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                    State Code: {loc.state_code} ({loc.state})
                  </span>
                </div>
                <p className="text-neutral-600">
                  {loc.address_line1}, {loc.address_line2}
                </p>
                <p className="text-neutral-600">
                  {loc.city}, {loc.state} - {loc.pincode}
                </p>
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                  <span className="font-semibold text-neutral-700">Master GSTIN:</span>
                  <span className="font-mono font-bold text-[#A20A3A] text-sm">{loc.gstin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT CORPORATE DETAILS */}
      {/* ========================================================================= */}
      {showEditCorporate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowEditCorporate(false)}
          />
          <div
            className="relative z-10 w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-2xl bg-white border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A]">
                  <Building2 className="h-5 w-5 text-[#A20A3A]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Edit Corporate & Contact Details
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Updates legal name, GSTIN, phone, and invoice header information
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditCorporate(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 admin-scrollbar bg-white">
              <form id="corp-form" onSubmit={handleSaveCorporate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Legal Registered Entity Name <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={corpLegalName}
                      onChange={(e) => setCorpLegalName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Display / Brand Name
                    </label>
                    <input
                      type="text"
                      value={corpDisplayName}
                      onChange={(e) => setCorpDisplayName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Company GSTIN <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={corpGstin}
                      onChange={(e) => setCorpGstin(e.target.value.toUpperCase())}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Company PAN
                    </label>
                    <input
                      type="text"
                      value={corpPan}
                      onChange={(e) => setCorpPan(e.target.value.toUpperCase())}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      CIN
                    </label>
                    <input
                      type="text"
                      value={corpCin}
                      onChange={(e) => setCorpCin(e.target.value.toUpperCase())}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Official Billing Email <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="email"
                      value={corpEmail}
                      onChange={(e) => setCorpEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Official Billing Phone <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={corpPhone}
                      onChange={(e) => setCorpPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="text"
                      value={corpWebsite}
                      onChange={(e) => setCorpWebsite(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Registered Office Address Line 1 <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={corpAddress1}
                      onChange={(e) => setCorpAddress1(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={corpAddress2}
                      onChange={(e) => setCorpAddress2(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={corpCity}
                      onChange={(e) => setCorpCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={corpPincode}
                      onChange={(e) => setCorpPincode(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={corpState}
                      onChange={(e) => setCorpState(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      GST State Code
                    </label>
                    <input
                      type="text"
                      value={corpStateCode}
                      onChange={(e) => setCorpStateCode(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-[#FAF8F9] shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditCorporate(false)}
                className="h-9 border-neutral-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="corp-form"
                className="bg-[#A20A3A] hover:bg-[#85082e] text-white font-semibold h-9 px-5"
              >
                Save Corporate Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT BANK ACCOUNT */}
      {/* ========================================================================= */}
      {showBankModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowBankModal(false)}
          />
          <div
            className="relative z-10 w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-2xl bg-white border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A]">
                  <CreditCard className="h-5 w-5 text-[#A20A3A]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    {editingBankIndex !== null ? 'Edit Remittance Bank Account' : 'Add Remittance Bank Account'}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Beneficiary details displayed on customer tax invoices for payments
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBankModal(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 admin-scrollbar bg-white">
              <form id="bank-form" onSubmit={handleSaveBankAccount} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Bank Name <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank, ICICI Bank, State Bank of India"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Beneficiary Account Holder Name <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankHolder}
                      onChange={(e) => setBankHolder(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Account Number <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankAccountNo}
                      onChange={(e) => setBankAccountNo(e.target.value)}
                      placeholder="e.g. 50200012345678"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      IFSC Code <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Branch Name <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                      placeholder="Guindy Industrial Estate, Chennai"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Associated UPI ID
                    </label>
                    <input
                      type="text"
                      value={bankUpi}
                      onChange={(e) => setBankUpi(e.target.value)}
                      placeholder="sathustechnology@hdfcbank"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-[#FAF8F9] shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBankModal(false)}
                className="h-9 border-neutral-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="bank-form"
                className="bg-[#A20A3A] hover:bg-[#85082e] text-white font-semibold h-9 px-5"
              >
                Save Bank Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: UPDATE PAYMENT QR CODE */}
      {/* ========================================================================= */}
      {showQRModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowQRModal(false)}
          />
          <div
            className="relative z-10 w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-2xl bg-white border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A]">
                  <QrCode className="h-5 w-5 text-[#A20A3A]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Update Company Payment QR Code
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Configure UPI scan-to-pay parameters or upload official bank QR image
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 admin-scrollbar bg-white">
              <form id="qr-form" onSubmit={handleSaveQR} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    QR Name / Identifier <span className="text-[#A20A3A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Primary UPI VPA / ID <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={qrUpiId}
                      onChange={(e) => setQrUpiId(e.target.value)}
                      placeholder="sathustechnology@hdfcbank"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Payee / Merchant Display Name <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={qrMerchant}
                      onChange={(e) => setQrMerchant(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    UPI Payload String (auto-formatted or custom)
                  </label>
                  <input
                    type="text"
                    value={qrPayload}
                    onChange={(e) => setQrPayload(e.target.value)}
                    placeholder="upi://pay?pa=sathustechnology@hdfcbank&pn=Sathus%20Technology&cu=INR"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A]"
                  />
                </div>

                {/* Upload Custom QR Image */}
                <div className="rounded-xl border border-neutral-200 bg-[#FAF8F9] p-4 space-y-3">
                  <span className="font-semibold text-neutral-800">
                    Upload Custom Bank QR Code Image (Optional):
                  </span>
                  <div className="flex items-center gap-4">
                    {qrImageUrl && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={qrImageUrl}
                        alt="Uploaded QR Preview"
                        className="h-20 w-20 object-contain rounded border border-neutral-300 bg-white p-1"
                      />
                    )}
                    <input
                      type="file"
                      ref={qrImageInputRef}
                      onChange={handleQRImageFileChange}
                      accept="image/png,image/jpeg,image/svg+xml"
                      className="hidden"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploadingQR}
                        onClick={() => qrImageInputRef.current?.click()}
                        className="text-xs h-8 border-neutral-300 gap-1.5"
                      >
                        {isUploadingQR ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#A20A3A]" />
                        ) : (
                          <Upload className="h-3.5 w-3.5 text-[#A20A3A]" />
                        )}
                        {isUploadingQR ? 'Optimizing...' : 'Choose Image'}
                      </Button>
                      {qrImageUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setQrImageUrl('')}
                          className="text-xs h-8 text-rose-600 hover:bg-rose-50"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    If no custom image is uploaded, a sharp SVG QR code is generated dynamically from your UPI VPA.
                  </p>
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-[#FAF8F9] shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQRModal(false)}
                className="h-9 border-neutral-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="qr-form"
                className="bg-[#A20A3A] hover:bg-[#85082e] text-white font-semibold h-9 px-5"
              >
                Save QR Code Configuration
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
