import Image from 'next/image';
import Link from 'next/link';

export interface ProductCardData {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: 'new' | 'sale' | 'limited' | 'bestseller' | string;
}

interface ProductGridProps {
  title?: string;
  products: ProductCardData[];
  viewAllHref?: string;
}

const badgeLabel = (badge?: string) => {
  if (!badge) {
    return '';
  }

  if (badge === 'sale') {
    return 'Sale';
  }

  return badge.replace(/-/g, ' ').toUpperCase();
};

export default function ProductGrid({ title, products, viewAllHref = '/products' }: ProductGridProps) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-t border-[var(--line)] pt-6">
        {title && (
          <div className="mb-5 flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h2 className="section-title text-[clamp(1.4rem,2.6vw,2rem)] text-[var(--ink)]">
              {title}
            </h2>

            <Link
              href={viewAllHref}
              className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              Tout voir
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {products.map((product) => {
            const label = badgeLabel(product.badge);

            return (
              <article key={product.id} className="group flex flex-col">
                <div className="relative aspect-square overflow-hidden border border-[var(--line)] bg-[#f5f2ec]">
                  {label && (
                    <span className="absolute right-3 top-3 z-10 bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)] shadow-sm">
                      {label}
                    </span>
                  )}

                  <Image
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="px-1 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                    {product.category}
                  </p>
                  <h3 className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--ink)]">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice ? (
                      <span className="text-[11px] text-[var(--muted)] line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
