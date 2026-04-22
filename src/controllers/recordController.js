class RecordController {
  constructor(recordService) {
    this.recordService = recordService;
  }

  getPatientRecords = async (req, res) => {
    const targetUserId = parseInt(req.params.id, 10);

    if (isNaN(targetUserId)) {
      return res.status(400).json({ error: 'Invalid patient ID parameter.' });
    }

    try {
      const records = await this.recordService.getPatientRecords(
        targetUserId,
        req.user.userId,
        req.user.role
      );

      return res.status(200).json({
        message: 'Medical records retrieved successfully',
        data: records,
      });
    } catch (error) {
      if (error.message === 'PATIENT_PROFILE_NOT_FOUND') {
        return res.status(404).json({ error: 'Patient profile not found.' });
      }
      if (error.message === 'FORBIDDEN') {
        return res.status(403).json({
          error: "Forbidden. You are not authorized to view another patient's medical records.",
        });
      }
      console.error('Fetch Records Error:', error);
      return res.status(500).json({ error: 'Internal server error while fetching patient records.' });
    }
  };

  updateRecord = async (req, res) => {
    const recordId = parseInt(req.params.recordId, 10);

    if (isNaN(recordId)) {
      return res.status(400).json({ error: 'Invalid recordId parameter.' });
    }

    const { diagnosis, prescriptionNotes } = req.body;

    try {
      const updatedRecord = await this.recordService.updateRecord(
        recordId,
        req.user.userId,
        diagnosis,
        prescriptionNotes
      );

      this.recordService.auditLog(req.user.userId, updatedRecord.id);

      return res.status(200).json({
        message: 'Medical Record successfully explicitly updated',
        data: updatedRecord,
      });
    } catch (error) {
      if (error.message === 'DOCTOR_PROFILE_NOT_FOUND') {
        return res.status(404).json({ error: 'Executing Doctor identity could not be matched.' });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Target Medical Record could not be isolated or located.' });
      }
      console.error('Update Record Error:', error);
      return res.status(500).json({ error: 'Internal server error while modifying patient record block.' });
    }
  };
}

module.exports = RecordController;
