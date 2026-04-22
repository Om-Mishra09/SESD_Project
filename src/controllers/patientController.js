class PatientController {
  constructor(patientService) {
    this.patientService = patientService;
  }

  getAllPatients = async (req, res) => {
    try {
      const patients = await this.patientService.getAllPatients();
      return res.status(200).json(patients);
    } catch (error) {
      console.error('Fetch All Patients Error:', error);
      return res.status(500).json({ error: 'Internal server error while fetching patients.' });
    }
  };
}

module.exports = PatientController;
