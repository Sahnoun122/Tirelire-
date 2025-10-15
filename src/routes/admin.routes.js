import express from "express";
import {
  getAllGroups,
  sendMessageToUser,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/groups", verifyAdmin, getAllGroups);
router.post("/message", verifyAdmin, sendMessageToUser);

export default router;
