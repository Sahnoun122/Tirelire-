import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  roundNumber: { type: Number, required: true },
  amount: { type: Number, required: true }, 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      paid: { type: Boolean, default: false },
      paymentDate: { type: Date },
    },
  ],
  isCompleted: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contribution", contributionSchema);
