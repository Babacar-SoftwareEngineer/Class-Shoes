import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

// Interface pour étendre Request d'Express avec l'utilisateur authentifié
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

/**
 * Middleware Express pour valider le JWT et protéger les routes.
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    res.status(401).json({ error: "Accès non autorisé. Token manquant." });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Jeton d'accès invalide ou expiré." });
    return;
  }
}
