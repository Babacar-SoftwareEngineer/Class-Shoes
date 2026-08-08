'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '../services/productService';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../lib/catalog';

interface ProductPurchasePanelProps {
  product: Product;
}

export default function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Taille unique');
  const [colour, setColour] = useState('Naturel');
  const [added, setAdded] = useState(false);
  const sizes = ['Taille unique', '36', '37', '38', '39', '40'];

  const addToBag = () => {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      <p className="mt-6 text-2xl text-(--ink)">{formatPrice(product.Price)}</p>
      <p className="mt-6 max-w-md text-sm leading-7 text-(--muted)">Une pièce pensée pour accompagner chaque jour. Matières choisies, proportions justes et finitions réalisées en petites séries.</p>

      <div className="mt-8 grid gap-6 border-y border-(--line) py-6 sm:grid-cols-2">
        <fieldset>
          <legend className="text-[10px] uppercase tracking-[0.22em] text-(--muted)">Couleur · {colour}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Naturel', 'Noir', 'Brun'].map((option) => <button type="button" key={option} onClick={() => setColour(option)} className={`border px-4 py-2 text-xs ${colour === option ? 'border-(--ink) bg-(--ink) text-white' : 'border-(--line) text-(--ink)'}`}>{option}</button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[10px] uppercase tracking-[0.22em] text-(--muted)">Taille · {size}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((option) => <button type="button" key={option} onClick={() => setSize(option)} className={`border px-3 py-2 text-xs ${size === option ? 'border-(--ink) bg-(--ink) text-white' : 'border-(--line) text-(--ink)'}`}>{option}</button>)}
          </div>
        </fieldset>
      </div>

      <p className="mt-5 text-xs text-(--muted)">{product.Quantity > 0 ? `${product.Quantity} pièces disponibles` : 'Rupture de stock'}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="flex h-12 items-center border border-(--line)">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-full w-10 text-(--muted) hover:text-(--ink)" aria-label="Diminuer la quantité">−</button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => Math.min(product.Quantity, value + 1))} disabled={quantity >= product.Quantity} className="h-full w-10 text-(--muted) hover:text-(--ink) disabled:opacity-30" aria-label="Augmenter la quantité">+</button>
        </div>
        <button type="button" onClick={addToBag} disabled={product.Quantity === 0} className="inline-flex h-12 min-w-45 items-center justify-center bg-(--ink) px-6 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-(--muted) disabled:cursor-not-allowed disabled:bg-(--line)">{added ? 'Ajouté au panier' : 'Ajouter au panier'}</button>
        <Link href="/cart" className="inline-flex h-12 items-center justify-center border border-(--line) px-5 text-[10px] uppercase tracking-[0.2em] text-(--ink) hover:border-(--ink)">Voir le panier</Link>
      </div>
    </>
  );
}
