import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export interface TokenPayload {
  userId: number;
  email: string;
}

/**
 * Génère un jeton JWT pour un utilisateur.
 * @param payload Les données à inclure dans le token.
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

/**
 * Vérifie et décode un jeton JWT. Throws an error if invalid/expired.
 * @param token Le jeton à vérifier.
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
