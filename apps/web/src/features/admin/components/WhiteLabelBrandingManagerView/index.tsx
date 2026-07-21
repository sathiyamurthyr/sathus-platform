'use client';

import React, { useState } from 'react';
import {
  Palette,
  Globe,
  Upload,
  CheckCircle2,
  Check,
  Globe2,
  Lock,
  Sparkles,
  Layers,
  Building2,
  Sliders,
} from 'lucide-react';
import { mockBrandingProfiles, mockCustomDomains } from '../../data/mock-branding-data';
import type { BrandingProfileItem, CustomDomainItem } from '../../types';

export function WhiteLabelBrandingManagerView() {
  const [profiles, setProfiles] = useState<BrandingProfileItem[]>(mockBrandingProfiles);
  const [domains, setDomains] = useState<CustomDomainItem[]>(mockCustomDomains);

  const [activeProfileId, setActiveProfileId] = useState<string>('brand-101');
  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Branding Editor Form State
  const [companyName, setCompanyName] = useState(currentProfile.companyName);
  const [primaryColor, setPrimaryColor] = useState(currentProfile.primaryColor);
  const [accentColor, setAccentColor] = useState(currentProfile.accentColor);
  const [loginMsg, setLoginMsg] = useState(currentProfile.loginMessage);

  const [notice, setNotice] = useState<string | null>(null);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId
          ? {
              ...p,
              companyName,
              primaryColor,
              accentColor,
              loginMessage: loginMsg,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    setNotice(`Branding profile for "${currentProfile.tenantName}" saved successfully.`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary" />
            <span>White Label & Custom Branding Platform</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.12 Configure tenant custom logos, HSL brand color palettes, login splash screens, and SSL custom domains.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={activeProfileId}
            onChange={(e) => {
              setActiveProfileId(e.target.value);
              const p = profiles.find((item) => item.id === e.target.value);
              if (p) {
                setCompanyName(p.companyName);
                setPrimaryColor(p.primaryColor);
                setAccentColor(p.accentColor);
                setLoginMsg(p.loginMessage);
              }
            }}
            className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-semibold text-foreground"
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                Branding: {p.tenantName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Branding Editor & Live Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <form onSubmit={handleSaveBranding} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
            <Sliders className="w-4 h-4 text-primary" />
            <span>Brand Identity Settings</span>
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Organization Display Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Primary Brand Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Accent Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-xs text-foreground font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Login Page Welcome Message</label>
            <textarea
              rows={2}
              value={loginMsg}
              onChange={(e) => setLoginMsg(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
            />
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all"
            >
              Save Branding Changes
            </button>
          </div>
        </form>

        {/* Live Brand Theme Preview */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Live Login Screen Preview</span>
          </h3>

          <div className="p-6 rounded-xl bg-background border border-border space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ backgroundColor: primaryColor }}>
              {companyName.charAt(0)}
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">{companyName}</h4>
              <p className="text-xs text-muted-foreground pt-1">{loginMsg}</p>
            </div>
            <button
              type="button"
              className="w-full py-2.5 rounded-lg text-white font-bold text-xs shadow-sm transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Sign In to {companyName}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Domains Manager */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Globe className="w-4 h-4 text-primary" />
          <span>Custom Domain Aliases & SSL Status</span>
        </h3>

        <div className="divide-y divide-border font-mono text-xs">
          {domains.map((dom) => (
            <div key={dom.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-foreground">{dom.domainName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>SSL Active</span>
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-sans">
                  Tenant: {dom.tenantName} • CNAME: <code className="text-primary">{dom.cnameRecord}</code>
                </div>
              </div>

              <div className="text-right text-[10px] text-muted-foreground">
                Expires: {new Date(dom.sslExpiresAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
