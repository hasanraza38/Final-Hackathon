import mongoose from "mongoose";


const LoanApplicationSchema = new mongoose.Schema({
    applicantName: { 
        type: String,
         required: true 
        },
    loanCategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'LoanCategory', 
        required: true
     },
    subcategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subcategory'
     },
    requestedAmount: { type: Number, 
        required: true
     },
    status: {
         type: String, enum: ['Pending', 'Approved', 'Rejected'], 
         default: 'Pending' 
        },
    loanPeriod: { type: 
        Number, 
        required: true 
    }, 
    applicationDate: 
    { type: Date, 
        default: Date.now 
    },
  });
  
  module.exports = mongoose.model('LoanApplication', LoanApplicationSchema);
  