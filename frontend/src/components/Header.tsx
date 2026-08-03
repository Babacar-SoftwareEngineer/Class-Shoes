'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';
import ClassShoesLogo from './ClassShoesLogo';

export default function Header() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'FEMME', href: '/products?categoryId=1' },
    { label: 'SACS', href: '/products?categoryId=2' },
    { label: 'CHAUSSURES', href: '/products?categoryId=4' },
    { label: 'NOUVEAUTÉS', href: '/products?sortBy=CreatedAt&sortOrder=desc' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--line)] bg-[var(--shell-bg)]/96 backdrop-blur-md">
      <div className="border-b border-[var(--line)] bg-[var(--page-bg)] px-4 py-1.5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-white/85 sm:text-[11px]">
        <span>Livraison offerte en ligne pendant une durée limitée.</span>
        <Link href="/products" className="ml-2 text-[var(--gold)] transition-colors hover:text-white">
          Découvrir la sélection
        </Link>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--ink)] focus-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMobileMenuOpen((value) => !value)}
            className="inline-flex items-center justify-start text-[var(--muted)] transition-colors hover:text-[var(--ink)] lg:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="justify-self-center">
            <ClassShoesLogo height={42} variant="dark" />
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-2 text-[var(--muted)]">
            <Link href="/products" className="rounded-full p-2 transition-colors hover:text-[var(--ink)] focus-ring" title="Search">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="hidden rounded-full p-2 transition-colors hover:text-[var(--ink)] focus-ring sm:inline-flex"
              title="Account"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <Link href="/cart" className="relative rounded-full p-2 transition-colors hover:text-[var(--ink)] focus-ring" title="Cart">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute right-0 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--page-bg)] px-1 text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="hidden items-center gap-1.5 border-l border-[var(--line)] pl-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)] transition-colors hover:text-[var(--ink)] lg:inline-flex"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[var(--line)] bg-[var(--shell-bg)] px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-[var(--line)] pb-2 transition-colors hover:text-[var(--ink)]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="pt-2 transition-colors hover:text-[var(--ink)]"
            >
              Tous les produits
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
