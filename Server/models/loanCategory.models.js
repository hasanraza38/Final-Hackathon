import mongoose from 'mongoose';

const loanCategorySchema = new mongoose.Schema(
  {
  name: {
     type: String,
     required: true,
     unique: true
     },
  subcategories: [{ type: String }], 
  maxLoan: {
     type: Number,
     required: true 
    },
  loanPeriod: {
   type: Number,
   required: true 
  }
}, 
{
  timestamps: true
});

export default mongoose.model('LoanCategory', loanCategorySchema);