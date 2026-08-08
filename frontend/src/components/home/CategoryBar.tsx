import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HOUSE_LINKS } from '../../lib/catalog';

export default function CategoryBar() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-(--page-bg)">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 font-serif text-3xl text-(--ink) md:text-4xl">
          Les quatre maisons
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOUSE_LINKS.map((category) => (
            <div key={category.label} className="group flex flex-col">
              <Link href={category.href} className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-(--card)">
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-(--ink)">{category.label}</h3>
                  <Link href={category.href} className="mt-1 block text-xs text-(--muted) transition-colors hover:text-(--ink)">
                    {category.description}
                  </Link>
                </div>
                <Link href={category.href} className="text-(--muted) transition-colors hover:text-(--ink)">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
