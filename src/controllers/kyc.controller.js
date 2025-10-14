import * as faceapi from "face-api.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Kyc from "../models/kyc.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_URL = path.join(__dirname, "../../models");

export const createKyc = async (req, res) => {
  try {
    const { fullName, nationalId, userId } = req.body;

    if (!req.files || !req.files.cardImage || !req.files.faceImage) {
      return res.status(400).json({ message: " la photos qui est demande " });
    }

    const cardImagePath = req.files.cardImage[0].path;
    const faceImagePath = req.files.faceImage[0].path;

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);

    const { Canvas, Image, ImageData, loadImage } = await import("canvas");
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    const cardImage = await loadImage(cardImagePath);
    const selfieImage = await loadImage(faceImagePath);

    const cardDetection = await faceapi
      .detectSingleFace(cardImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const selfieDetection = await faceapi
      .detectSingleFace(selfieImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!cardDetection || !selfieDetection) {
      return res.status(400).json({ message: "le vissage n'apparaitre pas " });
    }

    const distance = faceapi.euclideanDistance(
      cardDetection.descriptor,
      selfieDetection.descriptor
    );

    let status = distance < 0.6 ? "verified" : "rejected";

    const kycRecord = new Kyc({
      userId,
      fullName,
      nationalId,
      cardImage: cardImagePath,
      faceImage: faceImagePath,
      status,
    });

    await kycRecord.save();

    res.status(201).json({
      message: "KYC enregistré avec succès",
      result: kycRecord,
    });
  } catch (err) {
    console.error("Erreur:", err);
    res.status(500).json({ message: "il ya errore", error: err.message });
  }
};
