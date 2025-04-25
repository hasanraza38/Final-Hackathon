import AppointmentModels from "../models/appointment.models.js";

// Get All Appointments
const getAllAppointments = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { loanId } = req.query;

    let query = { userId }; 
    if (loanId) {
      if (!mongoose.isValidObjectId(loanId)) {
        return res.status(400).json({ message: 'Invalid loan ID format' });
      }
      query.loanId = loanId;
    }

    const appointments = await AppointmentModels.find(query)
      .populate({
        path: 'loanId',
        select: 'category subcategory loanAmount initialDeposit loanPeriod address status guarantors',
        populate: {
          path: 'userId',
          select: 'name email cnic' 
        }
      })
      .sort({ date: 1 });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }

    res.status(200).json({
      message: 'Appointments retrieved successfully',
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get All Appointments Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid loan ID format' });
    }
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
};
// Get All Appointments



  // Get Single Appointment
const getSingleAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointment = await AppointmentModels.findOne({
      _id: req.params.id,
      userId
    }).populate({
      path: 'loanId',
      select: 'category subcategory loanAmount initialDeposit loanPeriod address status guarantors',
      populate: {
        path: 'userId',
        select: 'name email cnic'
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or you are not authorized' });
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
  // Get Single Appointment


  export { getAllAppointments, getSingleAppointment };