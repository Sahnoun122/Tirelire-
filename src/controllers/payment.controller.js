import { stripe } from "../config/stripe.js";
import Payment from "../models/payment.model.js";
import { updateReliabilityScore } from "../services/reliability.service.js";

export const createStripePayment = async (req, res) => {
  try {
    const { amount, currency = "usd", userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      metadata: { userId },
    });

    const payment = new Payment({
      user: userId,
      amount,
      currency,
      method: "stripe",
      status: "pending",
      stripePaymentId: paymentIntent.id,
    });
    await payment.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "✅ Paiement Stripe créé avec succès.",
    });
  } catch (error) {
    console.error("Erreur Stripe:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createCashPayment = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    const payment = new Payment({
      user: userId,
      amount,
      currency: "mad",
      method: "cash",
      status: "pending",
    });

    await payment.save();

    res.status(201).json({
      message: "💵 Paiement en espèces enregistré (en attente de validation).",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const validateCashPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "succeeded" },
      { new: true }
    );

    if (!payment) return res.status(404).json({ message: "Paiement introuvable" });

    await updateReliabilityScore(payment.user, "succeeded");

    res.json({ message: "✅ Paiement validé avec succès", payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
