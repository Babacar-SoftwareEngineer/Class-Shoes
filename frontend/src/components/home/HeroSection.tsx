import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="px-4 pt-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden border border-[var(--line)] bg-[#e7dfd5]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1800&q=80"
            alt="Sac à main de la collection"
            fill
            sizes="(max-width: 1080px) 100vw, 1080px"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.05))]" />
        </div>

        <div className="relative z-10 flex min-h-[520px] flex-col justify-between px-5 py-5 sm:px-8 sm:py-8 lg:min-h-[640px] lg:px-10 lg:py-10">
          <div className="flex items-start justify-between gap-4">
            <div className="hidden max-w-[240px] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6f6258] sm:block">
              Sacs / Escarpins / Sandales / Bottines
            </div>

            <div className="rounded-full border border-[#88786a]/35 bg-white/45 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5f5348] backdrop-blur-sm">
              Nouvelle saison
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <p className="text-center font-serif text-[clamp(2.5rem,8vw,6.6rem)] uppercase leading-[0.92] tracking-[0.08em] text-[#5e5147]">
              Sacs & chaussures femme
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-xl space-y-4">
              <p className="max-w-md text-sm leading-6 text-[#4e4339]">
                Une sélection épurée de sacs, escarpins et essentiels femme pensée comme une vitrine éditoriale.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-[#4f4338] bg-white/70 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2a211b] transition-colors hover:bg-white focus-ring"
              >
                Découvrir la collection
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="justify-self-end rounded-none border border-[#8a7a6c]/30 bg-[#f0e9df]/85 px-5 py-4 text-right backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6f6258]">
                Jusqu&apos;à
              </p>
              <p className="font-serif text-5xl leading-none text-[#6a5b4e]">
                5%
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#6f6258]">
                cash back garanti
              </p>
              <p className="mt-2 max-w-[190px] text-[10px] leading-5 text-[#6f6258]">
                Des avantages à chaque commande, tout au long de la saison.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
