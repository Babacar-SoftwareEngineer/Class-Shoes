import prisma from '../config/db.js';
import { getCachedValue, setCachedValue } from '../config/redis.js';
import { Prisma } from '../generated/prisma/client.js';
import type { FetchProductsParams, PaginatedProductsResult } from '../types/index.js';

const PRODUCT_DETAILS_TTL_SECONDS = 3600;
const PRODUCT_LIST_TTL_SECONDS = 300;

const normalizeProductListKey = (params: FetchProductsParams): string => {
  const normalizedParams = {
    page: params.page ?? 1,
    limit: params.limit ?? 12,
    search: params.search ?? '',
    categoryId: params.categoryId ?? '',
    minPrice: params.minPrice ?? '',
    maxPrice: params.maxPrice ?? '',
    sortBy: params.sortBy ?? 'CreatedAt',
    sortOrder: params.sortOrder ?? 'asc',
  };

  return `product:list:${JSON.stringify(normalizedParams)}`;
};

/**
 * Récupère la liste des produits filtrés et paginés
 */
export const fetchProducts = async (params: FetchProductsParams): Promise<PaginatedProductsResult> => {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 12;
  const skip = (page - 1) * limit;

  const search = params.search;
  const categoryId = params.categoryId;
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const sortBy = params.sortBy || 'CreatedAt';
  const sortOrder = params.sortOrder === 'desc' ? 'desc' : 'asc';
  const listCacheKey = normalizeProductListKey(params);

  const cachedProducts = await getCachedValue<PaginatedProductsResult>(listCacheKey);

  if (cachedProducts) {
    return cachedProducts;
  }

  // Sécurisation du tri (champs autorisés)
  const allowedSortFields = ['ProductName', 'Price', 'CreatedAt'] as const;
  const orderField = allowedSortFields.includes(sortBy as (typeof allowedSortFields)[number])
    ? (sortBy as (typeof allowedSortFields)[number])
    : 'CreatedAt';

  // Construction de la clause WHERE dynamique
  const where: Prisma.ProductWhereInput = {
    IsActive: true,
  };

  if (search) {
    where.ProductName = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (categoryId && !isNaN(categoryId)) {
    where.CategoryId = categoryId;
  }

  if ((minPrice !== undefined && !isNaN(minPrice)) || (maxPrice !== undefined && !isNaN(maxPrice))) {
    where.Price = {};
    if (minPrice !== undefined && !isNaN(minPrice)) {
      where.Price.gte = minPrice;
    }
    if (maxPrice !== undefined && !isNaN(maxPrice)) {
      where.Price.lte = maxPrice;
    }
  }

  // Exécution parallèle des requêtes Prisma
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderField]: sortOrder } as Prisma.ProductOrderByWithRelationInput,
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

  const totalPages = Math.ceil(total / limit);

  const result = {
    products,
    pagination: {
      totalItems: total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };

  await setCachedValue(listCacheKey, result, PRODUCT_LIST_TTL_SECONDS);

  return result;
};

/**
 * Récupère les détails d'un produit par son identifiant unique
 */
export const fetchProductById = async (id: number) => {
  const cacheKey = `product:details:${id}`;
  const cachedProduct = await getCachedValue(cacheKey);

  if (cachedProduct) {
    return cachedProduct;
  }

  const product = await prisma.product.findUnique({
    where: {
      ProductId: id,
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
      ProductReview: {
        include: {
          UserProfile: {
            select: {
              DisplayName: true,
            },
          },
        },
      },
    },
  });

  await setCachedValue(cacheKey, product, PRODUCT_DETAILS_TTL_SECONDS);

  return product;
};
