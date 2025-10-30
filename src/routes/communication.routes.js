import express from "express";
import {
  sendMessage,
  getGroupMessages,
} from "../controllers/communication.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send/:groupId", authenticateToken, sendMessage);

router.get("/group/:groupId", authenticateToken, getGroupMessages);

export default router;
