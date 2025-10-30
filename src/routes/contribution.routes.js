import express from "express";
import { createContribution, getGroupContributions, markAsPaid } from "../controllers/contribution.controller.js";

const router = express.Router();

router.post("/create", createContribution);

router.get("/group/:groupId", getGroupContributions);

router.put("/mark-paid", markAsPaid);

export default router;
