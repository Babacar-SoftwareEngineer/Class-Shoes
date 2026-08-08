import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

/**
 * Middleware de validation des données entrantes basé sur un schéma Zod.
 * Transmet les erreurs au middleware d'erreur centralisé en cas d'échec.
 */
export const validate = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (typeof parsed === 'object' && parsed !== null) {
        const values = parsed as { body?: unknown; query?: unknown; params?: unknown };
        if (values.body) req.body = values.body;
        if (values.query) req.query = values.query as Request['query'];
        if (values.params) req.params = values.params as Request['params'];
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
