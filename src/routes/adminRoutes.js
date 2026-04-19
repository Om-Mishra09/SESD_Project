const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get(
  '/stats',
  verifyToken,
  authorizeRoles('ADMIN'),
  adminController.getSystemStats
);

module.exports = router;
