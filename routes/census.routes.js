const express = require('express');
const router = express.Router();
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  getStats,
  importRecords
} = require('../controllers/census.controller');

// @route   GET /api/census/stats
router.get('/stats', getStats);

// @route   POST /api/census/import
router.post('/import', importRecords);

// @route   POST /api/census
router.post('/', createRecord);

// @route   GET /api/census
router.get('/', getAllRecords);

// @route   GET /api/census/:id
router.get('/:id', getRecordById);

// @route   PUT /api/census/:id
router.put('/:id', updateRecord);

// @route   DELETE /api/census/:id
router.delete('/:id', deleteRecord);

module.exports = router;
