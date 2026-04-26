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
    getTotals,
  } = useCartStore();

  const cartTotal = getTotals();

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    ...cartTotal,
  };
};
