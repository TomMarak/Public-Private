'use client';

import { Product } from '@/types/product';

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="product-detail">
      <div className="product-images">
        {product.images.map((image, idx) => (
          <img key={idx} src={image} alt={product.name} />
        ))}
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        <p className="price">{product.price} Kč</p>
        {/* TODO: Add add to cart button */}
      </div>
    </div>
  );
}
