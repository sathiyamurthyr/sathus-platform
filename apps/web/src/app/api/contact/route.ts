import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/features/contact/validation';
import fs from 'fs/promises';
import path from 'path';

function getLeadsFilePath() {
  const rootData = path.join(process.cwd(), 'data', 'leads.json');
  const webData = path.join(process.cwd(), 'apps', 'web', 'data', 'leads.json');
  return fs.access(webData).then(() => webData).catch(() => rootData);
}

async function getLeads() {
  try {
    const filePath = await getLeadsFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveLead(lead: Record<string, unknown>) {
  const filePath = await getLeadsFilePath();
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });
  const leads = await getLeads();
  leads.unshift(lead);
  await fs.writeFile(filePath, JSON.stringify(leads, null, 2), 'utf-8');
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
