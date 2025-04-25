import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  initialDeposit: {
    type: Number,
    required: true
  },
  loanPeriod: {
    type: Number,
    required: true
  },
  address: {
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  guarantors: [{
    name: {
      type: String,
      required: [true, 'Guarantor name is required']
    },
    cnic: {
      type: String,
      required: [true, 'Guarantor CNIC is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Guarantor email is required'],
      unique: true,  
      },
  
  phone : { 
    type: Number,
     required: true,
      unique: true 
    },
  address: {
      city: { type: String, required: true },
      country: { type: String, required: true }
    }
  }]
}, { timestamps: true });



export default mongoose.model('LoanApplication', loanApplicationSchema);