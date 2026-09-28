import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/features/contact/validation';
import { dispatchAllLeadNotifications, LeadPayload } from '@/lib/notifications/webhook-dispatcher';
import fs from 'fs/promises';
import path from 'path';

function getPossibleFilePaths() {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'data', 'leads.json'),
    path.join(cwd, 'apps', 'web', 'data', 'leads.json'),
    path.join(cwd, '..', 'data', 'leads.json'),
  ];
}

async function getLeads(): Promise<LeadPayload[]> {
  const possiblePaths = getPossibleFilePaths();
  for (const filePath of possiblePaths) {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Continue searching
    }
  }
  return [];
}

async function saveLead(lead: LeadPayload) {
  const possiblePaths = getPossibleFilePaths();
  const filePath = possiblePaths[0];
  try {
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });
    const leads = await getLeads();
    leads.unshift(lead);
    await fs.writeFile(filePath, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save lead file:', err);
  }
}

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json({ success: true, leads: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    const leadRecord: LeadPayload = {
      id: crypto.randomUUID(),
      ...validatedData,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Save lead to persistent leads.json
    await saveLead(leadRecord);

    // Dispatch async webhook notifications
    await dispatchAllLeadNotifications(leadRecord);

    return NextResponse.json({
      success: true,
      leadId: leadRecord.id,
      message: 'Strategy session request received and notifications dispatched successfully',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid form submission' },
      { status: 400 }
    );
  }
}
