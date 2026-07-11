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
      onClick={handleAdd}
      disabled={product.Quantity === 0}
      className={`p-2.5 rounded-xl border transition-all ${
        product.Quantity === 0
          ? 'border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
          : 'border-zinc-200 dark:border-zinc-800 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 hover:border-violet-600 dark:hover:border-violet-600 cursor-pointer'
      }`}
      title={product.Quantity > 0 ? "Ajouter au panier" : "Rupture de stock"}
    >
      🛒
    </button>
  );
}
