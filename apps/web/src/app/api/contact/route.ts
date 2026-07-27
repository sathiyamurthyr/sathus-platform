import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/features/contact/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    const leadId = crypto.randomUUID();
    console.log('[Contact Submission]', { leadId, email: validatedData.email, company: validatedData.company });

    return NextResponse.json({
      success: true,
      leadId,
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
