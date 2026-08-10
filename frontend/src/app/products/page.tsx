import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '../../components/AddToCartButton';
import { getProducts, ProductFilters, Product } from '../../services/productService';
import { CATALOG_CATEGORIES, formatPrice } from '../../lib/catalog';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

function buildLink(params: Record<string, string | undefined>) {
  const nextParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== '') {
      nextParams.set(key, value);
    }
  });

  const query = nextParams.toString();
  return query ? `/products?${query}` : '/products';
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const currentSearch = params.search || '';
  const currentCategory = params.categoryId ? Number(params.categoryId) : undefined;
  const currentMinPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const currentMaxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const currentSortBy = params.sortBy || 'CreatedAt';
  const currentSortOrder = (params.sortOrder as 'asc' | 'desc') || 'desc';

  const filters: ProductFilters = {
    page: currentPage,
    limit: 9,
    search: currentSearch,
    categoryId: currentCategory,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  };

  const response = await getProducts(filters);
  const products = response.data || [];
  const pagination = response.pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 9,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const defaultImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80';
  const isShoesPage = currentCategory === 4;

  return (
    <div className="min-h-screen bg-(--shell-bg)">
      <section className="bg-(--page-bg) px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-(--muted)">Accueil / {isShoesPage ? 'Chaussures' : 'Collection 2026'}</p>
            <h1 className="mt-6 max-w-lg font-serif text-5xl leading-[0.98] text-(--ink) sm:text-6xl">{isShoesPage ? 'Chaussures' : 'La collection, pensée avec soin.'}</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-(--muted)">
              {isShoesPage ? 'Talons, chaussures plates et bottines en cuir italien. Chaque paire est finie à la main et pensée pour vous accompagner du matin au soir.' : 'Cuirs structurés, silhouettes sculptées et signatures discrètes pour le vestiaire quotidien.'}
            </p>
          </div>
          <div className="relative aspect-16/7 w-full overflow-hidden rounded-xl bg-(--card) lg:max-w-155 lg:justify-self-end">
            <Image src={isShoesPage ? '/cat-shoes.jpg' : '/cat-bags.jpg'} alt={isShoesPage ? 'Chaussures Class Shoes' : 'Collection de sacs Class Shoes'} fill sizes="(max-width: 1024px) 100vw, 620px" quality={82} className="object-cover object-center" priority />
          </div>
        </div>
      </section>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
          <aside className="space-y-6">
            <div className="border-t border-(--ink) pt-4">
              <div className="flex items-center justify-between border-b border-(--line) pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-(--ink)">
                  Filtres
                </h2>
                {(currentSearch || currentCategory || currentMinPrice || currentMaxPrice || currentSortBy !== 'CreatedAt') ? (
                  <Link href="/products" className="text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                    Réinitialiser
                  </Link>
                ) : null}
              </div>

              <form action="/products" method="GET" className="mt-4 space-y-4">
                {currentCategory ? <input type="hidden" name="categoryId" value={currentCategory} /> : null}
                {currentMinPrice ? <input type="hidden" name="minPrice" value={currentMinPrice} /> : null}
                {currentMaxPrice ? <input type="hidden" name="maxPrice" value={currentMaxPrice} /> : null}
                {currentSortBy !== 'CreatedAt' ? <input type="hidden" name="sortBy" value={currentSortBy} /> : null}
                {currentSortOrder !== 'desc' ? <input type="hidden" name="sortOrder" value={currentSortOrder} /> : null}

                {!isShoesPage ? <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                    Recherche
                  </label>
                  <input
                    type="text"
                    name="search"
                    defaultValue={currentSearch}
                    placeholder="Sac à main, escarpins..."
                    className="w-full border border-(--line) bg-(--paper) px-3 py-2 text-sm focus-ring"
                  />
                </div> : (
                  <>
                    <div>
                      <label className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-(--muted)">Style</label>
                      <div className="space-y-2 text-xs text-(--ink)">
                        {['Talons', 'Plates', 'Bottines', 'Sandales'].map((style) => <label key={style} className="flex items-center gap-2"><input type="radio" name="style" className="accent-(--ink)" />{style}</label>)}
                      </div>
                    </div>
                    <div className="border-t border-(--line) pt-5">
                      <label className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-(--muted)">Couleur</label>
                      <div className="space-y-2 text-xs text-(--ink)">
                        {['Sable', 'Noir'].map((colour) => <label key={colour} className="flex items-center gap-2"><input type="radio" name="colour" className="accent-(--ink)" />{colour}</label>)}
                      </div>
                    </div>
                  </>
                )}

                {!isShoesPage ? <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                    Catégories
                  </label>
                  <div className="space-y-1.5">
                    <Link
                      href={buildLink({
                        search: currentSearch,
                        page: '1',
                        sortBy: currentSortBy,
                        sortOrder: currentSortOrder,
                      })}
                      className={`flex items-center justify-between border px-3 py-2 text-sm transition-colors ${
                        !currentCategory ? 'border-(--ink) bg-(--ink) text-white' : 'border-(--line) hover:bg-(--paper)'
                      }`}
                    >
                      <span>Tous les produits</span>
                      <span>✦</span>
                    </Link>
                    {CATALOG_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={buildLink({
                          search: currentSearch,
                          categoryId: String(cat.id),
                          minPrice: currentMinPrice?.toString(),
                          maxPrice: currentMaxPrice?.toString(),
                          sortBy: currentSortBy,
                          sortOrder: currentSortOrder,
                          page: '1',
                        })}
                        className={`flex items-center justify-between border px-3 py-2 text-sm transition-colors ${
                          currentCategory === cat.id ? 'border-(--ink) bg-(--ink) text-white' : 'border-(--line) hover:bg-(--paper)'
                        }`}
                      >
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div> : null}

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-(--muted)">
                    Prix (FCFA)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={currentMinPrice ?? ''}
                      placeholder="Min"
                      min="0"
                      className="w-full border border-(--line) bg-(--paper) px-3 py-2 text-sm focus-ring"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={currentMaxPrice ?? ''}
                      placeholder="Max"
                      min="0"
                      className="w-full border border-(--line) bg-(--paper) px-3 py-2 text-sm focus-ring"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-3 w-full bg-(--ink) px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-(--muted)"
                  >
                    Appliquer
                  </button>
                </div>
              </form>
            </div>
          </aside>

            <main className="space-y-6">
            <div className="flex flex-col gap-4 border-y border-(--line) py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-(--muted)">
                <span className="font-semibold text-(--ink)">{pagination.totalItems}</span> produits trouvés
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-(--muted)">Trier</span>
                <Link
                  href={buildLink({
                    search: currentSearch,
                    categoryId: currentCategory?.toString(),
                    minPrice: currentMinPrice?.toString(),
                    maxPrice: currentMaxPrice?.toString(),
                    sortBy: 'CreatedAt',
                    sortOrder: 'desc',
                    page: '1',
                  })}
                  className={`border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                    currentSortBy === 'CreatedAt' ? 'border-(--ink) bg-(--ink) text-white' : 'border-(--line)'
                  }`}
                >
                  Nouveautés
                </Link>
                <Link
                  href={buildLink({
                    search: currentSearch,
                    categoryId: currentCategory?.toString(),
                    minPrice: currentMinPrice?.toString(),
                    maxPrice: currentMaxPrice?.toString(),
                    sortBy: 'Price',
                    sortOrder: currentSortBy === 'Price' && currentSortOrder === 'asc' ? 'desc' : 'asc',
                    page: '1',
                  })}
                  className={`border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                    currentSortBy === 'Price' ? 'border-(--ink) bg-(--ink) text-white' : 'border-(--line)'
                  }`}
                >
                  Prix
                </Link>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="border border-(--line) bg-white p-10 text-center">
                <h3 className="text-xl font-semibold text-(--ink)">Aucun produit ne correspond</h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-(--muted)">
                  Essayez de réinitialiser vos filtres ou d&apos;affiner votre recherche pour découvrir plus d&apos;articles.
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex bg-(--page-bg) px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white"
                >
                  Voir tout le catalogue
                </Link>
              </div>
            ) : (
              <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 ${isShoesPage ? 'lg:grid-cols-2 lg:gap-x-8' : 'lg:grid-cols-3'}`}>
                {products.map((product: Product) => {
                  const imageUrl = product.ProductImage?.[0]?.ImageUrl || defaultImage;

                  return (
                    <article key={product.ProductId} className="group">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-(--card)">
                        <Link href={`/product/${product.ProductId}`} className="absolute inset-0">
                          <Image
                            src={imageUrl}
                            alt={product.ProductName}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </Link>

                        {product.Quantity === 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-(--ink)/55">
                            <span className="bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-(--ink)">
                              Épuisé
                            </span>
                          </div>
                        ) : product.Quantity <= 5 ? (
                          <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-(--ink)">
                            Stock limité
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-3 pt-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-(--muted)">
                            {product.Category?.CategoryName || 'Collection'}
                          </p>
                          <h3 className="mt-1 text-sm font-normal text-(--ink)">
                            {product.ProductName}
                          </h3>
                        </div>

                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-(--muted)">Prix</p>
                            <p className="text-xl font-semibold text-(--ink)">{formatPrice(product.Price)}</p>
                          </div>
                          <AddToCartButton product={product} />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {pagination.totalPages > 1 ? (
              <div className="flex items-center justify-center gap-2 pt-4">
                {pagination.hasPrevPage ? (
                  <Link
                    href={buildLink({
                      search: currentSearch,
                      categoryId: currentCategory?.toString(),
                      minPrice: currentMinPrice?.toString(),
                      maxPrice: currentMaxPrice?.toString(),
                      sortBy: currentSortBy,
                      sortOrder: currentSortOrder,
                      page: String(currentPage - 1),
                    })}
                    className="border border-(--line) px-3 py-2 text-sm"
                  >
                    Précédent
                  </Link>
                ) : (
                  <span className="border border-(--line) px-3 py-2 text-sm text-(--muted)">
                    Précédent
                  </span>
                )}

                {Array.from({ length: pagination.totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isCurrent = page === currentPage;

                  if (page === 1 || page === pagination.totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                    return (
                      <Link
                        key={page}
                        href={buildLink({
                          search: currentSearch,
                          categoryId: currentCategory?.toString(),
                          minPrice: currentMinPrice?.toString(),
                          maxPrice: currentMaxPrice?.toString(),
                          sortBy: currentSortBy,
                          sortOrder: currentSortOrder,
                          page: String(page),
                        })}
                        className={`flex h-10 w-10 items-center justify-center border text-sm font-semibold ${
                          isCurrent ? 'border-(--ink) bg-(--ink) text-white' : 'border-(--line)'
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  }

                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={page} className="w-8 text-center text-(--muted)">
                        ...
                      </span>
                    );
                  }

                  return null;
                })}

                {pagination.hasNextPage ? (
                  <Link
                    href={buildLink({
                      search: currentSearch,
                      categoryId: currentCategory?.toString(),
                      minPrice: currentMinPrice?.toString(),
                      maxPrice: currentMaxPrice?.toString(),
                      sortBy: currentSortBy,
                      sortOrder: currentSortOrder,
                      page: String(currentPage + 1),
                    })}
                    className="border border-(--line) px-3 py-2 text-sm"
                  >
                    Suivant
                  </Link>
                ) : (
                  <span className="border border-(--line) px-3 py-2 text-sm text-(--muted)">
                    Suivant
                  </span>
                )}
              </div>
            ) : null}
          </main>
        </div>

    </div>
  );
}
