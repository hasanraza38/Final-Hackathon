import Loan from '../models/loan.models.js';
import Subcategory from '../models/subCategory.models.js';

// Get all loan applications
const getApplications = async (req, res) => {
  try {
    const { city, country } = req.query;
    let query = {};
    if (city) query['address.city'] = city;
    if (country) query['address.country'] = country;

    const applications = await Loan.find(query)
      .populate('userId', 'name email')
      .populate('appointment');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve loan application
const approveLoanApplication = async (req, res) => {
  try {
    const application = await Loan.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', tokenNumber: req.body.tokenNumber || `TOKEN-${req.params.id.slice(-6)}` },
      { new: true }
    ).populate('userId', 'name email').populate('appointment');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ message: 'Application approved', application });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reject loan application
const rejectLoanApplication = async (req, res) => {
  try {
    const application = await Loan.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('userId', 'name email').populate('appointment');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ message: 'Application rejected', application });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add loan (admin can manually add a loan)
const addLoan = async (req, res) => {
  try {
    const { userId, category, subcategory, loanAmount, initialDeposit, loanPeriod, address } = req.body;
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
    res.status(201).json({ message: 'Loan added', loan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit loan
const editLoan = async (req, res) => {
  try {
    const { category, subcategory, loanAmount, initialDeposit, loanPeriod, address, status } = req.body;
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { category, subcategory, loanAmount, initialDeposit, loanPeriod, address, status },
      { new: true }
    ).populate('userId', 'name email').populate('appointment');
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.status(200).json({ message: 'Loan updated', loan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete loan
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.status(200).json({ message: 'Loan deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add subcategory
const addSubcategory = async (req, res) => {
  try {
    const { category, name } = req.body;
    const subcategory = new Subcategory({ category, name });
    await subcategory.save();
    res.status(201).json({ message: 'Subcategory added', subcategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit subcategory
const editSubcategory = async (req, res) => {
  try {
    const { category, name } = req.body;
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { category, name },
      { new: true }
    );
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.status(200).json({ message: 'Subcategory updated', subcategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
    res.status(200).json({ message: 'Subcategory deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all subcategories
const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getApplications,
  approveLoanApplication,
  rejectLoanApplication,
  addLoan,
  editLoan,
  deleteLoan,
  addSubcategory,
  editSubcategory,
  deleteSubcategory,
  getSubcategories
};