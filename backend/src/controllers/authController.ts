import type { Request, Response } from 'express';
import prisma from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/auth.js';
import { generateToken } from '../utils/jwt.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';

/**
 * Inscription d'un nouvel utilisateur
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, displayName, firstName, lastName } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis.' });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.userProfile.findUnique({
      where: { Email: email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Cet email est déjà associé à un compte.' });
      return;
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
    const { PasswordHash: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: 'Inscription réussie.',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ error: 'Une erreur serveur est survenue lors de l\'inscription.' });
  }
}

/**
 * Connexion d'un utilisateur
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis.' });
      return;
    }

    // Rechercher l'utilisateur
    const user = await prisma.userProfile.findUnique({
      where: { Email: email },
    });

    if (!user || !user.PasswordHash) {
      res.status(401).json({ error: 'Identifiants invalides.' });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.PasswordHash);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Identifiants invalides.' });
      return;
    }

    // Générer le token JWT
    const token = generateToken({
      userId: user.UserId,
      email: user.Email,
    });

    // Retourner les infos de l'utilisateur (sans le hash) et le token
    const { PasswordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: 'Une erreur serveur est survenue lors de la connexion.' });
  }
}

/**
 * Récupérer le profil de l'utilisateur connecté (route protégée)
 */
export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié.' });
      return;
    }

    const user = await prisma.userProfile.findUnique({
      where: { UserId: req.user.userId },
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé.' });
      return;
    }

    const { PasswordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    res.status(500).json({ error: 'Une erreur serveur est survenue.' });
  }
}
