const prisma = require('../config/db');

/**
 * Fetches high-level system dashboard metrics and recent activity logs.
 */
async function getSystemStats(req, res) {
  try {
    // 1. Aggregated Analytics
    const doctorCount = await prisma.doctorProfile.count();
    const patientCount = await prisma.patientProfile.count();
    const appointmentCount = await prisma.appointment.count();

    // 2. Critical System Logs (Recent Activity)
    // Note: Since Appointment doesn't have createdAt, we sort by startTime
    const rawRecentAppointments = await prisma.appointment.findMany({
      take: 5,
      orderBy: { startTime: 'desc' },
      include: {
        doctor: {
          include: { user: { select: { email: true } } }
        },
        patient: {
          include: { user: { select: { email: true } } }
        }
      }
    });

    // 3. Flatten mapping for frontend delivery
    const recentActivity = rawRecentAppointments.map(app => ({
      id: app.id,
      startTime: app.startTime,
      status: app.status,
      doctorEmail: app.doctor?.user?.email || 'System Default',
      patientEmail: app.patient?.user?.email || 'Guest Patient',
      patientId: app.patientId,
      doctorId: app.doctorId
    }));

    return res.status(200).json({
      doctors: doctorCount,
      patients: patientCount,
      appointments: appointmentCount,
      recentActivity: recentActivity
    });

  } catch (error) {
    console.error('Fetch Admin Stats Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error while fetching dashboard statistics.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  getSystemStats
};
