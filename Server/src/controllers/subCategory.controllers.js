import SubcategorySchema from "../models/subCategory.models.js"


// Create a new subcategory
const createSubcategory = async (req, res) => {
  try {
    const subcategory = await SubcategorySchema.create(req.body);
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Create a new subcategory


// Get all subcategories
const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await SubcategorySchema.find().populate('loanCategory');
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all subcategories


// Get a single subcategory
const getSingleSubcategory = async (req, res) => {
  try {
    const subcategory = await SubcategorySchema.findById(req.params.id).populate('loanCategory');
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a single subcategory



// Update a subcategory
const updateSubcategory = async (req, res) => {
  try {
    const subcategory = await SubcategorySchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Update a subcategory


// Delete a subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await SubcategorySchema.findByIdAndDelete(req.params.id);
    if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a subcategory

export {deleteSubcategory, updateSubcategory, getSingleSubcategory, getAllSubcategories, createSubcategory}