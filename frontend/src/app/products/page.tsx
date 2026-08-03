import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '../../components/AddToCartButton';
import { getProducts, ProductFilters, Product } from '../../services/productService';

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

const CATEGORIES = [
  { id: 1, name: 'Sacs à main', icon: '👜' },
  { id: 2, name: 'Cabas', icon: '🛍️' },
  { id: 3, name: 'Sacs bandoulière', icon: '🎒' },
  { id: 4, name: 'Escarpins', icon: '👠' },
  { id: 5, name: 'Sandales', icon: '👡' },
  { id: 6, name: 'Bottines', icon: '🥾' },
  { id: 7, name: 'Ballerines', icon: '🥿' },
  { id: 8, name: 'Sneakers femme', icon: '👟' },
  { id: 9, name: 'Mules', icon: '✨' },
  { id: 10, name: 'Mocassins', icon: '🥿' },
];

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

  return (
    <div className="min-h-screen bg-[var(--shell-bg)] px-4 py-6 sm:px-6 lg:px-8">
      <section className="overflow-hidden border border-[var(--line)] bg-white">
        <div className="bg-[var(--page-bg)] px-6 py-16 text-center text-white">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Collection 2026</p>
          <h1 className="mt-4 font-serif text-4xl uppercase tracking-[0.12em] sm:text-5xl">
            Sacs & chaussures femme
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/75">
            Une sélection premium de sacs, escarpins, bottines et essentiels femme pensée pour une boutique plus élégante.
          </p>
        </div>

        <div className="grid gap-8 px-4 py-8 lg:grid-cols-[280px_1fr] lg:px-6">
          <aside className="space-y-6">
            <div className="border border-[var(--line)] p-4">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--ink)]">
                  Filtres
                </h2>
                {(currentSearch || currentCategory || currentMinPrice || currentMaxPrice || currentSortBy !== 'CreatedAt') ? (
                  <Link href="/products" className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
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

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                    Recherche
                  </label>
                  <input
                    type="text"
                    name="search"
                    defaultValue={currentSearch}
                    placeholder="Sac à main, escarpins..."
                    className="w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm focus-ring"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
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
                        !currentCategory ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--line)] hover:bg-[var(--paper)]'
                      }`}
                    >
                      <span>Tous les produits</span>
                      <span>✦</span>
                    </Link>
                    {CATEGORIES.map((cat) => (
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
                          currentCategory === cat.id ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--line)] hover:bg-[var(--paper)]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                    Prix
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={currentMinPrice ?? ''}
                      placeholder="Min"
                      min="0"
                      className="w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm focus-ring"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={currentMaxPrice ?? ''}
                      placeholder="Max"
                      min="0"
                      className="w-full border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm focus-ring"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-3 w-full bg-[var(--page-bg)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#3a0b13]"
                  >
                    Appliquer
                  </button>
                </div>
              </form>
            </div>
          </aside>

          <main className="space-y-6">
            <div className="flex flex-col gap-4 border border-[var(--line)] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--muted)]">
                Nous avons trouvé <span className="font-semibold text-[var(--ink)]">{pagination.totalItems}</span> produits
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">Tri</span>
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
                    currentSortBy === 'CreatedAt' ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--line)]'
                  }`}
                >
                  Plus récents
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
                    currentSortBy === 'Price' ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--line)]'
                  }`}
                >
                  Prix
                </Link>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="border border-[var(--line)] bg-white p-10 text-center">
                <h3 className="text-xl font-semibold text-[var(--ink)]">Aucun produit ne correspond</h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
                  Essayez de réinitialiser vos filtres ou d&apos;affiner votre recherche pour découvrir plus d&apos;articles.
                </p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex bg-[var(--page-bg)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white"
                >
                  Voir tout le catalogue
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product: Product) => {
                  const imageUrl = product.ProductImage?.[0]?.ImageUrl || defaultImage;

                  return (
                    <article key={product.ProductId} className="group border border-[var(--line)] bg-white">
                      <div className="relative aspect-square bg-[#f5f2ec]">
                        <Image
                          src={imageUrl}
                          alt={product.ProductName}
                          fill
                          sizes="(max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {product.Quantity === 0 ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                              Épuisé
                            </span>
                          </div>
                        ) : product.Quantity <= 5 ? (
                          <span className="absolute left-3 top-3 bg-[#d8b04b] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                            Stock limité
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-4 p-5">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                            {product.Category?.CategoryName || 'Collection'}
                          </p>
                          <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">
                            {product.ProductName}
                          </h3>
                        </div>

                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">Prix</p>
                            <p className="text-xl font-bold text-[var(--ink)]">${Number(product.Price).toFixed(2)}</p>
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
                    className="border border-[var(--line)] px-3 py-2 text-sm"
                  >
                    Précédent
                  </Link>
                ) : (
                  <span className="border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]">
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
                          isCurrent ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--line)]'
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  }

                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={page} className="w-8 text-center text-[var(--muted)]">
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
                    className="border border-[var(--line)] px-3 py-2 text-sm"
                  >
                    Suivant
                  </Link>
                ) : (
                  <span className="border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)]">
                    Suivant
                  </span>
                )}
              </div>
            ) : null}
          </main>
        </div>
      </section>
    </div>
  );
}
