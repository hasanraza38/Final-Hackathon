import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    loanCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanCategory', required: true },
  });
  
  module.exports = mongoose.model('Subcategory', SubcategorySchema);
  