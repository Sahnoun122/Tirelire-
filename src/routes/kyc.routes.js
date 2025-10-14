import express from "express";
import multer from "multer";
import { createKyc } from "../controllers/kyc.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/create",
  upload.fields([
    { name: "cardImage", maxCount: 1 },
    { name: "faceImage", maxCount: 1 },
  ]),
  createKyc
);

export default router;
