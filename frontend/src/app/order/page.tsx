'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/catalog';
import { normalizeImageSrc } from '../../lib/image';
import { createOrder } from '../../services/orderService';
import { useAuthStore } from '../../store/useAuthStore';
import type { PaymentMethod } from '../../types/order';

export default function OrderPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, isMounted } = useCart();
  const user = useAuthStore((state) => state.user);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile-money');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{ orderId: number; totalAmount: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMounted && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setFullName((current) => current || user.DisplayName || [user.FirstName, user.LastName].filter(Boolean).join(' '));
      setEmail((current) => current || user.Email);
    }
  }, [user, isMounted, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await createOrder(
        {
          customer: {
            fullName,
            email,
            phone,
            region,
            city,
            address,
          },
          paymentMethod,
          items: items.map((item) => ({
            productId: item.product.ProductId,
            quantity: item.quantity,
          })),
        }
      );

      setSubmittedOrder({
        orderId: response.data.orderId,
        totalAmount: response.data.totalAmount,
      });
      clearCart();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Une erreur est survenue pendant la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-(--muted)">Chargement de votre commande...</div>;
  }

  if (!user) {
    return null; // Redirection en cours
  }

  if (submittedOrder) {
    return (
      <div className="min-h-[60vh] bg-(--shell-bg) px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-[10px] uppercase tracking-[0.24em] text-(--muted)">Commande enregistrée</p>
        <h1 className="mt-4 font-serif text-5xl text-(--ink)">Merci pour votre commande.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-(--muted)">
          Votre commande #{submittedOrder.orderId} a bien été créée. Le total est de {formatPrice(submittedOrder.totalAmount)}.
        </p>
        <Link href="/products" className="mt-8 inline-flex bg-(--ink) px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-white">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-(--shell-bg) px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl text-(--ink)">Votre panier est vide.</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-(--muted)">Ajoutez au moins une pièce avant de passer votre commande.</p>
        <Link href="/products" className="mt-8 inline-flex bg-(--ink) px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-white">
          Découvrir la collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-(--shell-bg) px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="pb-7">
          <p className="text-[10px] uppercase tracking-[0.24em] text-(--muted)">Checkout sécurisé</p>
          <h1 className="mt-3 font-serif text-4xl text-(--ink) sm:text-5xl">Passer votre commande</h1>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <section className="rounded-xl border border-(--line) bg-(--paper) p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-(--ink)">Informations personnelles</h2>
                {!user ? (
                  <Link href="/login" className="text-[10px] uppercase tracking-[0.18em] text-(--muted)">
                    Se connecter
                  </Link>
                ) : null}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-(--ink)">
                  Nom complet
                  <input
                    required
                    name="fullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Ex : Awa Diop"
                    className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
                  />
                </label>
                <label className="text-xs text-(--ink)">
                  Téléphone
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
                  />
                </label>
                <label className="text-xs text-(--ink) sm:col-span-2">
                  E-mail
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="email@exemple.com"
                    className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-(--line) bg-(--paper) p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-(--ink)">Adresse de livraison</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-(--ink)">
                  Région
                  <select
                    required
                    name="region"
                    value={region}
                    onChange={(event) => setRegion(event.target.value)}
                    className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none focus:border-(--ink)"
                  >
                    <option value="">Choisir une région</option>
                    <option>Dakar</option>
                    <option>Thiès</option>
                    <option>Saint-Louis</option>
                    <option>Ziguinchor</option>
                  </select>
                </label>
                <label className="text-xs text-(--ink)">
                  Ville
                  <input
                    required
                    name="city"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="Ex : Dakar"
                    className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
                  />
                </label>
                <label className="text-xs text-(--ink) sm:col-span-2">
                  Adresse
                  <input
                    required
                    name="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Quartier, rue, repère"
                    className="mt-2 w-full rounded-md border border-(--line) bg-(--shell-bg) px-3 py-2.5 text-sm text-(--ink) outline-none placeholder:text-(--muted) focus:border-(--ink)"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-(--line) bg-(--paper) p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-(--ink)">Mode de paiement</h2>
              </div>
              <fieldset className="mt-5 grid gap-3 sm:grid-cols-3">
                <legend className="sr-only">Choisissez votre mode de paiement</legend>
                {[
                  {
                    value: 'mobile-money' as const,
                    title: 'Wave',
                    description: 'Paiement mobile',
                  },
                  {
                    value: 'orange-money' as const,
                    title: 'Orange Money',
                    description: 'Paiement mobile',
                  },
                  {
                    value: 'delivery' as const,
                    title: 'À la livraison',
                    description: 'Selon votre adresse',
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex min-h-20 cursor-pointer flex-col justify-center gap-2 rounded-lg border border-(--line) px-4 py-3 text-center transition-colors has-checked:border-(--ink) has-checked:bg-(--shell-bg)"
                  >
                    <input
                      required
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value)}
                      className="sr-only"
                    />
                    <span className="text-sm text-(--ink)">{option.title}</span>
                    <span className="text-[10px] text-(--muted)">{option.description}</span>
                  </label>
                ))}
              </fieldset>
            </section>

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#1c1c1c] px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
            </button>
          </form>

          <aside className="self-start rounded-xl border border-(--line) bg-(--paper) p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="text-sm font-semibold text-(--ink)">Votre commande</h2>
            <div className="mt-5 divide-y divide-(--line) border-y border-(--line)">
              {items.map((item) => (
                <div key={item.product.ProductId} className="flex gap-3 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-(--card)">
                    <Image src={normalizeImageSrc(item.product.ProductImage?.[0]?.ImageUrl)} alt={item.product.ProductName} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm leading-5 text-(--ink)">{item.product.ProductName}</p>
                    <p className="mt-1 text-xs text-(--muted)">Qté {item.quantity}</p>
                  </div>
                  <span className="text-sm text-(--ink)">{formatPrice(Number(item.product.Price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 text-xs text-(--muted)">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="text-(--ink)">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-(--ink)">Offerte</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-(--line) pt-4 text-base font-semibold text-(--ink)">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <p className="mt-4 text-center text-[10px] leading-5 text-(--muted)">Paiement sécurisé · Livraison rapide</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
