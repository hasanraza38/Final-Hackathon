import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  cnic: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  address: {
    city: String,
    country: String
  }
});

export default mongoose.model("User", userSchema);
