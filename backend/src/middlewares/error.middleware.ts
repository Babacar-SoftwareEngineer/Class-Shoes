import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

/**
 * Middleware global de gestion des erreurs Express.
 * Intercepte et formate toutes les erreurs de l'application.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Gestion des erreurs de validation Zod (HTTP 400)
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.').replace(/^(body|query|params)\./, ''),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Erreur de validation des données.',
      errors: formattedErrors,
    });
    return;
  }

  // 2. Gestion des erreurs métier personnalisées (AppError, NotFoundError, UnauthorizedError...)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // 3. Log et réponse générique pour les erreurs non gérées (HTTP 500)
  console.error('💥 Erreur serveur non gérée :', err);

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Une erreur interne est survenue sur le serveur.'
      : err.message || 'Une erreur interne est survenue sur le serveur.',
  });
}
