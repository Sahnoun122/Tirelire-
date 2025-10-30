import mongoose from "mongoose";

const transactionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  type: {
    type: String,
    enum: ["contribution", "virement", "withdrawal"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

export default mongoose.model("TransactionLog", transactionLogSchema);
