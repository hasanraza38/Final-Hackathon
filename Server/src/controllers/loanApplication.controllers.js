import LoanApplication from '../models/loanApplication.models.js';
import Appointment from '../models/appointment.models.js';
import generateQRCode from '../utils/generateQRCode.js';
import loanCategory from '../models/loanCategory.models.js';

// submit loan application
const submitLoanApplication = async (req, res) => {
  try {
    const { category, subcategory, loanAmount, initialDeposit, loanPeriod, guarantors, address } = req.body;
    const userId =  req.user?.id;
    console.log(userId, 'userId from token');
    

    const categoryDoc = await loanCategory.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (!categoryDoc.subcategories.includes(subcategory)) {
      return res.status(400).json({ message: 'Invalid subcategory' });
    }
    if (loanAmount > categoryDoc.maxLoan) {
      return res.status(400).json({ message: `Loan amount exceeds maximum of ${categoryDoc.maxLoan}` });
    }
    if (loanPeriod > categoryDoc.period) {
      return res.status(400).json({ message: `Loan period exceeds maximum of ${categoryDoc.period} years` });
    }

    if (!guarantors || !Array.isArray(guarantors) || guarantors.length < 2) {
      return res.status(400).json({ message: 'guarantors is required' });
    }

    for (const guarantor of guarantors) {
      if (!guarantor.name || !guarantor.cnic || !guarantor.email) {
        return res.status(400).json({ message: `Missing required fields for guarantor: ${guarantor.name || 'Unknown'}` });
      }


      const existingGuarantorCnic = await LoanApplication.findOne({ 'guarantors.cnic': guarantor.cnic });
      if (existingGuarantorCnic) {
        return res.status(400).json({ message: `Guarantor CNIC ${guarantor.cnic} already registered` });
      }

      const existingGuarantorEmail = await LoanApplication.findOne({ 'guarantors.email': guarantor.email });
      if (existingGuarantorEmail) {
        return res.status(400).json({ message: `Guarantor email ${guarantor.email} already registered` });
      }
    const existingGuarantorPhone = await LoanApplication.findOne({ 'guarantors.phone': guarantor.phone });
    if (existingGuarantorPhone) {
      return res.status(400).json({ message: `Guarantor email ${guarantor.phone} already registered` });
    }
  }


    const loan = new LoanApplication({
      userId,
      category,
      subcategory,
      loanAmount,
      initialDeposit,
      loanPeriod,
      address,
      status: 'pending',
      guarantors 
    });
    await loan.save();

    const tokenNumber = `TOKEN-${loan._id.toString().slice(-6)}`;
    const qrCode = await generateQRCode(tokenNumber);


    const appointment = new Appointment({
      userId,
      loanId: loan._id,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), 
      time: '10:00 AM',
      officeLocation: 'Saylani Head Office',
      tokenNumber,
      qrCode
    });
    await appointment.save();

    loan.appointment = appointment._id;
    await loan.save();

    res.status(201).json({
      message: 'Loan submitted successfully',
      loanId: loan._id,
      tokenNumber,
      appointment: {
        date: appointment.date,
        time: appointment.time,
        officeLocation: appointment.officeLocation,
        tokenNumber: appointment.tokenNumber,
        qrCode: appointment.qrCode
      },
      qrCode
    });
  } catch (error) {
    console.error('Submit Loan Error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(400).json({ error: error.message || 'Failed to submit loan' });
  }
};
// submit loan application



// get loan detail
const getLoanApplicationDetails = async (req, res) => {
  const loanApplication = await LoanApplication.findById(req.params.id).populate('userId', 'name email cnic').populate('appointment');
  if (!loanApplication) return res.status(404).json({ message: 'Loan not found' });
  res.json(loanApplication);
};
// get loan detail


export {submitLoanApplication, getLoanApplicationDetails}





