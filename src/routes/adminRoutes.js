const express = require('express');
const router = express.Router();

const prisma = require('../config/db');
const AdminService = require('../services/AdminService');
const AdminController = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const adminService = new AdminService(prisma);
const adminController = new AdminController(adminService);

router.get('/stats', verifyToken, authorizeRoles('ADMIN'), adminController.getSystemStats);

module.exports = router;
