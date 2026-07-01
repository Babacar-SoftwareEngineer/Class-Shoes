# Class Shoes - E-commerce

Ce projet contient la configuration pour le backend (Node.js/TypeScript) et le frontend de l'application Class Shoes.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
* **Docker Desktop** (ou Docker Engine & Docker Compose)
* **Node.js** (version 18+ recommandée)
* **pgAdmin** (déjà présent sur votre machine)

---

## 🛠️ Base de Données (PostgreSQL avec Docker)

La base de données tourne dans un conteneur isolé grâce à Docker Compose. Cela évite d'avoir à installer PostgreSQL directement sur votre système d'exploitation.

### 1. Démarrer la base de données
Exécutez la commande suivante à la racine du projet pour démarrer le conteneur en arrière-plan :
```bash
docker compose up -d
```

### 2. Vérifier l'état du conteneur
Vous pouvez lister les conteneurs actifs pour vérifier que le conteneur `class-shoes-db` fonctionne correctement :
```bash
docker ps
```

### 3. Arrêter la base de données
Pour arrêter le conteneur sans perdre vos données :
```bash
docker compose stop
```

Pour supprimer le conteneur (les données restent conservées dans le volume Docker `pgdata`) :
```bash
docker compose down
```

---

## 🔌 Connexion avec pgAdmin

Pour visualiser et gérer les données de votre base de données avec **pgAdmin** :

1. Ouvrez **pgAdmin** sur votre machine.
2. Créez un nouveau serveur (*Register -> Server...*).
3. Dans l'onglet **General**, nommez le serveur (ex: `Class Shoes Local`).
4. Dans l'onglet **Connection**, saisissez les informations suivantes :
   * **Host name/address** : `localhost`
   * **Port** : `5432`
   * **Maintenance database** : `class_shoes_db`
   * **Username** : `postgres`
   * **Password** : `postgres` (cochez la case *Save password* pour ne pas avoir à le retaper)
5. Enregistrez. Vous êtes connecté !

---

## 🚀 Prochaines Étapes : Intégration de Prisma ORM

Pour utiliser Prisma pour la communication entre le backend et la base de données :

1. Positionnez-vous dans le dossier backend :
   ```bash
   cd backend
   ```
2. Installez Prisma comme dépendance de développement :
   ```bash
   npm install prisma --save-dev
   ```
3. Initialisez Prisma :
   ```bash
   npx prisma init
   ```
   *Cette commande créera un dossier `backend/prisma` contenant un fichier `schema.prisma`.*
4. Configurez vos modèles dans `schema.prisma` et lancez les migrations avec :
   ```bash
   npx prisma migrate dev --name init
   ```
