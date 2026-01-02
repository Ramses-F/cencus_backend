# 📊 Census Backend API

API Backend pour le système de recensement développé avec Node.js, Express et MongoDB.

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

### Installation

```bash
# Cloner le projet
cd census_backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

### Configuration

Éditer le fichier `.env` :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/census_db
```

### Démarrage

```bash
# Production
npm start

# Développement (avec nodemon - à installer)
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

## 📁 Structure du Projet

```
census_backend/
├── config/
│   └── db.config.js          # Configuration MongoDB
├── controllers/
│   ├── auth.controller.js    # Contrôleur authentification
│   └── census.controller.js  # Contrôleur recensement
├── models/
│   ├── admin.models.js       # Modèle Admin
│   └── habittant.models.js   # Modèle CensusRecord
├── routes/
│   ├── auth.routes.js        # Routes authentification
│   └── census.routes.js      # Routes recensement
├── .env                       # Variables d'environnement
├── .env.example              # Exemple de configuration
├── server.js                 # Point d'entrée
├── API_DOCUMENTATION.md      # Documentation complète des APIs
└── package.json
```

## 📡 Endpoints Principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Recensement
- `POST /api/census` - Créer un enregistrement
- `GET /api/census` - Lister (pagination + filtres)
- `GET /api/census/:id` - Récupérer un enregistrement
- `PUT /api/census/:id` - Mettre à jour
- `DELETE /api/census/:id` - Supprimer
- `GET /api/census/stats` - Statistiques
- `POST /api/census/import` - Import en masse

📖 **Voir [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) pour la documentation complète**

## 🧪 Tests

```bash
# Tester toutes les APIs (nécessite curl et jq)
npm test

# Ou manuellement
chmod +x test-api.sh
./test-api.sh
```

## 🗄️ Modèles de Données

### CensusRecord (Enregistrement de Recensement)
```javascript
{
  lotNumber: String (unique, requis),
  familyName: String (requis),
  responsibleName: String (requis),
  contact: String (requis),
  inhabitants: Number (requis, min: 1),
  children: Number (requis, min: 0),
  notes: String (optionnel, max: 500 chars),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Admin
```javascript
{
  email: String (unique, requis),
  password: String (requis, min: 6 chars),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🔧 Technologies Utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement

## 📝 Exemples d'Utilisation

### Créer un enregistrement
```bash
curl -X POST http://localhost:5000/api/census \
  -H "Content-Type: application/json" \
  -d '{
    "lotNumber": "A123",
    "familyName": "Dupont",
    "responsibleName": "Jean Dupont",
    "contact": "+225 0123456789",
    "inhabitants": 5,
    "children": 2
  }'
```

### Obtenir les statistiques
```bash
curl http://localhost:5000/api/census/stats
```

## 🔒 Sécurité

✅ **Sécurité implémentée**
- Mots de passe hachés avec bcrypt (10 rounds de salage)
- Le champ password est exclu par défaut des requêtes
- Validation des emails avec regex

⚠️ **Pour la production, ajouter** :
- Implémenter JWT pour les tokens
- Ajouter un middleware d'authentification
- Implémenter rate limiting
- Valider et sanitizer toutes les entrées
- HTTPS obligatoire

## 📊 Fonctionnalités

✅ **Implémentées (Phase 1)**
- Authentification (login/register)
- CRUD complet des enregistrements
- Pagination et filtres
- Statistiques globales
- Import en masse

🔜 **À venir (Phase 2)**
- Export CSV/Excel/PDF
- Analytics avancées
- Authentification JWT
- Upload de fichiers
- Gestion des rôles

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

ISC

## 👥 Auteur

Développé pour le système de recensement Census Platform

---

**Version**: 1.0.0  
**Date**: Janvier 2026
