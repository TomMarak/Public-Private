'use client';

import { CartItem as CartItemType } from '@/types/cart';

export default function CartItem({ item, onRemove }: { item: CartItemType; onRemove: () => void }) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <p>{item.product?.name}</p>
        <p className="quantity">Množství: {item.quantity}</p>
      </div>
      <div className="cart-item-price">
        <p>{item.priceAtAdd * item.quantity} Kč</p>
        <button onClick={onRemove}>Odebrat</button>
      </div>
    </div>
  );
}
