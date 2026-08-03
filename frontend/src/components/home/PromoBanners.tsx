import Link from 'next/link';

const BANNERS = [
  {
    title: 'New Season Collection',
    subtitle: 'Fresh styles for spring & summer',
    cta: 'Explore',
    href: '/products',
    bgClass: 'bg-gradient-to-br from-emerald-600 to-teal-700',
    icon: (
      <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    title: 'Premium Leather',
    subtitle: 'Handcrafted quality that lasts',
    cta: 'Discover',
    href: '/products?categoryId=5',
    bgClass: 'bg-gradient-to-br from-zinc-800 to-zinc-950',
    icon: (
      <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: 'Limited Edition',
    subtitle: 'Exclusive drops — while stocks last',
    cta: 'Shop Now',
    href: '/products',
    bgClass: 'bg-gradient-to-br from-amber-500 to-orange-600',
    icon: (
      <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.545 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
];

export default function PromoBanners() {
  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BANNERS.map((banner, index) => (
            <Link
              key={index}
              href={banner.href}
              className={`relative overflow-hidden rounded-2xl ${banner.bgClass} p-6 md:p-8 text-white group transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/20 hover:-translate-y-1 animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute bottom-0 right-0">{banner.icon}</div>

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Special Offer
                </span>
                <h3 className="text-lg md:text-xl font-extrabold leading-tight">
                  {banner.title}
                </h3>
                <p className="text-xs text-white/70 font-medium max-w-[200px]">
                  {banner.subtitle}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 group-hover:bg-white/30 transition-all">
                    {banner.cta}
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
