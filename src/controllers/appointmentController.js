const prisma = require('../config/db');
const { Prisma } = require('@prisma/client');

/**
 * Books an appointment and implements Atomic Scheduling to prevent double-booking.
 * Generates an initial Medical Record for the appointment automatically.
 */
async function bookAppointment(req, res) {
  try {
    const { doctorId, startTime } = req.body;
    
    // We expect req.user to be populated by the verifyToken middleware.
    // In our schema, Appointment requires a PatientProfile ID. 
    // We assume req.user.userId links to the User model, and we need to fetch the PatientProfile.
    const userId = req.user.userId;

    if (!doctorId || !startTime) {
      return res.status(400).json({ error: 'doctorId and startTime are required.' });
    }

    const appointmentTime = new Date(startTime);

    // Run within a transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if the Doctor exists and is available
      const doctor = await tx.doctorProfile.findUnique({
        where: { id: parseInt(doctorId, 10) }
      });

      if (!doctor) {
        throw new Error('DOCTOR_NOT_FOUND');
      }

      if (!doctor.isAvailable) {
        throw new Error('DOCTOR_UNAVAILABLE');
      }

      // Fetch the patient profile ID associated with this user
      const patient = await tx.patientProfile.findUnique({
        where: { userId: userId }
      });

      if (!patient) {
        throw new Error('PATIENT_PROFILE_NOT_FOUND');
      }

      // 2. Attempt to create the Appointment record. 
      // This will throw a P2002 error if the doctorId and startTime combination already exists.
      const appointment = await tx.appointment.create({
        data: {
          doctorId: doctor.id,
          patientId: patient.id,
          startTime: appointmentTime,
          status: 'SCHEDULED', // Default from schema
        }
      });

      // 3. Automatically generate an empty MedicalRecord linked to this new appointment
      const medicalRecord = await tx.medicalRecord.create({
        data: {
          appointmentId: appointment.id,
          diagnosis: '',
          prescriptionNotes: ''
        }
      });

      return { appointment, medicalRecord };
    });

    return res.status(201).json({
      message: 'Appointment booked successfully',
      data: result
    });

  } catch (error) {
    // Catch specific Prisma unique constraint violation error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({ 
          error: 'Conflict: This time slot is already booked for the selected doctor.' 
        });
      }
    }

    // Handle application-specific business logic errors
    if (error.message === 'DOCTOR_NOT_FOUND') {
      return res.status(404).json({ error: 'Doctor not found.' });
    }
    if (error.message === 'DOCTOR_UNAVAILABLE') {
      return res.status(400).json({ error: 'Doctor is currently not accepting appointments.' });
    }
    if (error.message === 'PATIENT_PROFILE_NOT_FOUND') {
      return res.status(404).json({ error: 'Patient profile not found. Make sure you are logged in as a PATIENT.' });
    }

    console.error('Book Appointment Error:', error);
    return res.status(500).json({ error: 'Internal server error while booking appointment.' });
  }
}

module.exports = {
  bookAppointment
};