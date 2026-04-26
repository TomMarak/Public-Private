'use client';

import { useCart } from '@/hooks/useCart';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, total } = useCart();

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-drawer-header">
        <h2>Košík</h2>
        <button onClick={onClose}>×</button>
      </div>
      <div className="cart-drawer-content">
        {items.length === 0 ? (
          <p>Vaš košík je prázdný</p>
        ) : (
          <>
            {/* TODO: Render cart items */}
            <div className="cart-total">
              <p>Celkem: {total} Kč</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
