import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role: { type: String, enum: ["particulier", "admin"], default: "particulier" },
  national_id: { type: String },
  kyc_status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  reliability_score: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
