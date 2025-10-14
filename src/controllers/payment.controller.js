import { stripe } from '../config/stripe.js';
import { env } from '../config/env.js';
import Payment from '../models/payment.model.js';

// ✅ 1. Création d’un paiement Stripe
export const createStripePayment = async (req, res) => {
  try {
    const { amount, currency = 'usd', userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe = cents
      currency,
      metadata: { userId },
    });

    const payment = new Payment({
      user: userId,
      amount,
      currency,
      method: 'stripe',
      status: 'pending',
      stripePaymentId: paymentIntent.id,
    });

    await payment.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: 'Paiement Stripe créé avec succès.',
    });
  } catch (error) {
    console.error('Erreur Stripe:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ 2. Création d’un paiement Cash
export const createCashPayment = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    const payment = new Payment({
      user: userId,
      amount,
      currency: 'mad',
      method: 'cash',
      status: 'pending',
    });

    await payment.save();

    res.status(201).json({
      message: 'Paiement en espèces enregistré (en attente de validation).',
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ 3. Webhook Stripe
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.stripe.webhookSecret);
  } catch (err) {
    console.error('❌ Signature invalide:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Paiement réussi
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    await Payment.findOneAndUpdate(
      { stripePaymentId: paymentIntent.id },
      { status: 'succeeded' },
      { new: true }
    );

    console.log('✅ Paiement réussi pour userId:', paymentIntent.metadata.userId);
  }

  // ❌ Paiement échoué
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    await Payment.findOneAndUpdate(
      { stripePaymentId: paymentIntent.id },
      { status: 'failed' }
    );
    console.log('❌ Paiement échoué pour userId:', paymentIntent.metadata.userId);
  }

  res.json({ received: true });
};
