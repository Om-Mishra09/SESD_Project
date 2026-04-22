const { Prisma } = require('@prisma/client');

class AppointmentService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async bookAppointment(userId, doctorId, startTime) {
    const appointmentTime = new Date(startTime);

    return this.prisma.$transaction(async (tx) => {
      const doctor = await tx.doctorProfile.findUnique({
        where: { id: parseInt(doctorId, 10) },
      });

      if (!doctor) throw new Error('DOCTOR_NOT_FOUND');
      if (!doctor.isAvailable) throw new Error('DOCTOR_UNAVAILABLE');

      const patient = await tx.patientProfile.findUnique({
        where: { userId },
      });

      if (!patient) throw new Error('PATIENT_PROFILE_NOT_FOUND');

      const appointment = await tx.appointment.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
          startTime: appointmentTime,
          status: 'SCHEDULED',
        },
      });

      const medicalRecord = await tx.medicalRecord.create({
        data: {
          appointmentId: appointment.id,
          diagnosis: '',
          prescriptionNotes: '',
        },
      });

      return { appointment, medicalRecord };
    });
  }
}

module.exports = AppointmentService;
