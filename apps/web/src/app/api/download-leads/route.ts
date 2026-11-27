import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export interface DownloadLeadPayload {
  id: string;
  name: string;
  email: string;
  resourceTitle: string;
  resourceSlug: string;
  createdAt: string;
}

function getPossibleFilePaths() {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'data', 'leads.json'),
    path.join(cwd, 'apps', 'web', 'data', 'leads.json'),
    path.join(cwd, '..', 'data', 'leads.json'),
  ];
}

async function saveToFile(lead: DownloadLeadPayload) {
  const possiblePaths = getPossibleFilePaths();
  const filePath = possiblePaths[0];
  try {
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });

    let leads: unknown[] = [];
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      leads = JSON.parse(data);
    } catch {
      leads = [];
    }

    const leadRecord = {
      id: lead.id,
      firstName: lead.name.split(' ')[0] || lead.name,
      lastName: lead.name.split(' ').slice(1).join(' ') || '',
      email: lead.email,
      company: 'Resource Download',
      jobTitle: 'Data Engineer / Candidate',
      country: 'Online',
      industry: 'Data & Cloud',
      companySize: 'Unknown',
      message: `Downloaded resource: ${lead.resourceTitle}`,
      inquiryType: 'Resource Download',
      status: 'new',
      createdAt: lead.createdAt,
    };

    leads.unshift(leadRecord);
    await fs.writeFile(filePath, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to append to leads.json:', err);
  }
}

// Auto-initialize Postgres table
let tableInitialized = false;
async function initTable() {
  if (tableInitialized) return;
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS download_leads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        resource_title VARCHAR(500),
        resource_slug VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    tableInitialized = true;
  } catch (err) {
    console.error('Failed to initialize download_leads table:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, resourceTitle = 'Handbook', resourceSlug = 'general' } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const leadId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const lead: DownloadLeadPayload = {
      id: leadId,
      name: trimmedName,
      email: trimmedEmail,
      resourceTitle,
      resourceSlug,
      createdAt,
    };

    // 1. Save to PostgreSQL database
    try {
      await initTable();
      await query(
        `INSERT INTO download_leads (id, name, email, resource_title, resource_slug, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [lead.id, lead.name, lead.email, lead.resourceTitle, lead.resourceSlug, lead.createdAt]
      );
    } catch (dbErr) {
      console.error('PostgreSQL insert warning (fallback to file):', dbErr);
    }

    // 2. Save to leads.json for admin dashboard
    await saveToFile(lead);

    return NextResponse.json({
      success: true,
      message: 'Lead registered successfully. Download unlocked.',
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    console.error('Error processing download lead:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initTable();
    const leads = await query(
      `SELECT * FROM download_leads ORDER BY created_at DESC LIMIT 200`
    );
    return NextResponse.json({ success: true, leads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: message, leads: [] }, { status: 500 });
  }
}
