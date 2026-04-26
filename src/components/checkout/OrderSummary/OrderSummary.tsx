'use client';

import { useCart } from '@/hooks/useCart';
import CartSummary from '@/components/cart/CartSummary';

interface OrderSummaryProps {
  shippingMethod?: string;
  paymentMethod?: string;
  onPlaceOrder?: () => void;
  isSubmitting?: boolean;
}

const shippingPrices = {
  zasilkovna: 49,
  ppl: 89,
  pickup: 0,
};

export default function OrderSummary({
  shippingMethod,
  paymentMethod,
  onPlaceOrder,
  isSubmitting = false
}: OrderSummaryProps) {
  const { items, subtotal, tax, total } = useCart();

  const shippingPrice = shippingMethod ? shippingPrices[shippingMethod as keyof typeof shippingPrices] || 0 : 0;
  const finalTotal = total + shippingPrice;

  return (
    <div className="order-summary">
      <h3>Přehled objednávky</h3>

      <div className="order-items">
        {items.map((item, idx) => (
          <div key={`${item.productId}-${item.variantId}-${idx}`} className="order-item">
            <div className="item-info">
              <span className="item-name">{item.product?.name}</span>
              {item.variant && <span className="item-variant">{item.variant.name}</span>}
            </div>
            <div className="item-details">
              <span className="item-quantity">{item.quantity}×</span>
              <span className="item-price">{item.priceAtAdd} Kč</span>
            </div>
          </div>
        ))}
      </div>

      <div className="order-totals">
        <div className="total-row">
          <span>Mezisoučet:</span>
          <span>{subtotal} Kč</span>
        </div>

        {shippingMethod && (
          <div className="total-row">
            <span>Doprava:</span>
            <span>{shippingPrice} Kč</span>
          </div>
        )}

        <div className="total-row">
          <span>DPH (21%):</span>
          <span>{tax} Kč</span>
        </div>

        <div className="total-row total-final">
          <span>Celkem:</span>
          <span>{finalTotal} Kč</span>
        </div>
      </div>

      {shippingMethod && paymentMethod && (
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting || items.length === 0}
          className="btn-place-order"
        >
          {isSubmitting ? 'Zpracovávám...' : 'Zaplatit'}
        </button>
      )}

      <style jsx>{`
        .order-summary {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 2rem;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .order-items {
          margin-bottom: 1.5rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 500;
          color: #374151;
          display: block;
        }

        .item-variant {
          font-size: 0.875rem;
          color: #6b7280;
          display: block;
          margin-top: 0.25rem;
        }

        .item-details {
          text-align: right;
        }

        .item-quantity {
          color: #6b7280;
          margin-right: 0.5rem;
        }

        .item-price {
          font-weight: 500;
          color: #374151;
        }

        .order-totals {
          border-top: 2px solid #e5e7eb;
          padding-top: 1rem;
          margin-bottom: 1.5rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .total-final {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-place-order {
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn-place-order:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-place-order:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
