import type { Request, Response } from 'express';
import prisma from '../config/db.js';

/**
 * Récupère la liste des produits avec pagination et filtres dynamiques
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extraction et conversion des paramètres de requête
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const search = req.query.search as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const sortBy = (req.query.sortBy as string) || 'CreatedAt';
    const sortOrder = (req.query.sortOrder as string) === 'desc' ? 'desc' : 'asc';

    // Sécurisation du tri (champs autorisés)
    const allowedSortFields = ['ProductName', 'Price', 'CreatedAt'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'CreatedAt';

    // 2. Construction de la clause WHERE dynamique
    const where: any = {
      IsActive: true, // Par défaut, uniquement les produits actifs
    };

    if (search) {
      where.ProductName = {
        contains: search,
        mode: 'insensitive', // Recherche insensible à la casse
      };
    }

    if (categoryId && !isNaN(categoryId)) {
      where.CategoryId = categoryId;
    }

    // Gestion de la fourchette de prix
    if ((minPrice !== undefined && !isNaN(minPrice)) || (maxPrice !== undefined && !isNaN(maxPrice))) {
      where.Price = {};
      if (minPrice !== undefined && !isNaN(minPrice)) {
        where.Price.gte = minPrice;
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        where.Price.lte = maxPrice;
      }
    }

    // 3. Exécution parallèle des requêtes pour de meilleures performances
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [orderField]: sortOrder,
        },
        include: {
          Category: {
            select: {
              CategoryId: true,
              CategoryName: true,
            },
          },
          ProductImage: {
            select: {
              ImageId: true,
              ImageUrl: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // 4. Calcul des métadonnées de pagination
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur interne est survenue lors de la récupération des produits.',
    });
  }
};
