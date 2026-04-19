const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Protect route to ensure only authenticated users with the PATIENT role can book appointments
router.post(
  '/book', 
  verifyToken, 
  authorizeRoles('PATIENT'), 
  appointmentController.bookAppointment
);

module.exports = router;
