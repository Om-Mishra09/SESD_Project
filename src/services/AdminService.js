class AdminService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getSystemStats() {
    const [doctorCount, patientCount, appointmentCount, rawRecentAppointments] =
      await Promise.all([
        this.prisma.doctorProfile.count(),
        this.prisma.patientProfile.count(),
        this.prisma.appointment.count(),
        this.prisma.appointment.findMany({
          take: 5,
          orderBy: { startTime: 'desc' },
          include: {
            doctor: { include: { user: { select: { email: true } } } },
            patient: { include: { user: { select: { email: true } } } },
          },
        }),
      ]);

    const recentActivity = rawRecentAppointments.map((app) => ({
      id: app.id,
      startTime: app.startTime,
      status: app.status,
      doctorEmail: app.doctor?.user?.email || 'System Default',
      patientEmail: app.patient?.user?.email || 'Guest Patient',
      patientId: app.patientId,
      doctorId: app.doctorId,
    }));

    return { doctorCount, patientCount, appointmentCount, recentActivity };
  }
}

module.exports = AdminService;
