const LoanApplication = require('../models/LoanApplication');
import

exports.approveLoanApplication = async (req, res) => {
  try {
    const application = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.rejectLoanApplication = async (req, res) => {
  try {
    const application = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
