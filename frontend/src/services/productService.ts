export interface Category {
  CategoryId: number;
  CategoryName: string;
}

export interface ProductImage {
  ImageId: number;
  ImageUrl: string;
}

export interface Product {
  ProductId: number;
  ProductName: string;
  Price: string;
  Quantity: number;
  CategoryId: number | null;
  IsActive: boolean;
  CreatedAt: string;
  Category?: Category | null;
  ProductImage?: ProductImage[];
  ProductReview?: ProductReview[];
}

export interface ProductReview {
  ReviewId: number;
  Rating: number;
  Comment?: string | null;
  UserProfile?: { DisplayName: string } | null;
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération : ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch {
    const fallback = fallbackProducts.find((product) => product.ProductId === id);
    return fallback ?? null;
  }
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetProductsResponse {
  success: boolean;
  data: Product[];
  pagination: PaginationMeta;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number | string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fallbackProducts: Product[] = [
  {
    ProductId: 1,
    ProductName: 'Mini sac à chaîne noir',
    Price: '129.00',
    Quantity: 8,
    CategoryId: 1,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    Category: { CategoryId: 1, CategoryName: 'Sacs à main' },
    ProductImage: [
      {
        ImageId: 1,
        ImageUrl: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    ProductId: 2,
    ProductName: 'Cabas cuir grainé ivoire',
    Price: '189.00',
    Quantity: 6,
    CategoryId: 2,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    Category: { CategoryId: 2, CategoryName: 'Cabas' },
    ProductImage: [
      {
        ImageId: 2,
        ImageUrl: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    ProductId: 3,
    ProductName: 'Sac bandoulière rouge',
    Price: '159.00',
    Quantity: 3,
    CategoryId: 3,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    Category: { CategoryId: 3, CategoryName: 'Sacs bandoulière' },
    ProductImage: [
      {
        ImageId: 3,
        ImageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    ProductId: 4,
    ProductName: 'Escarpins slingback noirs',
    Price: '149.00',
    Quantity: 7,
    CategoryId: 4,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    Category: { CategoryId: 4, CategoryName: 'Escarpins' },
    ProductImage: [
      {
        ImageId: 4,
        ImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    ProductId: 5,
    ProductName: 'Sandales à talon nude',
    Price: '139.00',
    Quantity: 4,
    CategoryId: 5,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    Category: { CategoryId: 5, CategoryName: 'Sandales' },
    ProductImage: [
      {
        ImageId: 5,
        ImageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    ProductId: 6,
    ProductName: 'Bottines cuir chocolat',
    Price: '210.00',
    Quantity: 2,
    CategoryId: 6,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    Category: { CategoryId: 6, CategoryName: 'Bottines' },
    ProductImage: [
      {
        ImageId: 6,
        ImageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    ProductId: 7,
    ProductName: 'Sneakers femme blanches',
    Price: '135.00',
    Quantity: 15,
    CategoryId: 8,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    Category: { CategoryId: 8, CategoryName: 'Sneakers femme' },
    ProductImage: [
      {
        ImageId: 7,
        ImageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    ProductId: 8,
    ProductName: 'Ballerines ivoire',
    Price: '119.00',
    Quantity: 9,
    CategoryId: 7,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    Category: { CategoryId: 7, CategoryName: 'Ballerines' },
    ProductImage: [
      {
        ImageId: 8,
        ImageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
];

/**
 * Récupère les produits depuis le backend avec pagination et filtres
 */
export async function getProducts(filters: ProductFilters = {}): Promise<GetProductsResponse> {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération : ${response.statusText}`);
    }

    return await response.json();
  } catch {
    console.warn('Backend indisponible, utilisation des données fictives (mock) de secours.');

    let filtered = [...fallbackProducts];

    if (filters.categoryId) {
      filtered = filtered.filter((product) => product.CategoryId === Number(filters.categoryId));
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter((product) => product.ProductName.toLowerCase().includes(query));
    }

    if (filters.minPrice) {
      filtered = filtered.filter((product) => Number(product.Price) >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((product) => Number(product.Price) <= Number(filters.maxPrice));
    }

    const page = filters.page ? Number(filters.page) : 1;
    const limit = filters.limit ? Number(filters.limit) : 9;
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const paginatedData = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      data: paginatedData,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
