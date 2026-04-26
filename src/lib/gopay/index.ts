// GoPay API utilities
// Based on https://doc.gopay.com/

interface GoPayPaymentData {
  amount: number;
  currency: string;
  orderNumber: string;
  description: string;
  callback: {
    returnUrl: string;
    notificationUrl: string;
  };
  items: Array<{
    name: string;
    amount: number;
    count: number;
  }>;
  payer: {
    email: string;
    phone?: string;
  };
}

interface GoPayPaymentResponse {
  id: string;
  gw_url: string;
  state: string;
}

export const createGoPayPayment = async (data: GoPayPaymentData): Promise<GoPayPaymentResponse> => {
  const gopayId = process.env.GOPAY_ID;
  const gopaySecret = process.env.GOPAY_SECRET;
  const gopayUrl = process.env.GOPAY_URL || 'https://gw.sandbox.gopay.com/api';

  if (!gopayId || !gopaySecret) {
    throw new Error('GoPay credentials not configured');
  }

  const auth = Buffer.from(`${gopayId}:${gopaySecret}`).toString('base64');

  const paymentData = {
    amount: data.amount,
    currency: data.currency,
    order_number: data.orderNumber,
    order_description: data.description,
    callback: data.callback,
    items: data.items,
    payer: data.payer,
    lang: 'cs',
  };

  const response = await fetch(`${gopayUrl}/payments/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth}`,
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GoPay API error: ${response.status} ${error}`);
  }

  const result = await response.json();
  return result;
};

export const verifyGoPayWebhook = async (signature: string, body: any) => {
  // TODO: Implement webhook signature verification
  // GoPay uses HMAC-SHA256 for webhook signatures
  return true; // Placeholder
};
