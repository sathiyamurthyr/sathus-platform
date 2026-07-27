/**
 * Webhook Notification Dispatcher
 * Dispatches lead submission alerts to Slack, Email (Resend/SendGrid), and CRM endpoints.
 */

export interface LeadPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  teamSize?: string;
  inquiryType: string;
  message: string;
  privacyConsent: boolean;
  createdAt: string;
}

export async function dispatchSlackNotification(lead: LeadPayload): Promise<boolean> {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    console.log('[Slack Webhook Simulation]', {
      channel: '#sales-leads',
      leadName: `${lead.firstName} ${lead.lastName}`,
      company: lead.company,
      email: lead.email,
      inquiryType: lead.inquiryType,
    });
    return true;
  }

  const slackPayload = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 New Enterprise Lead Submission — Sathus.in',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name:*\n${lead.firstName} ${lead.lastName}` },
          { type: 'mrkdwn', text: `*Company:*\n${lead.company}` },
          { type: 'mrkdwn', text: `*Email:*\n${lead.email}` },
          { type: 'mrkdwn', text: `*Inquiry Type:*\n${lead.inquiryType}` },
          { type: 'mrkdwn', text: `*Team Size:*\n${lead.teamSize || 'N/A'}` },
          { type: 'mrkdwn', text: `*Phone:*\n${lead.phone || 'N/A'}` },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message Details:*\n>${lead.message.replace(/\n/g, '\n>')}`,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Submitted at ${lead.createdAt} | Lead ID: \`${lead.id}\``,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });
    return response.ok;
  } catch (error) {
    console.error('Slack Webhook Error:', error);
    return false;
  }
}

export async function dispatchEmailWebhook(lead: LeadPayload): Promise<boolean> {
  const emailWebhookUrl = process.env.EMAIL_WEBHOOK_URL;
  if (!emailWebhookUrl) {
    console.log('[Email Notification Simulation (Resend/SendGrid)]', {
      to: 'hello@sathus.technology',
      subject: `New Lead: ${lead.firstName} ${lead.lastName} (${lead.company})`,
      inquiryType: lead.inquiryType,
    });
    return true;
  }

  try {
    const response = await fetch(emailWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `[Sathus Lead] ${lead.inquiryType} from ${lead.company}`,
        lead,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Email Webhook Error:', error);
    return false;
  }
}

export async function dispatchCrmWebhook(lead: LeadPayload): Promise<boolean> {
  const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;
  if (!crmWebhookUrl) {
    console.log('[CRM Integration Simulation (HubSpot/Salesforce)]', {
      leadId: lead.id,
      email: lead.email,
      company: lead.company,
    });
    return true;
  }

  try {
    const response = await fetch(crmWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    return response.ok;
  } catch (error) {
    console.error('CRM Webhook Error:', error);
    return false;
  }
}

export async function dispatchAllLeadNotifications(lead: LeadPayload): Promise<void> {
  await Promise.allSettled([
    dispatchSlackNotification(lead),
    dispatchEmailWebhook(lead),
    dispatchCrmWebhook(lead),
  ]);
}
