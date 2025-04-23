import appointmentModels from "../models/appointment.models.js";

// Get All Appointments
const getAllAppointments = async (req, res) => {
    try {
      const { loanId } = req.query;
      let query = {};
      if (loanId) query.loanId = loanId;
  
      const appointments = await appointmentModels.find(query)
        .populate('loanId', 'userId category subcategory status')
        .sort({ date: 1 }); // Sort by date ascending
  
      res.status(200).json({
        message: 'Appointments retrieved successfully',
        count: appointments.length,
        appointments
      });
    } catch (error) {
      console.error('Get All Appointments Error:', error);
      res.status(500).json({ error: 'Failed to retrieve appointments' });
    }
  };


  // Get Single Appointment
const getSingleAppointment = async (req, res) => {
    try {
      const appointment = await appointmentModels.findById(req.params.id)
        .populate('loanId', 'userId category subcategory status');
  
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
  
      res.status(200).json({
        message: 'Appointment retrieved successfully',
        appointment
      });
    } catch (error) {
      console.error('Get Single Appointment Error:', error);
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: 'Invalid appointment ID' });
      }
      res.status(500).json({ error: 'Failed to retrieve appointment' });
    }
  };

  export { getAllAppointments, getSingleAppointment };