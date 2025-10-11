import express from "express";
import { createGroup, getGroup, listGroups , joinGroup } from "../controllers/group.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireKYC } from "../middleware/kyc.middleware.js";

const router = express.Router();

router.post('/create', authenticateToken, requireKYC, createGroup);
router.get('/list', authenticateToken, listGroups);
router.get('/get/:id', authenticateToken, getGroup);
router.post("/join/:id", authenticateToken, joinGroup);


export default router;
