'use client';

import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/catalog';
import { normalizeImageSrc } from '../lib/image';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalPrice, updateQuantity, removeItem, isMounted } = useCart();

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true" aria-label="Panier">
      <button type="button" aria-label="Fermer le panier" onClick={onClose} className="absolute inset-0 cursor-default bg-black/65" />
      <aside className="relative z-10 flex h-dvh w-full max-w-[460px] flex-col overflow-hidden bg-(--shell-bg) shadow-2xl">
        <div className="flex items-center justify-between border-b border-(--line) px-6 py-6 sm:px-8">
          <h2 className="text-lg uppercase tracking-[0.18em] text-(--ink)">Panier</h2>
          <button type="button" onClick={onClose} aria-label="Fermer le panier" className="text-2xl leading-none text-(--muted) hover:text-(--ink)">×</button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-8">
          {!isMounted ? <p className="py-10 text-sm text-(--muted)">Chargement du panier...</p> : null}
          {isMounted && items.length === 0 ? (
            <div className="py-16 text-center"><p className="font-serif text-3xl text-(--ink)">Votre panier est vide.</p><Link href="/products" onClick={onClose} className="mt-6 inline-flex bg-(--ink) px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white">Découvrir la collection</Link></div>
          ) : null}
          {isMounted && items.length > 0 ? items.map((item) => (
            <article key={item.product.ProductId} className="grid grid-cols-[100px_1fr_auto] gap-4 border-b border-(--line) py-6">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-(--card)"><Image src={normalizeImageSrc(item.product.ProductImage?.[0]?.ImageUrl)} alt={item.product.ProductName} fill sizes="100px" className="object-cover" /></div>
              <div className="min-w-0">
                <p className="truncate text-sm text-(--ink)">{item.product.ProductName}</p>
                <p className="mt-1 text-xs text-(--muted)">Quantité disponible : {item.product.Quantity}</p>
                <div className="mt-5 flex h-8 w-fit items-center border border-(--line)">
                  <button type="button" onClick={() => updateQuantity(item.product.ProductId, item.quantity - 1)} className="h-full w-8 text-(--muted) hover:text-(--ink)" aria-label="Diminuer la quantité">−</button>
                  <span className="w-7 text-center text-xs">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.product.ProductId, item.quantity + 1)} disabled={item.quantity >= item.product.Quantity} className="h-full w-8 text-(--muted) hover:text-(--ink) disabled:opacity-30" aria-label="Augmenter la quantité">+</button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between"><button type="button" onClick={() => removeItem(item.product.ProductId)} className="text-lg leading-none text-(--muted) hover:text-(--ink)" aria-label={`Supprimer ${item.product.ProductName}`}>×</button><span className="whitespace-nowrap text-sm text-(--ink)">{formatPrice(Number(item.product.Price) * item.quantity)}</span></div>
            </article>
          )) : null}
        </div>

        {isMounted && items.length > 0 ? (
          <div className="border-t border-(--line) px-6 py-6 sm:px-8">
            <div className="flex justify-between text-lg text-(--ink)"><span>Sous-total</span><span>{formatPrice(totalPrice)}</span></div>
            <p className="mt-3 text-xs leading-5 text-(--muted)">Livraison et taxes calculées au moment de la commande.</p>
            <Link href="/order" onClick={onClose} className="mt-6 flex w-full items-center justify-center rounded-full bg-[#1c1c1c] px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#333333]">Passer la commande</Link>
          </div>
        ) : null}
      </aside>
    </div>,
    document.body
  );
}
