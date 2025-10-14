# 💰 API de Gestion de Contributions et Groupes Solidaires

## 📘 Description du projet

Cette API gère l’inscription des utilisateurs, la création de groupes, les tours de contribution, la distribution des fonds et le suivi des paiements.  
Elle intègre également un **score de fiabilité interne** qui valorise la régularité et la ponctualité des membres.  
Ce score influence l’ordre de passage ou l’accès à certains groupes plus sélectifs.

L’objectif principal est de garantir une gestion **transparente, sécurisée et automatisée** des contributions entre membres d’un groupe.

---

## 🚀 Fonctionnalités principales

- ✅ **Inscription et authentification des utilisateurs** (JWT)
- ✅ **Création et gestion des groupes**
- ✅ **Tours de contribution et distribution automatique des fonds**
- ✅ **Suivi des paiements** (historique par groupe)
- ✅ **Notifications automatiques** pour éviter les retards
- ✅ **Score de fiabilité interne** : régularité et ponctualité récompensées
- ✅ **Gestion des bénéficiaires** transparente
- ✅ **Système KYC** (vérification identité + photo carte nationale)
- ✅ **Sécurité avancée et traçabilité complète**

---

## 🧠 Score de fiabilité

Chaque utilisateur possède un **score dynamique** basé sur :

| Critère | Description | Impact |
|----------|--------------|--------|
| Ponctualité | Respect des dates de paiement | +20 points |
| Retard | Retard de paiement | -15 points |
| Complétion du tour | Participation sans incident | +10 points |
| Litige | Litige non résolu | -25 points |

➡️ Le score influence :
- L’ordre de passage lors des tours de contribution.  
- L’éligibilité à certains groupes “Premium”.

---

## 🛡️ Sécurité et conformité (KYC)

Un système de **vérification d’identité (KYC)** garantit la fiabilité des membres :

- 📋 Vérification des données saisies (nom, prénom, numéro de carte nationale)
- 🖼️ Téléversement d’une image de la carte nationale
- 🤳 Vérification faciale (comparaison entre photo de la carte et photo/vidéo en temps réel)
- 🔒 Images chiffrées ou stockées via un service sécurisé

### Modes de validation
- **Automatique** via `face-api.js` ou un modèle LLM spécialisé  
- **Manuelle** par un administrateur si nécessaire  

Aucune action sensible (création de groupe, virement, contribution) n’est autorisée sans validation complète.

---

## 🔐 Authentification et rôles

- 🔑 **JWT (JSON Web Token)** pour la sécurité des requêtes
- 👤 **Rôles disponibles :**
  - `Particulier` → utilisateur standard (création, contribution, suivi)
  - `Admin` → supervision complète, validation KYC, résolution de litiges

Un **middleware d’authentification** contrôle les accès selon le rôle et l’état de vérification.

---

## 👥 Gestion des groupes

- Création de groupe par un particulier.
- Définition du **montant**, **fréquence** et **nombre de participants**.
- Gestion des **tours de contribution**.
- Historique complet des transactions.
- Signalement d’un problème → **ticket** transmis à l’admin.

---

## 💬 Communication et traçabilité

- 💬 Messages texte et audio entre membres du groupe.
- 📊 Journalisation de chaque transaction (timestamp, montant, auteur).
- 🔍 Archivage pour résolution des litiges.

---

## 🧱 Architecture du projet (N-Tiers)

Le projet suit une **architecture modulaire** basée sur la séparation des responsabilités :

