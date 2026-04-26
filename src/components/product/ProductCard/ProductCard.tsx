import { Product } from '@/types/product';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <img src={product.images[0] || ''} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">{product.price} Kč</p>
    </div>
  );
}
