import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';
import type { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: 'Trop de tentatives de connexion, veuillez réessayer après 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

// Route d'inscription avec validation Zod
router.post('/register', validate(registerSchema), register);

// Route de connexion avec validation Zod et Rate Limiting
router.post('/login', loginLimiter, validate(loginSchema), login);

// Route de déconnexion
router.post('/logout', logout);

// Route d'accès au profil (protégée)
router.get('/me', authenticateToken as unknown as RequestHandler, getProfile as unknown as RequestHandler);

export default router;
