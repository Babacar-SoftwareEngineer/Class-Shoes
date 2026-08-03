import type { Request, Response } from 'express';
import { fetchProducts, fetchProductById } from '../services/productService.js';
import { NotFoundError } from '../errors/AppError.js';

/**
 * Récupère la liste des produits avec pagination et filtres dynamiques
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, search, categoryId, minPrice, maxPrice, sortBy, sortOrder } = req.query as any;

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
