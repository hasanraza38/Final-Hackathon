import Loan from '../models/loan.models.js';
import Guarantor from '../models/guarantor.models.js';
import Appointment from '../models/appointment.models.js';
import generateQRCode from '../utils/generateQRCode.js';
import loanCategory from '../models/loanCategory.models.js';

const submitLoan = async (req, res) => {
  try {
    const { category, subcategory, loanAmount, initialDeposit, loanPeriod, guarantors, address } = req.body;
    const userId = req.user.id;

    // Validate category and subcategory
    const categoryDoc = await loanCategory.findOne({ name: category });
    if (!categoryDoc) return res.status(400).json({ message: 'Invalid category' });
    if (!categoryDoc.subcategories.includes(subcategory)) {
      return res.status(400).json({ message: 'Invalid subcategory' });
    }
    if (loanAmount > categoryDoc.maxLoan) {
      return res.status(400).json({ message: `Loan amount exceeds maximum of ${categoryDoc.maxLoan}` });
    }
    if (loanPeriod > categoryDoc.period) {
      return res.status(400).json({ message: `Loan period exceeds maximum of ${categoryDoc.period} years` });
    }

    const loan = new Loan({
      userId,
      category,
      subcategory,
      loanAmount,
      initialDeposit,
      loanPeriod,
      address,
      status: 'pending'
    });
    await loan.save();

    const guarantorDocs = guarantors.map(g => ({ ...g, loanId: loan._id }));
    await Guarantor.insertMany(guarantorDocs);

    const appointment = new Appointment({
      loanId: loan._id,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
      time: '10:00 AM',
      officeLocation: 'Saylani Office'
    });
    await appointment.save();

    loan.appointment = appointment._id;
    await loan.save();

    const tokenNumber = loan._id.toString();
    const qrCode = await generateQRCode(tokenNumber);

    res.json({
      message: 'Loan submitted',
      loanId: loan._id,
      tokenNumber,
      appointment: { date: appointment.date, time: appointment.time, officeLocation: appointment.officeLocation },
      qrCode
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const getLoanDetails = async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('userId', 'name email').populate('appointment');
  if (!loan) return res.status(404).json({ message: 'Loan not found' });
  res.json(loan);
};

export {submitLoan, getLoanDetails}





