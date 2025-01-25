import loanCategorySchema from "../models/loanCategory.models.js"
import loanCategorySchema from "../models/subCategory.models.js"


// Create a new loan category
const createLoanCategory = async (req, res) => {
  try {
    const loanCategory = await loanCategorySchema.create(req.body);
    res.status(201).json(loanCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Create a new loan category


// Get all loan categories
const getAllLoanCategories = async (req, res) => {
  try {
    const loanCategories = await loanCategorySchema.find().populate('subcategories');
    res.status(200).json(loanCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all loan categories


// Get a single loan category
const getSingleLoanCategory = async (req, res) => {
  try {
    const loanCategory = await loanCategorySchema.findById(req.params.id).populate('subcategories');
    if (!loanCategory) return res.status(404).json({ error: 'Loan category not found' });
    res.status(200).json(loanCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a single loan category


// Update a loan category
const updateLoanCategory = async (req, res) => {
  try {
    const loanCategory = await loanCategorySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!loanCategory) return res.status(404).json({ error: 'Loan category not found' });
    res.status(200).json(loanCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update a loan category


// Delete a loan category
const deleteLoanCategory = async (req, res) => {
  try {
    const loanCategory = await loanCategorySchema.findByIdAndDelete(req.params.id);
    if (!loanCategory) return res.status(404).json({ error: 'Loan category not found' });
    res.status(200).json({ message: 'Loan category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a loan category

export {createLoanCategory, getAllLoanCategories, getSingleLoanCategory, updateLoanCategory, deleteLoanCategory}
