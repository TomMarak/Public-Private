import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@payloadcms/next';
import { verifyGoPayWebhook } from '@/lib/gopay';
import config from '../../../../payload.config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-hub-signature');

    // Verify webhook signature (if provided)
    if (signature) {
      const isValid = await verifyGoPayWebhook(signature, body);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const payload = await getPayload({ config });

    // GoPay webhook body contains payment information
    const { id: paymentId, state, order_number: orderNumber } = body;

    // Find order by payment ID
    const orders = await payload.find({
      collection: 'orders',
      where: {
        paymentId: {
          equals: paymentId,
        },
      },
    });

    if (orders.docs.length === 0) {
      console.error(`Order not found for payment ID: ${paymentId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders.docs[0];

    // Update order status based on GoPay payment state
    let newStatus: string;
    switch (state) {
      case 'PAID':
        newStatus = 'paid';
        break;
      case 'CANCELLED':
      case 'TIMEOUTED':
        newStatus = 'cancelled';
        break;
      case 'CREATED':
      case 'PAYMENT_METHOD_CHOSEN':
        newStatus = 'pending';
        break;
      default:
        console.log(`Unhandled GoPay state: ${state}`);
        newStatus = order.status; // Keep current status
    }

    if (newStatus !== order.status) {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          status: newStatus,
        },
      });

      console.log(`Order ${order.id} status updated to ${newStatus} (GoPay state: ${state})`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('GoPay webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
