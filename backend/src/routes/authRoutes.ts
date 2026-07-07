import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = Router();

// Route d'inscription
router.post('/register', register);

// Route de connexion
router.post('/login', login);

// Route d'accès au profil (protégée)
router.get('/me', authenticateToken as any, getProfile as any);

export default router;
