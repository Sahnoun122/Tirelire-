import * as faceapi from "face-api.js";
import fs from "fs";
import path from "path";
import { fileURLToPath  } from "url";
import kyc from "../models/kyc.model";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const MODEL_URL = path.join(__dirname , "../../models");

export const createKyc  = async (req , res)=>{
    try {
        const {    fullName, nationalId, userId    } = req.body;

        if(!req.files || !req.files.cardImage || !req.files.faceImage){
            return res.status(400).json({message : "entre l'image demande"});
        }

        const cardImagePath = req.files.cardImage[0].path;
        const faceImagePath = req.files.faceImage[0].path;

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

    const {Canvas , Image , ImageData} = await import("canvas");
    faceapi.env.monkeyPatch({Canvas , Image , ImageData});


const cardDetection = await faceapi
.detectSingleFace(cardImage)
.withFaceLandmarks()
.withFaceDescriptor();

const selfieDetection = await faceapi
.detectSingleFace(selfieImage)
.withFaceLandmarks()
.withFaceDescriptor();

if(!cardDetection || !selfieDetection){
    return res.status(400).json({message : "le visage pas appraitre bien "})
}

const distance = faceapi.euclideanDistance(
    cardDetection.descriptor,
    selfieDetection.descriptor
);

let status = "pending";
if(distance<0.6){
    status = "verified";
}else{
    status = "rejected";
}

const kycRecord  = new kyc({
    userId,
    fullName,
    nationalId,
    cardImage : cardImagePath,
    faceImage : faceImagePath,
    status,
});

await kycRecord.save();

res.status(201).json({
    message : "KYC enregistré avec succès",
    result : kycRecord
});
    }  catch (err) {
    console.error(err);
    res.status(500).json({ message: "il ya errore " });
        
    }
}