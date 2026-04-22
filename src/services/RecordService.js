class RecordService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getPatientRecords(targetUserId, requestingUserId, requestingRole) {
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId: targetUserId },
    });

    if (!patientProfile) throw new Error('PATIENT_PROFILE_NOT_FOUND');

    if (requestingRole === 'PATIENT' && patientProfile.userId !== requestingUserId) {
      throw new Error('FORBIDDEN');
    }

    return this.prisma.appointment.findMany({
      where: { patientId: patientProfile.id },
      include: {
        medicalRecord: true,
        doctor: {
          select: {
            id: true,
            specialization: true,
            user: { select: { email: true } },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async updateRecord(recordId, userId, diagnosis, prescriptionNotes) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) throw new Error('DOCTOR_PROFILE_NOT_FOUND');

    return this.prisma.medicalRecord.update({
      where: { id: recordId },
      data: {
        diagnosis: diagnosis !== undefined ? diagnosis : undefined,
        prescriptionNotes: prescriptionNotes !== undefined ? prescriptionNotes : undefined,
      },
    });
  }

  auditLog(doctorId, recordId) {
    console.log(`\n🛡️  [AUDIT LOG - MEDICAL RECORD MODIFIED]
   Doctor Profile ID : ${doctorId}
   Target Record ID  : ${recordId}
   Timestamp         : ${new Date().toISOString()}\n`);
  }
}

module.exports = RecordService;
