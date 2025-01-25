onst AdminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    permissions: [{ type: String }], // e.g., "Approve Loan", "Manage Categories"
  });
  
  module.exports = mongoose.model('Admin', AdminSchema);
  