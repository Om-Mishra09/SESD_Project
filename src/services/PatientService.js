class PatientService {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAllPatients() {
    return this.prisma.user.findMany({
      where: { role: 'PATIENT' },
      select: {
        id: true,
        email: true,
        patientProfile: true,
      },
    });
  }
}

module.exports = PatientService;
