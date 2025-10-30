import dotenv from "dotenv";
dotenv.config();

export const env = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
};
