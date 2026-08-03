import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // Permet de lire le JSON dans le body des requêtes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Route de test
app.get('/', (_req: Request, res: Response) => {
    res.json({ message: "Le serveur e-commerce est en ligne !" });
});

// Middleware d'erreur centralisé (déclaré après toutes les routes)
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});