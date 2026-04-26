import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import Stripe from 'stripe';
import { verifyStripeSignature, getStripeClient } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = verifyStripeSignature(body, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = await getPayload({ config });

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
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
      }

      case 'payment_intent.payment_failed': {
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        const failedOrderId = failedPaymentIntent.metadata.orderId;

        if (failedOrderId) {
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
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
