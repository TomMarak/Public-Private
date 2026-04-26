import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@payloadcms/next';
import { verifyStripeSignature, getStripeClient } from '@/lib/stripe';
import config from '../../../../payload.config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    let event;
    try {
      event = verifyStripeSignature(body, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = await getPayload({ config });

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          // Update order status to paid
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              status: 'paid',
            },
          });

          console.log(`Order ${orderId} marked as paid`);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        const failedOrderId = failedPaymentIntent.metadata.orderId;

        if (failedOrderId) {
          // Update order status to cancelled
          await payload.update({
            collection: 'orders',
            id: failedOrderId,
            data: {
              status: 'cancelled',
            },
          });

          console.log(`Order ${failedOrderId} marked as cancelled due to payment failure`);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
