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

function getPossibleFilePaths() {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'data', 'subscribers.json'),
    path.join(cwd, 'apps', 'web', 'data', 'subscribers.json'),
    path.join(cwd, '..', 'data', 'subscribers.json'),
  ];
}

async function getSubscribers(): Promise<SubscriberPayload[]> {
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

async function saveSubscriber(subscriber: SubscriberPayload) {
  const possiblePaths = getPossibleFilePaths();
  const filePath = possiblePaths[0];
  try {
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });
    const subscribers = await getSubscribers();
    
    const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === subscriber.email.toLowerCase());
    if (existingIndex >= 0) {
      subscribers[existingIndex].status = 'active';
    } else {
      subscribers.unshift(subscriber);
    }

    await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save subscriber file:', err);
  }
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
    return NextResponse.json({
      success: true,
      count: 0,
      subscribers: [],
    });
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
