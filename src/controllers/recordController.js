const prisma = require('../config/db');

/**
 * Retrieves all medical records associated with a specific Patient Profile ID.
 * Implements strict authorization validation logic.
 */
async function getPatientRecords(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const { userId: tokenUserId, role } = req.user; // Extract identity from verified JWT

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid patient ID parameter.' });
    }

    // 1. Resolve Patient Target Profile
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId: userId }
    });

    if (!patientProfile) {
      return res.status(404).json({ error: 'Patient profile not found.' });
    }

    // 2. Enforce Strict PATIENT Ownership
    // If the user's role is PATIENT, their underlying User ID MUST map identically to the Profile.
    if (role === 'PATIENT' && patientProfile.userId !== tokenUserId) {
      return res.status(403).json({ 
        error: 'Forbidden. You are not authorized to view another patient\'s medical records.' 
      });
    }

    /* DOCTOR roles natively bypass this strict clause to inspect any patient */

    // 3. Extract the Graph (Appointments + nested MedicalRecords)
    const recordsGraph = await prisma.appointment.findMany({
      where: { patientId: patientProfile.id },
      include: {
        medicalRecord: true,
        doctor: {
          select: {
            id: true,
            specialization: true,
            user: { select: { email: true } }
          }
        }
      },
      orderBy: { startTime: 'desc' } // Most recent first
    });

    return res.status(200).json({
      message: 'Medical records retrieved successfully',
      data: recordsGraph
    });

  } catch (error) {
    console.error('Fetch Records Error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching patient records.' });
  }
}

/**
 * Controller-Isolated Audit Logging Middleware function
 */
function auditLogModification(auditData) {
  // In a production system, this interfaces with external observability or an AuditLog table.
  console.log(`\n🛡️  [AUDIT LOG - MEDICAL RECORD MODIFIED]
   Doctor Profile ID : ${auditData.doctorId}
   Target Record ID  : ${auditData.recordId}
   Timestamp         : ${auditData.timestamp}\n`);
}

/**
 * Updates a Medical Record (Diagnosis and Prescription Notes).
 * Explicitly bound to DOCTOR role execution with attached Audit Logging.
 */
async function updateRecord(req, res) {
  try {
    const { recordId } = req.params;
    const { diagnosis, prescriptionNotes } = req.body;
    const { userId } = req.user;

    const parsedRecordId = parseInt(recordId, 10);
    if (isNaN(parsedRecordId)) {
      return res.status(400).json({ error: 'Invalid recordId parameter.' });
    }

    // 1. Resolve internal Doctor Profile mapping from JWT Token's User node
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: userId }
    });

    if (!doctorProfile) {
      return res.status(404).json({ error: 'Executing Doctor identity could not be matched.' });
    }

    // 2. Execute target Medical Record update
    const updatedRecord = await prisma.medicalRecord.update({
      where: { id: parsedRecordId },
      data: {
        diagnosis: diagnosis !== undefined ? diagnosis : undefined,
        prescriptionNotes: prescriptionNotes !== undefined ? prescriptionNotes : undefined,
      }
    });

    // 3. Emit robust audit trace block
    auditLogModification({
      doctorId: doctorProfile.id,
      recordId: updatedRecord.id,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      message: 'Medical Record successfully explicitly updated',
      data: updatedRecord
    });

  } catch (error) {
    // Note: The global error handler will also naturally trap Prisma exceptions natively without crashing now!
    console.error('Update Record Error:', error);
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'Target Medical Record could not be isolated or located.'});
    }
    return res.status(500).json({ error: 'Internal server error while modifying patient record block.' });
  }
}

module.exports = {
  getPatientRecords,
  updateRecord
};
