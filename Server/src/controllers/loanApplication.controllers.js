import { application } from "express";
import LoanApplicationSchema from "../models/loanApplication.models.js"

// create loan application
const createLoanApplication = async (req, res) => {
  try {
    const application = new LoanApplicationSchema(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// create loan application

// get loan application
const getLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplicationSchema.find()
      .populate('loanCategory')
      .populate('subcategory');
    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get loan application


const updateLoanApplicationStatus = async (req, res) => {
  try {
    const application = await LoanApplicationSchema.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteLoanApplication = async (req, res) => {
  try {
    await LoanApplicationSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Loan application deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
