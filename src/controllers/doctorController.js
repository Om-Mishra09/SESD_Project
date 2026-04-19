const prisma = require('../config/db');

/**
 * Toggles or explicitly sets the 'isAvailable' status for the logged-in DOCTOR.
 */
async function toggleStatus(req, res) {
  try {
    // req.user is populated by the verifyToken middleware
    const userId = req.user.userId;

    // 1. Locate the doctor profile linked to this user account
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: userId }
    });

    if (!doctorProfile) {
      return res.status(404).json({ error: 'Doctor profile not found. Ensure you are logged in as a DOCTOR.' });
    }

    // 2. Determine the new status
    // If the client sends an explicit boolean { isAvailable: true|false }, honor it.
    // Otherwise, simply toggle the current database value.
    let newStatus;
    if (typeof req.body.isAvailable === 'boolean') {
      newStatus = req.body.isAvailable;
    } else {
      newStatus = !doctorProfile.isAvailable;
    }

    // 3. Update the Profile in the database
    const updatedProfile = await prisma.doctorProfile.update({
      where: { id: doctorProfile.id }, // Best practice: update using PK
      data: { isAvailable: newStatus }
    });

    // 4. Return the updated profile
    return res.status(200).json({
      message: `Doctor status successfully updated to ${newStatus ? 'AVAILABLE' : 'UNAVAILABLE'}`,
      data: updatedProfile
    });

  } catch (error) {
    console.error('Toggle Doctor Status Error:', error);
    return res.status(500).json({ error: 'Internal server error while toggling doctor status.' });
  }
}

/**
 * Fetches all doctors with their user profiles.
 */
async function getAllDoctors(req, res) {
  try {
    const doctors = await prisma.doctorProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
            createdAt: true
          }
        }
      }
    });
    return res.status(200).json(doctors);
  } catch (error) {
    console.error('Fetch All Doctors Error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching doctors.' });
  }
}

module.exports = {
  toggleStatus,
  getAllDoctors
};
