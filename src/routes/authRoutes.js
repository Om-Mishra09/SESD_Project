const express = require('express');
const router = express.Router();

const prisma = require('../config/db');
const AuthService = require('../services/AuthService');
const AuthController = require('../controllers/authController');

const authService = new AuthService(prisma);
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
