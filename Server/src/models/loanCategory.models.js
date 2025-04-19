import mongoose from 'mongoose';

const loanCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcategories: [{ type: String }], // Array of strings
  maxLoan: { type: Number, required: true },
  loanPeriod: { type: Number, required: true }
}, {
  timestamps: true
});
export default mongoose.model('LoanCategory', loanCategorySchema);