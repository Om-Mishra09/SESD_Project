const express = require('express');
const router = express.Router();

const prisma = require('../config/db');
const AppointmentService = require('../services/AppointmentService');
const AppointmentController = require('../controllers/appointmentController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const appointmentService = new AppointmentService(prisma);
const appointmentController = new AppointmentController(appointmentService);

router.post('/book', verifyToken, authorizeRoles('PATIENT'), appointmentController.bookAppointment);

module.exports = router;
