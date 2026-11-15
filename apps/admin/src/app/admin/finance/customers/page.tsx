'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  CheckCircle2,
  Search,
  Mail,
  Phone,
  MapPin,
  Building,
  Edit,
  X,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinanceNavHeader } from '@/components/finance/FinanceNavHeader';
import { financeClient } from '@/lib/finance-client';
import { FinanceCustomer } from '@/types/finance';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<FinanceCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<FinanceCustomer | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form State
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [stateCode, setStateCode] = useState('33');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const c = await financeClient.getCustomers();
      setCustomers(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Prevent background body scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showModal]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setLegalName('');
    setTradeName('');
    setGstin('');
    setPan('');
    setState('Tamil Nadu');
    setStateCode('33');
    setEmail('');
    setPhone('');
    setAddress('');
    setShowModal(true);
  };

  const handleOpenEdit = (c: FinanceCustomer) => {
    setEditingCustomer(c);
    setLegalName(c.legal_name || c.customer_name || c.legal_company_name || '');
    setTradeName(c.trade_name || c.legal_name || c.customer_name || '');
    setGstin(c.gstin || '');
    setPan(c.pan || '');
    setState(c.state || 'Tamil Nadu');
    setStateCode(c.state_code || '33');
    setEmail(c.contact_email || c.email || '');
    setPhone(c.contact_phone || c.phone || '');
    setAddress(c.billing_address_line1 || c.billing_address || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCustomer) {
      // Update existing customer
      try {
        await financeClient.updateCustomer(editingCustomer.ref_id, {
          customer_name: legalName,
          legal_company_name: legalName,
          legal_name: legalName,
          trade_name: tradeName || legalName,
          gstin: gstin.toUpperCase(),
          pan: pan.toUpperCase() || (gstin ? gstin.substring(2, 12) : ''),
          state: state,
          state_code: stateCode,
          billing_address: address,
          billing_address_line1: address,
          contact_email: email,
          contact_phone: phone,
          email: email,
          phone: phone,
        });
        setStatusMsg(`Customer "${legalName}" details updated successfully.`);
        setShowModal(false);
        setEditingCustomer(null);
        await loadData();
      } catch {
        setStatusMsg('Failed to update customer details.');
      }
    } else {
      // Create new customer
      const newCust: Partial<FinanceCustomer> = {
        customer_code: `CUST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customer_name: legalName,
        legal_company_name: legalName,
        legal_name: legalName,
        trade_name: tradeName || legalName,
        gstin: gstin.toUpperCase(),
        pan: pan.toUpperCase() || (gstin ? gstin.substring(2, 12) : ''),
        state: state,
        state_code: stateCode,
        billing_address: address,
        billing_address_line1: address,
        contact_email: email,
        contact_phone: phone,
        email: email,
        phone: phone,
        status: 'ACTIVE',
      };

      try {
        await financeClient.createCustomer(newCust);
        setStatusMsg(`Customer "${legalName}" registered successfully.`);
        setShowModal(false);
        await loadData();
      } catch {
        setStatusMsg('Failed to create customer.');
      }
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (c.legal_name || c.customer_name || c.legal_company_name || '').toLowerCase();
    const trade = (c.trade_name || '').toLowerCase();
    const gstinVal = (c.gstin || '').toLowerCase();
    const panVal = (c.pan || '').toLowerCase();
    const emailVal = (c.contact_email || c.email || '').toLowerCase();
    const phoneVal = (c.contact_phone || c.phone || '').toLowerCase();
    const codeVal = (c.customer_code || '').toLowerCase();
    return (
      name.includes(q) ||
      trade.includes(q) ||
      gstinVal.includes(q) ||
      panVal.includes(q) ||
      emailVal.includes(q) ||
      phoneVal.includes(q) ||
      codeVal.includes(q)
    );
  });

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
      <FinanceNavHeader />

      {/* Header and Add Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Customer Accounts & CRM
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            B2B Enterprise clients, GSTIN verification, Place of Supply mappings, and billing profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="gap-1.5 bg-[#A20A3A] hover:bg-[#85082e] text-white shadow-sm font-semibold h-9 px-4"
          >
            <Plus className="h-4 w-4" /> Add Client Account
          </Button>
        </div>
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

      {/* SEARCH BAR */}
      <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 shadow-sm max-w-md">
        <Search className="h-4 w-4 text-neutral-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by legal name, trade name, GSTIN, PAN or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-neutral-400 hover:text-neutral-600 px-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* CUSTOMERS GRID - Structured & Aligned Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((c) => (
          <div
            key={c.ref_id}
            className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm hover:border-[#A20A3A]/40 hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <div>
              {/* Card Header: Entity Name on Left, Badge & Edit Button on Right */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h3
                    className="font-bold text-sm text-neutral-900 truncate"
                    title={c.legal_name || c.customer_name || c.legal_company_name}
                  >
                    {c.legal_name || c.customer_name || c.legal_company_name}
                  </h3>
                  <p
                    className="text-xs text-neutral-500 truncate mt-0.5"
                    title={c.trade_name || 'Direct Enterprise Client'}
                  >
                    {c.trade_name || 'Direct Enterprise Client'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {c.status || 'ACTIVE'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-medium text-[#A20A3A] bg-[#A20A3A]/10 hover:bg-[#A20A3A]/20 transition-colors"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                </div>
              </div>

              {/* GSTIN / PAN / State Metadata Box - Uniform Height */}
              <div className="rounded-lg bg-[#FAF8F9] border border-neutral-200/80 p-3 space-y-1.5 text-xs mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">GSTIN:</span>
                  <span className="font-mono font-bold text-neutral-900">
                    {c.gstin || 'Unregistered (B2C)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">PAN:</span>
                  <span className="font-mono text-neutral-800">
                    {c.pan || (c.gstin ? c.gstin.substring(2, 12) : '—')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 font-medium">Place of Supply:</span>
                  <span className="text-neutral-800 font-medium">
                    {c.state || 'Tamil Nadu'} ({c.state_code || '33'})
                  </span>
                </div>
              </div>

              {/* Contact Details with Overflow Protection */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div
                  className="flex items-center gap-2 min-w-0"
                  title={c.contact_email || c.email}
                >
                  <Mail className="h-3.5 w-3.5 text-[#A20A3A] shrink-0" />
                  <span className="truncate">
                    {c.contact_email || c.email || 'No email registered'}
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="h-3.5 w-3.5 text-[#A20A3A] shrink-0" />
                  <span className="truncate">
                    {c.contact_phone || c.phone || 'No phone registered'}
                  </span>
                </div>
                <div className="flex items-start gap-2 pt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-[#A20A3A] shrink-0 mt-0.5" />
                  <p
                    className="line-clamp-2 text-neutral-600 leading-snug"
                    title={c.billing_address_line1 || c.billing_address}
                  >
                    {c.billing_address_line1 || c.billing_address || 'No registered billing address'}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="font-mono">{c.customer_code}</span>
              <button
                type="button"
                onClick={() => handleOpenEdit(c)}
                className="text-xs font-semibold text-[#A20A3A] hover:underline"
              >
                Edit Customer →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && !loading && (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
          No customer records match &quot;{searchQuery}&quot;.
        </div>
      )}

      {/* CREATE / EDIT CUSTOMER MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          aria-labelledby="customer-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Separate Dark Backdrop with 50% opacity */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Container: Solid White #FFFFFF, max-w-[640px], max-h-[90vh], rounded-2xl, shadow-2xl, border */}
          <div
            className="relative z-10 w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-2xl bg-white border border-neutral-200 shadow-2xl overflow-hidden text-neutral-900"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Fixed Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A20A3A]/10 text-[#A20A3A] shrink-0">
                  <Users className="h-5 w-5 text-[#A20A3A]" />
                </div>
                <div>
                  <h2 id="customer-modal-title" className="text-base font-bold text-neutral-900">
                    {editingCustomer ? 'Edit Customer Details' : 'Register New Customer'}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {editingCustomer
                      ? `Customer Code: ${editingCustomer.customer_code}`
                      : 'B2B Enterprise client profile and GST compliance details'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 admin-scrollbar bg-white">
              <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Legal Registered Entity Name - Full Width */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Legal Registered Entity Name <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      placeholder="e.g. Apex Technologies Private Limited"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors"
                      required
                    />
                  </div>

                  {/* Trade / Brand Name - Full Width */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Trade / Brand Name
                    </label>
                    <input
                      type="text"
                      value={tradeName}
                      onChange={(e) => setTradeName(e.target.value)}
                      placeholder="e.g. Apex Cloud Solutions"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors"
                    />
                  </div>

                  {/* GSTIN - Half Width */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      GSTIN
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setGstin(val);
                        if (val.length >= 12 && !pan) {
                          setPan(val.substring(2, 12));
                        }
                        if (val.length >= 2 && !stateCode) {
                          setStateCode(val.substring(0, 2));
                        }
                      }}
                      placeholder="33AAAAA0000A1Z5"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors uppercase"
                    />
                  </div>

                  {/* PAN - Half Width */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      PAN
                    </label>
                    <input
                      type="text"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      placeholder="AAAAA0000A"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors uppercase"
                    />
                  </div>

                  {/* State (Place of Supply) - Half Width */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      State (Place of Supply) <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Tamil Nadu"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors"
                      required
                    />
                  </div>

                  {/* GST State Code - Half Width */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      GST State Code <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      placeholder="e.g. 33 for TN, 29 for KA"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm font-mono text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors"
                      required
                    />
                  </div>

                  {/* Contact Email ID - Half Width */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Contact Email ID <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="billing@client.com"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors"
                      required
                    />
                  </div>

                  {/* Contact Phone Number - Half Width */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Contact Phone Number <span className="text-[#A20A3A]">*</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-10 px-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors"
                      required
                    />
                  </div>

                  {/* Billing Address - Full Width */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Billing Address <span className="text-[#A20A3A]">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      placeholder="Enter complete registered office / billing address with PIN code"
                      className="w-full p-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#A20A3A]/20 focus:border-[#A20A3A] transition-colors"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Sticky Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-[#FAF8F9] shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="customer-form"
                className="bg-[#A20A3A] hover:bg-[#85082e] text-white shadow-sm font-semibold px-5 h-9"
              >
                {editingCustomer ? 'Save Customer Changes' : 'Register Customer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
