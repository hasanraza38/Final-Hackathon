import mongoose from "mongoose";

const loanCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  maxLoanAmount: {
    type: Number,
    required: true,
  },
  loanPeriod: { 
    type: Number, 
    required: true 
}, 
  subcategories: 
  [{ 
    type: mongoose.Schema.Types.ObjectId,
     ref: "Subcategory" 
    }

  ],
},
{
  timestamps: true, 
});

export default mongoose.model("LoanCategory", loanCategorySchema);
