import express from "express";
import {
  createStripePayment,
  createCashPayment,
  validateCashPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/stripe", createStripePayment);
router.post("/cash", createCashPayment);
router.put("/cash/validate/:paymentId", validateCashPayment);

export default router;
