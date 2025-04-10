import Loan from '../models/loan.models.js';
import Guarantor from '../models/guarantor.models.js';
import Appointment from '../models/appointment.models.js';
import generateQRCode from '../utils/generateQRCode.js';

const submitLoan = async (req, res) => {
  const { category, subcategory, loanAmount, initialDeposit, loanPeriod, guarantors, address } = req.body;
  const userId = req.user.id;

  const loan = new Loan({
    userId,
    category,
    subcategory,
    loanAmount,
    initialDeposit,
    loanPeriod,
    address
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
};

const getLoanDetails = async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('userId', 'name email').populate('appointment');
  if (!loan) return res.status(404).json({ message: 'Loan not found' });
  res.json(loan);
};

export {submitLoan, getLoanDetails}