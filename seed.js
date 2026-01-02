// Script pour initialiser la base de données avec des données de test
require('dotenv').config();
const mongoose = require('mongoose');
const CensusRecord = require('./models/habittant.models');
const Admin = require('./models/admin.models');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/census_db';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    process.exit(1);
  }
};

const sampleData = {
  admins: [
    { email: 'admin@census.gov', password: 'password123' },
    { email: 'agent@census.gov', password: 'agent123' }
  ],
  records: [
    {
      lotNumber: 'A001',
      familyName: 'Kouassi',
      responsibleName: 'Jean Kouassi',
      contact: '+225 0701234567',
      inhabitants: 6,
      children: 3,
      notes: 'Famille résidant dans le quartier depuis 10 ans'
    },
    {
      lotNumber: 'A002',
      familyName: 'Yao',
      responsibleName: 'Marie Yao',
      contact: '+225 0712345678',
      inhabitants: 4,
      children: 2,
      notes: 'Nouvelle installation'
    },
    {
      lotNumber: 'A003',
      familyName: 'Kone',
      responsibleName: 'Paul Kone',
      contact: '+225 0723456789',
      inhabitants: 5,
      children: 1,
      notes: ''
    },
    {
      lotNumber: 'B001',
      familyName: 'Toure',
      responsibleName: 'Fatou Toure',
      contact: '+225 0734567890',
      inhabitants: 7,
      children: 4,
      notes: 'Grande famille'
    },
    {
      lotNumber: 'B002',
      familyName: 'Bamba',
      responsibleName: 'Amadou Bamba',
      contact: '+225 0745678901',
      inhabitants: 3,
      children: 0,
      notes: 'Couple sans enfants'
    },
    {
      lotNumber: 'B003',
      familyName: 'Diallo',
      responsibleName: 'Ibrahim Diallo',
      contact: '+225 0756789012',
      inhabitants: 8,
      children: 5,
      notes: 'Famille nombreuse avec grands-parents'
    },
    {
      lotNumber: 'C001',
      familyName: 'Traore',
      responsibleName: 'Awa Traore',
      contact: '+225 0767890123',
      inhabitants: 4,
      children: 2,
      notes: ''
    },
    {
      lotNumber: 'C002',
      familyName: 'Ouattara',
      responsibleName: 'Sekou Ouattara',
      contact: '+225 0778901234',
      inhabitants: 5,
      children: 2,
      notes: 'Propriétaires d\'un petit commerce'
    },
    {
      lotNumber: 'C003',
      familyName: 'Camara',
      responsibleName: 'Aissata Camara',
      contact: '+225 0789012345',
      inhabitants: 6,
      children: 3,
      notes: ''
    },
    {
      lotNumber: 'D001',
      familyName: 'Sylla',
      responsibleName: 'Mohamed Sylla',
      contact: '+225 0790123456',
      inhabitants: 4,
      children: 1,
      notes: 'Famille récemment arrivée'
    }
  ]
};

const seedDatabase = async () => {
  try {
    // Connexion à la base
    await connectDB();

    // Supprimer les données existantes
    console.log('🗑️  Suppression des données existantes...');
    await CensusRecord.deleteMany({});
    await Admin.deleteMany({});
    console.log('✅ Données supprimées');

    // Insérer les admins
    console.log('👤 Création des admins...');
    const admins = await Admin.insertMany(sampleData.admins);
    console.log(`✅ ${admins.length} admins créés`);

    // Insérer les enregistrements
    console.log('📊 Création des enregistrements de recensement...');
    const records = await CensusRecord.insertMany(sampleData.records);
    console.log(`✅ ${records.length} enregistrements créés`);

    // Afficher les statistiques
    console.log('\n📈 Statistiques:');
    const totalInhabitants = records.reduce((sum, r) => sum + r.inhabitants, 0);
    const totalChildren = records.reduce((sum, r) => sum + r.children, 0);
    const totalAdults = totalInhabitants - totalChildren;
    
    console.log(`   - Total enregistrements: ${records.length}`);
    console.log(`   - Total habitants: ${totalInhabitants}`);
    console.log(`   - Total enfants: ${totalChildren}`);
    console.log(`   - Total adultes: ${totalAdults}`);
    console.log(`   - Taille moyenne ménage: ${(totalInhabitants / records.length).toFixed(2)}`);

    console.log('\n✅ Base de données initialisée avec succès!');
    console.log('\n📝 Comptes de test:');
    console.log('   Email: admin@census.gov');
    console.log('   Password: password123');
    console.log('\n   Email: agent@census.gov');
    console.log('   Password: agent123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

// Exécuter le script
seedDatabase();
