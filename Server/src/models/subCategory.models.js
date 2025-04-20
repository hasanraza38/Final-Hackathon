import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
  category: { type: String, required: true },
  name: { type: String, required: true, unique: true }
},
{
  timestamps: true
}
);

export default mongoose.model('Subcategory', subcategorySchema);