const CensusRecord = require('../models/habittant.models');

// @desc    Créer un nouvel enregistrement de recensement
// @route   POST /api/census
// @access  Private
exports.createRecord = async (req, res) => {
  try {
    const { lotNumber, familyName, responsibleName, contact, inhabitants, children, notes } = req.body;

    // Validation des champs requis
    if (!lotNumber || !familyName || !responsibleName || !contact || !inhabitants || children === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être renseignés'
      });
    }

    // Vérifier si le numéro de lot existe déjà
    const existingRecord = await CensusRecord.findOne({ lotNumber });
    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: `Le numéro de lot ${lotNumber} existe déjà`
      });
    }

    // Créer l'enregistrement
    const record = await CensusRecord.create({
      lotNumber,
      familyName,
      responsibleName,
      contact,
      inhabitants: parseInt(inhabitants),
      children: parseInt(children),
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Enregistrement créé avec succès',
      data: record
    });

  } catch (error) {
    console.error('Erreur de création:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création',
      error: error.message
    });
  }
};

// @desc    Récupérer tous les enregistrements avec pagination
// @route   GET /api/census
// @access  Private
exports.getAllRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0; // 0 = pas de limite
    const skip = limit > 0 ? (page - 1) * limit : 0;

    // Filtres optionnels
    const filter = {};
    if (req.query.familyName) {
      filter.familyName = { $regex: req.query.familyName, $options: 'i' };
    }
    if (req.query.lotNumber) {
      filter.lotNumber = { $regex: req.query.lotNumber, $options: 'i' };
    }

    // Récupérer les enregistrements
    const query = CensusRecord.find(filter).sort({ createdAt: -1 }).skip(skip);
    
    // Appliquer la limite seulement si elle est définie
    if (limit > 0) {
      query.limit(limit);
    }
    
    const records = await query;

    // Compter le total
    const total = await CensusRecord.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      page,
      pages: limit > 0 ? Math.ceil(total / limit) : 1,
      data: records
    });

  } catch (error) {
    console.error('Erreur de récupération:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération',
      error: error.message
    });
  }
};

// @desc    Récupérer un enregistrement par ID
// @route   GET /api/census/:id
// @access  Private
exports.getRecordById = async (req, res) => {
  try {
    const record = await CensusRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Enregistrement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });

  } catch (error) {
    console.error('Erreur de récupération:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un enregistrement
// @route   PUT /api/census/:id
// @access  Private
exports.updateRecord = async (req, res) => {
  try {
    const { lotNumber, familyName, responsibleName, contact, inhabitants, children, notes } = req.body;

    // Vérifier si l'enregistrement existe
    let record = await CensusRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Enregistrement non trouvé'
      });
    }

    // Vérifier si le nouveau numéro de lot existe déjà (si modifié)
    if (lotNumber && lotNumber !== record.lotNumber) {
      const existingRecord = await CensusRecord.findOne({ lotNumber });
      if (existingRecord) {
        return res.status(400).json({
          success: false,
          message: `Le numéro de lot ${lotNumber} existe déjà`
        });
      }
    }

    // Mettre à jour
    record = await CensusRecord.findByIdAndUpdate(
      req.params.id,
      {
        lotNumber,
        familyName,
        responsibleName,
        contact,
        inhabitants: inhabitants ? parseInt(inhabitants) : record.inhabitants,
        children: children !== undefined ? parseInt(children) : record.children,
        notes
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Enregistrement mis à jour avec succès',
      data: record
    });

  } catch (error) {
    console.error('Erreur de mise à jour:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour',
      error: error.message
    });
  }
};

// @desc    Supprimer un enregistrement
// @route   DELETE /api/census/:id
// @access  Private
exports.deleteRecord = async (req, res) => {
  try {
    const record = await CensusRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Enregistrement non trouvé'
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Enregistrement supprimé avec succès',
      data: {}
    });

  } catch (error) {
    console.error('Erreur de suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression',
      error: error.message
    });
  }
};

// @desc    Obtenir les statistiques
// @route   GET /api/census/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    // Compter le total d'enregistrements
    const totalRecords = await CensusRecord.countDocuments();

    // Calculer les totaux
    const result = await CensusRecord.aggregate([
      {
        $group: {
          _id: null,
          totalInhabitants: { $sum: '$inhabitants' },
          totalChildren: { $sum: '$children' }
        }
      }
    ]);

    const stats = result[0] || { totalInhabitants: 0, totalChildren: 0 };

    // Calculer le nombre d'adultes
    const totalAdults = stats.totalInhabitants - stats.totalChildren;

    res.status(200).json({
      success: true,
      data: {
        totalRecords,
        totalHouseholds: totalRecords,
        totalInhabitants: stats.totalInhabitants,
        totalChildren: stats.totalChildren,
        totalAdults,
        averageHouseholdSize: totalRecords > 0 ? (stats.totalInhabitants / totalRecords).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('Erreur de statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du calcul des statistiques',
      error: error.message
    });
  }
};

// @desc    Import en masse (CSV/Excel)
// @route   POST /api/census/import
// @access  Private
exports.importRecords = async (req, res) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun enregistrement à importer'
      });
    }

    const results = {
      success: [],
      failed: [],
      total: records.length
    };

    // Importer chaque enregistrement
    for (const recordData of records) {
      try {
        // Vérifier si le lot existe déjà
        const existingRecord = await CensusRecord.findOne({ lotNumber: recordData.lotNumber });
        if (existingRecord) {
          results.failed.push({
            lotNumber: recordData.lotNumber,
            reason: 'Numéro de lot déjà existant'
          });
          continue;
        }

        // Créer l'enregistrement
        const record = await CensusRecord.create({
          lotNumber: recordData.lotNumber,
          familyName: recordData.familyName,
          responsibleName: recordData.responsibleName,
          contact: recordData.contact,
          inhabitants: parseInt(recordData.inhabitants),
          children: parseInt(recordData.children),
          notes: recordData.notes || ''
        });

        results.success.push(record);

      } catch (error) {
        results.failed.push({
          lotNumber: recordData.lotNumber,
          reason: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Import terminé: ${results.success.length} réussis, ${results.failed.length} échoués`,
      data: results
    });

  } catch (error) {
    console.error('Erreur d\'import:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'import',
      error: error.message
    });
  }
};
