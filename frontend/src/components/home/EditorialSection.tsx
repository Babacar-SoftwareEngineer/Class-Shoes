import Image from 'next/image';
import Link from 'next/link';

export default function EditorialSection() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden border border-[var(--line)] md:grid-cols-2">
        <article className="group relative min-h-[360px] overflow-hidden bg-[#e7ddd2]">
          <Image
            src="https://images.unsplash.com/photo-1614179689702-355944cd0918?auto=format&fit=crop&w=1200&q=80"
            alt="Sac à main éditorial"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.4))]" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">Lookbook</p>
            <h3 className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] sm:text-4xl">
              Sacs signatures
            </h3>
            <Link
              href="/products?categoryId=1"
              className="mt-4 inline-flex items-center gap-2 border border-white/35 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Voir les sacs
            </Link>
          </div>
        </article>

        <article className="group relative min-h-[360px] overflow-hidden bg-[#d8c8b6]">
          <Image
            src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80"
            alt="Chaussure femme éditoriale"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.35))]" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">Campaign</p>
            <h3 className="mt-2 font-serif text-3xl uppercase tracking-[0.08em] sm:text-4xl">
              Chaussures femme
            </h3>
            <Link
              href="/products?categoryId=8"
              className="mt-4 inline-flex items-center gap-2 border border-white/35 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Découvrir
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
