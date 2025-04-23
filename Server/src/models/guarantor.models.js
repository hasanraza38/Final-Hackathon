import mongoose from "mongoose";

const guarantorSchema = new mongoose.Schema(
  {
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  // location: { type: String, required: true },
  cnic: { type: String, required: true }
},
{
  timestamps: true,
}
);

export default mongoose.model('Guarantor', guarantorSchema);