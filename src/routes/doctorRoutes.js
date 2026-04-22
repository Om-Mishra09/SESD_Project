const express = require('express');
const router = express.Router();

const prisma = require('../config/db');
const DoctorService = require('../services/DoctorService');
const DoctorController = require('../controllers/doctorController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const doctorService = new DoctorService(prisma);
const doctorController = new DoctorController(doctorService);

router.patch('/status', verifyToken, authorizeRoles('DOCTOR'), doctorController.toggleStatus);
router.get('/', verifyToken, doctorController.getAllDoctors);

module.exports = router;
