import express  from "express";

import { createGroup  , getGroup} from "../controllers/group.controller.js";

import { authenticateToken } from "../middleware/auth.middleware.js";
import { requireKYC } from "../middleware/kyc.middleware.js";

const router = express.Router()

router.post('/create' , authenticateToken , requireKYC , createGroup);

router.post("/get/:id" , authenticateToken , getGroup)
export default router;