import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      fullName: z.string({ message: 'Le nom complet est requis.' }).min(2, 'Le nom complet est requis.'),
      email: z.string({ message: "L'email est requis." }).email("Format d'email invalide."),
      phone: z.string({ message: 'Le téléphone est requis.' }).min(6, 'Le téléphone est requis.'),
      region: z.string({ message: 'La région est requise.' }).min(1, 'La région est requise.'),
      city: z.string({ message: 'La ville est requise.' }).min(1, 'La ville est requise.'),
      address: z.string({ message: "L'adresse est requise." }).min(3, "L'adresse est requise."),
    }),
    paymentMethod: z.enum(['mobile-money', 'orange-money', 'delivery']),
    items: z.array(
      z.object({
        productId: z.coerce.number({ message: "L'identifiant du produit est invalide." }).int().positive(),
        quantity: z.coerce.number({ message: 'La quantité est invalide.' }).int().positive(),
      })
    ).min(1, 'Au moins un produit est requis.'),
  }),
});
