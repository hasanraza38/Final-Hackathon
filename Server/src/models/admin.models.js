import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    permissions: [{ type: String }], // e.g., "Approve Loan", "Manage Categories"
  });
  
  export default mongoose.model("Admin", AdminSchema);