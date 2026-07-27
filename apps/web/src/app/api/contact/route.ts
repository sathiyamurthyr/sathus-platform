import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/features/contact/validation';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

async function ensureLeadsFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(LEADS_FILE);
    } catch {
      await fs.writeFile(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring leads file:', error);
  }
}

async function getLeads() {
  await ensureLeadsFile();
  try {
    const data = await fs.readFile(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveLead(lead: Record<string, unknown>) {
  const leads = await getLeads();
  leads.unshift(lead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    const leadRecord = {
      id: crypto.randomUUID(),
      ...validatedData,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    await saveLead(leadRecord);

    console.log('[Contact Submission Received]', {
      id: leadRecord.id,
      email: validatedData.email,
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      company: validatedData.company,
      inquiryType: validatedData.inquiryType,
    });

    return NextResponse.json({
      success: true,
      leadId: leadRecord.id,
      message: 'Strategy session request received successfully',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid form submission' },
      { status: 400 }
    );
  }
}
