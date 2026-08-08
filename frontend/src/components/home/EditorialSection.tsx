import Image from 'next/image';
import { Button } from '../ui/Button';

export default function EditorialSection() {
  return (
    <section className="bg-(--accent) w-full">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl lg:aspect-video">
            <Image
              src="/editorial-1.jpg"
              alt="Femme portant une silhouette Class Shoes"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>

          <div className="flex flex-col justify-center px-4 md:px-10">
            <h2 className="mb-6 font-serif text-[clamp(2.5rem,4vw,3.5rem)] leading-tight text-(--ink)">
              Pensé pour les<br />
              femmes qui<br />
              aiment la<br />
              simplicité
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed text-(--ink)/80">
              Chaussures, sacs, parfums et accessoires fabriqués en petites séries. Matières choisies, proportions justes, rien de superflu.
            </p>

            <div>
              <Button variant="primary">EN SAVOIR PLUS</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
