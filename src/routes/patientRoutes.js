const express = require('express');
const router = express.Router();

const prisma = require('../config/db');
const PatientService = require('../services/PatientService');
const PatientController = require('../controllers/patientController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const patientService = new PatientService(prisma);
const patientController = new PatientController(patientService);

router.get('/', verifyToken, authorizeRoles('DOCTOR', 'ADMIN'), patientController.getAllPatients);

module.exports = router;
