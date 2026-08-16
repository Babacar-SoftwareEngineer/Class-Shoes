import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '../../lib/catalog';

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

export default function ProductGrid({ title, products, viewAllHref = '/products' }: ProductGridProps) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-(--page-bg)">
      <div className="mx-auto max-w-7xl">
        {title && (
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl text-(--ink) md:text-4xl">
              {title}
            </h2>
            <Link
              href={viewAllHref}
              className="text-xs font-semibold text-(--muted) transition-colors hover:text-(--ink)"
            >
              Voir tout
            </Link>
          </div>
        )}

        <div className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {products.map((product) => (
            <article key={product.id} className="group relative flex w-[260px] shrink-0 snap-start flex-col sm:w-[280px]">
              <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-(--card)">
                {product.badge === 'new' && (
                  <span className="absolute left-3 top-3 z-10 flex h-7 items-center bg-white px-3 text-[10px] font-semibold text-(--ink)">
                    NEW
                  </span>
                )}

                <Link href={`/product/${product.id}`} className="absolute inset-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    fill
                    sizes="(max-width: 768px) 260px, 280px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-(--ink)">
                    {product.name}
                  </h3>
                  <span className="text-sm text-(--ink)">{formatPrice(product.price)}</span>
                </div>
                <p className="mt-1 text-xs text-(--muted)">
                  {product.category}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
