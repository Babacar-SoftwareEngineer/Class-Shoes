import { Router } from 'express';
import { getProducts } from '../controllers/productController.js';

const router = Router();

// Route pour lister les produits avec pagination et filtres
router.get('/', getProducts);

export default router;
