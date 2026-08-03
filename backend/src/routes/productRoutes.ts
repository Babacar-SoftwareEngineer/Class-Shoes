import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';
import { validate } from '../middlewares/validate.middleware.js';
import { getProductsQuerySchema, getProductByIdParamsSchema } from '../schemas/productSchema.js';

const router = Router();

// Route pour lister les produits avec pagination et filtres (valide les query params)
router.get('/', validate(getProductsQuerySchema), getProducts);

// Route pour récupérer les détails d'un produit spécifique (valide l'ID param)
router.get('/:id', validate(getProductByIdParamsSchema), getProductById);

export default router;
