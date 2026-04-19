const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get(
  '/',
  verifyToken,
  authorizeRoles('DOCTOR', 'ADMIN'),
  patientController.getAllPatients
);

module.exports = router;
