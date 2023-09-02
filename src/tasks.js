// Functions exported from here will be available as background tasks; see src/utils/queue.js

import RequestService from "./services/request.js";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { io } from "../server.js";
import ImageService from "./services/image.js";
import { promises as fs } from "fs";

export async function processImages(task, done) {
  console.log(task.data);

  // Set request status to pending
  let request = { ...task.data, Status: "pending" };
  request = await RequestService.update(request.id, request);
  io.emit("update-request", request);

  // Get Image from DB
  const image = await ImageService.get(request.id, { type: "ORIGINAL" });
  console.log(image);
  // Load Image from disk
  const fileName = `./uploads/${image.imageRef}`;
  console.log(fileName);

  const imageContent = await fs.readFile(fileName);

  // Hand off to google vision
  const visionClient = new ImageAnnotatorClient();
  const [result] = await visionClient.annotateImage({
    image: { content: imageContent },
    features: [{ type: "FACE_DETECTION" }],
  });
  //
  const faceAnnotations = result.faceAnnotations;
  // console.log(faceAnnotations);
  const numberOfPeople = faceAnnotations ? faceAnnotations.length : 0;
  console.log("Number of people:" + numberOfPeople);

  // Set request status to complete
  done();
}
