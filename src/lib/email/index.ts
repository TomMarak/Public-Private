import { Resend } from 'resend';
import { createAccountCreationToken } from '../auth/tokens';

const resend = new Resend(process.env.RESEND_API_KEY);

// Base HTML template with Battle Owl branding
const createEmailTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      background-color: #f8f9fa;
      padding: 20px;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 10px;
    }
    .tagline {
      color: #6b7280;
      font-size: 14px;
    }
    .content {
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      margin: 10px 0;
    }
    .button:hover {
      background: #2563eb;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .order-details {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .total {
      font-weight: bold;
      font-size: 18px;
      color: #1f2937;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Battle Owl</div>
      <div class="tagline">Kvalitní kosmetika a oblečení</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>
        Tento email byl odeslán automaticky.<br>
        Battle Owl s.r.o. | www.battleowl.com
      </p>
    </div>
  </div>
</body>
</html>
`;

// 1. Order confirmation email for customer
export const sendOrderConfirmation = async (orderData: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    productName: string;
    variantName?: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}) => {
  const itemsHtml = orderData.items.map(item => `
    <div class="order-item">
      <span>${item.productName}${item.variantName ? ` (${item.variantName})` : ''} × ${item.quantity}</span>
      <span>${item.priceAtPurchase * item.quantity} Kč</span>
    </div>
  `).join('');

  const paymentMethodLabel = {
    card: 'Karta',
    transfer: 'Bankovní převod',
    cash_on_delivery: 'Dobírka'
  }[orderData.paymentMethod] || orderData.paymentMethod;

  const shippingMethodLabel = {
    zasilkovna: 'Zásilkovna',
    ppl: 'PPL',
    pickup: 'Osobní odběr'
  }[orderData.shippingMethod] || orderData.shippingMethod;

  const content = `
    <h2>Děkujeme za vaši objednávku!</h2>
    <p>Dobrý den ${orderData.customerName},</p>
    <p>Vaše objednávka byla úspěšně přijata. Zde jsou detaily:</p>

    <div class="order-details">
      <h3>Objednávka ${orderData.orderNumber}</h3>
      ${itemsHtml}
      <div class="order-item">
        <span>Mezisoučet:</span>
        <span>${orderData.subtotal} Kč</span>
      </div>
      <div class="order-item">
        <span>DPH (21%):</span>
        <span>${orderData.tax} Kč</span>
      </div>
      <div class="order-item">
        <span>Doprava (${shippingMethodLabel}):</span>
        <span>${orderData.shipping} Kč</span>
      </div>
      <div class="order-item total">
        <span>Celkem:</span>
        <span>${orderData.total} Kč</span>
      </div>
    </div>

    <h3>Doručovací adresa:</h3>
    <p>
      ${orderData.shippingAddress.name}<br>
      ${orderData.shippingAddress.street}<br>
      ${orderData.shippingAddress.city} ${orderData.shippingAddress.postalCode}<br>
      ${orderData.shippingAddress.country}
    </p>

    <h3>Způsob platby:</h3>
    <p>${paymentMethodLabel}</p>

    <p>O stavu objednávky vás budeme informovat emailem.</p>
  `;

  const html = createEmailTemplate(content, `Potvrzení objednávky ${orderData.orderNumber}`);

  try {
    await resend.emails.send({
      from: 'Battle Owl <orders@battleowl.com>',
      to: orderData.customerEmail,
      subject: `Potvrzení objednávky ${orderData.orderNumber}`,
      html,
    });
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
};

// 2. Account creation offer for guest after payment
export const sendAccountCreationOffer = async (orderData: {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
}) => {
  const token = await createAccountCreationToken(orderData.orderId, orderData.customerEmail);

  const content = `
    <h2>Vytvořte si účet u Battle Owl</h2>
    <p>Dobrý den ${orderData.customerName},</p>
    <p>Vaše objednávka ${orderData.orderNumber} byla úspěšně zaplacena.</p>
    <p>Vytvořením účtu získáte:</p>
    <ul>
      <li>Rychlejší nákup bez opakovaného zadávání údajů</li>
      <li>Přehled všech vašich objednávek</li>
      <li>Sledování stavu zásilek</li>
      <li>Exkluzivní nabídky a slevy</li>
    </ul>

    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/vytvorit-ucet?token=${token}" class="button">
      Vytvořit účet
    </a>

    <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
      Tento odkaz je platný 24 hodin. Pokud si účet nechcete vytvořit, můžete tuto zprávu ignorovat.
    </p>
  `;

  const html = createEmailTemplate(content, 'Vytvořte si účet u Battle Owl');

  try {
    await resend.emails.send({
      from: 'Battle Owl <accounts@battleowl.com>',
      to: orderData.customerEmail,
      subject: 'Vytvořte si účet u Battle Owl',
      html,
    });
  } catch (error) {
    console.error('Failed to send account creation offer email:', error);
    throw error;
  }
};

// 3. New order notification for admin
export const sendNewOrderNotification = async (orderData: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
  items: Array<{
    productName: string;
    variantName?: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
}) => {
  const itemsHtml = orderData.items.map(item => `
    <div class="order-item">
      <span>${item.productName}${item.variantName ? ` (${item.variantName})` : ''} × ${item.quantity}</span>
      <span>${item.priceAtPurchase * item.quantity} Kč</span>
    </div>
  `).join('');

  const paymentMethodLabel = {
    card: 'Karta',
    transfer: 'Bankovní převod',
    cash_on_delivery: 'Dobírka'
  }[orderData.paymentMethod] || orderData.paymentMethod;

  const shippingMethodLabel = {
    zasilkovna: 'Zásilkovna',
    ppl: 'PPL',
    pickup: 'Osobní odběr'
  }[orderData.shippingMethod] || orderData.shippingMethod;

  const content = `
    <h2>Nová objednávka!</h2>
    <p>Byla přijata nová objednávka:</p>

    <div class="order-details">
      <h3>Objednávka ${orderData.orderNumber}</h3>
      <p><strong>Zákazník:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
      <p><strong>Celková částka:</strong> ${orderData.total} Kč</p>
      <p><strong>Platba:</strong> ${paymentMethodLabel}</p>
      <p><strong>Doprava:</strong> ${shippingMethodLabel}</p>

      <h4>Položky:</h4>
      ${itemsHtml}
    </div>

    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/collections/orders/${orderData.orderNumber}" class="button">
      Zobrazit v admin panelu
    </a>
  `;

  const html = createEmailTemplate(content, `Nová objednávka ${orderData.orderNumber}`);

  try {
    await resend.emails.send({
      from: 'Battle Owl <system@battleowl.com>',
      to: process.env.ADMIN_EMAIL || 'admin@battleowl.com',
      subject: `Nová objednávka ${orderData.orderNumber}`,
      html,
    });
  } catch (error) {
    console.error('Failed to send new order notification email:', error);
    throw error;
  }
};

// 4. Shipping confirmation for customer (sent manually from admin when status changes to shipped)
export const sendShippingConfirmation = async (orderData: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  trackingNumber?: string;
  shippingMethod: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}) => {
  const shippingMethodLabel = {
    zasilkovna: 'Zásilkovna',
    ppl: 'PPL',
    pickup: 'Osobní odběr'
  }[orderData.shippingMethod] || orderData.shippingMethod;

  let trackingInfo = '';
  if (orderData.trackingNumber) {
    if (orderData.shippingMethod === 'zasilkovna') {
      trackingInfo = `<p>Sledovací číslo: <strong>${orderData.trackingNumber}</strong></p>
                      <p><a href="https://www.zasilkovna.cz/vyhledavani" class="button">Sledovat zásilku</a></p>`;
    } else if (orderData.shippingMethod === 'ppl') {
      trackingInfo = `<p>Sledovací číslo: <strong>${orderData.trackingNumber}</strong></p>
                      <p><a href="https://www.ppl.cz/en/" class="button">Sledovat zásilku</a></p>`;
    } else {
      trackingInfo = `<p>Sledovací číslo: <strong>${orderData.trackingNumber}</strong></p>`;
    }
  }

  const content = `
    <h2>Vaše objednávka byla odeslána!</h2>
    <p>Dobrý den ${orderData.customerName},</p>
    <p>Vaše objednávka ${orderData.orderNumber} byla právě odeslána.</p>

    <h3>Doručovací adresa:</h3>
    <p>
      ${orderData.shippingAddress.name}<br>
      ${orderData.shippingAddress.street}<br>
      ${orderData.shippingAddress.city} ${orderData.shippingAddress.postalCode}<br>
      ${orderData.shippingAddress.country}
    </p>

    <h3>Způsob dopravy:</h3>
    <p>${shippingMethodLabel}</p>

    ${trackingInfo}

    <p>Očekávaná doba doručení je 1-3 pracovní dny.</p>
    <p>Pokud máte jakékoliv otázky, neváhejte nás kontaktovat.</p>
  `;

  const html = createEmailTemplate(content, `Objednávka ${orderData.orderNumber} byla odeslána`);

  try {
    await resend.emails.send({
      from: 'Battle Owl <shipping@battleowl.com>',
      to: orderData.customerEmail,
      subject: `Objednávka ${orderData.orderNumber} byla odeslána`,
      html,
    });
  } catch (error) {
    console.error('Failed to send shipping confirmation email:', error);
    throw error;
  }
};
