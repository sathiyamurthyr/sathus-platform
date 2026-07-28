import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export interface SubscriberPayload {
  id: string;
  email: string;
  source?: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
}

function getSubscribersFilePath() {
  const rootData = path.join(process.cwd(), 'data', 'subscribers.json');
  const webData = path.join(process.cwd(), 'apps', 'web', 'data', 'subscribers.json');
  return fs.access(webData).then(() => webData).catch(() => rootData);
}

async function getSubscribers(): Promise<SubscriberPayload[]> {
  try {
    const filePath = await getSubscribersFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscriber(subscriber: SubscriberPayload) {
  const filePath = await getSubscribersFilePath();
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });
  const subscribers = await getSubscribers();
  
  // Check if already subscribed
  const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === subscriber.email.toLowerCase());
  if (existingIndex >= 0) {
    subscribers[existingIndex].status = 'active';
  } else {
    subscribers.unshift(subscriber);
  }

  await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), 'utf-8');
  return subscribers;
}

export async function GET() {
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source = 'Newsletter Form' } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const subscriberRecord: SubscriberPayload = {
      id: crypto.randomUUID(),
      email: email.trim().toLowerCase(),
      source,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await saveSubscriber(subscriberRecord);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Sathus Technology engineering updates!',
      subscriber: subscriberRecord,
    });
  } catch (error) {
    console.error('Subscriber API error:', error);
    return NextResponse.json(
      { success: false, error: 'Subscription failed' },
      { status: 500 }
    );
  }
}
