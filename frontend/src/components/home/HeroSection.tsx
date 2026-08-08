import Image from 'next/image';
import { Button } from '../ui/Button';

export default function HeroSection() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8 bg-(--page-bg)">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center pt-10 lg:pt-0">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-(--muted)">
              COLLECTION AUTOMNE 2026
            </p>
            <h1 className="mb-6 font-serif text-[clamp(3.5rem,6vw,5.5rem)] leading-[1.05] tracking-tight text-(--ink)">
              Dressed<br />
              <span className="italic">with intention.</span>
            </h1>
            <p className="mb-10 max-w-md text-sm leading-relaxed text-(--muted)">
              Chaussures, sacs, parfums et accessoires fabriqués en petites séries. Matières choisies, proportions justes, rien de superflu.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">DÉCOUVRIR LA COLLECTION</Button>
              <Button variant="outline">VOIR LES NOUVEAUTÉS</Button>
            </div>
          </div>

          <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl lg:aspect-3/4">
            <Image
              src="/hero.jpg"
              alt="Dressed with intention"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
