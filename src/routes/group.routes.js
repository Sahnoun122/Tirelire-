import express from "express";
import { createGroup, getGroup, listGroups , joinGroup ,leaveGroup , startRound} from "../controllers/group.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireKYC } from "../middleware/kyc.middleware.js";

const router = express.Router();

router.post('/create', authenticateToken, requireKYC, createGroup);
router.get('/list', authenticateToken, listGroups);
router.get('/get/:id', authenticateToken, getGroup);
router.post("/join/:id", authenticateToken, joinGroup);
router.post("/leave/:id", authenticateToken, leaveGroup);
router.post("/start-round/:id", authenticateToken, startRound);


export default router;
