import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    search: z.string().optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const getProductByIdParamsSchema = z.object({
  params: z.object({
    id: z.coerce
      .number({ message: "L'identifiant du produit fourni est invalide." })
      .int("L'identifiant doit être un entier.")
      .positive("L'identifiant du produit doit être un nombre positif."),
  }),
});
