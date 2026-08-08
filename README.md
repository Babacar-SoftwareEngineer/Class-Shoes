# Class Shoes

Class Shoes est une boutique en ligne de chaussures, sacs, parfums et accessoires.
Le projet est composé d'un frontend Next.js, d'une API Express/TypeScript, d'une base PostgreSQL et d'un cache Redis.

## Prérequis

- Node.js 18 ou supérieur
- Docker Desktop avec Docker Compose
- Git

## Architecture

```text
frontend/   Next.js, React, Tailwind CSS, Zustand
backend/    Express, TypeScript, Prisma, JWT
PostgreSQL  Base de données produit, utilisateurs et commandes
Redis       Cache des produits
load-tests/ Scénarios de charge k6
```

## Démarrage local

### 1. Installer les dépendances

```powershell
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configurer le backend

Créer `backend/.env` à partir de `backend/.env.example` :

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5431/class_shoes_db?schema=public"
JWT_SECRET=remplacer-par-une-cle-secrete-longue
JWT_EXPIRES_IN=1h
REDIS_URL="redis://localhost:6379"
```

Ne jamais committer `backend/.env` ou une clé secrète réelle.

### 3. Démarrer PostgreSQL et Redis

Depuis la racine :

```powershell
docker compose up -d db redis
docker compose ps
```

PostgreSQL est accessible sur `localhost:5431` depuis la machine hôte.
Redis est accessible sur `localhost:6379`.

### 4. Préparer la base de données

```powershell
cd backend
npx prisma generate
npx prisma migrate deploy
npm run seed
```

Le seed réinitialise les données de développement. Ne pas l'exécuter sur une base de production sans vérification.

### 5. Démarrer l'API

```powershell
cd backend
npm run dev
```

API locale : `http://localhost:5000`

Routes principales :

```text
GET  /                         Santé de l'API
GET  /api/products             Catalogue avec filtres et pagination
GET  /api/products/:id         Détail produit
POST /api/auth/register        Inscription
POST /api/auth/login           Connexion
GET  /api/auth/me              Profil authentifié
```

### 6. Configurer et démarrer le frontend

Créer `frontend/.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Puis lancer Next.js :

```powershell
cd frontend
npm run dev
```

Application locale : `http://localhost:3000`

Si l'API est indisponible, le frontend utilise actuellement des données mock pour permettre le développement de l'interface. Ce fallback doit être surveillé ou désactivé en production.

## Fonctionnalités frontend

- Homepage éditoriale Class Shoes
- Catalogue filtrable et paginé
- Page dédiée Chaussures
- Page détail produit
- Galerie et recommandations produit
- Panier persistant avec tiroir latéral
- Modification des quantités selon le stock
- Page commande avec informations personnelles, livraison et paiement
- Affichage des montants en FCFA
- Authentification API prête à être connectée aux écrans frontend

## Scripts

### Frontend

```powershell
cd frontend
npm run dev
npm run lint
npm run build
npm start
```

### Backend

```powershell
cd backend
npm run dev
npm run lint
npm run build
npm start
npm run seed
```

### Test de charge

Le script k6 teste le catalogue :

```powershell
docker compose run --rm k6
```

Ou avec k6 installé localement :

```powershell
$env:BASE_URL = "http://localhost:5000"
k6 run load-tests/catalog-load-test.js
```

## Vérification avant commit

```powershell
cd backend
npm run lint
npm run build

cd ../frontend
npm run lint
npm run build
```

## Déploiement

Avant une mise en ligne complète, il reste notamment à :

- ajouter l'API de création et consultation des commandes ;
- connecter la page commande à cette API ;
- intégrer un fournisseur de paiement et ses webhooks ;
- connecter les écrans frontend à l'authentification JWT ;
- utiliser une base PostgreSQL managée et un Redis managé ;
- remplacer `cors()` ouvert par une liste de domaines autorisés ;
- définir des secrets de production différents du développement ;
- configurer `NEXT_PUBLIC_API_URL` avec l'URL publique de l'API ;
- désactiver ou surveiller le fallback mock en production ;
- configurer les sauvegardes, logs, HTTPS et alertes.

Le backend et le frontend peuvent être déployés séparément. Le frontend doit connaître l'URL publique du backend via `NEXT_PUBLIC_API_URL`, et le backend doit autoriser le domaine public du frontend dans CORS.

## Arrêter les services locaux

```powershell
docker compose stop
```

Pour supprimer les conteneurs sans supprimer le volume PostgreSQL :

```powershell
docker compose down
```

## État actuel

Le catalogue et l'interface e-commerce sont opérationnels localement. La persistance réelle des commandes et le paiement doivent encore être implémentés côté backend avant une ouverture commerciale.
