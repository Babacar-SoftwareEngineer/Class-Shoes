import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductPurchasePanel from '../../../components/ProductPurchasePanel';
import { getProductById, getProducts } from '../../../services/productService';
import { formatPrice } from '../../../lib/catalog';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  const images = product.ProductImage?.length
    ? product.ProductImage
    : [{ ImageId: product.ProductId, ImageUrl: '/p1.jpg' }];
  const relatedFromCategory = (await getProducts({ limit: 8, categoryId: product.CategoryId ?? undefined })).data
    .filter((item) => item.ProductId !== product.ProductId)
    .slice(0, 4);
  const related = relatedFromCategory.length > 0
    ? relatedFromCategory
    : (await getProducts({ limit: 8 })).data.filter((item) => item.ProductId !== product.ProductId).slice(0, 4);

  return (
    <div className="bg-(--shell-bg)">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <p className="mb-8 text-[10px] uppercase tracking-[0.24em] text-(--muted)">
          <Link href="/products" className="hover:text-(--ink)">Accueil</Link> / {product.Category?.CategoryName ?? 'Collection'} / {product.ProductName}
        </p>

        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-(--card)">
              <Image src={images[0].ImageUrl} alt={product.ProductName} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            </div>
            {images.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {images.map((image) => (
                  <div key={image.ImageId} className="relative aspect-square overflow-hidden rounded-lg bg-(--card)">
                    <Image src={image.ImageUrl} alt="" fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-center py-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-(--muted)">{product.Category?.CategoryName ?? 'Collection'}</p>
            <div className="mt-4">
              <h1 className="font-serif text-4xl leading-tight text-(--ink) sm:text-5xl">{product.ProductName}</h1>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-(--muted)">
              <span className="tracking-[0.18em] text-(--ink)">★★★★★</span>
              <span>4,9 · 48 avis</span>
            </div>
            <ProductPurchasePanel product={product} />

            <div className="mt-10 divide-y divide-(--line) border-y border-(--line) text-[10px] uppercase tracking-[0.22em]">
              <details open className="py-4">
                <summary className="cursor-pointer">Détails & matière</summary>
                <p className="mt-3 max-w-md text-xs font-normal normal-case leading-6 tracking-normal text-(--muted)">Une fabrication en petite série, pensée pour durer et se patiner avec le temps.</p>
              </details>
              <details className="py-4"><summary className="cursor-pointer">Livraison & retours</summary></details>
              <details className="py-4"><summary className="cursor-pointer">Entretien</summary></details>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-24">
            <h2 className="font-serif text-3xl text-(--ink)">Vous aimerez aussi</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((item) => (
                <Link key={item.ProductId} href={`/product/${item.ProductId}`} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-(--card)">
                    <Image src={item.ProductImage?.[0]?.ImageUrl ?? '/p1.jpg'} alt={item.ProductName} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-3 flex justify-between gap-3 text-xs"><span>{item.ProductName}</span><span>{formatPrice(item.Price)}</span></div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
