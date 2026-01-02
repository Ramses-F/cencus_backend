const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  }
}, {
  timestamps: true
});

// Note: L'index sur email est automatiquement créé par unique: true

// Configuration pour inclure les virtuels dans JSON
adminSchema.set('toJSON', { 
  transform: function(doc, ret) {
    delete ret.password; // Toujours supprimer le mot de passe du JSON
    return ret;
  }
});

module.exports = mongoose.model('Admin', adminSchema);
