const { Prisma } = require('@prisma/client');

class AppointmentController {
  constructor(appointmentService) {
    this.appointmentService = appointmentService;
  }

  bookAppointment = async (req, res) => {
    const { doctorId, startTime } = req.body;

    if (!doctorId || !startTime) {
      return res.status(400).json({ error: 'doctorId and startTime are required.' });
    }

    try {
      const result = await this.appointmentService.bookAppointment(
        req.user.userId,
        doctorId,
        startTime
      );

      return res.status(201).json({
        message: 'Appointment booked successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return res.status(409).json({
          error: 'Conflict: This time slot is already booked for the selected doctor.',
        });
      }
      if (error.message === 'DOCTOR_NOT_FOUND') {
        return res.status(404).json({ error: 'Doctor not found.' });
      }
      if (error.message === 'DOCTOR_UNAVAILABLE') {
        return res.status(400).json({ error: 'Doctor is currently not accepting appointments.' });
      }
      if (error.message === 'PATIENT_PROFILE_NOT_FOUND') {
        return res.status(404).json({
          error: 'Patient profile not found. Make sure you are logged in as a PATIENT.',
        });
      }

      console.error('Book Appointment Error:', error);
      return res.status(500).json({ error: 'Internal server error while booking appointment.' });
    }
  };
}

module.exports = AppointmentController;