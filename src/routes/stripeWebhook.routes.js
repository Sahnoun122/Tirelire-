import express from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhook.controller.js";

const router = express.Router();

// Route principale pour Stripe (données brutes)
router.post("/", express.raw({ type: "application/json" }), handleStripeWebhook);

// Route de test pour Postman (JSON parsé) - plus simple
router.post("/test", express.json(), (req, res) => {
  console.log("📝 Test webhook appelé avec:", req.body);
  
  // Simuler un événement Stripe simple
  const mockEvent = {
    type: req.body.type || "payment_intent.succeeded",
    data: {
      object: {
        id: req.body.data?.object?.id || "pi_test_123",
        metadata: req.body.data?.object?.metadata || { userId: "test_user" }
      }
    }
  };
  
  // Appeler le handler avec l'événement simulé
  req.body = mockEvent;
  handleStripeWebhook(req, res);
});

export default router;
