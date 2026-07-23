'use client';

import React, { useState } from 'react';
import {
  Code,
  Key,
  Plus,
  RefreshCw,
  Copy,
  CheckCircle2,
  Globe,
  Sliders,
  Terminal,
  Activity,
  Webhook,
  Layers,
  FileCode,
  Check,
} from 'lucide-react';
import { mockDeveloperApps, mockAPIKeys, mockWebhooks } from '../../data/mock-developer-data';
import type { DeveloperApp, APIKeyItem, WebhookSubscription, APIKeyType } from '../../types';

export function DeveloperPortalManagerView() {
  const [apps] = useState<DeveloperApp[]>(mockDeveloperApps);
  const [keys, setKeys] = useState<APIKeyItem[]>(mockAPIKeys);
  const [webhooks] = useState<WebhookSubscription[]>(mockWebhooks);

  // Selected language for code snippet generator
  const [selectedLang, setSelectedLang] = useState<'curl' | 'python' | 'typescript' | 'go' | 'java' | 'csharp'>('curl');

  // Key creation modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<APIKeyType>('server');
  const [newKeyAppId, setNewKeyAppId] = useState('app-101');
  const [newKeyRateLimit, setNewKeyRateLimit] = useState(1200);

  const [notice, setNotice] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleRotateKey = (id: string) => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              maskedKey: `${k.keyPrefix}********************${randomHex}`,
              lastUsedAt: new Date().toISOString(),
            }
          : k
      )
    );
    setNotice(`API Key "${id}" secret rotated successfully.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCreateAPIKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const app = apps.find((a) => a.id === newKeyAppId);
    const prefix = newKeyType === 'server' ? 'sk_live_' : 'pk_live_';
    const newKey: APIKeyItem = {
      id: `key-${Date.now()}`,
      appId: newKeyAppId,
      appName: app?.name || 'Developer Application',
      name: newKeyName,
      keyPrefix: prefix,
      maskedKey: `${prefix}********************${Math.random().toString(36).substring(2, 6)}`,
      keyType: newKeyType,
      scopes: ['api:read', 'api:write'],
      rateLimitPerMin: Number(newKeyRateLimit),
      lastUsedAt: 'Never',
      expiresAt: null,
      status: 'active',
    };

    setKeys((prev) => [newKey, ...prev]);
    setShowKeyModal(false);
    setNewKeyName('');
    setNotice(`API Key "${newKey.name}" generated successfully.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const codeSnippets: Record<string, string> = {
    curl: `curl -X GET "https://api.sathus.cloud/v1/analytics/overview" \\
  -H "Authorization: Bearer sk_live_acme_********************4a9b" \\
  -H "Content-Type: application/json"`,
    python: `import requests

headers = {
    "Authorization": "Bearer sk_live_acme_********************4a9b",
    "Content-Type": "application/json"
}
response = requests.get("https://api.sathus.cloud/v1/analytics/overview", headers=headers)
print(response.json())`,
    typescript: `import { SathusClient } from '@sathus/sdk';

const client = new SathusClient({
  apiKey: process.env.SATHUS_API_KEY,
});

const analytics = await client.analytics.getOverview();
// Process analytics overview response`,
    go: `package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    req, _ := http.NewRequest("GET", "https://api.sathus.cloud/v1/analytics/overview", nil)
    req.Header.Set("Authorization", "Bearer sk_live_acme_********************4a9b")
    resp, _ := http.DefaultClient.Do(req)
    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`,
    java: `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.sathus.cloud/v1/analytics/overview"))
    .header("Authorization", "Bearer sk_live_acme_********************4a9b")
    .GET()
    .build();

HttpResponse<String> response = HttpClient.newHttpClient()
    .send(request, HttpResponse.BodyHandlers.ofString());`,
    csharp: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer sk_live_acme_********************4a9b");

var response = await client.GetAsync("https://api.sathus.cloud/v1/analytics/overview");
var result = await response.Content.ReadAsStringAsync();`,
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(codeSnippets[selectedLang] || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center space-x-2">
            <Code className="w-5 h-5 text-primary" />
            <span>Enterprise Developer Portal & API Key Management</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Story 15.7 Provision API keys, manage webhook subscriptions, test OpenAPI endpoints, and monitor developer call rates.
          </p>
        </div>

        <button
          onClick={() => setShowKeyModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Key className="w-4 h-4" />
          <span>Provision New API Key</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Developer Apps Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apps.map((app) => (
          <div key={app.id} className="bg-card border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{app.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {app.environment}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{app.description}</p>
            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>{app.keyCount} Active Keys</span>
              <span>Monthly Volume: <strong className="text-primary">{(app.monthlyCalls / 1000).toFixed(1)}k calls</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Active API Keys Directory Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Key className="w-4 h-4 text-primary" />
          <span>Active API Key Registry & Rotation Engine</span>
        </h3>

        <div className="divide-y divide-border">
          {keys.map((k) => (
            <div key={k.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">{k.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                    {k.keyType}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-500 font-bold">{k.maskedKey}</div>
                <div className="text-[10px] text-muted-foreground">
                  App: {k.appName} • Rate Limit: {k.rateLimitPerMin} req/min • Last used: {k.lastUsedAt}
                </div>
              </div>

              <button
                onClick={() => handleRotateKey(k.id)}
                className="px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-muted/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                <span>Rotate Key</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* OpenAPI Explorer & Multi-Language Code Snippets Generator */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span>OpenAPI Snippet Generator</span>
          </h3>

          {/* Language selector tabs */}
          <div className="flex items-center space-x-1.5 bg-background p-1 rounded-lg border border-border">
            {[
              { id: 'curl', label: 'cURL' },
              { id: 'python', label: 'Python' },
              { id: 'typescript', label: 'TypeScript' },
              { id: 'go', label: 'Go' },
              { id: 'java', label: 'Java' },
              { id: 'csharp', label: 'C#' },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id as any)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded transition-colors ${
                  selectedLang === lang.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative bg-muted/40 rounded-xl p-4 font-mono text-xs text-foreground overflow-x-auto">
          <button
            onClick={handleCopySnippet}
            className="absolute right-3 top-3 p-1.5 rounded bg-background border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{copiedCode ? 'Copied!' : 'Copy'}</span>
          </button>
          <pre>{codeSnippets[selectedLang]}</pre>
        </div>
      </div>

      {/* Webhook Subscription Manager */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center space-x-2 border-b border-border pb-3">
          <Webhook className="w-4 h-4 text-primary" />
          <span>Webhook Subscriptions</span>
        </h3>

        <div className="divide-y divide-border">
          {webhooks.map((wh) => (
            <div key={wh.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold font-mono text-foreground">{wh.targetUrl}</div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  Events: {wh.subscribedEvents.join(', ')} • Secret: {wh.secretMasked}
                </div>
              </div>

              <div className="text-xs font-mono text-emerald-500 font-bold">
                {wh.deliverySuccessPercent}% Delivery SLA
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provision API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center space-x-2">
                <Key className="w-5 h-5 text-primary" />
                <span>Provision API Key</span>
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAPIKey} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Parent Application</label>
                <select
                  value={newKeyAppId}
                  onChange={(e) => setNewKeyAppId(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                >
                  {apps.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.environment})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">API Key Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Analytics Exporter Production Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Key Type</label>
                  <select
                    value={newKeyType}
                    onChange={(e) => setNewKeyType(e.target.value as APIKeyType)}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground"
                  >
                    <option value="server">Server Secret (sk_live)</option>
                    <option value="client">Client Public (pk_test)</option>
                    <option value="read_only">Read Only</option>
                    <option value="admin">Admin Privilege</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Rate Limit (req/min)</label>
                  <input
                    type="number"
                    value={newKeyRateLimit}
                    onChange={(e) => setNewKeyRateLimit(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg p-2.5 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:bg-muted/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                >
                  Provision Secret Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
