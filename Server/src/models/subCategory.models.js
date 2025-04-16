import mongoose from 'mongoose';

// const loanSubcategorySchema = new mongoose.Schema({
//   categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanCategory', required: true },
//   name: { type: String, required: true, unique: true }
// });

const subcategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true, unique: true }
});

export default mongoose.model('Subcategory', subcategorySchema);