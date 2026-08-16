import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError.js';

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
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    throw new UnauthorizedError('Accès non autorisé. Token manquant.');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new ForbiddenError("Jeton d'accès invalide ou expiré.");
  }
}

/**
 * Middleware optionnel: garde l'utilisateur si un token est présent,
 * mais laisse passer les requêtes invitées.
 */
export function authenticateOptionalToken(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new ForbiddenError("Jeton d'accès invalide ou expiré.");
  }
}
