import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import uploadRoutes from './routes/upload.js';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json()); // Permet de lire le JSON dans le body des requêtes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Route de test
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Le serveur e-commerce est en ligne !' });
});

// Middleware d'erreur centralisé (déclaré après toutes les routes)
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
