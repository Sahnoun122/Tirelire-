import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import groupRoutes from "./routes/group.routes.js"
import morgan from "morgan";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/groups" , groupRoutes);

export default app;
