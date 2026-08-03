import type { PaginationMeta } from './api.types.js';

export interface FetchProductsParams {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  categoryId?: number | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

export interface PaginatedProductsResult {
  products: any[];
  pagination: PaginationMeta;
}
