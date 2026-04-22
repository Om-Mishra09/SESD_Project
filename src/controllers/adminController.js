class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  getSystemStats = async (req, res) => {
    try {
      const { doctorCount, patientCount, appointmentCount, recentActivity } =
        await this.adminService.getSystemStats();

      return res.status(200).json({
        doctors: doctorCount,
        patients: patientCount,
        appointments: appointmentCount,
        recentActivity,
      });
    } catch (error) {
      console.error('Fetch Admin Stats Error:', error);
      return res.status(500).json({
        error: 'Internal server error while fetching dashboard statistics.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
}

module.exports = AdminController;
