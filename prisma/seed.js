const prisma = require('../src/config/db');
const bcrypt = require('bcrypt');

async function main() {
  console.log('🔄 Cleaning up existing database...');
  // Delete in reverse order of relationships to respect foreign keys
  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('🌱 Seeding ADMIN user...');
  await prisma.user.create({
    data: {
      email: 'admin@medicore.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('🌱 Seeding DOCTOR users...');
  const specializations = ['Cardiology', 'Neurology', 'Pediatrics'];
  const doctors = [];
  
  for (let i = 0; i < 3; i++) {
    const doc = await prisma.user.create({
      data: {
        email: `doctor${i + 1}@medicore.com`,
        password: hashedPassword,
        role: 'DOCTOR',
        doctorProfile: {
          create: {
            specialization: specializations[i],
            isAvailable: true,
          },
        },
      },
      include: { doctorProfile: true },
    });
    doctors.push(doc);
  }

  console.log('🌱 Seeding PATIENT users...');
  const patients = [];
  for (let i = 0; i < 5; i++) {
    const pat = await prisma.user.create({
      data: {
        email: `patient${i + 1}@medicore.com`,
        password: hashedPassword,
        role: 'PATIENT',
        patientProfile: {
          create: {},
        },
      },
      include: { patientProfile: true },
    });
    patients.push(pat);
  }

  console.log('🌱 Seeding Appointments and Medical Records...');
  const now = new Date();
  
  for (let i = 0; i < 10; i++) {
    // 5 past appointments, 5 future appointments
    const isPast = i < 5;
    const appointmentDate = new Date(now);
    
    if (isPast) {
      appointmentDate.setDate(now.getDate() - (i + 1));
    } else {
      appointmentDate.setDate(now.getDate() + (i + 1));
    }

    const doctorProfileId = doctors[i % 3].doctorProfile.id;
    const patientProfileId = patients[i % 5].patientProfile.id;

    await prisma.appointment.create({
      data: {
        doctorId: doctorProfileId,
        patientId: patientProfileId,
        startTime: appointmentDate,
        status: isPast ? 'COMPLETED' : 'SCHEDULED',
        medicalRecord: isPast
          ? {
              create: {
                diagnosis: `Routine Checkup Diagnosis #${i + 1}`,
                prescriptionNotes: `Prescribed medication sequence #${i + 1}`,
              },
            }
          : undefined, // no record for future appointments typically
      },
    });
  }

  console.log('✨ Seeding completely successful!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
