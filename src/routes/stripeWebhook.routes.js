import express from "express";
import { handleStripeWebhook } from "../controllers/stripeWebhook.controller.js";

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), handleStripeWebhook);

router.post("/test", express.json(), (req, res) => {
  console.log("📝 Test webhook appelé avec:", req.body);
  
  const mockEvent = {
    type: req.body.type || "payment_intent.succeeded",
    data: {
      object: {
        id: req.body.data?.object?.id || "pi_test_123",
        metadata: req.body.data?.object?.metadata || { userId: "test_user" }
      }
    }
  };
  
  req.body = mockEvent;
  handleStripeWebhook(req, res);
});

export default router;
