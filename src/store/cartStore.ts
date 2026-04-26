import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart';

interface CartStore extends Cart {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,

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

          // Recalculate totals
          const newItems = [...state.items];
          const subtotal = newItems.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
          const tax = subtotal * 0.21; // 21% DPH
          const total = subtotal + tax;
          const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

          return { 
            items: newItems,
            subtotal,
            tax,
            total,
            itemCount,
          };
        });
      },

      removeItem: (productId: string, variantId?: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          );

          // Recalculate totals
          const subtotal = newItems.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
          const tax = newItems.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity * 0.21), 0);
          const total = subtotal + tax;
          const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

          return { 
            items: newItems,
            subtotal,
            tax,
            total,
            itemCount,
          };
        });
      },

      updateQuantity: (productId: string, quantity: number, variantId?: string) => {
        set((state) => {
          const newItems = [...state.items];
          const item = newItems.find(
            (i) => i.productId === productId && i.variantId === variantId
          );
          if (item) {
            item.quantity = Math.max(0, quantity);
          }

          // Recalculate totals
          const subtotal = newItems.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
          const tax = subtotal * 0.21; // 21% DPH
          const total = subtotal + tax;
          const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

          return { 
            items: newItems,
            subtotal,
            tax,
            total,
            itemCount,
          };
        });
      },

      clearCart: () => set({ 
        items: [], 
        subtotal: 0, 
        tax: 0, 
        total: 0,
        itemCount: 0,
      }),
    }),
    {
      name: 'cart-store',
    }
  )
);
