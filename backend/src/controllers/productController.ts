import type { Request, Response } from 'express';
import { fetchProducts, fetchProductById } from '../services/productService.js';
import { NotFoundError } from '../errors/AppError.js';

/**
 * Récupère la liste des produits avec pagination et filtres dynamiques
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const queryValue = (value: unknown): string | undefined => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return queryValue(value[0]);
    return undefined;
  };
  const parseNumber = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const page = parseNumber(queryValue(req.query.page));
  const limit = parseNumber(queryValue(req.query.limit));
  const categoryId = parseNumber(queryValue(req.query.categoryId));
  const minPrice = parseNumber(queryValue(req.query.minPrice));
  const maxPrice = parseNumber(queryValue(req.query.maxPrice));
  const search = queryValue(req.query.search);
  const sortBy = queryValue(req.query.sortBy);
  const sortOrderValue = queryValue(req.query.sortOrder);
  const sortOrder = sortOrderValue === 'asc' || sortOrderValue === 'desc' ? sortOrderValue : undefined;

  const result = await fetchProducts({
    page,
    limit,
    search,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    success: true,
    data: result.products,
    pagination: result.pagination,
  });
};

/**
 * Récupère les détails d'un produit spécifique par son identifiant
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);

  const product = await fetchProductById(id);

  if (!product) {
    throw new NotFoundError("Le produit demandé n'existe pas.");
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};
