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
  Price: string; // Le type Decimal de Prisma/Postgres est sérialisé en String dans le JSON
  Quantity: number;
  CategoryId: number | null;
  IsActive: boolean;
  CreatedAt: string;
  Category?: Category | null;
  ProductImage?: ProductImage[];
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
      // Revalidation toutes les minutes pour Next.js App Router (mise en cache serveur)
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération : ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur dans getProducts service:', error);
    return {
      success: false,
      data: [],
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: filters.page ? Number(filters.page) : 1,
        limit: filters.limit ? Number(filters.limit) : 12,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}
