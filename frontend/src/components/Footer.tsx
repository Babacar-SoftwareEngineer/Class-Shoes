'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ClassShoesLogo from './ClassShoesLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubscribed(true);
    setEmail('');

    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="w-full bg-[#15100d] text-white">
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-b border-white/10 pb-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-[clamp(2.6rem,6vw,4.8rem)] font-serif uppercase leading-none tracking-[0.08em] text-white/35">
                Email
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                En laissant votre e-mail, vous acceptez de recevoir les nouveautés, lancements et offres privées.
              </p>
            </div>

            <div className="lg:justify-self-end">
              {subscribed ? (
                <div className="rounded-none border border-[#cfd56d]/30 bg-[#cfd56d]/10 px-4 py-3 text-sm text-[#e5eb9f]">
                  Thank you. You are now subscribed.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    required
                    placeholder="Adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-0 flex-1 border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus-ring"
                  />
                  <button
                    type="submit"
                    className="bg-[#dfe489] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#211911] transition-colors hover:bg-[#f1f3a7]"
                  >
                    Valider
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Contact</p>
              <Link href="mailto:lystre@gmail.com" className="mt-2 block text-lg text-white/90 transition-colors hover:text-white">
                lystre@gmail.com
              </Link>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Social</p>
              <p className="mt-2 text-sm text-white/75">Facebook / Instagram / Tiktok</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Explorer</p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li><Link href="/products" className="transition-colors hover:text-white">Sacs à main</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Chaussures femme</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Nouveautés</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Sélection</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Cartes cadeaux</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">À propos</p>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              <li><Link href="#" className="transition-colors hover:text-white">Blog</Link></li>
              <li><Link href="#" className="transition-colors hover:text-white">Notre histoire</Link></li>
              <li><Link href="#" className="transition-colors hover:text-white">FAQ</Link></li>
              <li><Link href="#" className="transition-colors hover:text-white">Carrières</Link></li>
              <li><Link href="#" className="transition-colors hover:text-white">Fondation</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">We accept</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-none border border-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Visa</span>
              <span className="rounded-none border border-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Mastercard</span>
              <span className="rounded-none border border-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Apple Pay</span>
              <span className="rounded-none border border-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">PayPal</span>
            </div>
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Legal</p>
              <Link href="#" className="mt-2 block text-sm text-white/75 transition-colors hover:text-white">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <ClassShoesLogo variant="light" height={54} />
          <p className="text-xs uppercase tracking-[0.22em] text-white/35">
            {new Date().getFullYear()} Class Shoes. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
