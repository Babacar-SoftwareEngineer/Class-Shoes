import Link from 'next/link';
import Image from 'next/image';

const ECO_PRODUCTS = [
  { id: 1, image: '/p1.jpg', name: 'Eco Runner' },
  { id: 2, image: '/p2.jpg', name: 'Green Step' },
  { id: 3, image: '/p3.jpg', name: 'Nature Walk' },
  { id: 4, image: '/p4.jpg', name: 'Earth Sneaker' },
  { id: 5, image: '/p5.jpg', name: 'Bamboo Slide' },
];

export default function EcoBanner() {
  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 p-8 md:p-12 animate-fade-in-up">
          {/* Background decorations */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5" />

          {/* Leaf SVG decoration */}
          <svg className="absolute top-4 right-8 w-20 h-20 text-white/10 rotate-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
          </svg>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            {/* Text content */}
            <div className="flex-1 space-y-3 text-center lg:text-left">
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
                🌿 Collection responsable
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Une mode plus responsable,{' '}
                <span className="text-emerald-100">pensée pour durer.</span>
              </h2>
              <p className="text-sm text-emerald-100/80 max-w-md font-medium">
                Découvrez nos chaussures fabriquées avec des matières recyclées et organiques.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-white text-emerald-700 text-sm font-bold rounded-full hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.97] group"
              >
                Découvrir la collection responsable
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Product thumbnails */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 lg:pb-0">
              {ECO_PRODUCTS.map((product, i) => (
                <div
                  key={product.id}
                  className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg hover:scale-105 hover:border-white/60 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
