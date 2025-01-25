import LoanApplicationSchema from "../models/loanApplication.models.js"

// approve application 
const approveLoanApplication = async (req, res) => {
  try {
    const application = await LoanApplicationSchema.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// approve application 


// reject application 
const rejectLoanApplication = async (req, res) => {
  try {
    const application = await LoanApplicationSchema.findByIdAndUpdate(
      req.params.id,
      { status: 'Rejected' },
      { new: true }
    );
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// reject application 

export {approveLoanApplication, rejectLoanApplication}