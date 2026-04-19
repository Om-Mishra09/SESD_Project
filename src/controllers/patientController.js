const prisma = require('../config/db');

/**
 * Fetches all users with the PATIENT role.
 */
async function getAllPatients(req, res) {
  try {
    const patients = await prisma.user.findMany({
      where: {
        role: 'PATIENT'
      },
      select: {
        id: true,
        email: true,
        patientProfile: true
      }
    });
    return res.status(200).json(patients);
  } catch (error) {
    console.error('Fetch All Patients Error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching patients.' });
  }
}

module.exports = {
  getAllPatients
};
