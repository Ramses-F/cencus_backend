const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.config');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenue sur l\'API Census Backend',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      census: '/api/census'
    }
  });
});

// Routes API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/census', require('./routes/census.routes'));

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée' 
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
