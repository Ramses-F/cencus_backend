const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/register
router.post('/register', register);

module.exports = router;
