'use client';

import { useCart } from '@/hooks/useCart';

export default function CartSummary() {
  const { subtotal, tax, total } = useCart();

  return (
    <div className="cart-summary">
      <div className="summary-row">
        <span>Mezisoučet:</span>
        <span>{subtotal} Kč</span>
      </div>
      <div className="summary-row">
        <span>DPH (21%):</span>
        <span>{tax} Kč</span>
      </div>
      <div className="summary-row summary-total">
        <span>Celkem:</span>
        <span>{total} Kč</span>
      </div>
    </div>
  );
}
