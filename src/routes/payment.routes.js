import express from 'express';
import {
  createStripePayment,
  createCashPayment,
  handleStripeWebhook,
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/stripe', createStripePayment);
router.post('/cash', createCashPayment);

router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
