import mongoose from "mongoose";

const guarantorSchema = new mongoose.Schema(
  {
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  address:{
    city: String,
    country: String
  },
  cnic: { type: String, required: true ,unique: true },
},
{
  timestamps: true,
}
);

export default mongoose.model('Guarantor', guarantorSchema);