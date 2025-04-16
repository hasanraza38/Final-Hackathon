import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  loanAmount: { type: Number, required: true },
  initialDeposit: { type: Number, required: true },
  loanPeriod: { type: Number, required: true }, // in years
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  tokenNumber: { type: String },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  address: {
    city: String,
    country: String
  }
});

export default mongoose.model('Loan', loanSchema);