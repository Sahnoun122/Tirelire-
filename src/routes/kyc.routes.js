import express from "express";
import upload from "../middleware/upload.middleware";
import  { createKyc } from "../controllers/kyc.controller.js";


const router = express.Router();
router.post('/create',
    upload.fields([
        {name : "cardImage" , maxCount : 1},
        { name : "faceImage" , maxCount : 1},
    ]),

    createKyc
);

export default router;