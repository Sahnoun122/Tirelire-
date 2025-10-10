import express  from "express";

import { createGroup } from "../controllers/group.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireKYC } from "../middleware/kyc.middleware.js";

const router = express.Router()

router.post('/create' , authenticateToken , requireKYC , createGroup);

export default router;