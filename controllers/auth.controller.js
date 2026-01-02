const Admin = require('../models/admin.models');
const bcrypt = require('bcryptjs');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Comparer le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Connexion réussie
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        id: admin._id,
        email: admin.email,
        token: 'temp_token_' + admin._id // Token temporaire simple
      }
    });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion',
      error: error.message
    });
  }
};

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Vérifier si l'email existe déjà
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Hacher le mot de passe avec bcrypt (10 rounds de salage)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel admin avec le mot de passe haché
    const admin = await Admin.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message
    });
  }
};

// @desc    Update admin email
// @route   PUT /api/auth/update-email
// @access  Private
exports.updateEmail = async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Validation
    if (!newEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir le nouvel email et votre mot de passe'
      });
    }

    // Extraire l'ID de l'admin du token (format: temp_token_<adminId>)
    const adminId = token?.replace('temp_token_', '');
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    // Trouver l'admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }

    // Vérifier si le nouvel email existe déjà
    const existingAdmin = await Admin.findOne({ email: newEmail });
    if (existingAdmin && existingAdmin._id.toString() !== adminId) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé par un autre compte'
      });
    }

    // Mettre à jour l'email
    admin.email = newEmail;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Email mis à jour avec succès',
      data: {
        email: admin.email
      }
    });

  } catch (error) {
    console.error('Erreur de mise à jour email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de l\'email',
      error: error.message
    });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir l\'ancien et le nouveau mot de passe'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Extraire l'ID de l'admin du token
    const adminId = token?.replace('temp_token_', '');
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    // Trouver l'admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur de mise à jour mot de passe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du mot de passe',
      error: error.message
    });
  }
};

