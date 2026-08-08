'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="w-full">
      {/* Newsletter Section */}
      <div className="bg-[#EAE4D9] px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-4xl font-serif text-(--ink) md:text-5xl">Restez proche de la maison</h2>
        <p className="mx-auto mb-8 max-w-md text-sm text-(--ink)">
          Recevez nos nouveautés, nos offres exclusives et nos inspirations de style.
        </p>

        {subscribed ? (
          <div className="mx-auto max-w-md rounded-none border border-(--ink) bg-transparent px-4 py-3 text-sm text-(--ink)">
            Merci, votre inscription est confirmée.
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mx-auto flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <input
              type="email"
              required
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-full border border-(--ink)/20 bg-white/50 px-6 py-3 text-sm text-(--ink) placeholder:text-(--ink)/50 focus-ring"
            />
            <Button type="submit" variant="primary">
              S&apos;INSCRIRE
            </Button>
          </form>
        )}
      </div>

      {/* Dark Footer Links Section */}
      <div className="bg-(--ink) px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 text-xs tracking-wider md:grid-cols-4">
          <div className="space-y-4">
            <ul className="space-y-3 uppercase text-white/70">
              <li><Link href="/products?categoryId=4" className="hover:text-white transition-colors">Chaussures</Link></li>
              <li><Link href="/products?categoryId=1" className="hover:text-white transition-colors">Sacs</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Parfums</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Accessoires</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <ul className="space-y-3 uppercase text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Service client</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Livraison & retours</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Questions fréquentes</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <ul className="space-y-3 uppercase text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Conditions générales</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <ul className="space-y-3 uppercase text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Notre maison</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Carrières</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Boutiques</Link></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl border-t border-white/10 pt-8 text-center text-[10px] uppercase tracking-widest text-white/40">
          © {new Date().getFullYear()} CLASS SHOES, TOUS DROITS RÉSERVÉS.
        </div>
      </div>
    </footer>
  );
}
