'use client';

import { useCart } from '@/hooks/useCart';
import CartSummary from '@/components/cart/CartSummary';

export default function OrderSummary() {
  const { items } = useCart();

  return (
    <div className="order-summary">
      <h3>Přehled objednávky</h3>
      <div className="order-items">
        {items.map((item, idx) => (
          <div key={idx} className="order-item">
            <span>{item.product?.name}</span>
            <span>{item.quantity} × {item.priceAtAdd} Kč</span>
          </div>
        ))}
      </div>
      <CartSummary />
    </div>
  );
}
