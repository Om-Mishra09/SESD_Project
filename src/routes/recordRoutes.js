const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Cross-compatible route: Both DOCTORS and PATIENTS can hit this.
// Internal logic validates the ownership boundaries.
router.get(
  '/patient/:id',
  verifyToken,
  authorizeRoles('PATIENT', 'DOCTOR'),
  recordController.getPatientRecords
);

// DOCTOR Only update route executing explicitly attached Audit Traces
router.put(
  '/:recordId',
  verifyToken,
  authorizeRoles('DOCTOR'),
  recordController.updateRecord
);

module.exports = router;
