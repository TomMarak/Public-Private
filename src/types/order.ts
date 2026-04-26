import { CartItem } from './cart';

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  guestEmail?: string;
  items: CartItem[];
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  shippingMethod: 'zasilkovna' | 'ppl' | 'pickup';
  paymentMethod: 'card' | 'transfer' | 'cash_on_delivery';
  paymentId?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
