import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
  loanId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'Loan',
     required: true },
  date: { 
    type: Date,
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  officeLocation: {
     type: String, 
     required: true 
    },
  tokenNumber: {
    type: String,
    required: true
  },
  qrCode: {
    type: String,
    required: true
  }
},
{
  timestamps: true,
}
);

export default mongoose.model('Appointment', appointmentSchema);