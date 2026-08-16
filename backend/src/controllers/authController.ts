import type { Request, Response } from 'express';
import prisma from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/auth.js';
import { generateToken } from '../utils/jwt.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../errors/AppError.js';

function withoutSensitiveFields<T extends { PasswordHash?: string | null; AuthId?: string | null }>(
  user: T
): Omit<T, 'PasswordHash' | 'AuthId'> {
  const safeUser = { ...user } as Partial<T>;
  delete safeUser.PasswordHash;
  delete safeUser.AuthId;
  return safeUser as Omit<T, 'PasswordHash' | 'AuthId'>;
}

/**
 * Inscription d'un nouvel utilisateur
 */
export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, displayName, firstName, lastName } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.userProfile.findUnique({
    where: { Email: email },
  });

  if (existingUser) {
    throw new ConflictError('Cet email est déjà associé à un compte.');
  }

  // Hacher le mot de passe
  const passwordHash = await hashPassword(password);

  // Créer l'utilisateur
  const user = await prisma.userProfile.create({
    data: {
      Email: email,
      PasswordHash: passwordHash,
      DisplayName: displayName || null,
      FirstName: firstName || null,
      LastName: lastName || null,
    },
  });

  // Retourner l'utilisateur créé sans le mot de passe haché
  const token = generateToken({
    userId: user.UserId,
    email: user.Email,
  });
  const userWithoutPassword = withoutSensitiveFields(user);
  res.status(201).json({
    success: true,
    message: 'Inscription réussie.',
    token,
    user: userWithoutPassword,
  });
}

/**
 * Connexion d'un utilisateur
 */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  // Rechercher l'utilisateur
  const user = await prisma.userProfile.findUnique({
    where: { Email: email },
  });

  if (!user || !user.PasswordHash) {
    throw new UnauthorizedError('Identifiants invalides.');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await comparePassword(password, user.PasswordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Identifiants invalides.');
  }

  // Générer le token JWT
  const token = generateToken({
    userId: user.UserId,
    email: user.Email,
  });

  // Retourner les infos de l'utilisateur (sans le hash) et le token
  const userWithoutPassword = withoutSensitiveFields(user);
  res.status(200).json({
    success: true,
    message: 'Connexion réussie.',
    token,
    user: userWithoutPassword,
  });
}

/**
 * Récupérer le profil de l'utilisateur connecté (route protégée)
 */
export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError('Non authentifié.');
  }

  const user = await prisma.userProfile.findUnique({
    where: { UserId: req.user.userId },
  });

  if (!user) {
    throw new NotFoundError('Utilisateur non trouvé.');
  }

  const userWithoutPassword = withoutSensitiveFields(user);
  res.status(200).json({
    success: true,
    user: userWithoutPassword,
  });
}
