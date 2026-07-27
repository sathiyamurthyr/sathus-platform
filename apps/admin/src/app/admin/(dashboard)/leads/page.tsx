'use client';

import * as React from 'react';
import { Mail, Building2, Calendar, Phone, Globe, Filter, RefreshCw, UserCheck, Inbox } from 'lucide-react';

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

export default function AdminLeadsDashboardPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterType, setFilterType] = React.useState<string>('all');

  const fetchLeads = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/contact');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = filterType === 'all'
    ? leads
    : leads.filter((l) => l.inquiryType === filterType);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Strategy Session & Contact Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage incoming platform inquiries, strategy session bookings, and enterprise requests.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-2 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Filter by Type:
        </span>
        {['all', 'strategy-session', 'general', 'product-demo', 'partnership', 'careers'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`capitalize text-xs px-3 py-1 rounded-md border ${
              filterType === type ? 'bg-primary text-primary-foreground font-semibold' : 'bg-background hover:bg-muted'
            }`}
          >
            {type === 'all' ? 'All Requests' : type.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Inbox className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl font-bold">{leads.length}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Strategy Sessions</p>
            <p className="text-2xl font-bold">
              {leads.filter((l) => l.inquiryType === 'strategy-session').length}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Enterprise Leads</p>
            <p className="text-2xl font-bold">
              {leads.filter((l) => l.companySize === '201-500' || l.companySize === '501-1000' || l.companySize === '1000+').length}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          Loading requests...
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center space-y-3">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">No requests found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Submit a strategy session request from the web app to see it appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-xl border bg-card p-6 space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase tracking-wider">
                    {lead.inquiryType || 'general'}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {lead.id.slice(0, 8)}...
                  </span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(lead.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="font-bold text-sm mb-1">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <a href={`mailto:${lead.email}`} className="hover:underline font-medium">
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
                  <p className="font-bold text-sm mb-1 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    {lead.company}
                  </p>
                  <p className="text-muted-foreground mb-1">Role: <span className="font-medium">{lead.jobTitle}</span></p>
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

              <div className="rounded-lg bg-muted/40 p-4 border text-xs leading-relaxed">
                <span className="font-bold block mb-1">Message / Agenda:</span>
                <p className="text-muted-foreground whitespace-pre-wrap">{lead.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
