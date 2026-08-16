import { API_BASE_URL } from '../lib/api';

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
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
  }
}
