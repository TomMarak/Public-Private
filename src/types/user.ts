import { Address } from './order';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  userId: string;
  email: string;
  role: 'admin' | 'customer';
  iat: number;
  exp: number;
}
