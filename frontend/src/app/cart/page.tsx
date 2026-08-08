'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/catalog';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems, isMounted } = useCart();

  if (!isMounted) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-(--muted)">Chargement du panier...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-(--shell-bg) px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.24em] text-(--muted)">Votre sélection</p>
        <h1 className="mt-4 font-serif text-4xl text-(--ink)">Votre panier est vide.</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-(--muted)">Découvrez la collection et choisissez une pièce qui vous ressemble.</p>
        <Link href="/products" className="mt-8 inline-flex bg-(--ink) px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-white">Découvrir la collection</Link>
      </div>
    );
  }

  return (
    <div className="bg-(--shell-bg) px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between border-b border-(--line) pb-5">
          <div><p className="text-[10px] uppercase tracking-[0.24em] text-(--muted)">Collection 2026</p><h1 className="mt-3 font-serif text-4xl text-(--ink)">Votre panier</h1></div>
          <button type="button" onClick={clearCart} className="text-[10px] uppercase tracking-[0.2em] text-(--muted) hover:text-(--ink)">Vider le panier</button>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="divide-y divide-(--line) border-y border-(--line)">
            {items.map((item) => {
              const imageUrl = item.product.ProductImage?.[0]?.ImageUrl ?? '/p1.jpg';
              return (
                <article key={item.product.ProductId} className="grid grid-cols-[88px_1fr_auto] gap-4 py-5 sm:grid-cols-[112px_1fr_auto] sm:gap-6">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-(--card)"><Image src={imageUrl} alt={item.product.ProductName} fill sizes="112px" className="object-cover" /></div>
                  <div className="flex min-w-0 flex-col justify-between py-1">
                    <div><p className="text-[10px] uppercase tracking-[0.18em] text-(--muted)">Pièce sélectionnée</p><h2 className="mt-2 truncate text-sm text-(--ink)">{item.product.ProductName}</h2></div>
                    <p className="mt-4 text-sm text-(--ink)">{formatPrice(item.product.Price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between py-1">
                    <button type="button" onClick={() => removeItem(item.product.ProductId)} className="text-[10px] uppercase tracking-[0.16em] text-(--muted) hover:text-(--ink)">Supprimer</button>
                    <div className="flex h-9 items-center border border-(--line) text-sm">
                      <button type="button" onClick={() => updateQuantity(item.product.ProductId, item.quantity - 1)} className="h-full w-8 text-(--muted) hover:text-(--ink)" aria-label="Diminuer la quantité">−</button>
                      <span className="w-7 text-center text-xs">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product.ProductId, item.quantity + 1)} disabled={item.quantity >= item.product.Quantity} className="h-full w-8 text-(--muted) hover:text-(--ink) disabled:opacity-30" aria-label="Augmenter la quantité">+</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="self-start border-t border-(--ink) pt-5">
            <div className="flex justify-between text-sm"><span className="text-(--muted)">Articles</span><span>{totalItems}</span></div>
            <div className="mt-4 flex justify-between border-t border-(--line) pt-4 text-lg"><span>Total</span><span>{formatPrice(totalPrice)}</span></div>
            <p className="mt-4 text-xs leading-5 text-(--muted)">Livraison et retours offerts dans le monde entier.</p>
            <Link href="/order" className="mt-8 flex w-full items-center justify-center bg-[#1c1c1c] px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white! transition-colors hover:bg-[#333333]">Passer la commande</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
