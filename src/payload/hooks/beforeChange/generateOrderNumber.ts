import { CollectionBeforeChangeHook } from 'payload';

export const generateOrderNumber: CollectionBeforeChangeHook = async ({
  data,
  operation,
}) => {
  if (operation === 'create' && !data.orderNumber) {
    // Generate order number like ORD-20260426-001
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timestamp = date.getTime();

    // For simplicity, use timestamp-based number
    // In production, you might want to use a counter from database
    const orderNumber = `ORD-${dateStr}-${timestamp.toString().slice(-6)}`;

    return {
      ...data,
      orderNumber,
    };
  }

  return data;
};