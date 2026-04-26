'use client';

import { useCallback } from 'react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/types/cart';

export const useCart = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    subtotal,
    tax,
  } = useCartStore();

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    subtotal,
    tax,
  };
};
