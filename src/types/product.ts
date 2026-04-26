export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  variants?: Variant[];
  status: 'draft' | 'published' | 'sold_out';
  createdAt: Date;
  updatedAt: Date;
}

export interface Variant {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price?: number;
}
