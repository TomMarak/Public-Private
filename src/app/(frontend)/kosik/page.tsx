'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import ShippingSelector from '@/components/checkout/ShippingSelector';
import PaymentSelector from '@/components/checkout/PaymentSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCart } from '@/hooks/useCart';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function KosikPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (formData: CheckoutFormData) => {
    if (!shippingMethod || !paymentMethod) {
      alert('Vyberte prosím způsob dopravy a platby');
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would integrate with your payment processor (Stripe, GoPay)
      // For now, we'll simulate the order creation

      const orderData = {
        customer: null, // For guest checkout
        guestEmail: formData.email,
        items: items.map(item => ({
          product: item.productId,
          variantName: item.variant?.name,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtAdd,
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        shippingMethod,
        paymentMethod,
        subtotal: total,
        tax: total * 0.21,
        shipping: getShippingPrice(shippingMethod),
        total: total + (total * 0.21) + getShippingPrice(shippingMethod),
      };

      // TODO: Send order to API
      console.log('Order data:', orderData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart and redirect to success page
      clearCart();
      router.push('/objednavka-potvrzena');

    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Došlo k chybě při zpracování objednávky. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getShippingPrice = (method: string): number => {
    const prices = {
      zasilkovna: 49,
      ppl: 89,
      pickup: 0,
    };
    return prices[method as keyof typeof prices] || 0;
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <h1>Košík je prázdný</h1>
          <p>Váš nákupní košík neobsahuje žádné položky.</p>
          <button onClick={() => router.push('/')} className="btn-primary">
            Pokračovat v nákupu
          </button>
        </div>

        <style jsx>{`
          .empty-cart {
            min-height: 50vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }

          .container {
            max-width: 600px;
            padding: 2rem;
          }

          h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #333;
          }

          p {
            font-size: 1.125rem;
            color: #6b7280;
            margin-bottom: 2rem;
          }

          .btn-primary {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .btn-primary:hover {
            background: #2563eb;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-layout">
          {/* Left side - Form */}
          <div className="checkout-form-section">
            <h1>Košík a objednávka</h1>

            <CheckoutForm onSubmit={handleFormSubmit} />

            <ShippingSelector
              selectedMethod={shippingMethod}
              onMethodChange={setShippingMethod}
            />

            <PaymentSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </div>

          {/* Right side - Sticky summary */}
          <div className="checkout-summary-section">
            <OrderSummary
              shippingMethod={shippingMethod}
              paymentMethod={paymentMethod}
              onPlaceOrder={() => handleFormSubmit({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                street: '',
                city: '',
                postalCode: '',
                country: 'CZ',
              })}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 2rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          align-items: start;
        }

        .checkout-form-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .checkout-summary-section {
          position: sticky;
          top: 2rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #333;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .checkout-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .checkout-form-section {
            padding: 1rem;
          }

          .checkout-summary-section {
            position: static;
            order: -1; /* Summary on top for mobile */
          }
        }
      `}</style>
    </div>
  );
}