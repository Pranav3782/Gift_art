import { NextResponse } from 'next/server';
import { superProfile } from '@/lib/superprofile';

/**
 * @fileOverview SuperProfile Webhook Handler
 * Receives payment status updates directly from SuperProfile.
 */

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-superprofile-signature');
    const webhookSecret = process.env.SUPERPROFILE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: 'Missing signature or secret' }, { status: 401 });
    }

    const isValid = superProfile.verifyWebhookSignature(body, signature, webhookSecret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const event = JSON.parse(body);

    // Handle the event status (e.g., payment.success, payment.failed)
    console.log('SuperProfile Webhook Event Received:', event.type);

    // Update your database here...

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
