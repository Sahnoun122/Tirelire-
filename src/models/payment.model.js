import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  method: { type: String, enum: ['stripe', 'cash'], required: true },
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  stripePaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', paymentSchema);
