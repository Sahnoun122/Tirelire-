
import path from "path";
import * as canvas from "canvas";
import * as faceapi from "face-api.js";
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export async function compareImages(imagePathA, imagePathB, modelsPath) {
  const defaultModelsPath = path.resolve(process.cwd(), "src", "models");
  const usedModelsPath = modelsPath || defaultModelsPath;
  await faceapi.nets.tinyFaceDetector.loadFromDisk(usedModelsPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(usedModelsPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(usedModelsPath);

  const imgA = await canvas.loadImage(imagePathA);
  const imgB = await canvas.loadImage(imagePathB);

  const detectionA = await faceapi
    .detectSingleFace(imgA, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  const detectionB = await faceapi
    .detectSingleFace(imgB, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detectionA || !detectionB) {
    return { match: false, reason: "face_not_detected" };
  }

  const faceMatcher = new faceapi.FaceMatcher(detectionA.descriptor);
  const bestMatch = faceMatcher.findBestMatch(detectionB.descriptor);
  return { match: bestMatch.label === "person" };
}

import { promises as fs } from "fs";

export async function saveKycDocument(sourcePath, filename, folder = "uploads") {
  const savePath = path.resolve(process.cwd(), folder, filename);
  await fs.copyFile(sourcePath, savePath);
  return savePath;
}
