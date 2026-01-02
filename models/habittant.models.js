const mongoose = require('mongoose');

const censusRecordSchema = new mongoose.Schema({
  // Informations du lot
  lotNumber: {
    type: String,
    required: [true, 'Le numéro de lot est requis'],
    trim: true,
    unique: true
  },
  familyName: {
    type: String,
    required: [true, 'Le nom de famille est requis'],
    trim: true
  },
  
  // Informations du responsable
  responsibleName: {
    type: String,
    required: [true, 'Le nom du responsable est requis'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Le contact est requis'],
    trim: true
  },
  
  // Composition du ménage
  inhabitants: {
    type: Number,
    required: [true, 'Le nombre d\'habitants est requis'],
    min: [1, 'Il doit y avoir au moins 1 habitant']
  },
  children: {
    type: Number,
    required: [true, 'Le nombre d\'enfants est requis'],
    min: [0, 'Le nombre d\'enfants ne peut pas être négatif']
  },
  
  // Notes additionnelles
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  }
}, {
  timestamps: true
});

// Index pour améliorer les recherches
// Note: L'index sur lotNumber est automatiquement créé par unique: true
censusRecordSchema.index({ familyName: 1 });
censusRecordSchema.index({ createdAt: -1 });
censusRecordSchema.index({ statut: 1 });

// Méthode virtuelle pour calculer le nombre d'adultes
censusRecordSchema.virtual('adults').get(function() {
  return this.inhabitants - this.children;
});

// Configuration pour inclure les virtuels dans JSON
censusRecordSchema.set('toJSON', { virtuals: true });
censusRecordSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CensusRecord', censusRecordSchema);
