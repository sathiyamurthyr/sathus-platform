'use client';

import * as React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { Button } from '@/components/ui/button';
import { Mail, Building2, Calendar, Phone, Globe, Filter, RefreshCw, Inbox, Users, Download, Search } from 'lucide-react';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone?: string;
  country: string;
  industry: string;
  companySize: string;
  serviceInterested?: string;
  message: string;
  inquiryType: string;
  status: string;
  createdAt: string;
}

interface Subscriber {
  id: string;
  email: string;
  source?: string;
  status: string;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [activeView, setActiveView] = React.useState<'leads' | 'subscribers'>('leads');
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterType, setFilterType] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, subsRes] = await Promise.all([
        fetch('/api/contact').catch(() => null),
        fetch('/api/subscribe').catch(() => null),
      ]);

      if (leadsRes && leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
      }

      if (subsRes && subsRes.ok) {
        const subsData = await subsRes.json();
        setSubscribers(subsData.subscribers || []);
      }
    } catch (err) {
      console.error('Failed to load lead & subscriber data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredLeads = leads.filter((l) => {
    const matchesFilter = filterType === 'all' || l.inquiryType === filterType;
    const matchesSearch = !searchQuery || 
      `${l.firstName} ${l.lastName} ${l.email} ${l.company} ${l.message}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredSubscribers = subscribers.filter((s) => {
    return !searchQuery || `${s.email} ${s.source}`.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleExportData = () => {
    const exportData = activeView === 'leads' ? leads : subscribers;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${activeView}-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="container mx-auto px-4 pt-3 pb-16 space-y-8">
      <Breadcrumb items={[{ label: 'Admin Dashboard' }, { label: 'Leads & Subscriber Management' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Enterprise Leads & Subscribers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time management dashboard for incoming customer inquiries, strategy session bookings, and newsletter subscribers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportData} disabled={activeView === 'leads' ? leads.length === 0 : subscribers.length === 0} className="gap-2">
            <Download className="h-4 w-4" />
            Export {activeView === 'leads' ? 'Leads' : 'Subscribers'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center border-b border-border/80 gap-6">
        <button
          onClick={() => setActiveView('leads')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeView === 'leads'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Inbox className="h-4 w-4" />
          Strategy Session Leads ({leads.length})
        </button>

        <button
          onClick={() => setActiveView('subscribers')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeView === 'subscribers'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" />
          Newsletter Subscribers ({subscribers.length})
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeView === 'leads' ? 'leads by name, email, company...' : 'subscribers by email...'}`}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-xs md:text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {activeView === 'leads' && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Type:
            </span>
            {['all', 'strategy-session', 'product-demo', 'general', 'partnership'].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(type)}
                className="capitalize text-xs h-8 rounded-lg"
              >
                {type === 'all' ? 'All' : type.replace('-', ' ')}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Inbox className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl font-bold text-foreground">{leads.length}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Strategy Sessions</p>
            <p className="text-2xl font-bold text-foreground">
              {leads.filter((l) => l.inquiryType === 'strategy-session').length}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Subscribers</p>
            <p className="text-2xl font-bold text-foreground">{subscribers.length}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
          Loading requests...
        </div>
      ) : activeView === 'leads' ? (
        /* LEADS VIEW */
        filteredLeads.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center space-y-3">
            <Inbox className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">No original requests received yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Real customer strategy session submissions from <Link href="/book-strategy-session" className="text-primary hover:underline">/book-strategy-session</Link> or AI Chat will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-border bg-card p-6 space-y-4 transition-colors hover:border-primary/40 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                      {lead.inquiryType || 'general'}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      ID: {lead.id.slice(0, 8)}...
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {new Date(lead.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="font-bold text-sm text-foreground mb-1">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                      <a href={`mailto:${lead.email}`} className="hover:underline font-medium text-foreground">
                        {lead.email}
                      </a>
                    </p>
                    {lead.phone && (
                      <p className="text-muted-foreground flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {lead.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-sm text-foreground mb-1 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-primary shrink-0" />
                      {lead.company}
                    </p>
                    <p className="text-muted-foreground mb-1">Role: <span className="font-medium text-foreground">{lead.jobTitle}</span></p>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      {lead.country} • {lead.industry} ({lead.companySize} emp)
                    </p>
                  </div>

                  <div>
                    {lead.serviceInterested && (
                      <div className="mb-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Service Interest</span>
                        <span className="font-semibold text-primary">{lead.serviceInterested}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-muted/40 p-4 border border-border/40 text-xs leading-relaxed">
                  <span className="font-bold text-foreground block mb-1">Message / Agenda:</span>
                  <p className="text-muted-foreground whitespace-pre-wrap">{lead.message}</p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* SUBSCRIBERS VIEW */
        filteredSubscribers.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center space-y-3">
            <Users className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">No newsletter subscribers yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Real visitor subscriptions from the engineering blog will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 text-foreground font-bold border-b border-border uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Signup Source</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Subscribed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-bold text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <a href={`mailto:${sub.email}`} className="hover:underline">
                          {sub.email}
                        </a>
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">
                        {sub.source || 'Newsletter Form'}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 uppercase">
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
