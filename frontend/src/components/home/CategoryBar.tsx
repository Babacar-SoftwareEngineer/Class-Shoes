'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  {
    id: 1,
    title: 'Sacs à main',
    subtitle: 'Leather essentials',
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Cabas',
    subtitle: 'Daily carry',
    image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Escarpins',
    subtitle: 'Evening edit',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Sandales',
    subtitle: 'Summer heel',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Bottines',
    subtitle: 'City boots',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 8,
    title: 'Sneakers femme',
    subtitle: 'Clean sneakers',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function CategoryBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between border-b border-[var(--line)] pb-3">
        <h2 className="section-title text-[clamp(1.4rem,2.6vw,2rem)] text-[var(--ink)]">
          Categories
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="flex h-9 w-9 items-center justify-center border border-[var(--line)] text-[var(--muted)] transition-colors hover:bg-[var(--ink)] hover:text-white focus-ring"
            aria-label="Previous categories"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-9 w-9 items-center justify-center border border-[var(--line)] text-[var(--muted)] transition-colors hover:bg-[var(--ink)] hover:text-white focus-ring"
            aria-label="Next categories"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className="group relative aspect-square w-[190px] shrink-0 snap-start overflow-hidden border border-[var(--line)] bg-[var(--card)] sm:w-[208px]"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="208px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.62))]" />

            <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white">
              <p className="font-serif text-xl uppercase leading-none tracking-[0.1em]">
                {category.title}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/70">
                {category.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
