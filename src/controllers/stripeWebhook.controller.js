import Payment from "../models/payment.model.js";
import { stripe } from "../config/stripe.js";
import { env } from "../config/env.js";
import { updateReliabilityScore } from "../services/reliability.service.js";

export const handleStripeWebhook = async (req, res) => {
  console.log("🔍 Webhook appelé:", {
    path: req.path,
    method: req.method,
    hasSignature: !!req.headers["stripe-signature"],
    signature: req.headers["stripe-signature"]?.substring(0, 20) + "...",
    nodeEnv: process.env.NODE_ENV
  });

  const sig = req.headers["stripe-signature"];
  let event;

  const isTestMode = !env.stripe.webhookSecret || process.env.NODE_ENV !== 'production';
  
  if (isTestMode) {
    console.log("Mode test/développement activé - signature ignorée");
    event = req.body;
    
    if (!event || !event.type || !event.data) {
      console.log("Format de données invalide pour le test");
      return res.status(400).json({ 
        error: "Format invalide", 
        expected: { type: "string", data: { object: {} } } 
      });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, env.stripe.webhookSecret);
      console.log("Signature Stripe validée");
    } catch (err) {
      console.error(" Signature invalide:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  const paymentIntent = event.data.object;
  const userId = paymentIntent.metadata.userId;

  switch (event.type) {
    case "payment_intent.succeeded":
      await Payment.findOneAndUpdate({ stripePaymentId: paymentIntent.id }, { status: "succeeded" });
      await updateReliabilityScore(userId, "succeeded");
      console.log(`Paiement réussi pour ${userId}`);
      break;

    case "payment_intent.payment_failed":
      await Payment.findOneAndUpdate({ stripePaymentId: paymentIntent.id }, { status: "failed" });
      await updateReliabilityScore(userId, "failed");
      console.log(` Paiement échoué pour ${userId}`);
      break;

    default:
      console.log(`Événement Stripe non géré : ${event.type}`);
  }

  res.json({ received: true });
};
