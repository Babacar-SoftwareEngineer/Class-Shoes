'use client';

import Link from 'next/link';
import { useCart } from '../hooks/useCart';

export default function Header() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/products" className="flex items-center gap-2 group">
          <span className="text-2xl">👟</span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-violet-500 group-hover:to-indigo-500 transition-all">
            Class Shoes
          </span>
        </Link>

        {/* Navigation & Cart */}
        <div className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            Boutique
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 text-sm font-bold transition-all"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Mon Panier</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center bg-violet-600 text-white text-[10px] font-black rounded-full px-1 shadow-sm border border-white dark:border-zinc-950 animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
