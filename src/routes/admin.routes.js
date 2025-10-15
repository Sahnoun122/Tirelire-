import express from "express";
import { getAllGroups, sendMessageToUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/groups", getAllGroups);

router.post("/message", sendMessageToUser);

export default router;
