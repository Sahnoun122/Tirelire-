import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import groupRoutes from "./routes/group.routes.js"
import contributionRoutes from "./routes/contribution.routes.js";
import kycRoutes from "./routes/kyc.routes.js";
import paymentRoutes from './routes/payment.routes.js';

import webhookRoutes from "./routes/stripeWebhook.routes.js";

import morgan from "morgan";

dotenv.config();
connectDB();

const app = express();

// Webhook route DOIT être avant express.json() pour recevoir les données brutes
app.use("/api/webhook", webhookRoutes);

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/groups" , groupRoutes);
app.use("/api/kyc" , kycRoutes);

app.use("/api/payments", paymentRoutes);


app.use("/api/contribution" , contributionRoutes);
export default app;