📦 api-contribution/
│
├─ src/
│ ├─ config/ # ⚙️ Configuration globale (MongoDB, JWT, dotenv)
│ │ ├─ db.js # Connexion MongoDB
│ │ ├─ jwt.js # Génération et vérification des tokens
│ │ └─ env.js # Chargement des variables d'environnement
│ │
│ ├─ models/ # 🧩 Schémas Mongoose
│ │ ├─ user.model.js # Utilisateur (rôle, KYC, score)
│ │ ├─ group.model.js # Groupe, membres, tours de contribution
│ │ ├─ payment.model.js # Historique des paiements
│ │ └─ message.model.js # Messages texte/audio
│ │
│ ├─ controllers/ # 🎯 Logique métier principale
│ │ ├─ auth.controller.js
│ │ ├─ group.controller.js
│ │ ├─ payment.controller.js
│ │ └─ kyc.controller.js
│ │
│ 
│ ├─ routes/ # 🛣️ Routes Express
│ │ ├─ auth.routes.js
│ │ ├─ group.routes.js
│ │ ├─ payment.routes.js
│ │ ├─ message.routes.js
│ │ └─ kyc.routes.js
│ │
│ ├─ middlewares/ # 🧱 Contrôles avant exécution
│ │ ├─ auth.middleware.js
│ │ ├─ role.middleware.js
│ │ ├─ error.middleware.js
│ │ └─ validate.middleware.js
│ │
│ ├─ utils/ # 🧰 Fonctions utilitaires
│ │ ├─ crypto.util.js # Chiffrement/déchiffrement
│ │ ├─ logger.util.js # Logging des actions
│ │ └─ helper.util.js # Fonctions diverses
│ │
│ ├─ tests/ # 🧪 Tests unitaires et d’intégration
│ │ ├─ auth.test.js
│ │ ├─ group.test.js
│ │ └─ payment.test.js
│ │
│ ├─ app.js # Point d’entrée Express
│ └─ server.js # Lancement du serveur Node
│
├─ .env.example # Exemple de variables d'environnement
├─ Dockerfile # Image Docker
├─ docker-compose.yml # Services API + MongoDB
├─ jest.config.js # Configuration Jest
├─ package.json
└─ README.md



---

## 🧰 Technologies utilisées

| Domaine | Technologie |
|----------|--------------|
| Backend | Node.js + Express |
| Base de données | MongoDB + Mongoose |
| Authentification | JWT |
| Sécurité | bcrypt, Helmet |
| Tests | Jest |
| Conteneurisation | Docker |
| Gestion de projet | JIRA + GitHub |
| ORM | Mongoose |

---

## 🧪 Tests

Les tests unitaires et d’intégration sont réalisés avec **Jest**.

```bash
npm run test

Exemples de tests :

Authentification (login, register)

Création de groupe

Paiement de contribution

Score de fiabilité

🐳 Dockerisation

Exécution en environnement isolé avec Docker :

docker-compose up --build

Contenu du docker-compose.yml :

api-service → exécution du backend Node.js

mongo-service → base MongoDB

mongo-express → interface web pour MongoDB (optionnel)

🧭 Planification sur JIRA

L’organisation suit la méthode Scrum, adaptée à un développeur solo :

Type	Exemple
Epic	Authentification & Sécurité
User Story	En tant qu’utilisateur, je veux créer un compte sécurisé
Task	Implémenter la logique de hash du mot de passe
Sub-task	Ajouter la validation des champs avec Joi
Automatisations

🔄 Lien entre JIRA et GitHub : chaque commit contient un tag #issue-ID

✅ Fermeture automatique des tickets lors des merges main

📈 Tableaux de bord de progression (burn-down chart, sprint velocity)

⚙️ Installation et exécution
🧩 Prérequis

Node.js ≥ 18

MongoDB local ou distant

npm ou yarn installé

Docker (optionnel)

🧰 Installation
git clone https://github.com/sahnoun/api-contribution.git
cd api-contribution
npm install

🔧 Variables d’environnement (.env)

Crée un fichier .env à la racine :

PORT=5000
MONGO_URI=mongodb://localhost:27017/api-contribution
JWT_SECRET=ton_secret_jwt

▶️ Lancer le projet
npm run dev

🧪 Lancer les tests
npm run test
