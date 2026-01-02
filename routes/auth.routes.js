const express = require('express');
const router = express.Router();
const { login, register, updateEmail, updatePassword } = require('../controllers/auth.controller');

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/register
router.post('/register', register);

// @route   PUT /api/auth/update-email
router.put('/update-email', updateEmail);

// @route   PUT /api/auth/update-password
router.put('/update-password', updatePassword);

module.exports = router;
