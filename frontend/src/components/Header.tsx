'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/useCart';
import ClassShoesLogo from './ClassShoesLogo';
import { HOUSE_LINKS } from '../lib/catalog';
import CartDrawer from './CartDrawer';
import { useAuthStore } from '../store/useAuthStore';

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const navLinks = HOUSE_LINKS.map(({ label, href }) => ({ label: label.toUpperCase(), href }));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--line) bg-(--shell-bg)/96 backdrop-blur-md">
      <div className="bg-(--ink) px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white">
        LIVRAISON ET RETOURS OFFERTS DANS LE MONDE ENTIER
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-(--muted) transition-colors hover:text-(--ink) focus-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="inline-flex items-center justify-start text-(--muted) transition-colors hover:text-(--ink) lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="justify-self-center">
            <ClassShoesLogo height={42} variant="dark" />
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-2 text-(--muted)">
            <Link href="/products" className="rounded-full p-2 transition-colors hover:text-(--ink) focus-ring" title="Rechercher">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            {user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-[10px] uppercase tracking-[0.18em] text-(--muted)">
                  {user.DisplayName || user.Email}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearSession();
                    router.push('/');
                  }}
                  className="rounded-full border border-(--line) px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-(--ink) transition-all hover:border-(--ink) hover:bg-gray-50"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 sm:flex">
                <Link href="/login" className="rounded-full border border-(--line) px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-(--ink) transition-all hover:border-(--ink) hover:bg-gray-50">
                  Connexion
                </Link>
                <Link href="/register" className="rounded-full bg-(--ink) px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white shadow-md transition-all hover:scale-105 hover:bg-(--muted) text-white hover:shadow-lg">
                  Inscription
                </Link>
              </div>
            )}
            <button type="button" onClick={() => setCartOpen(true)} className="relative rounded-full p-2 transition-colors hover:text-(--ink) focus-ring" title="Ouvrir le panier" aria-label="Ouvrir le panier">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute right-0 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-(--ink) px-1 text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-(--line) bg-(--shell-bg) px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-(--muted)">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-(--line) pb-2 transition-colors hover:text-(--ink)"
              >
                {link.label}
              </Link>
            ))}
            {!user ? (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="pt-2 transition-colors hover:text-(--ink)">
                  Connexion
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="transition-colors hover:text-(--ink)">
                  Inscription
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  setMobileMenuOpen(false);
                  router.push('/');
                }}
                className="pt-2 text-left transition-colors hover:text-(--ink)"
              >
                Déconnexion
              </button>
            )}
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-2 transition-colors hover:text-(--ink)"
            >
              Tous les produits
            </Link>
          </nav>
        </div>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
