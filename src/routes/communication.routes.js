import express from "express";
import {
  sendMessage,
  getGroupMessages,
  logTransaction,
  getGroupTransactions,
} from "../controllers/communication.controller.js";

const router = express.Router();

router.post("/message/send", sendMessage);
router.get("/messages/:groupId", getGroupMessages);

router.post("/transaction/log", logTransaction);
router.get("/transactions/:groupId", getGroupTransactions);

export default router;
