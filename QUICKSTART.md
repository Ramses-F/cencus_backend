# 🚀 Guide de Démarrage Rapide

## Étape 1: Installation

```bash
cd census_backend
npm install
```

## Étape 2: Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Vérifier que MongoDB est démarré
# Si MongoDB n'est pas installé, installer MongoDB Community Edition
```

## Étape 3: Initialiser la base avec des données de test

```bash
npm run seed
```

Cela va créer :
- 2 comptes admins
- 10 enregistrements de recensement exemple

**Identifiants de test:**
- Email: `admin@census.gov`
- Password: `password123`

## Étape 4: Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## Étape 5: Tester les APIs

### Option 1: Via curl (terminal)

```bash
# Test de connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@census.gov","password":"password123"}'

# Récupérer tous les enregistrements
curl http://localhost:5000/api/census

# Obtenir les statistiques
curl http://localhost:5000/api/census/stats
```

### Option 2: Script de test automatique

```bash
npm test
```

### Option 3: Via Postman ou Insomnia

Importer les requêtes depuis `API_DOCUMENTATION.md`

## 📊 Résultat Attendu

Après l'initialisation, vous devriez avoir :
- ✅ 10 enregistrements de recensement
- ✅ 52 habitants au total
- ✅ 23 enfants
- ✅ 29 adultes
- ✅ Taille moyenne de ménage: ~5.2 personnes

## 🔥 Commandes Utiles

```bash
# Démarrer le serveur
npm start

# Mode développement (avec auto-reload)
npm run dev

# Réinitialiser la base avec données de test
npm run seed

# Tester les APIs
npm test
```

## 🐛 Dépannage

### Erreur: MongoDB connection failed
```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod

# Ou démarrer MongoDB
sudo systemctl start mongod
```

### Erreur: Port 5000 already in use
```bash
# Changer le port dans .env
PORT=3000
```

### Erreur: Module not found
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

## 📖 Documentation Complète

- [README.md](./README.md) - Vue d'ensemble du projet
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Documentation des APIs

## 🎯 Prochaines Étapes

1. ✅ Tester toutes les routes API
2. ✅ Connecter le frontend Next.js
3. ✅ Implémenter JWT pour la sécurité
4. ✅ Ajouter les exports (CSV, Excel, PDF)
5. ✅ Déployer en production

---

**Besoin d'aide ?** Consulter la documentation complète ou créer une issue sur GitHub.
