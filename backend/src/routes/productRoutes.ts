import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = Router();

// Route pour lister les produits avec pagination et filtres (gère aussi ?search=...)
router.get('/', getProducts);

// Route pour récupérer les détails d'un produit spécifique
router.get('/:id', getProductById);

export default router;
