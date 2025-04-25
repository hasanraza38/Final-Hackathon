import LoanApplication from '../models/loanApplication.models.js';
import loanCategory from '../models/loanCategory.models.js';
import mongoose from 'mongoose';

// Get all loan applications
const getAllApplications = async (req, res) => {
  try {
    
    const { city, country } = req.query;
    let query = {};
    if (city) query['address.city'] = city;
    if (country) query['address.country'] = country;

    const applications = await LoanApplication.find(query)
      .populate('userId', 'name email')
      .populate('appointment');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getSingleApplication = async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id)
      .populate('userId', 'name email cnic')
      .populate('appointment', 'date time');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      message: 'Application retrieved successfully',
      application
    });
  } catch (error) {
    console.error('Get Single Application Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    res.status(500).json({ error: 'Failed to retrieve application' });
  }
};

// Approve loan application
const approveLoanApplication = async (req, res) => {
  try {
    const application = await LoanApplication.findByIdAndUpdate(
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
    const application = await LoanApplication.findByIdAndUpdate(
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


// add loan category
const addCategory = async (req, res) => {
  try {
    const { name, subcategories, maxLoan, loanPeriod } = req.body;
    const category = new loanCategory({
      name,
      subcategories: subcategories || [],
      maxLoan,
      loanPeriod
    });
    await category.save();
    res.status(201).json({ message: 'Category added', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add subcategory 

const addSubcategory = async (req, res) => {
  try {
    const { categoryId } = req.params; 
    const { subcategory } = req.body; 

    if (!categoryId) {
      return res.status(400).json({ message: 'categoryId is required in URL params' });
    }
    if (!subcategory) {
      return res.status(400).json({ message: 'subcategory is required in request body' });
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid categoryId format' });
    }
    if (typeof subcategory !== 'string') {
      return res.status(400).json({ message: 'subcategory must be a string' });
    }

    const category = await loanCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.subcategories.includes(subcategory)) {
      return res.status(400).json({ message: 'Subcategory already exists' });
    }

    category.subcategories.push(subcategory);
    await category.save();
    res.status(200).json({ message: 'Subcategory added', category });
  } catch (error) {
    console.error('Add Subcategory Error:', error); 
    res.status(400).json({ error: error.message });
  }
};

// Edit category
const editCategory = async (req, res) => {
  try {
    const { name, subcategories, maxLoan, period } = req.body;
    const category = await loanCategory.findByIdAndUpdate(
      req.params.id,
      { name, subcategories, maxLoan, period },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category updated', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await loanCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await loanCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllApplications,
  getSingleApplication,
  approveLoanApplication,
  rejectLoanApplication,
  deleteCategory,
  editCategory,
  addCategory,  
  getCategories,
  addSubcategory
};