const express = require('express');
const router = express.Router();

const prisma = require('../config/db');
const RecordService = require('../services/RecordService');
const RecordController = require('../controllers/recordController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const recordService = new RecordService(prisma);
const recordController = new RecordController(recordService);

router.get('/patient/:id', verifyToken, authorizeRoles('PATIENT', 'DOCTOR'), recordController.getPatientRecords);
router.put('/:recordId', verifyToken, authorizeRoles('DOCTOR'), recordController.updateRecord);

module.exports = router;
