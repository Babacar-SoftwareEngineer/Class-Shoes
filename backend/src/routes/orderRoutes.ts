import { Router } from 'express';
import { createOrder } from '../controllers/orderController.js';
import { authenticateOptionalToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createOrderSchema } from '../schemas/orderSchema.js';

const router = Router();

router.post('/', authenticateOptionalToken, validate(createOrderSchema), createOrder);

export default router;
