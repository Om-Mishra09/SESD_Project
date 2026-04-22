class DoctorController {
  constructor(doctorService) {
    this.doctorService = doctorService;
  }

  toggleStatus = async (req, res) => {
    try {
      const updatedProfile = await this.doctorService.toggleStatus(
        req.user.userId,
        req.body.isAvailable
      );

      return res.status(200).json({
        message: `Doctor status successfully updated to ${updatedProfile.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}`,
        data: updatedProfile,
      });
    } catch (error) {
      if (error.message === 'DOCTOR_PROFILE_NOT_FOUND') {
        return res.status(404).json({
          error: 'Doctor profile not found. Ensure you are logged in as a DOCTOR.',
        });
      }
      console.error('Toggle Doctor Status Error:', error);
      return res.status(500).json({ error: 'Internal server error while toggling doctor status.' });
    }
  };

  getAllDoctors = async (req, res) => {
    try {
      const doctors = await this.doctorService.getAllDoctors();
      return res.status(200).json(doctors);
    } catch (error) {
      console.error('Fetch All Doctors Error:', error);
      return res.status(500).json({ error: 'Internal server error while fetching doctors.' });
    }
  };
}

module.exports = DoctorController;
