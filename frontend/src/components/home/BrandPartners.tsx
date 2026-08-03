const BRANDS = [
  { name: 'Nike', logo: 'NIKE' },
  { name: 'Adidas', logo: 'adidas' },
  { name: 'Puma', logo: 'PUMA' },
  { name: 'New Balance', logo: 'NB' },
  { name: 'Converse', logo: 'CONVERSE' },
  { name: 'Vans', logo: 'VANS' },
  { name: 'Reebok', logo: 'Reebok' },
  { name: 'Timberland', logo: 'Timberland' },
];

export default function BrandPartners() {
  return (
    <section className="w-full bg-zinc-50/50 dark:bg-zinc-900/30 border-y border-zinc-200/60 dark:border-zinc-800/40 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 mb-8">
          Trusted by the world&apos;s leading brands
        </p>

        {/* Brand logos row */}
        <div className="flex items-center justify-between gap-6 overflow-x-auto scrollbar-hide pb-2">
          {BRANDS.map((brand, index) => (
            <div
              key={brand.name}
              className="shrink-0 flex items-center justify-center min-w-[100px] h-12 px-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.06}s` }}
              title={brand.name}
            >
              <span className="text-lg md:text-xl font-black tracking-tighter text-zinc-600 dark:text-zinc-400 uppercase whitespace-nowrap select-none">
                {brand.logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
