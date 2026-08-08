'use client';

import { Product } from '../services/productService';
import { useCartStore } from '../store/useCartStore';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={product.Quantity === 0}
      className={`inline-flex h-11 items-center justify-center border px-5 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors ${
        product.Quantity === 0
          ? 'cursor-not-allowed border-(--line) text-(--muted)'
          : 'cursor-pointer border-(--ink) bg-(--ink) text-white hover:bg-transparent hover:text-(--ink)'
      }`}
      title={product.Quantity > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
    >
      {product.Quantity > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
    </button>
  );
}
