import { AfterChangeHook } from 'payload/dist/collections/config/types';
import { sendShippingConfirmation } from '../../../lib/email';

export const sendShippingEmail: AfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Only send email when status changes to 'shipped' and operation is update
  if (
    operation === 'update' &&
    doc.status === 'shipped' &&
    previousDoc?.status !== 'shipped'
  ) {
    try {
      // Get product names for the email
      const productIds = doc.items?.map((item: any) => item.product) || [];
      const products = await req.payload.find({
        collection: 'products',
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const productMap = products.docs.reduce((map, product) => {
        map[product.id] = product.name;
        return map;
      }, {} as Record<string, string>);

      const itemsWithNames = doc.items?.map((item: any) => ({
        productName: productMap[item.product] || `Produkt ${item.product}`,
        variantName: item.variantName || '',
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })) || [];

      await sendShippingConfirmation({
        orderNumber: doc.orderNumber,
        customerEmail: doc.guestEmail || doc.customer?.email,
        customerName: doc.shippingAddress?.name || 'Vážený zákazník',
        trackingNumber: doc.trackingNumber,
        shippingMethod: doc.shippingMethod,
        shippingAddress: doc.shippingAddress,
      });

      console.log(`Shipping confirmation email sent for order ${doc.orderNumber}`);
    } catch (error) {
      console.error('Failed to send shipping confirmation email:', error);
      // Don't throw error to avoid breaking the admin update
    }
  }
};