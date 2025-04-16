import mongoose from 'mongoose';

const loanCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcategories: [{ type: String, required: true }],
  maxLoan: { type: Number, required: true },
  loanPeriod: { type: Number, required: true } // in years
});

export default mongoose.model('LoanCategory', loanCategorySchema);