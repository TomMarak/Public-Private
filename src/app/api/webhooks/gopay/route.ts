import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { verifyGoPayWebhook } from '@/lib/gopay';

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-hub-signature');

    if (signature) {
      const isValid = await verifyGoPayWebhook(signature, body);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const payload = await getPayload({ config });

    const { id: paymentId, state } = body;

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

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let newStatus: OrderStatus;
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
        newStatus = (order.status as OrderStatus | null | undefined) ?? 'pending';
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
