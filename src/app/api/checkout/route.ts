import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from '@payloadcms/next';
import { checkoutSchema } from '@/validators/checkout';
import { getStripeClient } from '@/lib/stripe';
import { createGoPayPayment } from '@/lib/gopay';
import config from '../../../payload.config';

const shippingPrices = {
  zasilkovna: 49,
  ppl: 89,
  pickup: 0,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0);
    const shipping = shippingPrices[data.shippingMethod];
    const tax = Math.round(subtotal * 0.21); // 21% DPH
    const total = subtotal + shipping + tax;

    // Get Payload instance
    const payload = await getPayload({ config });

    // Create order data
    const orderData = {
      guestEmail: data.email,
      items: data.items.map(item => ({
        product: item.productId,
        variantName: item.variant?.name || '',
        quantity: item.quantity,
        priceAtPurchase: item.priceAtAdd,
      })),
      status: 'pending' as const,
      shippingAddress: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      },
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
    };

    // Create order in Payload CMS
    const order = await payload.create({
      collection: 'orders',
      data: orderData,
    });

    let paymentResult = null;

    // Handle payment based on method
    if (data.paymentMethod === 'card') {
      // Create Stripe PaymentIntent
      const stripe = getStripeClient();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100, // Stripe expects amount in cents
        currency: 'czk',
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      // Update order with payment ID
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          paymentId: paymentIntent.id,
        },
      });

      paymentResult = {
        type: 'stripe',
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };

    } else if (data.paymentMethod === 'transfer') {
      // For bank transfer, create GoPay payment
      const gopayPayment = await createGoPayPayment({
        amount: total,
        currency: 'CZK',
        orderNumber: order.orderNumber,
        description: `Objednávka ${order.orderNumber}`,
        callback: {
          returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/objednavka-potvrzena`,
          notificationUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/gopay`,
        },
        items: data.items.map(item => ({
          name: `Produkt ${item.productId}`,
          amount: item.priceAtAdd * item.quantity,
          count: item.quantity,
        })),
        payer: {
          email: data.email,
          phone: data.phone,
        },
      });

      // Update order with payment ID
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          paymentId: gopayPayment.id,
        },
      });

      paymentResult = {
        type: 'gopay',
        gwUrl: gopayPayment.gw_url,
        paymentId: gopayPayment.id,
      };

    } else if (data.paymentMethod === 'cash_on_delivery') {
      // For cash on delivery, order is already pending
      // Status will be updated when payment is confirmed
      paymentResult = {
        type: 'cash_on_delivery',
        status: 'pending',
      };
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total,
      },
      payment: paymentResult,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
