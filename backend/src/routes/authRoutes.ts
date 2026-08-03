import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = Router();

// Route d'inscription avec validation Zod
router.post('/register', validate(registerSchema), register);

// Route de connexion avec validation Zod
router.post('/login', validate(loginSchema), login);

// Route d'accès au profil (protégée)
router.get('/me', authenticateToken as any, getProfile as any);

export default router;
