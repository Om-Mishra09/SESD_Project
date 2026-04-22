class DoctorService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async toggleStatus(userId, explicitStatus) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) throw new Error('DOCTOR_PROFILE_NOT_FOUND');

    const newStatus =
      typeof explicitStatus === 'boolean' ? explicitStatus : !doctorProfile.isAvailable;

    return this.prisma.doctorProfile.update({
      where: { id: doctorProfile.id },
      data: { isAvailable: newStatus },
    });
  }

  async getAllDoctors() {
    return this.prisma.doctorProfile.findMany({
      include: {
        user: {
          select: { email: true, createdAt: true },
        },
      },
    });
  }
}

module.exports = DoctorService;
