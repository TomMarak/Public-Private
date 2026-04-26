import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore extends Cart {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; tax: number; total: number };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,

      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );

          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            state.items.push(item);
          }

          return { items: [...state.items] };
        });
      },

      removeItem: (productId: string, variantId?: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId: string, quantity: number, variantId?: string) => {
        set((state) => {
          const item = state.items.find(
            (i) => i.productId === productId && i.variantId === variantId
          );
          if (item) {
            item.quantity = Math.max(0, quantity);
          }
          return { items: [...state.items] };
        });
      },

      clearCart: () => set({ items: [], subtotal: 0, tax: 0, total: 0 }),

      getTotals: () => {
        const state = get();
        const subtotal = state.items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
        const tax = subtotal * 0.21; // 21% DPH
        const total = subtotal + tax;
        return { subtotal, tax, total };
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
