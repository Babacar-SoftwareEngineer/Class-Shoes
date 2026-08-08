'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/catalog';

export default function OrderPage() {
  const { items, totalPrice, clearCart, isMounted } = useCart();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  if (!isMounted) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-(--muted)">Chargement de votre commande...</div>;
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] bg-(--shell-bg) px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.24em] text-(--muted)">Commande enregistrée</p>
        <h1 className="mt-4 font-serif text-5xl text-(--ink)">Merci pour votre commande.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-(--muted)">Votre demande a bien été enregistrée. Une confirmation vous sera envoyée lorsque le paiement sera activé.</p>
        <Link href="/products" className="mt-8 inline-flex bg-(--ink) px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-white">Continuer mes achats</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-(--shell-bg) px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-(--ink)">Votre panier est vide.</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-(--muted)">Ajoutez au moins une pièce avant de passer votre commande.</p>
        <Link href="/products" className="mt-8 inline-flex bg-(--ink) px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-white">Découvrir la collection</Link>
      </div>
    );
  }

  return (
    <div className="bg-(--shell-bg) px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="pb-7">
          <h1 className="font-serif text-4xl text-(--ink) sm:text-5xl">Passer votre commande</h1>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <section className="rounded-xl border border-(--line) bg-(--paper) p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-(--ink)">Informations personnelles</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-(--ink)">Nom complet<input required name="fullName" placeholder="Ex : Awa Diop" className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)" /></label>
                <label className="text-xs text-(--ink)">Téléphone<input required type="tel" name="phone" placeholder="+221 77 000 00 00" className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)" /></label>
                <label className="text-xs text-(--ink) sm:col-span-2">E-mail<input required type="email" name="email" placeholder="email@exemple.com" className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)" /></label>
              </div>
            </section>

            <section className="rounded-xl border border-(--line) bg-(--paper) p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-(--ink)">Adresse de livraison</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-(--ink)">Région<select name="region" className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none focus:border-(--ink)"><option value="">Choisir une région</option><option>Dakar</option><option>Thiès</option><option>Saint-Louis</option><option>Ziguinchor</option></select></label>
                <label className="text-xs text-(--ink)">Ville<input required name="city" placeholder="Ex : Dakar" className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)" /></label>
                <label className="text-xs text-(--ink) sm:col-span-2">Adresse<input required name="address" placeholder="Quartier, rue, repère" className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)" /></label>
              </div>
            </section>

            <section className="rounded-xl border border-(--line) bg-(--paper) p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-(--ink)">Mode de paiement</h2>
              </div>
              <fieldset className="mt-5 grid gap-3 sm:grid-cols-3">
                <legend className="sr-only">Choisissez votre mode de paiement</legend>
                <label className="flex min-h-20 cursor-pointer flex-col justify-center gap-2 rounded-lg border border-(--line) px-4 py-3 text-center transition-colors has-checked:border-(--ink) has-checked:bg-(--shell-bg)">
                  <input required type="radio" name="paymentMethod" value="mobile-money" defaultChecked className="sr-only" />
                  <span className="text-sm text-(--ink)">Wave</span>
                  <span className="text-[10px] text-(--muted)">Paiement mobile</span>
                </label>
                <label className="flex min-h-20 cursor-pointer flex-col justify-center gap-2 rounded-lg border border-(--line) px-4 py-3 text-center transition-colors hover:border-(--ink) has-checked:border-(--ink) has-checked:bg-(--shell-bg)">
                  <input type="radio" name="paymentMethod" value="orange-money" className="sr-only" />
                  <span className="text-sm text-(--ink)">Orange Money</span>
                  <span className="text-[10px] text-(--muted)">Paiement mobile</span>
                </label>
                <label className="flex min-h-20 cursor-pointer flex-col justify-center gap-2 rounded-lg border border-(--line) px-4 py-3 text-center transition-colors hover:border-(--ink) has-checked:border-(--ink) has-checked:bg-(--shell-bg)">
                  <input type="radio" name="paymentMethod" value="delivery" className="sr-only" />
                  <span className="text-sm text-(--ink)">À la livraison</span>
                  <span className="text-[10px] text-(--muted)">Selon votre adresse</span>
                </label>
              </fieldset>
            </section>

            <button type="submit" className="w-full rounded-lg bg-[#1c1c1c] px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white! transition-colors hover:bg-[#333333]">Confirmer la commande</button>
          </form>

          <aside className="self-start rounded-xl border border-(--line) bg-(--paper) p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="text-sm font-semibold text-(--ink)">Votre commande</h2>
            <div className="mt-5 divide-y divide-(--line) border-y border-(--line)">
              {items.map((item) => (
                <div key={item.product.ProductId} className="flex gap-3 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-(--card)"><Image src={item.product.ProductImage?.[0]?.ImageUrl ?? '/p1.jpg'} alt={item.product.ProductName} fill sizes="64px" className="object-cover" /></div>
                  <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm leading-5 text-(--ink)">{item.product.ProductName}</p><p className="mt-1 text-xs text-(--muted)">Qté {item.quantity}</p></div>
                  <span className="text-sm text-(--ink)">{formatPrice(Number(item.product.Price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-xs text-(--muted)"><div className="flex justify-between"><span>Sous-total</span><span className="text-(--ink)">{formatPrice(totalPrice)}</span></div><div className="flex justify-between"><span>Livraison</span><span className="text-(--ink)">Offerte</span></div></div>
            <div className="mt-4 flex justify-between border-t border-(--line) pt-4 text-base font-semibold text-(--ink)"><span>Total</span><span>{formatPrice(totalPrice)}</span></div>
            <p className="mt-4 text-center text-[10px] leading-5 text-(--muted)">Paiement sécurisé · Livraison rapide</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
