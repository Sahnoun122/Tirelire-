import express from "express";
import { manualNotificationTest } from "../controllers/notification.controller.js";

const router = express.Router();

router.post("/test", manualNotificationTest);

export default router;
