const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Protect route with Role-Based Access Control logic (only DOCTORS can toggle their status)
router.patch(
  '/status',
  verifyToken,
  authorizeRoles('DOCTOR'),
  doctorController.toggleStatus
);

// Public/protected route to get all doctors
router.get('/', verifyToken, doctorController.getAllDoctors);

module.exports = router;
