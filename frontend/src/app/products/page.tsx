import { getProducts, ProductFilters, Product } from '../../services/productService';
import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '../../components/AddToCartButton';

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
  { id: 1, name: 'Sneakers', icon: '👟' },
  { id: 2, name: 'Running', icon: '🏃' },
  { id: 3, name: 'Bottes', icon: '🥾' },
  { id: 4, name: 'Sandales', icon: '🩴' },
  { id: 5, name: 'Ville', icon: '👞' },
  { id: 6, name: 'Sport', icon: '⚽' },
];

export default async function ProductsPage({ searchParams }: PageProps) {
  // Await searchParams car sous Next.js 15+ / 16, c'est une Promise
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const currentSearch = params.search || '';
  const currentCategory = params.categoryId ? Number(params.categoryId) : undefined;
  const currentMinPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const currentMaxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const currentSortBy = params.sortBy || 'CreatedAt';
  const currentSortOrder = (params.sortOrder as 'asc' | 'desc') || 'desc';

  // Appel au service frontend de récupération des produits
  const filters: ProductFilters = {
    page: currentPage,
    limit: 9, // 9 produits par page pour une grille 3x3 propre
    search: currentSearch,
    categoryId: currentCategory,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder,
  };

  const response = await getProducts(filters);
  const products = response.data || [];
  const { totalPages, totalItems, hasNextPage, hasPrevPage } = response.pagination || {
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // Helper pour construire les liens des filtres en conservant les autres filtres
  const createFilterLink = (updates: Partial<typeof params>) => {
    const updatedParams = { ...params, ...updates };
    // Nettoyer les paramètres vides ou par défaut
    if (updatedParams.page && Number(updatedParams.page) === 1 && !updates.page) delete updatedParams.page;
    
    const searchString = new URLSearchParams(
      Object.entries(updatedParams).reduce((acc, [key, val]) => {
        if (val !== undefined && val !== '') acc[key] = val;
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    return `/products?${searchString}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-700 py-16 px-6 text-center text-white shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
        <div className="relative max-w-4xl mx-auto space-y-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            Collection 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Découvrez nos collections Class Shoes
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
            Une sélection premium alliant design contemporain et confort absolu pour toutes vos activités.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          
          {/* Section Filtres - Panneau Latéral */}
          <aside className="lg:col-span-1 space-y-6 mb-8 lg:mb-0">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm space-y-6 backdrop-blur-md">
              
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-lg font-bold tracking-tight">Filtres</h2>
                {(currentSearch || currentCategory || currentMinPrice || currentMaxPrice || currentSortBy !== 'CreatedAt') && (
                  <Link
                    href="/products"
                    className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    Réinitialiser
                  </Link>
                )}
              </div>

              {/* Recherche */}
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wide block">Recherche</label>
                <form action="/products" method="GET" className="relative">
                  {/* Inclure les filtres existants en inputs cachés pour les conserver lors du submit de la recherche */}
                  {currentCategory && <input type="hidden" name="categoryId" value={currentCategory} />}
                  {currentMinPrice && <input type="hidden" name="minPrice" value={currentMinPrice} />}
                  {currentMaxPrice && <input type="hidden" name="maxPrice" value={currentMaxPrice} />}
                  {currentSortBy !== 'CreatedAt' && <input type="hidden" name="sortBy" value={currentSortBy} />}
                  {currentSortOrder !== 'desc' && <input type="hidden" name="sortOrder" value={currentSortOrder} />}
                  
                  <input
                    type="text"
                    name="search"
                    defaultValue={currentSearch}
                    placeholder="Ex: Sneakers, Ville..."
                    className="w-full pl-4 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    🔍
                  </button>
                </form>
              </div>

              {/* Catégories */}
              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide block">Catégories</label>
                <div className="flex flex-col gap-1.5">
                  <Link
                    href={createFilterLink({ categoryId: '', page: '1' })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      !currentCategory
                        ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span>Tous les modèles</span>
                    <span className="text-xs">⚡</span>
                  </Link>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={createFilterLink({ categoryId: cat.id.toString(), page: '1' })}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        currentCategory === cat.id
                          ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
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

              {/* Tranche de prix */}
              <div className="space-y-3">
                <label className="text-sm font-semibold tracking-wide block">Prix (€)</label>
                <form action="/products" method="GET" className="grid grid-cols-2 gap-2">
                  {currentSearch && <input type="hidden" name="search" value={currentSearch} />}
                  {currentCategory && <input type="hidden" name="categoryId" value={currentCategory} />}
                  {currentSortBy !== 'CreatedAt' && <input type="hidden" name="sortBy" value={currentSortBy} />}
                  {currentSortOrder !== 'desc' && <input type="hidden" name="sortOrder" value={currentSortOrder} />}

                  <input
                    type="number"
                    name="minPrice"
                    defaultValue={currentMinPrice ?? ''}
                    placeholder="Min"
                    min="0"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    defaultValue={currentMaxPrice ?? ''}
                    placeholder="Max"
                    min="0"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all"
                  />
                  <button
                    type="submit"
                    className="col-span-2 mt-2 w-full py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-white text-xs font-semibold tracking-wide transition-all shadow-sm"
                  >
                    Appliquer le prix
                  </button>
                </form>
              </div>

            </div>
          </aside>

          {/* Section Produits */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Barre d'infos et de tri */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 px-6 py-4 rounded-2xl shadow-sm gap-4">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Nous avons trouvé <span className="font-bold text-zinc-900 dark:text-white">{totalItems}</span> produits
              </p>
              
              {/* Menu de Tri */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">Trier par:</span>
                <div className="flex gap-1.5">
                  <Link
                    href={createFilterLink({ sortBy: 'CreatedAt', sortOrder: 'desc', page: '1' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      currentSortBy === 'CreatedAt'
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Récents
                  </Link>
                  <Link
                    href={createFilterLink({
                      sortBy: 'Price',
                      sortOrder: currentSortBy === 'Price' && currentSortOrder === 'asc' ? 'desc' : 'asc',
                      page: '1',
                    })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                      currentSortBy === 'Price'
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    Prix {currentSortBy === 'Price' ? (currentSortOrder === 'asc' ? '↗️' : '↘️') : ''}
                  </Link>
                </div>
              </div>
            </div>

            {/* Grille des produits */}
            {products.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-12 text-center shadow-sm space-y-4">
                <div className="text-5xl">👟🤷‍♂️</div>
                <h3 className="text-xl font-bold">Aucun produit ne correspond</h3>
                <p className="text-zinc-500 max-w-sm mx-auto text-sm">
                  Essayez de réinitialiser vos filtres ou de modifier votre recherche pour découvrir d'autres articles.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow transition-all"
                >
                  Voir tous les produits
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product: Product) => {
                  const defaultImg = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';
                  const imageUrl = product.ProductImage && product.ProductImage.length > 0 
                    ? product.ProductImage[0].ImageUrl 
                    : defaultImg;
                  
                  return (
                    <div
                      key={product.ProductId}
                      className="group bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={product.ProductName}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.Quantity === 0 && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-wider bg-red-600 px-3 py-1 rounded-full">
                              Rupture
                            </span>
                          </div>
                        )}
                        {product.Quantity > 0 && product.Quantity <= 5 && (
                          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-sm">
                            Stock Limité
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                            {product.Category?.CategoryName || 'Chaussures'}
                          </span>
                          <h3 className="font-bold text-base leading-snug group-hover:text-violet-600 transition-colors line-clamp-2">
                            {product.ProductName}
                          </h3>
                        </div>

                        <div className="flex justify-between items-end pt-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">Prix</span>
                            <span className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                              {Number(product.Price).toFixed(2)} €
                            </span>
                          </div>
                          
                          <AddToCartButton product={product} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                
                {/* Précédent */}
                {hasPrevPage ? (
                  <Link
                    href={createFilterLink({ page: (currentPage - 1).toString() })}
                    className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-semibold"
                  >
                    ◀
                  </Link>
                ) : (
                  <span className="p-2.5 border border-zinc-100 dark:border-zinc-800 rounded-xl text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                    ◀
                  </span>
                )}

                {/* Numéros de page */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrent = pageNumber === currentPage;

                    // N'afficher que les pages proches pour éviter d'avoir 1000 boutons si database volumineuse
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <Link
                          key={pageNumber}
                          href={createFilterLink({ page: pageNumber.toString() })}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold tracking-wide transition-all ${
                            isCurrent
                              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                              : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {pageNumber}
                        </Link>
                      );
                    }

                    // Afficher des ellipses si nécessaire
                    if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                      return (
                        <span key={pageNumber} className="w-10 text-center text-zinc-400 font-bold select-none">
                          ...
                        </span>
                      );
                    }

                    return null;
                  })}
                </div>

                {/* Suivant */}
                {hasNextPage ? (
                  <Link
                    href={createFilterLink({ page: (currentPage + 1).toString() })}
                    className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-semibold"
                  >
                    ▶
                  </Link>
                ) : (
                  <span className="p-2.5 border border-zinc-100 dark:border-zinc-800 rounded-xl text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                    ▶
                  </span>
                )}

              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
