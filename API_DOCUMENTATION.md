# Census Backend API Documentation

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Configurer MongoDB dans .env
MONGO_URI=mongodb://localhost:27017/census_db
PORT=5000

# Démarrer le serveur
npm start
```

## 📡 Endpoints API

### Base URL
```
http://localhost:5000
```

---

## 🔐 Authentification

### 1. Inscription (Register)
**POST** `/api/auth/register`

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "admin@example.com"
  }
}
```

### 2. Connexion (Login)
**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "admin@example.com",
    "token": "temp_token_65f1a2b3c4d5e6f7g8h9i0j1"
  }
}
```

---

## 📊 Gestion des Enregistrements de Recensement

### 3. Créer un enregistrement
**POST** `/api/census`

**Body:**
```json
{
  "lotNumber": "A123",
  "familyName": "Dupont",
  "responsibleName": "Jean Dupont",
  "contact": "+225 0123456789",
  "inhabitants": 5,
  "children": 2,
  "notes": "Famille nombreuse avec jardin"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Enregistrement créé avec succès",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "lotNumber": "A123",
    "familyName": "Dupont",
    "responsibleName": "Jean Dupont",
    "contact": "+225 0123456789",
    "inhabitants": 5,
    "children": 2,
    "notes": "Famille nombreuse avec jardin",
    "createdAt": "2026-01-02T10:30:00.000Z",
    "updatedAt": "2026-01-02T10:30:00.000Z"
  }
}
```

### 4. Récupérer tous les enregistrements
**GET** `/api/census`

**Query Parameters:**
- `page` (optionnel) - Numéro de page (défaut: 1)
- `limit` (optionnel) - Nombre d'éléments par page (défaut: 10)
- `familyName` (optionnel) - Filtrer par nom de famille
- `lotNumber` (optionnel) - Filtrer par numéro de lot

**Exemples:**
```
GET /api/census
GET /api/census?page=2&limit=20
GET /api/census?familyName=Dupont
GET /api/census?lotNumber=A123
```

**Réponse (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "lotNumber": "A123",
      "familyName": "Dupont",
      "responsibleName": "Jean Dupont",
      "contact": "+225 0123456789",
      "inhabitants": 5,
      "children": 2,
      "notes": "Famille nombreuse",
      "createdAt": "2026-01-02T10:30:00.000Z",
      "updatedAt": "2026-01-02T10:30:00.000Z"
    }
  ]
}
```

### 5. Récupérer un enregistrement par ID
**GET** `/api/census/:id`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "lotNumber": "A123",
    "familyName": "Dupont",
    ...
  }
}
```

### 6. Mettre à jour un enregistrement
**PUT** `/api/census/:id`

**Body:**
```json
{
  "lotNumber": "A123",
  "familyName": "Dupont-Martin",
  "responsibleName": "Jean Dupont",
  "contact": "+225 0123456789",
  "inhabitants": 6,
  "children": 3,
  "notes": "Nouvelle naissance"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Enregistrement mis à jour avec succès",
  "data": { ... }
}
```

### 7. Supprimer un enregistrement
**DELETE** `/api/census/:id`

**Réponse (200):**
```json
{
  "success": true,
  "message": "Enregistrement supprimé avec succès",
  "data": {}
}
```

---

## 📈 Statistiques

### 8. Obtenir les statistiques
**GET** `/api/census/stats`

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "totalRecords": 45,
    "totalHouseholds": 45,
    "totalInhabitants": 230,
    "totalChildren": 87,
    "totalAdults": 143,
    "averageHouseholdSize": "5.11"
  }
}
```

---

## 📥 Import de Données

### 9. Import en masse
**POST** `/api/census/import`

**Body:**
```json
{
  "records": [
    {
      "lotNumber": "B456",
      "familyName": "Martin",
      "responsibleName": "Marie Martin",
      "contact": "+225 9876543210",
      "inhabitants": 4,
      "children": 1,
      "notes": ""
    },
    {
      "lotNumber": "C789",
      "familyName": "Bernard",
      "responsibleName": "Paul Bernard",
      "contact": "+225 5555555555",
      "inhabitants": 3,
      "children": 0,
      "notes": "Couple sans enfants"
    }
  ]
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Import terminé: 2 réussis, 0 échoués",
  "data": {
    "success": [ ... ],
    "failed": [],
    "total": 2
  }
}
```

---

## ❌ Gestion des Erreurs

Toutes les erreurs suivent ce format:

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques (en dev)"
}
```

**Codes d'erreur:**
- `400` - Mauvaise requête (données invalides)
- `401` - Non autorisé (authentification échouée)
- `404` - Ressource non trouvée
- `500` - Erreur serveur

---

## 🧪 Test avec curl

```bash
# Inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Créer un enregistrement
curl -X POST http://localhost:5000/api/census \
  -H "Content-Type: application/json" \
  -d '{"lotNumber":"A123","familyName":"Dupont","responsibleName":"Jean Dupont","contact":"+225 0123456789","inhabitants":5,"children":2}'

# Obtenir tous les enregistrements
curl http://localhost:5000/api/census

# Obtenir les statistiques
curl http://localhost:5000/api/census/stats
```

---

## 📝 Notes

- Toutes les dates sont au format ISO 8601
- Les champs `createdAt` et `updatedAt` sont automatiques
- La pagination par défaut est de 10 éléments par page
- **Les mots de passe sont hachés avec bcrypt (10 rounds de salage)**
- Le mot de passe n'est jamais renvoyé dans les réponses JSON
